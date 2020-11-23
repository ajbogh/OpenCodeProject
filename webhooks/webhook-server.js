const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const port = 3001;
const allowedUsers = require('./config/webhook-users.js');
const exec = require('child_process').exec;
const process = require('process');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.listen(port, () => {
  console.log(`Webhooks listening at http://localhost:${port}`)
});

app.post('/webhook', (req, res) => {
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
