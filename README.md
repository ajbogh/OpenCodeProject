# The Open Code Project - Open source website code

For complete setup instructions please see [SETUP.md](SETUP.md).

# Installation

```bash
$ npm install

# For running the server in production
$ npm install -g pm2
```

# Running the server

To run the server on a production machine, simply run pm2.

```bash
# In production
$ pm2 start ecosystem.config.js

# In development
$ npm run app
```
