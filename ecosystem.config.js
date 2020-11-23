module.exports = {
  apps : [{
    name      : 'opencodeproject-server',
    script    : 'server.js',
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
  }]
};
