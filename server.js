const compression = require('compression');
const express = require('express');
const path = require('path');
const mockArticles = require('./mocks/articles.js');

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

app.use(express.static('src'));

app.get('/api/articles', (req, res) => {
  // TODO: make this a database call
  const { page = 0, limit = 10, sortBy = 'date', order = 'ASC' } = req.query;
  const totalArticles = mockArticles.length;

  let sortedArticles = mockArticles.sort((a, b) => {
    return a[sortBy].localeCompare(b[sortBy], undefined, {ignorePunctuation: true});
  });

  if(order === 'DESC') {
    sortedArticles.reverse();
  }

  sortedArticles = sortedArticles.slice(page * limit, (page * limit) + limit);

  res.json({
    articles: sortedArticles,
    page, 
    limit,
    order,
    sortBy,
    count: sortedArticles.length,
    total: totalArticles,
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

app.get('/api/articles/:id', (req, res) => {
  res.json(mockArticles.find(article => +article.id === +req.params.id));
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'src/index.html'));
});

app.use(send404); // catchall overrides need for 404
app.use(compression());

// Do graceful shutdown
function shutdown() {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed')
  });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
process.on('exit', shutdown);
