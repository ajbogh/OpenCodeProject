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

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
});

app.use(express.static('src'));

app.get('/api/articles', (req, res) => {
  res.json(mockArticles);
});

app.get('/api/articles/:id', (req, res) => {
  res.json(mockArticles.find(article => +article.id === +req.params.id));
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'src/index.html'));
});

app.use(send404); // catchall overrides need for 404
app.use(compression());
