---
title: THREE.NodeMaterial example
slug: three-nodematerial-example
date: 2018-11-23 19:40:00
layout: post.html
draft: true
---

A little-known gem, node-based materials have been an experimental part of the [three.js library](https://threejs.org/) for a few years now. THREE.NodeMaterial is still a work-in-progress — no documentation exists, and it's certainly not ready to replace the default materials — but nevertheless NodeMaterial can already be used to achieve some nice effects, without hot-patching the three.js shaders or writing material shaders from scratch.

A classic  material has a discrete number of inputs (color, opacity, metalness, roughness, ...), each accepting a simple scalar value. Node-based materials have the same inputs, but each input can accept a *complex GLSL expression*. In effect, this gives the opportunity to tweak — or even radically alter — how the property behaves.

Here's a simple example: a sphere, with geometry displaced over time in the vertex shader.

<div id="view"></div>

The GLSL for this effect is pretty simple. Use the vertex `y` position and the current time as inputs to a `sin()` function, then map that to a scale varying from `0.8` to `1.2`.

```glsl
vPosition *= sin( vPosition.y * time ) * 0.2 + 1.0;
```

The builtin three.js materials, like `THREE.MeshStandardMaterial`, have plenty of material-related options, but custom effects like this will require us to modify the shader somehow. With `THREE.NodeMaterial`, we can do that in a declarative way, allowing three.js to compile (and potentially optimize) the shader:

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

This is clearly more code, and harder to read, than the plain GLSL above. However, consider what you _didn't_ have to do here:

- Decide where in the shader to inject the new uniform inputs.
- Decide where in the shader to inject the animation.
- Deal with broken code in future releases of three.js, because some minor change in the shader broke a regular expression used to inject things.

Node-based materials have gained popularity over the past few years ( EXAMPLES ... ), typically in the form of a node connectivity UI. No such UI exists for THREE.NodeMaterial today, but that's a plausible future direction.

Moreover, node-based materials are machine-readable, optimizeable, and composable. They are easier to reuse and share than arbitrary shader patches. For example, a developer could write a series of _new_ nodes (composed of the core nodes) for complex behaviors. Published on NPM, those nodes would be accessible to all three.js users. Example:

```js
import { StandardNodeMaterial } from './THREE.Nodes.js';
import { FoliagePositionNode } from '@donmccurdy/three-nodes-foliage';

const material = new THREE.StandardNodeMaterial();
material.position = new FoliagePositionNode({ windSpeed: 5.0 });
```

<script type="module">
  import { Runtime, Inspector, createLibrary } from '/notebook-runtime.js';
  import notebook from 'https://api.observablehq.com/@donmccurdy/three-nodematerial-example.js';

  const el = document.querySelector('#view');
  const library = createLibrary(el);

  Runtime.load(notebook, library, (cell) => {
    if (cell.name === 'view') {
      return new Inspector(el);
    }
  });
</script>
