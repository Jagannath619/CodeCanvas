from http.server import BaseHTTPRequestHandler
import os

HTML = open(os.path.join(os.path.dirname(__file__), 'index.html'), encoding='utf-8').read()

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write(HTML.encode('utf-8'))