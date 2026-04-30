from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json
import os
from lxml import etree

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        query = urlparse(self.path).query
        params = parse_qs(query)
        
        # Get slugs from URL (default to usa/mexico)
        sel_a = params.get('a', ['usa'])[0].lower()
        sel_b = params.get('b', ['mexico'])[0].lower()

        try:
            # Vercel environment pathing
            base_path = os.path.join('/var/task', 'assets')
            manifest_path = os.path.join(base_path, 'semantic_audit_manifest.json')
            
            with open(manifest_path, 'r') as f:
                manifest_data = json.load(f)
            
            teams = manifest_data.get('teams', {})
            
            if sel_a not in teams or sel_b not in teams:
                raise KeyError(f"Team '{sel_a}' or '{sel_b}' not found in manifest.")

            team_a = teams[sel_a]
            team_b = teams[sel_b]

            # Parse SVGs using the explicit file_path from the manifest
            path_a = os.path.join('/var/task', team_a['file_path'])
            path_b = os.path.join('/var/task', team_b['file_path'])
            
            tree_a = etree.parse(path_a)
            tree_b = etree.parse(path_b)
            
            # Extract elements using our injected IDs
            silhouette = tree_a.xpath(".//*[@id='primary_silhouette']")[0]
            hero = tree_b.xpath(".//*[@id='hero_graphic']")[0]

            silhouette_str = etree.tostring(silhouette, encoding='unicode')
            hero_str = etree.tostring(hero, encoding='unicode')

            # Pull branding colors from manifest
            color_a = team_a['elements']['hero_palette'][0]
            color_b = team_b['elements']['hero_palette'][0]

            # THE NESTED SVG FIX:
            # We wrap the elements in their own viewboxes to force alignment.
            final_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" fill="none"/>
    
    <!-- Outer Container (Silhouette) centered at 100% size -->
    <svg viewBox="0 0 500 500" width="100" height="100" preserveAspectRatio="xMidYMid meet">
        <g fill="{color_a}">{silhouette_str}</g>
    </svg>

    <!-- Inner Graphic (Hero) scaled and centered inside the container -->
    <svg viewBox="0 0 500 500" width="60" height="60" x="20" y="20" preserveAspectRatio="xMidYMid meet">
        <g fill="{color_b}">{hero_str}</g>
    </svg>
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
            self.wfile.write(f"Frankenstein Error: {str(e)}".encode())