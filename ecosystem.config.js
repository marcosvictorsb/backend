module.exports = {
  apps: [
    {
      name: 'gunno-api',
      script: './dist/server.js',
      instances: 'max',          
      exec_mode: 'cluster', 
      watch: false, 
      env: {
        NODE_ENV: 'production'
      }
    }
  ],
  deploy: {
    production: {
      user: 'root',
      host: '177.153.50.232',
      ref: 'origin/main',
      repo: 'git@github.com:marcosvictorsb/gunno-app.git',
      path: '/var/www/backend/gunno-api',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};