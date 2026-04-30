from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json
import os
from lxml import etree

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        query = urlparse(self.path).query
        params = parse_qs(query)
        
        # 'a' is the Body (Silhouette), 'b' is the Soul (Hero Icon)
        sel_a = params.get('a', ['usa'])[0].lower()
        sel_b = params.get('b', ['mexico'])[0].lower()

        try:
            # Setup paths for Vercel's environment[cite: 1, 2]
            base_path = os.path.join('/var/task', 'assets')
            manifest_path = os.path.join(base_path, 'semantic_audit_manifest.json')
            
            with open(manifest_path, 'r') as f:
                manifest_data = json.load(f)
            
            # 1. GET TEAM DATA[cite: 3]
            team_a = manifest_data['teams'][sel_a]
            team_b = manifest_data['teams'][sel_b]

            # 2. PARSE THE SVG FILES
            tree_a = etree.parse(os.path.join('/var/task', team_a['file_path']))
            tree_b = etree.parse(os.path.join('/var/task', team_b['file_path']))
            
            # 3. SURGICAL EXTRACTION USING INJECTED IDs
            # Find the shield from Team A and the icon from Team B
            silhouette = tree_a.xpath(".//*[@id='primary_silhouette']")[0]
            hero = tree_b.xpath(".//*[@id='hero_graphic']")[0]

            # 4. AMALGAMATION
            # Convert elements to strings and wrap in a clean 2026 viewport
            silhouette_str = etree.tostring(silhouette, encoding='unicode')
            hero_str = etree.tostring(hero, encoding='unicode')

            # Pull colors from the manifest[cite: 3]
            color_a = team_a['elements']['hero_palette'][0]
            color_b = team_b['elements']['hero_palette'][0]

            final_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 310">
    <g id="kit-silhouette" fill="{color_a}">
        {silhouette_str}
    </g>
    <g id="kit-hero" fill="{color_b}">
        {hero_str}
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
            self.wfile.write(f"Frankenstein Error: {str(e)}".encode())from http.server import BaseHTTPRequestHandler
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
            # We are now looking for 'assets' which Next.js won't hide
            base_path = os.path.join('/var/task', 'assets')
            manifest_path = os.path.join(base_path, 'semantic_audit_manifest.json')
            logo_dir = os.path.join(base_path, 'svg-logos')

            with open(manifest_path, 'r') as f:
                manifest = json.load(f)
            
            file_a_path = os.path.join(logo_dir, manifest[sel_a]['filename_map'])
            file_b_path = os.path.join(logo_dir, manifest[sel_b]['filename_map'])

            with open(file_a_path, 'rb') as f:
                svg_a_raw = f.read()
            with open(file_b_path, 'rb') as f:
                svg_b_raw = f.read()
            
            root_a = etree.fromstring(svg_a_raw)
            root_b = etree.fromstring(svg_b_raw)
            
            inner_a = "".join([etree.tostring(child, encoding='unicode') for child in root_a])
            inner_b = "".join([etree.tostring(child, encoding='unicode') for child in root_b])

            final_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" fill="white"/>
    <g id="base-layer" opacity="0.3">{inner_a}</g>
    <g id="overlay-layer" transform="scale(0.5) translate(50, 50)">{inner_b}</g>
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
            self.wfile.write(f"Error: {str(e)}\nPath: {manifest_path}".encode())
