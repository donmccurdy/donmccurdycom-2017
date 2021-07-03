# donmccurdy.com

My personal website and blog, 2017 – present.

I write blog posts in Markdown. A [Metalsmith](https://metalsmith.io/) script assembles the website from the blog posts.

For the photo gallery, I export images and metadata from Adobe Lightroom. A script scrapes the metadata from the photos, using it to generate a markdown post for each. Optimized photos are hosted on Google Cloud Storage. This workflow was based loosely on a [blog post by Tom MacWright](https://macwright.org/2019/02/28/photos.html).

Setup:

```shell
npm install --global vercel
npm install

# Set up the photos submodule.
git submodule init
git submodule update
cd photos
npm install && npm run build

# Run a local server with automatic rebuilds.
vercel dev
```

## Adding photos

1. Add "Title" as metadata in Lightroom.
2. Export at ~4K resolution, move to `photos/src`
3. In `photos`/: `npm run build && npm run deploy`
4. In `./`: `npm run dev`
