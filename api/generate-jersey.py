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
            # 1. Read manifest from local file system
            manifest_path = os.path.join(os.getcwd(), 'public', 'semantic_audit_manifest.json')
            with open(manifest_path, 'r') as f:
                manifest = json.load(f)
            
            # 2. Get file paths
            file_a_path = os.path.join(os.getcwd(), 'public', 'svg-logos', manifest[sel_a]['filename_map'])
            file_b_path = os.path.join(os.getcwd(), 'public', 'svg-logos', manifest[sel_b]['filename_map'])

            # 3. Read SVG contents
            with open(file_a_path, 'rb') as f:
                svg_a_raw = f.read()
            with open(file_b_path, 'rb') as f:
                svg_b_raw = f.read()
            
            # 4. Parse SVGs
            root_a = etree.fromstring(svg_a_raw)
            root_b = etree.fromstring(svg_b_raw)
            
            # Extract inner content of B to overlay
            inner_b = "".join([etree.tostring(child, encoding='unicode') for child in root_b])

            # 5. Build the composite SVG
            # Use ViewBox from Logo A as the master frame
            final_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="{manifest[sel_a]['viewBox']}">
    <g id="base-layer" opacity="0.3">
        {etree.tostring(root_a, encoding='unicode')}
    </g>
    <g id="overlay-layer" transform="scale(0.5) translate(25, 25)">
        {inner_b}
    </g>
</svg>"""

            self.send_response(200)
            self.send_header('Content-type', 'image/svg+xml')
            # Important: Add cache control so you see changes immediately
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.end_headers()
            self.wfile.write(final_svg.encode('utf-8'))

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(f"Internal Server Error: {str(e)}".encode())