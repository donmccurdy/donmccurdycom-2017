---
title: Creating a “Portal” Effect using THREE.js, A-Frame VR, and GLSL
slug: creating-a-portal-effect-using-three-js-a-frame-vr-and-glsl-2
date: 2016-12-07 21:10:43
layout: post.html
draft: true
---

In this post, I'll walk through the code needed to create a specific “portal” effect in WebGL:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">shader portal 🏜 ↭ 🏞 <br>with <a href="https://twitter.com/aframevr">@aframevr</a> / <a href="https://twitter.com/hashtag/threejs?src=hash">#threejs</a> <a href="https://t.co/VDZdKxWuAQ">pic.twitter.com/VDZdKxWuAQ</a></p>&mdash; Don McCurdy (@donrmccurdy) <a href="https://twitter.com/donrmccurdy/status/803477033393287168">November 29, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

## The plan

Our goal is a scene with two parts — *sideA*🏜 and *sideB*🏞. The only geometry is a large sphere, and the camera looks around inside that sphere. If the camera is on *sideA*🏜, then the sphere's interior is painted using *textureA*🏜. This is an equirectangular image, and every pixel on the sphere is coming the texture.

With one exception: there is a “portal” sitting near the center of the scene. If that portal is between the camera and a pixel on the sphere, another photo, *textureB*🏞, is used instead.

Diagram:

![diagram]()

For each pixel shown, we're going to Do Math and calculate whether the portal is between the eye and that pixel. Implemented in JavaScript, this would be extremely slow. There are too many pixels, and too much math, to solve quickly. Even writing in C, this is a bad idea.

Fortunately, modern GPUs are incredibly good at doing things with pixels in parallel. To take advantage of that, we need to express the diagram above as a *shader*:

From [The Book of Shaders, Chapter 1](https://thebookofshaders.com/01/):

> Shaders are ... a set of instructions, but the instructions are executed all at once for every single pixel on the screen. That means the code you write has to behave differently depending on the position of the pixel on the screen. Like a type press, your program will work as a function that receives a position and returns a color, and when it's compiled it will run extraordinarily fast.

Shaders are written using a syntax called GLSL, and can be combined with other programming languages conveniently. In [THREE.js](https://threejs.org/), shaders are created using [THREE.ShaderMaterial](https://threejs.org/docs/index.html?q=shadermaterial#Reference/Materials/ShaderMaterial).

## Adding a Shader Material

```javascript
const material = new THREE.ShaderMaterial({
  side: THREE.BackSide,
  uniforms: {
    // ...  
  },
  vertexShader: /* ... */,
  fragmentShader: /* ... */
});
```

**THREE.BackSide** is chosen, because the camera is inside the sphere. The texture must be inside out to be visible.

Our **uniforms** contain information about the scene, which the GPU will need when we start writing our shader. These will include:

1. Position of the camera / eye.
2. Position/rotation/size of the portal.
3. Which 'side' of the portal we're currently on.
4. `textureA`🏜 and `textureB`🏞.

The **vertexShader** and **fragmentShader** will eventually contain GLSL code. We'll get to that soon enough.

Putting all of this together, here's an [A-Frame](https://aframe.io/) component:

```javascript

const AFRAME = require('aframe');

const textureLoader = new THREE.TextureLoader();

AFRAME.registerComponent('portal-material', {
  dependencies: ['material', 'geometry'],

  schema: {
    camera: {type: 'selector', default: '[camera]'},
    portal: {type: 'selector', default: ''},
    textureA: {type: 'src'},
    textureB: {type: 'src'},
  },

  init: function () {
    const data = this.data,
          mesh = this.el.getObject3D('mesh');

    this.cameraPosition = new THREE.Vector3();
    this.portalPosition = new THREE.Vector3();
    this.portalNormal = new THREE.Vector3(0, 0, 1);
    this.portalRadius = 0.25;

    this.material = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        vCameraPosition: {value: this.cameraPosition},
        vPortalPosition: {value: this.portalPosition},
        vPortalNormal:   {value: this.portalNormal},
        portalRadius:    {value: this.portalRadius},
        isSideA:         {value: 1.0},
        textureA:        {
          type: 't',
          value: textureLoader.load(data.textureA)
        },
        textureB:        {
          type: 't',
          value: textureLoader.load(data.textureB)
        },
      },
      vertexShader: vertexShader,
      fragmentShader: intersectSegmentAndPlane
                    + fragmentShader
    });

    mesh.material = this.material;
  },

  /**
   * Update all uniforms passed as inputs to the shader.
   */
  tick: function () {
    const data = this.data;

    // Update camera and portal positions.
    this.cameraPosition
      .copy(data.camera.getAttribute('position'));
    this.portalPosition
      .copy(data.portal.getAttribute('position'));

    // Update shader uniforms.
    this.material.uniforms.vCameraPosition.value
      .copy(this.cameraPosition);
    this.material.uniforms.vPortalPosition.value
      .copy(this.portalPosition);
    this.material.uniforms.vPortalNormal.value
      .copy(this.portalNormal);
 },
});

```

## Writing the shaders

Our **vertex shader** is a callback that runs, on the GPU, for every for every vertex in the sphere geometry — it's not a real sphere, but more like a dodecahedron, so there are corners evenly spaced around. This shader has a very easy job: store the position of the vertex `modelMatrix * vec4( position, 1.0 )`, and matching position on the texture, `uv`. These are stored as `vUv` and `vWorldPosition`.

The rest of the shader, creating `gl_Position`, is boilerplate for most vertex shaders and can be ignored.

The shader itself is stored as a string so that we can pass it around in JavaScript. If that bothers you, there is a Browserify- and Webpack-compatible alternative: [glslify](https://mattdesl.svbtle.com/glslify).

```glsl
const vertexShader = `

varying vec3 vWorldPosition;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix
              * modelViewMatrix
              * vec4( position, 1.0 );
}

`;
```
Unlike the vertex shader, a **fragment shader** callback runs once for every "fragment" (or pixel) to be shown. Data we stored in the vertex shader — `vWorldPosition` and `vUv` — is available here, and is automatically interpolated (by the GPU) from pixel to pixel. Interpolation means that pixels halfway between to vertices will have a `vUv` texture coordinate halfway between, appropriately.

In the fragment shader, we:

1. Compute the point where light, going from the current pixel to the eye, would pass through the portal plane. Think of that plane as an infinitely large wall, parallel to the portal — mathematically, this is much easier than trying to compute intersections with the portal directly.
2. Compute distance from that intersection point to the center of the portal. If the distance is less than the portal's radius, consider it a "hit".
3. If there's a "hit" on a pixel, switch from the default texture to `textureB`🏞.

```glsl
const fragmentShader = `

uniform vec3 vCameraPosition;
uniform vec3 vPortalPosition;
uniform vec3 vPortalNormal;
uniform float portalRadius;
uniform float isSideA;
uniform sampler2D textureA;
uniform sampler2D textureB;

varying vec3 vWorldPosition;
varying vec2 vUv;

void main() {
  vec3 vIntersectPosition = intersectSegmentAndPlane(
    vCameraPosition,
    vWorldPosition,
    vPortalPosition,
    vPortalNormal
  );

  float blend = isSideA;
  if (distance(vPortalPosition, vIntersectPosition)
      < portalRadius) {
    blend *= -1.0;
  }

  gl_FragColor = mix(
    texture2D(textureB, vUv),
    texture2D(textureA, vUv),
    clamp(blend, 0.0, 1.0)
  );
}

`;
```

Finally, we'll need to implement the `intersectSegmentAndPlane()` helper function used above. The details here are out of scope for this post, but it's based closely on the example [C++ implementation described here](http://geomalgorithms.com/a05-_intersect-1.html).

```glsl
const intersectSegmentAndPlane = `

vec3 intersectSegmentAndPlane(
      vec3 s1, vec3 s2, vec3 pv, vec3 pn) {

    vec3 u = s2 - s1;
    vec3 w = s1 - pv;

    float D = dot(pn, u);
    float N = -1.0 * dot(pn, w);

    // Return arbitrary 'very distant' point when there
    // is no intersection.
    vec3 noHit = vec3(99999.0, 99999.0, 99999.0);

    if (abs(D) < 0.000001) { // Segment is parallel to plane.
      if (N == 0.0) {
        return noHit; // Segment lies in plane.
      } else {
        return noHit; // No intersection.
      }
    }

    // Segment and plane are not parallel. Compute
    // intersection.
    float sI = N / D;
    if (sI < 0.0 || sI > 1.0) {
      return noHit; // No intersection.
    }

    return s1 + sI * u; // Compute segment intersect point.
}

`;
```

## Stepping Through

So what happens if the camera goes "through" the portal? So far, we'll still be on the same side. To create an illusion of teleporting, we need to invert the shader at exactly the moment the camera passes through.

It's easier not to do this in the shader itself, but to track the camera in JavaScript and change the `isSideA` uniform at the right time. Just like we computed intersections with the portal above, we'll track where the camera moves after each frame. If the camera has has moved through the portal between one frame and the next, invert the shader.

Omitted from this post, for brevity, I've implemented this by [adding an updateTracking() method to the A-Frame component](https://github.com/donmccurdy/webvr-experiments/blob/a5676808d13f849d02c36d61a79fe28a97dc322f/1-portal/components/transient-material.js#L64-L94).

The complete code for this post is [available on GitHub](https://github.com/donmccurdy/webvr-experiments/tree/a5676808d13f849d02c36d61a79fe28a97dc322f/1-portal).

## Wrapping up

Nice work reading this far. Shaders and THREE.js can be confusing, and getting started is hard. There are good resources for both, and you can learn them separately if combining them is too much at first. A few good resources:

Shaders:

- [The Book of Shaders](https://thebookofshaders.com/)
- [Shader School](https://github.com/stackgl/shader-school)

THREE.js:

- [THREE.js Documentation](https://threejs.org/docs/index.html#Manual/Introduction/Creating_a_scene)
- [WebGL: Up and Running](https://smile.amazon.com/WebGL-Running-Building-Graphics-Web/dp/144932357X)
