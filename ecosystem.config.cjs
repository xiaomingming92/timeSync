module.exports = {
  apps: [
    {
      name: 'ndate-service',
      script: './dist/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '128M',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      log_file: './logs/ndate-service.log',
      out_file: './logs/ndate-service.out.log',
      error_file: './logs/ndate-service.error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
