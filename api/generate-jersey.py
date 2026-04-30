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
            # Vercel pathing[cite: 1, 2]
            base_path = os.path.join('/var/task', 'assets')
            manifest_path = os.path.join(base_path, 'semantic_audit_manifest.json')
            
            with open(manifest_path, 'r') as f:
                manifest_data = json.load(f)
            
            # Access the 'teams' dictionary
            teams = manifest_data.get('teams', {})
            
            if sel_a not in teams or sel_b not in teams:
                raise KeyError(f"Team '{sel_a}' or '{sel_b}' not found in manifest teams list.")

            team_a = teams[sel_a]
            team_b = teams[sel_b]

            # Parse SVGs using the file_path from manifest[cite: 3]
            # Note: We join with /var/task because Vercel bundles the assets there[cite: 1]
            path_a = os.path.join('/var/task', team_a['file_path'])
            path_b = os.path.join('/var/task', team_b['file_path'])
            
            tree_a = etree.parse(path_a)
            tree_b = etree.parse(path_b)
            
            # Use XPath to find our injected IDs[cite: 2]
            # We use * to handle namespaces gracefully
            silhouette = tree_a.xpath(".//*[@id='primary_silhouette']")[0]
            hero = tree_b.xpath(".//*[@id='hero_graphic']")[0]

            silhouette_str = etree.tostring(silhouette, encoding='unicode')
            hero_str = etree.tostring(hero, encoding='unicode')

            # Pull colors[cite: 3]
            color_a = team_a['elements']['hero_palette'][0]
            color_b = team_b['elements']['hero_palette'][0]

            # Build final SVG
            final_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 310">
                <g id="kit-silhouette" fill="{color_a}">{silhouette_str}</g>
                <g id="kit-hero" fill="{color_b}">{hero_str}</g>
            </svg>"""

            self.send_response(200)
            self.send_header('Content-type', 'image/svg+xml')
            self.end_headers()
            self.wfile.write(final_svg.encode('utf-8'))

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            # This will tell us exactly which key or path is failing
            self.wfile.write(f"Frankenstein Error: {str(e)}".encode())