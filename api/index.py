import base64
import os
from lxml import etree
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# Path to the plain text data file (slug:base64)
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(CURRENT_DIR, "data_assets.txt")

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        query = parse_qs(urlparse(self.path).query)
        
        raw_a = query.get('a', [None])[0]
        raw_b = query.get('b', [None])[0]
        
        if not raw_a or not raw_b:
            self.send_error(400, "Missing parameters 'a' or 'b'")
            return

        team_a_slug = raw_a.strip().lower()
        team_b_slug = raw_b.strip().lower()

        # 1. Retrieve data from the text file
        svg_a_enc, svg_b_enc = None, None
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r') as f:
                for line in f:
                    if ':' not in line: continue
                    parts = line.split(":", 1)
                    if parts[0].strip().lower() == team_a_slug:
                        svg_a_enc = parts[1].strip()
                    if parts[0].strip().lower() == team_b_slug:
                        svg_b_enc = parts[1].strip()
                    if svg_a_enc and svg_b_enc: break
        
        if not svg_a_enc or not svg_b_enc:
            missing = team_a_slug if not svg_a_enc else team_b_slug
            self.send_error(404, f"Key '{missing}' not found in data_assets.txt")
            return

        try:
            # 2. Parse the SVGs
            parser = etree.XMLParser(remove_blank_text=True)
            tree_a = etree.fromstring(base64.b64decode(svg_a_enc), parser)
            tree_b = etree.fromstring(base64.b64decode(svg_b_enc), parser)

            # 3. Clean noise based on your semantic audit
            for tree in [tree_a, tree_b]:
                for noise in tree.xpath(".//*[@id='typography_labels']"):
                    noise.getparent().remove(noise)

            # 4. Extract specific IDs
            mascot_a = tree_a.xpath(".//*[@id='hero_graphic']")[0]
            shield_b = tree_b.xpath(".//*[@id='primary_silhouette']")[0]

            # 5. Build the container
            # Using nsmap handles the xmlns declaration automatically.
            combined_svg = etree.Element("svg", nsmap=tree_b.nsmap)
            
            # Set attributes without manual xmlns string to avoid the 'redefined' error
            combined_svg.set("viewBox", "0 0 1000 1000")
            
            # 6. Ensure visibility and scaling
            shield_b.set("style", "display:inline; opacity:1;")
            mascot_a.set("style", "display:inline; opacity:1;")
            
            # 7. Assemble
            combined_svg.append(shield_b)
            combined_svg.append(mascot_a)

            # 8. Output
            self.send_response(200)
            self.send_header('Content-type', 'image/svg+xml')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(etree.tostring(combined_svg, pretty_print=True))

        except Exception as e:
            self.send_error(500, f"Kit-Builder Logic Error: {str(e)}")