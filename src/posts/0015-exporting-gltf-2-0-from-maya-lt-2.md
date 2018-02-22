---
title: Exporting glTF 2.0 from Maya LT
slug: exporting-gltf-2-0-from-maya-lt-2
date: 2017-06-27 17:02:32
layout: post.html
---

> **Updated Febrary 2018**: The tools available for glTF have changed since last June, and I've tried to update things accordingly. Unfortunately there is still no _direct_ path to glTF from Autodesk tools like Maya, Maya LT, or 3DS Max, so anything you do will require hopping through at least one intermediate step.
>
> There are now some viable alternatives to the process I describe in this article, any of which may be well worth trying. In no particular order:
>
> 1. Export to FBX and convert with Facebook's [FBX2glTF](https://github.com/facebookincubator/FBX2glTF), which has experimental support for converting Stingray PBS materials to glTF's PBR representation.
> 2. [COLLADA2GLTF](https://github.com/KhronosGroup/COLLADA2GLTF) has been updated to support glTF 2.0.
> 3. The [three.js editor](https://threejs.org/editor/) can import many files with drag-and-drop, and export to glTF.
> 4. Recent versions of [Substance Painter](https://www.allegorithmic.com/products/substance-painter) export directly to glTF 2.0, and should have good integration with Maya workflows.

***

This post will walk through the process of exporting an animated [glTF 2.0](https://www.khronos.org/news/press/khronos-releases-gltf-2.0-specification) model from Maya LT. We’ll use the following tools:

* [Maya LT](https://www.autodesk.com/products/maya-lt/overview)
* [FBX Converter 2013.3](http://usa.autodesk.com/adsk/servlet/pc/item?siteID=123112&id=22694909)
* [Blender](https://www.blender.org/)
* [Blender glTF exporter](https://github.com/KhronosGroup/glTF-Blender-Exporter/)

All of these are available for Windows or macOS. Because Blender cannot import recent versions of FBX, my workflow uses COLLADA as an intermediate format.

The post _does not_ cover how to create PBR materials — for that, refer to the [Blender exporter's documentation](https://github.com/KhronosGroup/glTF-Blender-Exporter/blob/master/docs/user.md). Default Blender materials should generally work, but support for Cycles nodes is quite minimal unless using the glTF-specific Cycles nodes included with the exporter. Support for the Principled BSDF node is also missing, but likely to be added soon.

For an alternative workflow using Blender and COLLADA2GLTF, you may want to try with Diego Goberna’s excellent article, [glTF Workflow for A-Saturday-Night](https://blog.mozvr.com/a-saturday-night-gltf-workflow/), instead.

**1. Clean up the model for export.**

Optional steps to clean up geometry and history.

i. *Mesh* → *Cleanup*
ii. *Edit* → *Delete All by Type* → *History*, to clean up the model **ONLY** if the model is not animated. If you’re animating the model yourself, do this step before animating, or skip it entirely.
iii. *Modify* → *Freeze Transformations*

**2. Export in FBX 2013 format from Maya.**

The FBX Converter used in step 3 hasn’t been updated since 2013. Accordingly, we need to export from Maya LT in the FBX 2013 format. Steps:

i. *File* → *Export All...*
ii. Select *Animation* and *Bake Animation*
iii. Deselect *Lights* and *Cameras*
iv. *Advanced Options* → *FBX File Format* → **Binary** + **FBX 2013**
v. *Export All*

![Maya screenshot](/assets/images/2017/06/maya_export_2.png)

**3. Convert from FBX to COLLADA.**

Open the FBX Converter UI, and drag the FBX file into the left panel. In the right panel, select *Destination Format* → *DAE Collada*. Convert.

![FBX Converter screenshot](/assets/images/2017/06/fbx_converter.png)

**4. Import COLLADA asset to Blender.**

Open Blender, clear the scene, and *File* → *Import* → *COLLADA*. If parts of an animated model are out of place, try playing the animation and they may align correctly. When everything looks OK, continue to step 5.

**5. Export glTF 2.0 from Blender.**

i. *File* → *Export* → *glTF 2.0* (`.gltf` or `.glb`)
ii. Enable animation and skinning.
iii. Disable lights and cameras.
iv. Materials will be explained in a follow-up post; for now, see the Blender [exporter documentation](https://github.com/KhronosGroup/glTF-Blender-Exporter/blob/master/docs/user.md).
v. Export.

**6. Test with glTF viewer.**

Drag the `.gltf` or `.glb` file — and all other generated files, including `.bin` — into https://gltf-viewer.donmccurdy.com/ to preview them in three.js. If something is wrong, test the file on the [glTF Validator](http://github.khronos.org/glTF-Validator/). Invalid files should be reported as GitHub issues on the Blender exporter. If the file appears valid but isn’t appearing correctly, please [report an issue on the viewer tool](https://github.com/donmccurdy/three-gltf-viewer/issues/new).

Assuming you made it this far, you have a valid glTF 2.0 asset. Congratulations! You can now use the model in [three.js](https://threejs.org/docs/#examples/loaders/GLTF2Loader), [A-Frame](https://aframe.io/docs/0.5.0/components/gltf-model.html), [Babylon.js](https://github.com/BabylonJS/Babylon.js/tree/master/loaders/src/glTF), and [other WebGL engines](https://github.com/KhronosGroup/glTF#loaders-and-viewers).
