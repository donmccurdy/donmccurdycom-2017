# donmccurdy.com

My personal website and blog, 2017 – present.

I write blog posts in Markdown. A [Metalsmith](https://metalsmith.io/) script assembles the website from the blog posts.

For the photo gallery, I export images and metadata from Adobe Lightroom. A script scrapes the metadata from the photos, using it to generate a markdown post for each. Optimized photos are hosted on Google Cloud Storage. This workflow was based loosely on a [blog post by Tom MacWright](https://macwright.org/2019/02/28/photos.html).

Setup:

```shell
npm install

# Set up the photos submodule.
git submodule init
git submodule update
cd photos
npm install && npm run build

# Run a local server with automatic rebuilds.
npm run dev

# Deploy.
npm run deploy
```
