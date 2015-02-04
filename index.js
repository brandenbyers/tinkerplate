var Metalsmith    = require('metalsmith'),
    branch        = require('metalsmith-branch'),
    markdown      = require('metalsmith-markdown'),
    templates     = require('metalsmith-templates'),
    collections   = require('metalsmith-collections'),
    permalinks    = require('metalsmith-permalinks'),
    paginate      = require('metalsmith-pagination'),
    drafts        = require('metalsmith-drafts'),
    gist          = require('metalsmith-gist'),
    tags          = require('metalsmith-tags'),
    snippet       = require('metalsmith-snippet'),
    Handlebars    = require('handlebars'),
    fs            = require('fs'),
    moment        = require('moment')
    sass          = require('metalsmith-sass');
    autoprefixer  = require('metalsmith-autoprefixer'),
    metallic      = require('metalsmith-metallic'),
    cleanCSS      = require('metalsmith-clean-css'),
    uglify        = require('metalsmith-uglify'),
    htmlescape    = require('metalsmith-htmlescape'),
    headingsId    = require('metalsmith-headings-identifier'),
    watch         = require('metalsmith-watch'),
    serve         = require('metalsmith-serve'),
metadata = require('metalsmith-metadata');



Handlebars.registerPartial('header', fs.readFileSync(__dirname + '/templates/partials/header.hbt').toString());
Handlebars.registerPartial('footer', fs.readFileSync(__dirname + '/templates/partials/footer.hbt').toString());
Handlebars.registerHelper("prettifyDate", function(timestamp) {
    return moment(new Date(timestamp)).fromNow();
});

Metalsmith(__dirname)
  .use(sass({
    outputStyle: 'expanded',
    outputDir: 'css/'
  }))
  .use(metallic())
  .use(autoprefixer())
  .use(drafts())
//  .use(tags({
//    path: 'topics',
//    template: 'tag.hbt',
//    sortBy: 'date',
//    reverse: true
//  }))
  .use(gist())
  .use(collections({
    blog: {
      pattern: 'content/*.md',
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(metadata({
  globals: 'globals.json',
  
}))
  .use(paginate({
    'collections.blog': {
    perPage: 100,
    template: 'paginate.hbt',
    first: 'blog/index.html',
    path: 'blog/page/:num/index.html',
    pageMetadata: {
      title: 'Blog Archive'
    }
  }
  }))
  .use(markdown())
  .use(branch('content/*')
    .use(permalinks({
      pattern: ':collection/:title',
      relative: false
    }))
  )
//    .use(cleanCSS())
//    .use(uglify())
  .use(snippet({
    maxLength: 250,
    suffix: '...'
  }))
  .use(templates('handlebars'))
  .use(htmlescape())
  .use(headingsId({
    allow: "headingAnchor"
  }))
  .use(watch({
    pattern: '**/*',
    livereload: true
  }))
  .use(serve())
  .destination('./build')
  .build(function(err, files) {
    if (err) { throw err; }
  });
