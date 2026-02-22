#!/usr/bin/env python3
"""
测试 RFC 868 Time Protocol 服务器
"""

import socket
import struct
import time

# RFC 868 时间从 1900-01-01 开始，而 Unix 时间从 1970-01-01 开始
# 两者相差 2208988800 秒
TIME_OFFSET = 2208988800

def test_rfc868_server(host='localhost', port=37):
    """测试 RFC 868 服务器"""
    print(f"连接到 RFC 868 服务器 {host}:{port}...")
    
    try:
        # 创建 socket 连接
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5)
        sock.connect((host, port))
        
        # 接收 4 字节数据
        data = sock.recv(4)
        
        if len(data) != 4:
            print(f"错误：接收到的数据长度不正确: {len(data)} 字节")
            return
        
        # 解析 32 位大端序整数
        rfc868_time = struct.unpack('>I', data)[0]
        unix_time = rfc868_time - TIME_OFFSET
        
        print(f"接收到的 RFC 868 时间: {rfc868_time}")
        print(f"转换为 Unix 时间: {unix_time}")
        print(f"当前时间: {int(time.time())}")
        print(f"时间差: {abs(int(time.time()) - unix_time)} 秒")
        print(f"日期时间: {time.ctime(unix_time)}")
        
        sock.close()
        print("测试成功！")
        
    except Exception as e:
        print(f"错误: {e}")

if __name__ == '__main__':
    test_rfc868_server()
