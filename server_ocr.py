from http.server import BaseHTTPRequestHandler, HTTPServer
import os
import io
import http.server
import json
import base64
from urllib.parse import unquote_plus

try:
    import ddddocr
except:
    os.system("pip install -i https://pypi.tuna.tsinghua.edu.cn/simple ddddocr")
    print("ddddocr已安装")
    import ddddocr

# 初始化OCR对象
ocr = ddddocr.DdddOcr()

class OCRRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write("345345".encode())
    def do_POST(self):
        if self.path == '/ocr':
            # 获取请求体长度
            content_length = int(self.headers['Content-Length'])
            # 读取请求体
            post_data = self.rfile.read(content_length)
            # 解析JSON数据
            try:
                data = json.loads(post_data)
                img_base64 = data['img']
                # 将base64解码为字节
                img_bytes = base64.b64decode(img_base64)
                # 使用ddddocr识别验证码
                result = ocr.classification(img_bytes)
                # 返回识别结果
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                response = {'result': result}
                self.wfile.write(json.dumps(response).encode())
            except Exception as e:
                # 发生错误时返回错误信息
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {'error': str(e)}
                self.wfile.write(json.dumps(response).encode())
        else:
            # 如果不是/ocr路径，返回404
            self.send_error(404)

# 设置服务器地址和端口
server_address = ('', 80)

# 创建HTTP服务器
httpd = http.server.HTTPServer(server_address, OCRRequestHandler)

print(f'Server running on port {server_address[1]}...')
# 启动服务器
httpd.serve_forever()