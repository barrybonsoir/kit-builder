from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json
import os
from lxml import etree

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        query = urlparse(self.path).query
        params = parse_qs(query)
        
        sel_a = params.get('a', ['south-korea'])[0].lower()
        sel_b = params.get('b', ['brazil'])[0].lower()

        try:
            # 1. FIND THE ROOT DIRECTORY
            # This navigates from /var/task/api/generate-jersey.py up to /var/task/
            current_dir = os.path.dirname(os.path.abspath(__file__))
            root_dir = os.path.dirname(current_dir)
            
            # 2. DEFINE PATHS
            manifest_path = os.path.join(root_dir, 'public', 'semantic_audit_manifest.json')
            logo_dir = os.path.join(root_dir, 'public', 'svg-logos')
            
            # Debug check: If the path doesn't exist, try a direct relative path
            if not os.path.exists(manifest_path):
                manifest_path = os.path.abspath(os.path.join(current_dir, '..', 'public', 'semantic_audit_manifest.json'))
                logo_dir = os.path.abspath(os.path.join(current_dir, '..', 'public', 'svg-logos'))

            # 3. READ DATA
            with open(manifest_path, 'r') as f:
                manifest = json.load(f)
            
            file_a_path = os.path.join(logo_dir, manifest[sel_a]['filename_map'])
            file_b_path = os.path.join(logo_dir, manifest[sel_b]['filename_map'])

            with open(file_a_path, 'rb') as f:
                svg_a_raw = f.read()
            with open(file_b_path, 'rb') as f:
                svg_b_raw = f.read()
            
            # 4. PARSE AND ASSEMBLE
            root_a = etree.fromstring(svg_a_raw)
            root_b = etree.fromstring(svg_b_raw)
            
            inner_a = "".join([etree.tostring(child, encoding='unicode') for child in root_a])
            inner_b = "".join([etree.tostring(child, encoding='unicode') for child in root_b])

            final_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" fill="white"/>
    <g id="base-layer" opacity="0.3">
        {inner_a}
    </g>
    <g id="overlay-layer" transform="scale(0.5) translate(50, 50)">
        {inner_b}
    </g>
</svg>"""

            self.send_response(200)
            self.send_header('Content-type', 'image/svg+xml')
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.end_headers()
            self.wfile.write(final_svg.encode('utf-8'))

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            # Detailed debug output to help identify the missing folder
            self.wfile.write(f"Error: {str(e)}\nAttempted Manifest Path: {manifest_path}\nFiles in Root: {os.listdir(root_dir)}".encode())