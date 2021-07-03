const metalsmith  = require('metalsmith');
const collections = require('metalsmith-collections');
const layouts     = require('metalsmith-layouts');
const less        = require('metalsmith-less');
const markdown    = require('metalsmith-markdown');
const metallic    = require('metalsmith-metallic');
const permalinks  = require('metalsmith-permalinks');
const rss         = require('metalsmith-feed');
const snippet     = require('metalsmith-snippet');

const fs          = require('fs');

const MEDIA_ROOT  = 'https://storage.googleapis.com/donmccurdy-photos';
const media       = require('./photos/dist/media.json');

// Generate a markdown page for each photo.
media.photos.forEach(createPhotoPage);

metalsmith(__dirname)
  .metadata({
    site: {
      title: 'Don McCurdy',
      url: 'https://www.donmccurdy.com/',
      description: 'Developer working on climate data, graphics, data visualization, and web technologies.',
      year: new Date().getFullYear()
    },
    media: {
      root: MEDIA_ROOT,
      ...media
    }
  })
  .source('./src')
  .destination('./public')
  .clean(true)
  .use(collections({
    posts: {
      pattern: 'posts/*.md',
      sortBy: 'date',
      reverse: true
    },
    photos: {
      pattern: 'photos/*.md',
      sortBy: 'date',
      reverse: true
    },
    drafts: {
      pattern: 'drafts/*.md',
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(metallic())
  .use(markdown())
  .use(snippet({maxLength: 200}))
  .use(permalinks({
    relative: false,
    date: 'YYYY/MM/DD',
    linksets: [
      {
        match: {collection: 'posts'},
        pattern: ':date/:slug/'
      },
      {
        match: {collection: 'photos'},
        pattern: 'photos/:date/:slug/'
      },
      {
        match: {collection: 'drafts'},
        pattern: '_drafts/:slug/'
      }
    ]
  }))
  .use(rss({collection: 'posts'}))
  .use(layouts({engine: 'swig'}))
  .use(less({
    pattern: 'assets/css/*.less',
    render: { paths: ['src/assets/css'] },
  }))
  .build((err) => {
    if (err) throw err;
  });

/** Generate a markdown page for each photo. */
function createPhotoPage (photo) {
  const slug = photo.id.replace(/_/g, '-');

  fs.writeFileSync(`src/photos/${slug}.md`, `---
title: ${photo.title}
slug: ${slug}
date: ${photo.date}
layout: photo.html
id: ${photo.id}
imageAbs: ${MEDIA_ROOT}/${photo.id}_1280.jpg
imageAlt: ${photo.title}
isPhotos: true
metadata:
    acquisitionMake: ${photo.acquisitionMake}
    acquisitionModel: ${photo.acquisitionModel}
    aperture: ${photo.aperture}
    exposureTimeSeconds: ${photo.exposureTimeSeconds}
---

${photo.id}.jpg
`);
}
