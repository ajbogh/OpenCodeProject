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
git submodule update --remote --merge
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

## Docker

Docker will use a swarm for future flexibility. Some commands are listed below to start the swarm and list the relevant information later if you need it.

We will use the docker stack command to deploy the services.

```bash
# Start swarm if not already started
docker swarm init
# Manage swarm nodes: https://docs.docker.com/engine/swarm/manage-nodes/
# Retrieve join command for worker nodes 
docker swarm join-token worker
# View join command and token for manager nodes
docker swarm join-token manager

# Start database
docker stack deploy -c stack.yml mysql
```

## Database

Once Docker is running, run the database install script.

```
npm run setup
```

To back up the database, run the backup script.

```
npm run backup
```

Copy the src/database files to a backup location. They can be restored later by copying them back to the same location and running the `setup` script from above.


The open PHPMyAdmin: http://localhost:8080
Or use MySQL administration programs to connect to localhost:3306 using your configured username and password.
