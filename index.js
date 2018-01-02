const metalsmith  = require('metalsmith');
const collections = require('metalsmith-collections');
const layouts     = require('metalsmith-layouts');
const less        = require('metalsmith-less');
const markdown    = require('metalsmith-markdown');
const permalinks  = require('metalsmith-permalinks');
const rss         = require('metalsmith-feed');
const snippet     = require('metalsmith-snippet');

metalsmith(__dirname)
  .metadata({
    site: {
      title: 'Don McCurdy',
      url: 'https://www.donmccurdy.com/',
      description: 'Developer on Project Sunroof, at Google. Working on climate change, data visualization, graphics, and WebVR.',
    }
  })
  .source('./src')
  .destination('./build')
  .clean(true)
  .use(collections({
    posts: {
      pattern: 'posts/*.md',
      sortBy: 'date',
      reverse: true
    },
    drafts: {
      pattern: 'drafts/*.md',
      sortBy: 'date',
      reverse: true
    }
  }))
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
