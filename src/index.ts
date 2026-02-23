import net from 'net';

// 端口 37 是 RFC 868 标准规定的时间同步服务端口
// 这是行业规范，必须使用端口 37
const RFC868_PORT = 37;
const NODE_ENV = process.env.NODE_ENV || 'development';

// RFC 868 时间从 1900-01-01 开始，而 Unix 时间从 1970-01-01 开始
// 两者相差 2208988800 秒
const TIME_OFFSET = 2208988800;

// 日志函数
function log(message: string, level: 'info' | 'error' | 'debug' = 'info') {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
}

// 启动 RFC 868 Time Protocol 服务器
function startRFC868Server() {
  const server = net.createServer((socket) => {
    const clientAddress = socket.remoteAddress || 'unknown';
    const clientPort = socket.remotePort || 'unknown';
    
    log(`接收到来自 ${clientAddress}:${clientPort} 的连接请求`, 'info');
    
    try {
      // 获取当前时间
      const unixTime = Math.floor(Date.now() / 1000); // 转换为秒
      const rfc868Time = unixTime + TIME_OFFSET;
      
      // 发送 32 位大端序整数
      const buffer = Buffer.alloc(4);
      buffer.writeUInt32BE(rfc868Time, 0);
      socket.write(buffer);
      
      log(`向 ${clientAddress}:${clientPort} 发送时间: ${unixTime} (Unix) -> ${rfc868Time} (RFC868)`, 'debug');
      socket.end();
      
      log(`连接已关闭: ${clientAddress}:${clientPort}`, 'info');
    } catch (error) {
      log(`处理连接时出错: ${error}`, 'error');
      socket.end();
    }
  });
  
  server.listen(RFC868_PORT, '0.0.0.0', () => {
    log(`nDate 时间同步服务启动在端口 ${RFC868_PORT} (RFC 868 标准)`, 'info');
    log(`环境: ${NODE_ENV}`, 'info');
    log(`服务已就绪，等待客户端连接...`, 'info');
  });
  
  server.on('error', (error) => {
    log(`服务器错误: ${error}`, 'error');
  });
  
  server.on('listening', () => {
    const address = server.address();
    if (typeof address === 'object' && address !== null) {
      log(`服务器监听地址: ${address.address}:${address.port}`, 'info');
    }
  });
}

// 启动服务
log('正在启动 nDate 时间同步服务...', 'info');
startRFC868Server();
