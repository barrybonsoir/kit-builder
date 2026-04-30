from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import requests
from lxml import etree

MANIFEST_URL = "https://raw.githubusercontent.com/barrybonsoir/kit-builder/main/public/semantic_audit_manifest.json"

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        query = urlparse(self.path).query
        params = parse_qs(query)
        
        sel_a = params.get('a', ['brazil'])[0].lower()
        sel_b = params.get('b', ['england'])[0].lower()

        try:
            manifest = requests.get(MANIFEST_URL).json()
            
            # Load Logo A (The Background)
            file_a = manifest[sel_a]['filename_map']
            svg_a = requests.get(f"https://kit-builder-nu.vercel.app/public/svg-logos/{file_a}").content
            
            # Load Logo B (The Overlay)
            file_b = manifest[sel_b]['filename_map']
            svg_b = requests.get(f"https://kit-builder-nu.vercel.app/public/svg-logos/{file_b}").content
            
            # Clean up the SVGs to be injected
            root_b = etree.fromstring(svg_b)
            inner_content_b = etree.tostring(root_b, encoding='unicode')

            # Build the reassembled SVG
            final_svg = f"""
<svg xmlns="http://www.w3.org/2000/svg" viewBox="{manifest[sel_a]['viewBox']}">
    <g id="base-layer" opacity="0.4">
        {etree.tostring(etree.fromstring(svg_a), encoding='unicode')}
    </g>
    <g id="overlay-layer" transform="scale(0.5) translate(25, 25)">
        {inner_content_b}
    </g>
</svg>
"""
            self.send_response(200)
            self.send_header('Content-type', 'image/svg+xml')
            self.end_headers()
            self.wfile.write(final_svg.encode('utf-8'))

        except Exception as e:
            self.send_response(200)
            self.wfile.write(f"Error: {str(e)}".encode())