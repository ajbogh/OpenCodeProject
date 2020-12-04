# Setup

These instructions are intended to help a user or developer start with the project. Other notes and instructions are listed in the [setup](setup) folder.

## Downloading

```bash
git clone --recurse-submodules git@github.com:ajbogh/OpenCodeProject.git
```

## Pulling changes

```bash
# pull the project without updating submodules
git pull

# update the project and submodules
git pull --recurse-submodules

# update just the submodules
git submodule update --recursive
```

## Prior to npm installing

Before you run `npm install` you need to install some dependencies for the smart-crop server. You can see the instructions under [node-image-farmer/README.md](node-image-farmer/README.md).

Run **one** of the following commands, depending on your system:

```bash
$ cd node-image-farmer
$ npm run install-ubuntu-deps # if permission error, try using sudo.
$ # npm run install-redhat-deps
$ # npm run install-mac-deps (untested)
```

## Webhooks

Webhooks can be used to automatically update the server code using the master branch of the Github project.

Fork the project, then configure the webhook to point to http://yourdomain:3001/webhook.

Set up the secret using the instructions below.

Make sure the server starts with pm2 using the instructions in [the pm2 README](setup/pm2/README.md).

## Secrets

Copy the [config/secrets.example.js](config/secrets.example.js) file to `config/secrets.js`. Add your Github webhook secret to the file.



