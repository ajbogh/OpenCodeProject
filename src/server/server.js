const compression = require('compression');
const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const mockArticles = require('../../mocks/articles.js');
const Logger = require('./logger.js');


const app = express();
const port = 3000;

function send404(req, res) {
  // send your 404 here
  res.statusCode = 404;
  res.end('nothing here!');
}

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
});

app.use((req, res, next) => {
  Logger.log(`Recieved ${req.method} ${req.url}`);
  next();
});

app.use('/', express.static(path.join(__dirname, '/../public')));

app.use('/content/smart/*', createProxyMiddleware({ 
  target: 'http://localhost:3002', 
  changeOrigin: true 
}));

app.get('/api/posts', (req, res) => {
  // TODO: make this a database call
  const { page = 0, limit = 10, sortBy = 'date', order = 'ASC', category } = req.query;

  let sortedPosts = [];
  if(category) {
    sortedPosts  = mockArticles.filter(article => article.category === category);
  }

  const totalPosts = sortedPosts.length;

  sortedPosts = sortedPosts.sort((a, b) => {
    return a[sortBy].localeCompare(b[sortBy], undefined, {ignorePunctuation: true});
  });

  if(order === 'DESC') {
    sortedPosts.reverse();
  }

  sortedPosts = sortedPosts.slice(page * limit, (page * limit) + limit);

  console.log(category, sortedPosts);

  res.json({
    posts: sortedPosts,
    page, 
    limit,
    order,
    sortBy,
    count: sortedPosts.length,
    total: totalPosts,
  });
});

app.get('/api/categories', (req, res) => {
  // TODO: make this a database call
  const categoryMap = {};

  mockArticles.forEach(({ category }) => {
    if(categoryMap[category]) {
      categoryMap[category]++;
    } else{
      categoryMap[category] = 1;
    }
  });

  res.json(categoryMap);
});

app.get('/api/posts/:id', (req, res) => {
  res.json(mockArticles.find(article => +article.id === +req.params.id));
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
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('exit', () => shutdown('exit'));
