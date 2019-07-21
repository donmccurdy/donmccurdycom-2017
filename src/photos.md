---
title: Photos
layout: page.html
isPhotos: true
---

Instagram: [@donmccurdy](https://www.instagram.com/donmccurdy/)

<div id="photos"></div>
<script>
  const BUCKET_PATH = 'https://storage.googleapis.com/donmccurdy-photos';
  fetch(`${BUCKET_PATH}/media.json`)
    .then((response) => response.json())
    .then((media) => {
      const containerEl = document.querySelector('#photos');
      media.photos.forEach((photo) => {
        const imgWrapEl = document.createElement('figure');
        const imgEl = document.createElement('img');
        const basename = photo.path.match(/(\d+\/.*)\./)[1];
        const srcPrefix = `${BUCKET_PATH}/${basename}`;
        imgEl.src = `${srcPrefix}_640.jpg`;
        imgEl.srcset = `${srcPrefix}_640.webp, ${srcPrefix}_640.jpg`
        imgWrapEl.appendChild(imgEl);
        containerEl.appendChild(imgWrapEl);
      });
    })
</script>

