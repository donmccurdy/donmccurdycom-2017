---
title: Three.js NodeMaterial introduction
slug: three-nodematerial-introduction
date: 2019-03-17 17:40:00
layout: post.html
draft: true
syntax: true
image: assets/images/2019/03/grass-wind-thumb.png
imageAlt: A 3D rendering of lowpoly grass, moving gently in a breeze.
---

Node-based materials have been an experimental part of the [three.js library](https://threejs.org/) for a few years now under [_three/examples/js/nodes/_](https://github.com/mrdoob/three.js/tree/dev/examples/js/nodes), thanks to the efforts of [Sunag](https://github.com/sunag). There are [great examples](https://github.com/sunag), but _NodeMaterial_ is still a work in progress and not a drop-in replacement for the default materials yet. Nevertheless, _NodeMaterial_ can already be used to achieve some nice effects, without writing custom materials from scratch.

A classic  material, like [_THREE.MeshStandardMaterial_](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial), has a discrete number of inputs (`color`, `opacity`, `metalness`, `roughness`, ...), each accepting a simple scalar value. Node-based materials have mostly the same inputs, but *each input can accept a complex expression*. This gives the opportunity to adjust — or even radically alter — how the property behaves. Here's a simple example:

<figure>
<div id="view" class="async-content"></div>
<figcaption>
  A sphere, with geometry displaced over time in the vertex shader. [Source code](https://observablehq.com/@donmccurdy/three-nodematerial-example) in an Observable notebook.
</figcaption>
</figure>

The GLSL for this effect is concise. Use the vertex `y` position and the current time as inputs to a `sin()` wave, then map that to a scale varying from `0.8` to `1.2`, displacing the vertex by +/-20%.

```glsl
vPosition *= sin( vPosition.y * time ) * 0.2 + 1.0;
```

Custom effects like this will require us to modify the _MeshStandardMaterial_ shader somehow. With _NodeMaterial_, we can do that in a declarative way, allowing three.js to build the shader for us:

```js
const material = new THREE.StandardNodeMaterial();

// Basic material properties.
material.color = new THREE.ColorNode( 0xffffff * Math.random() );
material.metalness = new THREE.FloatNode( 0.0 );
material.roughness = new THREE.FloatNode( 1.0 );  

const { MUL, ADD } = THREE.OperatorNode;
const localPosition = new THREE.PositionNode();
const localY = new THREE.SwitchNode( localPosition, 'y' );

// Modulate vertex position based on time and height.
// GLSL: vPosition *= sin( vPosition.y * time ) * 0.2 + 1.0;
let offset = new THREE.Math1Node(
  new THREE.OperatorNode( localY, time, MUL ),
  THREE.Math1Node.SIN
);
offset = new THREE.OperatorNode( offset, new THREE.FloatNode( 0.2 ), MUL );
offset = new THREE.OperatorNode( offset, new THREE.FloatNode( 1.0 ), ADD );

material.position = new THREE.OperatorNode( localPosition, offset, MUL );
```

This is more code than the plain GLSL above, but consider what we _didn't_ have to do:

- Decide where in the shader to inject the new uniform inputs.
- Decide where in the shader to inject the animation.
- Deal with broken code in future releases of three.js, because some minor change in the source shader broke a regular expression used to inject things.

Node-based materials have gained popularity in tools like [Shader Forge](http://acegikmo.com/shaderforge/), [Unity](https://blogs.unity3d.com/2018/02/27/introduction-to-shader-graph-build-your-shaders-with-a-visual-editor/), [Unreal](https://docs.unrealengine.com/en-us/Engine/Rendering/Materials/Editor), [Houdini](https://www.sidefx.com/), and [Blender](https://docs.blender.org/manual/en/latest/render/blender_render/materials/nodes/introduction.html), for their expressive flexibility. While those tools provide a user interface for constructing the shader graph, no such UI exists for _THREE.NodeMaterial_ just yet. As an experiment I've explored parsing a node graph created in another tool, [Shade for iOS](https://shade.to/), and converting that to equivalent three.js nodes:

<figure>
<video style="width: 100%;" autoplay muted loop>
  <source src="/assets/images/2019/03/grass-wind.webm" type="video/webm">
  <source src="/assets/images/2019/03/grass-wind.mov" type="video/mp4">
</video>
<figcaption style="max-width: 550px; margin: 0 auto;">A node-based shader, from the [Shade for iOS](https://shade.to/) examples, using an instanced glTF grass mesh with a procedural wind animation. [Live demo](https://three-shadenodeloader.donmccurdy.com/).</figcaption>
</figure>

Node-based materials are declarative, optimizable, and [composable](https://en.wikipedia.org/wiki/Composability). They are relatively easy to reuse and share. For example, a developer could write a series of _new_ nodes (composed of the core nodes) for complex behaviors. Published on NPM, those nodes would be accessible to all three.js users:

```js
import { StandardNodeMaterial } from 'three/examples/js/nodes/';
import { GrassWindNode } from '@donmccurdy/three-grass-wind'; // not on NPM.

const material = new THREE.StandardNodeMaterial();
material.position = new GrassWindNode({ windSpeed: 5.0 });
```

In time I'm hopeful that node-based materials will encourage more creative and reusable materials in the three.js community, and enable third-party libraries like [THREE.BAS](https://github.com/zadvorsky/three.bas) to integrate more easily with the three.js core library.

<script type="module">
  import { Runtime, Inspector, createLibrary } from '/notebook-runtime.js';
  import notebook from 'https://api.observablehq.com/@donmccurdy/three-nodematerial-example.js';

  const el = document.querySelector('#view');
  const library = createLibrary(el);

  Runtime.load(notebook, library, (cell) => {
    if (cell.name === 'view') {
      el.classList.remove('async-content');
      return new Inspector(el);
    }
  });
</script>
