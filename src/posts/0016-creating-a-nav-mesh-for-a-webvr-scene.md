---
title: Creating a nav mesh for a WebVR scene
slug: creating-a-nav-mesh-for-a-webvr-scene
date: 2017-08-20 21:21:09
layout: post.html
---

This tutorial shows how to create a navigation mesh for a scene
with Blender, and use it in [A-Frame](https://aframe.io/) to do basic
pathfinding. For the short version, watch [this video at
6:08](https://youtu.be/v4d_6ZCGlAg?t=6m8s). The key parts are covered in only 1
minute.

*****

From the Unity documentation,

> “The NavMesh is a class can be used to do spatial queries, like pathfinding and
> walkability tests, set the pathfinding cost for specific area types, and to
tweak global behavior of pathfinding and avoidance.”

In the easiest case, a nav mesh can just be a simple mesh covering parts of the
scene where characters are allowed to travel. Stairs become ramps, and obstacles
are holes in the mesh.

<figure>
    <img src="/assets/images/2017/08/unity_nav_mesh.png" alt="Screenshot of a navigation mesh inside of the Unity user interface.">
    <figcaption>Nav mesh screenshot in Unity.</figcaption>
</figure>

As a someone who has never done game development, I assumed setting up a whole
new mesh for navigation would be a painful, time-consuming process. Nope! Here’s
what we’ll use:

* [Blender](https://www.blender.org/), a free 3D modeling tool, that can generate
a navigation mesh from an existing model.
* [A-Frame](https://aframe.io/), a web framework for building virtual reality
experiences.
* The new [pathfinding
module](https://github.com/donmccurdy/aframe-extras/tree/master/src/pathfinding)
in A-Frame Extras, using [PatrolJS](https://github.com/nickjanssen/PatrolJS) for
navigation.

This tutorial assumes a working knowledge of A-Frame, and some understanding of
Blender basics: moving, scaling, and tweaking vertices.

## Finding a scene

I’ll be using a [Fantasy Game
Inn](https://sketchfab.com/models/192bf30a7e28425ab385aef19769d4b0), by
[pepedrago](https://sketchfab.com/pepedrago) on Sketchfab, as my scene. Use any
scene you want, with two rules:

First, the model must work in A-Frame. All models on Sketchfab are available in
glTF format, which is a good choice. Before investing time anywhere else, test
the model on my [glTF Viewer](https://gltf-viewer.donmccurdy.com/), and pay
attention to the performance tab. If your frame rate is < 60 FPS in the viewer,
you’re not going to be able to use it with WebVR without optimizing it first.
That’s out of scope for this guide, but you can find some [performance advice
here](https://aframe.io/docs/0.6.0/introduction/models.html#optimizing-complex-models).

Second, the model — or at least the geometry — must work in Blender. Blender is
pretty flexible, and you won’t need the materials to create your nav mesh. If
you’ve already created a scene in A-Frame, you also can export that as an OBJ or
glTF from the browser and import it into Blender.

## Setting up your scene in Blender

After importing your scene in Blender, spend some time getting the scale right.
By convention in WebVR, 1 unit = 1 meter. A 1.65m x 0.5m box should look
human-sized. These dimensions are important for getting a good nav mesh, and
detecting spaces that are or are not walkable.

<figure>
    <img src="/assets/images/2017/08/bare_scene.png" alt="Screenshot of our bare scene inside of the Blender user interface.">
    <figcaption>Bare scene in Blender, without materials.</figcaption>
</figure>

## Creating the nav mesh

In the header, switch to **Blender Game** mode.

<figure>
    <img src="/assets/images/2017/08/blender_mode.png" alt="Screenshot of selecting the 'Blender Game' mode in Blender's user interface.">
    <figcaption>Use **Blender Game** mode.</figcaption>
</figure>

Then, select the model and open the **Scene Panel**.

<figure>
    <img src="/assets/images/2017/08/scene_panel.png" alt="Screenshot of the scene panel in Blender's user interface.">
    <figcaption>The scene panel.</figcaption>
</figure>

Expand the **Navigation mesh** section, and choose settings for the agent. This
determines the size of character Blender will use when deciding where you can
walk. A height of `1.0` and a radius of `0.2` might be reasonable places to
start. My scene is crowded, so I’ll also bring down the `Cell Size` and `Max
Slope` a bit. Then, press **Build navigation mesh**. Result:

<figure>
    <img src="/assets/images/2017/08/initial_nav_mesh.png" alt="Screenshot of the initial navigation mesh before any cleanup. Triangles are multi-colored across the surface areas of the mesh.">
    <figcaption>Our first navigation mesh, before cleanup.</figcaption>
</figure>

As it is, we could drop this into A-Frame and try it out. But for a real scene,
you may want to spend some time cleaning the mesh up. Delete the nav mesh if
it’s really off, and try again with different settings. Once you have something
close enough, you can use *Edit Mode* in Blender to tweak individual vertices,
add bridges, or delete unwanted areas.

Keep in mind that using PatrolJS, the *center* of a character can go anywhere
within this mesh. So there should be some space between the edges of the nav
mesh and the actual obstacles, so that a character can’t end up halfway into a
wall.

Select the nav mesh, and export to `.gltf` using the [glTF Blender
exporter](https://github.com/KhronosGroup/glTF-Blender-Exporter/) choosing
*Export selected only*. For a 2MB scene, this navigation mesh is about 8KB.
Here’s my result in the glTF Viewer:

<figure>
    <img src="/assets/images/2017/08/final_nav_mesh.png" alt="Final navigation mesh, of polygons along the walkable areas of the mesh, in an online glTF viewer.">
    <figcaption>Final navigation mesh, exported to glTF.</figcaption>
</figure>

## Using the nav mesh in A-Frame

Now, we’re ready to try this out in A-Frame. Load up original mesh, the nav
mesh, and a simple NPC:

    <a-scene>
      <!-- Scene -->
      <a-entity gltf-model="scene.gltf"></a-entity>

      <!-- Nav Mesh -->
      <a-entity gltf-model="navmesh.gltf"></a-entity>

      <!-- NPC -->
      <a-entity id="npc" gltf-model="npc.gltf"></a-entity>
    </a-scene>

Everything should be visible at this point, but nothing is happening. I’ve
created a [basic set of pathfinding
components](https://github.com/donmccurdy/aframe-extras/tree/master/src/pathfinding),
based on [PatrolJS](https://github.com/nickjanssen/PatrolJS/), which we’ll use
to send our NPC around the scene:

    <a-scene>
      <!-- Scene -->
      <a-entity gltf-model="scene.gltf"></a-entity>

      <!-- Nav Mesh -->
       <a-entity gltf-model="navmesh.gltf"
                 nav-mesh></a-entity>

      <!-- NPC -->
      <a-entity id="npc"
                gltf-model="npc.gltf"
                nav-controller="speed: 1.5"></a-entity>
    </a-scene>

The `nav-mesh` component is a way of telling the navigation system which model
to use for pathfinding. The `nav-controller` component adds behaviors to the NPC
entity, allowing it to search for paths and move toward a destination.

Finally, we’ll add ourselves to the scene with a custom pointer that tells the
NPC where to go. Add this snippet to the scene above:

    <a-entity camera="userHeight: 1.6"
              universal-controls>
      <a-cursor nav-pointer
                raycaster="objects: [nav-mesh]"></a-cursor>
    </a-entity>

That `nav-pointer` component is not one of the pre-bundled components, so we’ll
have to define it ourselves:

    AFRAME.registerComponent('nav-pointer', {
      init: function () {
        const el = this.el;

        // On click, send the NPC to the target location.
        el.addEventListener('click', (e) => {
          const ctrlEl = el.sceneEl.querySelector('[nav-controller]');
          ctrlEl.setAttribute('nav-controller', {
            active: true,
            destination: e.detail.intersection.point
          });
        });

        // When hovering on the nav mesh, show a green cursor.
        el.addEventListener('mouseenter', () => {
          el.setAttribute('material', {color: 'green'});
        });
        el.addEventListener('mouseleave', () => {
          el.setAttribute('material', {color: 'crimson'})
        });
     
        // Refresh the raycaster after models load.
        el.sceneEl.addEventListener('object3dset', () => {
          this.el.components.raycaster.refreshObjects();
        });
      }
    });

That’s it! The nav mesh doesn’t need to be shown anymore, so hide it by adding
`visible=”false”`. Click anywhere to guide the NPC around. If you want to use
`[teleport-controls](https://github.com/fernandojsg/aframe-teleport-controls)`
for roomscale VR locomotion, this same nav mesh can be reused:

    <a-entity teleport-controls="hitEntity: [nav-mesh];"
              vive-controls="hand: left;"></a-entity>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">New blog post about navigation meshes for WebVR, and a simple pathfinding module in <a href="https://twitter.com/aframevr?ref_src=twsrc%5Etfw">@aframevr</a> extras. <a href="https://t.co/HtneyKhWLO">https://t.co/HtneyKhWLO</a> <a href="https://t.co/Ljlu8VltFR">pic.twitter.com/Ljlu8VltFR</a></p>&mdash; Don McCurdy (@donrmccurdy) <a href="https://twitter.com/donrmccurdy/status/899487743306158080?ref_src=twsrc%5Etfw">August 21, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

