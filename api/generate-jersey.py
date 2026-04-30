from http.server import BaseHTTPRequestHandler
import os

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        
        # This will tell us the TRUTH about what files are in your root
        root_files = os.listdir('/var/task')
        
        output = f"DIAGNOSTIC REPORT\n"
        output += f"Current Working Directory: {os.getcwd()}\n"
        output += f"Files in /var/task: {root_files}\n"
        
        if 'public' in root_files:
            output += f"Public folder exists! Contents: {os.listdir('/var/task/public')}\n"
        else:
            output += "Public folder IS MISSING from /var/task\n"
            
        self.wfile.write(output.encode())