require('dotenv').config();

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
      user: process.env.DEPLOY_USER,
      host: process.env.SERVER_HOST,
      ref: 'origin/main',
      repo: process.env.REPO_URL,
      path: process.env.DEPLOY_PATH,
      'post-deploy': 'npm install && npm run build && npm run migration && pm2 startOrRestart gunno-api --update-env'
    }
  }
};