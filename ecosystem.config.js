module.exports = {
  apps : [
    {
      name      : 'opencodeproject-server',
      script    : 'src/server/server.js',
      watch     : true,
      env: {
        NODE_ENV: 'development'
      },
      env_production : {
        NODE_ENV: 'production'
      }
    },
    {
      name      : 'opencodeproject-webhooks',
      script    : 'webhooks/webhook-server.js',
      watch     : true,
      env: {
        NODE_ENV: 'development'
      },
      env_production : {
        NODE_ENV: 'production'
      }
    },
    {
      name      : 'node-image-farmer',
      script    : 'node-image-farmer/app/app.js',
      watch     : true,
      args      : '--port=3002',
      env: {
        NODE_ENV: 'development',
      },
      env_production : {
        NODE_ENV: 'production',
      }
    }
  ]
};
