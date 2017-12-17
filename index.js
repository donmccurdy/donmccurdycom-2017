var metalsmith  = require('metalsmith');
var collections = require('metalsmith-collections');
var layouts     = require('metalsmith-layouts');
var markdown    = require('metalsmith-markdown');
var permalinks  = require('metalsmith-permalinks');
var slug        = require('metalsmith-slug');

// var drafts = require('metalsmith-drafts');

metalsmith(__dirname)
  .metadata({
    sitename: 'Don McCurdy',
    siteurl: 'http://www.donmccurdy.com/',
    description: 'Developer on Project Sunroof, at Google. Working on climate change, data visualization, graphics, and WebVR.',
    generatorname: 'Metalsmith',
    generatorurl: 'http://metalsmith.io/'
  })
  .source('./src')
  .destination('./build')
  .clean(true)                // clean destination before
  .use(collections({          // group all blog posts by internally
    posts: {
      pattern: 'posts/*.md',
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(slug())
  .use(markdown())
  .use(permalinks({relative: false}))
  .use(layouts({engine: 'swig'}))
  .build((err) => {
    if (err) throw err;
  });
