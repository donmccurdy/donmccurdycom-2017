const metalsmith  = require('metalsmith');
const collections = require('metalsmith-collections');
const layouts     = require('metalsmith-layouts');
const markdown    = require('metalsmith-markdown');
const permalinks  = require('metalsmith-permalinks');

metalsmith(__dirname)
  .metadata({
    sitename: 'Don McCurdy',
    siteurl: 'http://www.donmccurdy.com/',
    sitedescription: 'Developer on Project Sunroof, at Google. Working on climate change, data visualization, graphics, and WebVR.'
  })
  .source('./src')
  .destination('./build')
  .clean(true)
  .use(collections({
    posts: {
      pattern: 'posts/*.md',
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(markdown())
  .use(permalinks({
    relative: false,
    date: 'YYYY/MM/DD',
    pattern: ':date/:slug'
  }))
  .use(layouts({engine: 'swig'}))
  .build((err) => {
    if (err) throw err;
  });
