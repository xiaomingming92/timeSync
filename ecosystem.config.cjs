module.exports = {
  apps: [
    {
      name: 'ndate-service',
      script: './dist/index.js',
      exec_interpreter: '/home/xmm/.volta/tools/image/node/24.11.0/bin/node',
      instances: 1,
      exec_mode: 'fork',
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
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // 解决 cluster 模式下使用特权端口的问题
      // 需要确保 Node.js 进程有 CAP_NET_BIND_SERVICE 能力
      capabilities: {
        'CAP_NET_BIND_SERVICE': 'ep'
      }
    }
  ]
};
