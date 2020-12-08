const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const port = 3001;
const allowedUsers = require('./config/webhook-users.js');
const exec = require('child_process').exec;
const process = require('process');
let githubWebHook  = '';

try {
  const secrets = require('../config/secrets.js');
  githubWebHook = secrets.githubWebHook;
} catch (e) {
  console.error('Could not find the `config/secrets.js` file. Make sure to copy the config/secrets.example.js file and configure your secrets.', e);
  process.exit();
}

if(githubWebHook === '') {
  console.error('The github webhook secret is not defined. Please add a secret to your Github project\'s webhooks settings and copy it into the `config/secrets.js` file.');
  process.exit();
}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const server = app.listen(port, () => {
  console.log(`Webhooks listening at http://localhost:${port}`)
});

app.get('/webhook', (req, res) => {
  res.send("OK");
});

app.post('/webhook', (req, res) => {
  const xHubSignature = req.header('X-Hub-Signature');
  const host = req.header['X-Forwarded-Host'] || req.get('host');
  const origin = req.header['X-Forwarded-Origin'] || req.get('origin');
  const ip = req.header['X-Forwarded-For'] || req.connection.remoteAddress;

  if(xHubSignature !== githubWebHook) {
    console.error(`The X-Hub-Signature does not match: ${xHubSignature}, host: ${host}, origin: ${origin}`);
    res.status(401).end();
  }

  const details = req.body;
  const { login, id, html_url } = details.sender;

  const isUserAllowed = !!allowedUsers.find(user => {
    return user.login === login && user.id === id && user.html_url === html_url;
  });

  if(!isUserAllowed) {
    console.log("Git push ignored, user not allowed to deploy:", login, id, html_url);
    res.status(401).end();
    return;
  }

  // get package.json file mtime
  const scriptDir = __dirname;
  const packageStats = fs.statSync(`${scriptDir}/../package.json`);
  const packageMTime = packageStats.mtime;

  console.log("Running `git pull`");
  const child = exec('git pull', function (error, stdout, stderr) {
    if(stdout !== '') {
      console.log('stdout:', stdout);
    }
    
    if(stderr !== '') {
      console.log('stderr:', stderr);
    }

    if (error !== null) {
      console.log('exec error:', error);
      process.chdir(scriptDir);
      res.status(400).end();
      return;
    }

    // perform an npm install if package.json changed
    const newPackageStats = fs.statSync(`${scriptDir}/../package.json`)
    const newPackageMTime = newPackageStats.mtime;

    if(newPackageMTime.toString() !== packageMTime.toString()) {
      console.log("Running `npm install`");
      const child = exec('npm install', function (error, stdout, stderr) {
        if(stdout !== '') {
          console.log('stdout:', stdout);
        }

        if(stderr !== '') {
          console.log('stderr:', stderr);
        }

        if (error !== null) {
          console.log('exec error:', error);
          res.status(400).end();
          return;
        }
      });
    }
    
    res.status(200).end();
  });
});

// Do graceful shutdown
function shutdown(type) {
  console.log(`webhook: ${type} signal received: closing HTTP server`);
  server.close(() => {
    console.log('HTTP server closed')
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('exit', () => shutdown('exit'));
