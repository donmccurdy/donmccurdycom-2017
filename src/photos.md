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
      media.photos.reverse();
      media.photos.forEach((photo) => {
        const srcPrefix = `${BUCKET_PATH}/${photo.id}`;

        const imgWrapEl = document.createElement('figure');
        const pictureEl = document.createElement('picture');
        pictureEl.title = photo.title;

        // WebP.
        const sourceWEBP = document.createElement('source');
        sourceWEBP.srcset = `${srcPrefix}_640.webp`;
        sourceWEBP.type = 'image/webp';

        // JPEG.
        const sourceJPG = document.createElement('source');
        sourceJPG.srcset = `${srcPrefix}_640.jpg`;
        sourceJPG.type = 'image/jpeg';

        // Fallback.
        const imgJPG = document.createElement('img');
        imgJPG.src = `${srcPrefix}_640.jpg`;
        imgJPG.alt = photo.title;

        // Link to full-resolution version.
        const anchorEl = document.createElement('a');
        anchorEl.href = `${srcPrefix}_2880.jpg`
        anchorEl.target = '_blank';

        pictureEl.appendChild(sourceWEBP);
        pictureEl.appendChild(sourceJPG);
        pictureEl.appendChild(imgJPG);
        anchorEl.appendChild(pictureEl);
        imgWrapEl.appendChild(anchorEl);
        containerEl.appendChild(imgWrapEl);
      });
    })
</script>
