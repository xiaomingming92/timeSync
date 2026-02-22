import net from 'net';
const RFC868_PORT = 37;
const NODE_ENV = process.env.NODE_ENV || 'development';
// RFC 868 时间从 1900-01-01 开始，而 Unix 时间从 1970-01-01 开始
// 两者相差 2208988800 秒
const TIME_OFFSET = 2208988800;
// 启动 RFC 868 Time Protocol 服务器
function startRFC868Server() {
    const server = net.createServer((socket) => {
        try {
            // 获取当前时间
            const unixTime = Math.floor(Date.now() / 1000); // 转换为秒
            const rfc868Time = unixTime + TIME_OFFSET;
            // 发送 32 位大端序整数
            const buffer = Buffer.alloc(4);
            buffer.writeUInt32BE(rfc868Time, 0);
            socket.write(buffer);
            console.log(`RFC 868: 发送时间: ${unixTime} (Unix) -> ${rfc868Time} (RFC868)`);
            socket.end();
        }
        catch (error) {
            console.error(`RFC 868 错误: ${error}`);
            socket.end();
        }
    });
    server.listen(RFC868_PORT, '0.0.0.0', () => {
        console.log(`nDate 时间同步服务启动在端口 ${RFC868_PORT} (RFC 868 标准)`);
        console.log(`环境: ${NODE_ENV}`);
    });
    server.on('error', (error) => {
        console.error(`RFC 868 服务器错误: ${error}`);
    });
}
// 启动服务
startRFC868Server();
