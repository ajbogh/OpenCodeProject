const compression = require('compression');
const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const opn = require('better-opn');
const mockArticles = require('../../mocks/articles.js');
const Logger = require('./logger.js');
const db = require('./datalayer/connect');
const posts = require('./datalayer/posts');
require('./helpers/error.js');

const app = express();
const port = 3000;

function send404(req, res) {
  // send your 404 here
  res.statusCode = 404;
  res.end('nothing here!');
}

const server = app.listen(port, () => {
  const url = `http://localhost:${port}`;
  console.log(`Listening at ${url}`);

  if(process.env.NODE_ENV === 'development') {
    opn(url);
  }
});

app.use((req, res, next) => {
  Logger.log(`Recieved ${req.method} ${req.url}`);
  next();
});

app.use('/', express.static(path.join(__dirname, '/../public')));
app.use('/config', express.static(path.join(__dirname, '/../../config')));

app.use('/content/smart/*', createProxyMiddleware({ 
  target: 'http://localhost:3002', 
  changeOrigin: true 
}));

app.get('/api/categories', async (req, res) => {
  
  let categories;
  try {
    categories = await(posts.getCategories());
  } catch (err) {
    res.status(500).send(err);
  }

  res.json(categories);
});

app.get('/api/posts', async (req, res, next) => {
  const { page = 0, limit = 10, sortBy = 'created_datetime', order = 'ASC', category } = req.query;
  const maxCharacters = 100;

  let postsForCategory;
  try {
    postsForCategory = await posts.getPostsForCategory(category, sortBy, order, limit, page);

    // For each post find the substring "---more---", or the first paragraph, and select characters prior
    postsForCategory = postsForCategory.posts.map((post) => {
      const { markdown } = post;
      let breakIndex = markdown.search('---more---');
      if(breakIndex === -1) {
        breakIndex = markdown.search(/\r?\n\r?\n/);
      }
      if(breakIndex === -1) {
        breakIndex = maxCharacters;
      }

      return {
        ...post,
        markdown: markdown.substring(0, breakIndex),
      };
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.toJSON());
    return;
  }

  let postsCount;
  try {
    postsCount = posts.getPostsCount(category);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.toJSON());
    return;
  }

  res.json({
    posts: postsForCategory,
    category,
    page,
    limit,
    order,
    sortBy,
    count: postsForCategory.length,
    total: postsCount.total,
  });
});

app.get('/api/posts/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const post = await posts.getPost(id);
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.toJSON());
    return;
  }
});

// create a new post
app.post('/api/admin/posts', (req, res) => {
  var postsRef = ref.child("posts");

  postsRef.set({
    test: {
      hello: true
    },
  });  
});

// create a new user
app.post('/api/admin/users', (req, res) => {

});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../index.html'));
});

app.use(send404); // catchall overrides need for 404
app.use(compression());

// Do graceful shutdown
function shutdown(type) {
  console.log(`${type} signal received: closing HTTP server`);
  server.close(() => {
    console.log('HTTP server closed')
  });
  
  db.end(err => {
    if(err) {
      console.log('Database connection failed to close');
      console.error(err);
    }
    
    console.log('Database connection closed')
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('exit', () => shutdown('exit'));
