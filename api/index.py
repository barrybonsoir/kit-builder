import base64
import os
from lxml import etree
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(CURRENT_DIR, "data_assets.txt")

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        query = parse_qs(urlparse(self.path).query)
        # Use .strip() to ensure no accidental spaces in the URL params
        team_a_slug = query.get('a', [None])[0].strip().lower()
        team_b_slug = query.get('b', [None])[0].strip().lower()

        svg_a_enc, svg_b_enc = None, None
        
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r') as f:
                for line in f:
                    if ':' not in line: continue
                    
                    # Split into slug and data, stripping all whitespace
                    parts = line.split(":", 1)
                    current_slug = parts[0].strip().lower()
                    current_data = parts[1].strip()

                    if current_slug == team_a_slug:
                        svg_a_enc = current_data
                    if current_slug == team_b_slug:
                        svg_b_enc = current_data
        
        if not svg_a_enc or not svg_b_enc:
            missing = team_a_slug if not svg_a_enc else team_b_slug
            self.send_error(404, f"Key '{missing}' not found in data_assets.txt")
            return

        try:
            parser = etree.XMLParser(remove_blank_text=True)
            tree_a = etree.fromstring(base64.b64decode(svg_a_enc), parser)
            tree_b = etree.fromstring(base64.b64decode(svg_b_enc), parser)

            # Surgical Purge (ID-based removal)
            for tree in [tree_a, tree_b]:
                for noise in tree.xpath(".//*[@id='typography_labels']"):
                    noise.getparent().remove(noise)

            # Extraction
            mascot_a = tree_a.xpath(".//*[@id='hero_graphic']")[0]
            shield_b = tree_b.xpath(".//*[@id='primary_silhouette']")[0]

            combined_svg = etree.Element("svg", nsmap=tree_b.nsmap)
            combined_svg.set("viewBox", tree_b.get("viewBox", "0 0 100 100"))
            combined_svg.set("xmlns", "http://www.w3.org/2000/svg")

            combined_svg.append(shield_b)
            combined_svg.append(mascot_a)

            self.send_response(200)
            self.send_header('Content-type', 'image/svg+xml')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(etree.tostring(combined_svg, pretty_print=True))

        except Exception as e:
            self.send_error(500, f"SVG Processing Error: {str(e)}")