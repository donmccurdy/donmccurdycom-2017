---
title: Unpaid Work (Visualization)
slug: vis-makeover-monday-unpaid-work
date: 2020-04-06 10:41:00
layout: post.html
---

[Week 14, 2020](https://data.world/makeovermonday/2020w14) of [#MakeoverMonday](https://data.world/makeovermonday). I intended for this to be a bit of practice with different styles of visualization; it ended up being mostly a deep-dive into [dataframe.js](https://gmousse.gitbooks.io/dataframe-js/#dataframe-js), which I hadn't used before. Most time was spent data cleaning, discovering and resolving a few issues mentioned below. Got a bit more comfortable with dataframe.js by the end of the visualization, but probably should have just formatted the data in another tool before bringing it into JavaScript, in retrospect.

- Original visualization: [Unpaid work: Allocation of time and time-use](https://unstats.un.org/unsd/gender/timeuse/index.html)
- Data source: [UN Stats](https://unstats.un.org/unsd/gender/timeuse/index.html)

<div id="summary" class="async-content"></div>

<figure class="width-large">
    <center><h3>Share of paid and unpaid work, by gender</h3></center>
    <div id="main" class="async-content"></div>
</figure>

<script type="module">

import notebook from '/assets/resources/notebooks/unpaid-work/index.js';
import {Runtime, Library, Inspector} from '/assets/resources/notebooks/unpaid-work/runtime.js';

new Runtime().module(notebook, name => {
  if (['summary', 'main'].includes(name)) {
    const el = document.querySelector('#' + name);
    el.classList.remove('async-content');
    return new Inspector(el);
  }
});

</script>
