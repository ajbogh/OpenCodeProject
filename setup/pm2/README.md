Use PM2 to start the app.

More info: https://pm2.keymetrics.io/
Quick Start: https://pm2.keymetrics.io/docs/usage/quick-start/

```
pm2 start server.js
pm2 start webhooks/webhook-server.js
```

Once started, check the status with PM2

```
pm2 status
```

Set PM2 to start automatically:

```
pm2 startup
```
