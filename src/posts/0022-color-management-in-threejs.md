---
title: Color management in three.js
slug: color-management-in-threejs
date: 2020-06-17 09:23:00
layout: post.html
image: assets/images/2020/06/gamma_hero.png
imageAlt: Illustration of gamma-correct rendering.
---

![Illustration of bad gamma.](/assets/images/2020/06/gamma.png)

*A particularly clear example of gamma correct (left) and incorrect (right) rendering. [Source](https://blog.johnnovak.net/2016/09/21/what-every-coder-should-know-about-gamma/).*

**Best practices**

1. Textures with color data (`.map`, `.emissiveMap`, etc.) should be configured with `.encoding = sRGBEncoding`; all other textures use `LinearEncoding`.
2. Vertex colors should be stored in linear colorspace.
3. Material `.color` and `.emissive` should also use linear colorspace. Notably, this means that if you're trying to match an object in the scene to a `#4285F4` color in your HTML/CSS, the material actually needs to be `material.color.setHex( 0x4285f4 ).convertSRGBToLinear()`. Same goes for light colors. Scene background color and fog color might be exceptions?
4. Renderer should have `.outputEncoding = sRGBEncoding` if no post-processing is used, otherwise use `LinearEncoding` and apply gamma correction (TBD) as last pass in post instead.

[THREE.GLTFLoader](https://threejs.org/docs/#examples/en/loaders/GLTFLoader) provides (1), (2), and (3) out of the box. Other loaders may vary. For most developers, (3) is probably the most painful of these requirements, and I'd be interested in ways to address it automatically. For example, a `renderer.colorManagement=true` option that converts Color uniforms by default.

**Motivation**

The goal of all that is a "linear workflow" — lighting calculations are done on linear values. When values are in gamma space (or "gamma workflow"), instead, surfaces will respond inconsistently to lighting, appearing too bright in places and too dark in others, or somewhat washed out. And obviously, light and color values brought from other PBR programs would not match as expected. You can tune your lights carefully and eventually get consistent results with a gamma workflow, too, but the lighting will be more fragile to future changes.

John Novak describes the problem well:

> [With gamma workflows, or incorrectly-configured linear workflows] the material and lighting parameters we would need to choose would be completely devoid of any physical meaning whatsoever; they’ll be just a random set of numbers that happen to produce an OK looking image for *that particular scene*, and thus not transferable to other scenes or lighting conditions. It’s a lot of wasted energy to work like that. ... It’s also important to point out that incorrect gamma handling in 3D rendering is one of the main culprits behind the “fake plasticky CGI look” in some (mostly older) games.

**References**

- [Unity • Linear or gamma workflow](https://docs.unity3d.com/Manual/LinearRendering-LinearOrGammaWorkflow.html)
- [What every coder should know about gamma](https://blog.johnnovak.net/2016/09/21/what-every-coder-should-know-about-gamma/)
