---
title: Pretty Maps
slug: pretty-maps
date: 2017-01-19 19:23:32
layout: post.html
draft: true
---

<script src="https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/0.7.22/webcomponents-lite.min.js"></script>
  <script>
    /* this script must run before Polymer is imported */
    window.Polymer = {
      dom: 'shadow',
      lazyRegister: true
    };
  </script>
<link rel="import" href="https://sandbox.donmccurdy.com/maple/maple-elements.vulcanized.html">

<!-- Map -->
<maple-map name="carousel-demo" api-key="AIzaSyC_oduXECa4g7b0KYsZtFOy8iquLu7lqdE" latitude="42.3601" longitude="-71.0589" zoom="12" style="height: 300px;"><maple-tile-layer name="demo-tile-layer" url-prefix="https://storage.googleapis.com/solar-tiles/us_"></maple-tile-layer></maple-map>

**TITLE OF MAP**

Short description of everything.

Marshmallow oat cake marshmallow. Muffin topping soufflé. Dragée candy cheesecake. Donut jelly-o fruitcake chocolate bar lollipop marshmallow biscuit. Lollipop pudding sweet. Marzipan powder jelly beans caramels.

<!-- Carousel --><maple-carousel for="carousel-demo"><maple-carousel-item title="Somerville, MA" img-url="https://sandbox.donmccurdy.com/maple/somerville.jpg" lat="42.3876" lng="-71.0995" zoom="14"></maple-carousel-item><maple-carousel-item title="New York, NY" img-url="https://sandbox.donmccurdy.com/maple/newyork.jpg" lat="40.7128" lng="-74.0059" zoom="12"></maple-carousel-item><maple-carousel-item title="Fresno, CA" img-url="https://sandbox.donmccurdy.com/maple/fresno.jpg" lat="36.7468" lng="-119.7726" zoom="12"></maple-carousel-item><maple-carousel-item title="London, UK" img-url="https://sandbox.donmccurdy.com/maple/london.jpg" lat="51.5074" lng="-0.1278" zoom="10"></maple-carousel-item><maple-carousel-item title="Paris, France" img-url="https://sandbox.donmccurdy.com/maple/paris.jpg" lat="48.8566" lng="2.3522" zoom="10"></maple-carousel-item><maple-carousel-item title="Dubai, UAE" img-url="https://sandbox.donmccurdy.com/maple/dubai.jpg" lat="25.2048" lng="55.2708" zoom="12"></maple-carousel-item></maple-carousel>


Dessert topping brownie wafer danish toffee cotton candy sweet roll tiramisu. Croissant brownie jelly lemon drops ice cream sugar plum cookie chocolate cake. Carrot cake fruitcake bear claw gummies. Cheesecake candy chupa chups cotton candy gummies marzipan chocolate bar. Marzipan carrot cake muffin liquorice gummies lollipop candy.
