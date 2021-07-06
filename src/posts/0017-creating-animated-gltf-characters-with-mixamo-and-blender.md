---
title: Creating animated glTF characters with Mixamo and Blender
slug: creating-animated-gltf-characters-with-mixamo-and-blender
date: 2017-11-06 08:01:41
layout: post.html
---

<figure>
  <img src="/assets/images/2017/11/hero_shot.png" alt="Image of a figure in an online model viewer.">
  <figcaption>**End result:** Rigged glTF 2.0 character with multiple animation clips.</figcaption>
</figure>

[Mixamo](https://www.mixamo.com/), by Adobe, provides an easy way to get started
with character animation:

1.  **Automatic character rigging. **Upload a 3D model, place a few markers on
joints, and you’ve got a rigged character. *Note: Mixamo only supports humanoid
characters.*
1.  **Library of customizable animations.** Mixamo’s library contains thousands of
free animations, any of which can be used with their default characters or any
model you upload.

Mixamo exports characters and animations to COLLADA or FBX. For game engines
like Unity, those exchange formats work just fine: the engine will convert
everything to an optimized runtime format when building your game. For WebGL and
WebVR, developers and artists don’t have the luxury of a “build” step: models
need to be optimized before loading in libraries like
[three.js](https://threejs.org/) and [BabylonJS](https://www.babylonjs.com/).

[glTF](http://khronos.org/gltf) (GL Transmission Format) offers a web-friendly
runtime format that suits this use case well. In this post, I’ll go through my
workflow using Mixamo to rig, animate, and export a character to glTF.

## 1. Create a rigged character

Mixamo makes this step incredibly easy. Log in, click *Upload Character*, and
follow the step-by-step instructions. Characters rigged outside of Mixamo are
probably not going to work with their animation library so if you want that
level of control, consider reading [this
tutorial](http://unboring.net/workflows/animation.html) instead.

Once you’ve found or uploaded a model, download it — with no animations selected
— choosing Format = `FBX`, Pose = `T-pose` .

<figure>
  <img src="/assets/images/2017/11/download_settings_char.png"
       alt="When downloading a base character from Mixamo, choose **Format=FBX** and **Pose=T-pose**.">
  <figcaption>
    When downloading a base character from Mixamo, choose **Format=FBX** and **Pose=T-pose**.
  </figcaption>
</figure>

## 2. Download animations for the character

Select one animation at a time in Mixamo, and download each in FBX format. Don’t
include the skin, because we already have that in the base character file. These
files can be reused for multiple characters.

<figure>
    <img src="/assets/images/2017/11/download_settings_anim.png" alt="Export animations from Mixamo in FBX format, without skins.">
    <figcaption>Export animations from Mixamo in FBX format, without skins.</figcaption>
</figure>

## 3. Import everything into Blender

**NOTE:** These instructions were written against Blender 2.78c. The steps,
especially the settings for importing FBX files, are different in older versions
of Blender.*

We need to import all of the FBX files — our character and each animation — into
Blender. Let’s assume you have a base character and two animations:

* character.fbx
* character@run.fbx
* character@idle.fbx

One at a time, we’ll add these to the Blender scene:

* File → Import → FBX.
* Under *Main*, select *Manual Orientation*.

<figure>
  <img src="/assets/images/2017/11/manual_orientation.png" alt="When importing the FBX, select “Manual Orientation” under the “Main” tab.">
  <figcaption>When importing the FBX, select “Manual Orientation” under the “Main” tab.</figcaption>
</figure>

* Under *Armatures, *select *Automatic Bone Orientation.*

<figure>
  <img src="/assets/images/2017/11/bone_orientation.png" alt="When importing each FBX, select “Automatic Bone Orientation” under the “Armatures” tab.">
  <figcaption>When importing each FBX, select “Automatic Bone Orientation” under the “Armatures” tab.</figcaption>
</figure>

* Select the base character model, then *Import FBX.*
* In the Blender scene graph, rename this object as *Character*, and rename its
animation as *TPose*.

<figure>
  <img src="/assets/images/2017/11/node_names.png" alt="The base character should have name like “Character”, and the animation should be called “TPose”.">
  <figcaption>The base character should have name like “Character”, and the animation should be called “TPose”.</figcaption>
</figure>

* Repeat for each animation file. After importing each animation file, name the
animations *Run* and *Idle *respectively*.*

At this point, you should see your model and some skeletons in various poses,
but no animation playing yet. If something has gone wrong, reset the scene and
import each file again. Or, find more detailed instructions on this step in one
of the Youtube videos at the bottom of this post.

## 4. Preview the character animations

Before we export anything, let’s try previewing each animation in Blender and
make sure things look OK. Steps:

* Play animation in the Blender’s footer.

<figure class="width-large">
  <img src="/assets/images/2017/11/play_anim.png" alt="Play animation in the Blender footer.">
  <figcaption>Play animation in the Blender footer.</figcaption>
</figure>

> **TIP:** You should expect to see skeletons moving around now, but the model
> itself will appear stuck in the T-pose. We’ll apply the animations to the
original model in the next few steps.*

* Open the *Dope Sheet* in a new panel.
* In the *Dope Sheet* panel, select *Action Editor* in the footer.

<figure>
  <img src="/assets/images/2017/11/dope_sheet.gif"
       alt="Open the **Dope Sheet** in a new panel, then select **Action Editor**.">
  <figcaption>Open the **Dope Sheet** in a new panel, then select **Action Editor**.</figcaption>
</figure>

* After selecting the character, try playing different Actions (there will be one
Action for each animation, plus the T-Pose).

<figure class="width-large">
  <video controls="controls" src="/assets/images/2017/11/action_preview.mov"></video>
  <figcaption>Walk through the four steps above in this 30-second screen capture.</figcaption>
</figure>

> **TIP:** If you don’t see the option to select an animation, make sure that you
> have selected the character from the scene graph, and opened the **Action
Editor** in the Dope Sheet. If the model isn’t animating, make sure you’ve
selected the character before choosing an animation.

If this all looks right, switch back to the `T-Pose` animation and save the
scene to a new `.blend` file.

## 5. Export to glTF

Time to export our model! Make sure you’ve saved your Blender scene by this
point.

* Delete the armatures from the animations, leaving only the base character and
its armature.

<figure>
  <img src="/assets/images/2017/11/cleanup.gif" alt="Delete the armatures for each animation, leaving only the base character.">
  <figcaption>Delete the armatures for each animation, leaving only the base character.</figcaption>
</figure>

* Install the [Khronos Group glTF exporter](https://github.com/KhronosGroup/glTF-Blender-Exporter)
or [Kupoman glTF exporter](https://github.com/Kupoman/blendergltf). Both
exporters cannot be enabled at the same time.

> **NOTE:** When this post was initially published, only the *Kupoman* exporter
> supported multiple animations. Now both exporters should work.

* *If using the Khronos Group exporter* — Ensure the actions you want to export
are either active, stashed, or "pushed down" into NLA tracks.
* *File* → *Export* → *glTF*
* *If using the Kupoman exporter* — In the *Animations* section, ensure that *All Eligible* objects and armatures
are exported. This ensures we get all of the available animations, not just the T-Pose.

<figure>
  <img src="/assets/images/2017/11/all_eligible.png" alt="Select “*All Eligible” for animation Armatures and Objects.*">
  <figcaption>Select “*All Eligible” for animation Armatures and Objects. Applies to Kupoman exporter only.*</figcaption>
</figure>

The export will create multiple files: a `.gltf`, a `.bin`, and perhaps some
textures. Test the model on the [drag-and-drop three.js glTF
viewer](https://gltf-viewer.donmccurdy.com/), by dragging all of those files
into the window together. In the *Animations* tab, select animations one at a
time and ensure that they play as expected.

<figure class="width-large">
  <img src="/assets/images/2017/11/cycle_quick.gif" alt="Cycling through animations in the online glTF viewer.">
  <figcaption>Cycling through animations in the online glTF viewer.</figcaption>
</figure>

If something is wrong at this point, test the model out in the [BabylonJS
viewer](http://sandbox.babylonjs.com/). Model working in Babylon but not
three.js? [File an issue on my
viewer](https://github.com/donmccurdy/three-gltf-viewer/issues/new). Model not
working anywhere? Double-check that everything looks OK in Blender, and if so,
[file an issue on the Blender
exporter](https://github.com/Kupoman/blendergltf/issues/new).

If you got this far and everything looks OK in the viewer, you’ve got an
animated glTF 2.0 character ready for use in A-Frame, three.js, BabylonJS, and
more. Nice work!

> **CREDITS: **Thanks to [Daniel Stokes](https://github.com/Kupoman) for
> implementing support for multiple actions in the glTF exporter, and to [Toby
Tremayne](https://twitter.com/magicindustries) for testing and feedback on
earlier drafts of this post.

*****

## Appendix: Loading animated characters in A-Frame

A future post will describe how to transition between animations in A-Frame, and
associate each animation with character states. For the quick/easy version in
the meantime, use the `animation-mixer` component from [A-Frame
Extras](http://github.com/donmccurdy/aframe-extras):

```
  <a-entity gltf-model="url(character.gltf)"
            animation-mixer="clip: Run;"></a-entity>
```

The `animation-mixer` component has a few simple options that allow you to
crossfade between animations and control looping. For full control, check out
the [three.js animation
system](https://threejs.org/docs/#manual/introduction/Animation-system), which
`animation-mixer` uses under the hood.

## Resources

For more information, you may want to go through these Youtube tutorials on
Blender and Mixamo:

* [Using Mixamo with Blender](https://www.youtube.com/watch?v=PHBWN2IIuck). The
first ½ of the video is relevant — disregard everything after the author begins
creating a single combined animation track. The video advises using an
experimental *Apply Transform* option, which DID NOT work for me in recent
versions of Blender.
* [A-Frame / Mixamo walkthrough](https://www.youtube.com/watch?v=hheYLOworF4).
This video describes a somewhat different workflow, and targets the three.js
JSON format, but may also be helpful.
