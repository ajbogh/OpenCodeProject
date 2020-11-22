const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const port = 3001;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.listen(port, () => {
  console.log(`Webhooks listening at http://localhost:${port}`)
});

app.post('/webhook', (req, res) => {
  const details = res.json(req.body);
  console.log(req.body);
  res.status(200).end();
});
