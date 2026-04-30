import base64
import sys
import os
from lxml import etree
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# Add the current directory to the path so index.py can see data_assets.py
sys.path.append(os.path.dirname(__file__))

try:
    import data_assets
except ImportError:
    # Diagnostic fallback
    data_assets = None

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # 1. Check if the data file even loaded
        if data_assets is None:
            self.send_error(500, "Internal Error: data_assets.py not found in /api")
            return

        query = parse_qs(urlparse(self.path).query)
        team_a_slug = query.get('a', [None])[0]
        team_b_slug = query.get('b', [None])[0]

        if not team_a_slug or not team_b_slug:
            self.send_error(400, "Missing parameters 'a' or 'b'")
            return

        # 2. Extract SVG data from the dictionary
        # Using getattr to avoid crashes if the dict is missing
        svg_dict = getattr(data_assets, 'TEAM_SVG_DATA', {})
        svg_a_enc = svg_dict.get(team_a_slug)
        svg_b_enc = svg_dict.get(team_b_slug)

        if not svg_a_enc or not svg_b_enc:
            self.send_error(404, f"Team slug not found: {team_a_slug if not svg_a_enc else team_b_slug}")
            return

        try:
            # 3. Decode and Parse
            parser = etree.XMLParser(remove_blank_text=True)
            tree_a = etree.fromstring(base64.b64decode(svg_a_enc), parser)
            tree_b = etree.fromstring(base64.b64decode(svg_b_enc), parser)

            # 4. The Surgical Purge (Removing 'OREA', 'CBF', etc.)
            # This relies on the IDs you injected with your script
            for tree in [tree_a, tree_b]:
                for noise in tree.xpath(".//*[@id='typography_labels']"):
                    noise.getparent().remove(noise)

            # 5. Extract and Combine
            # mascot_a: The graphic | shield_b: The container
            mascot_a = tree_a.xpath(".//*[@id='hero_graphic']")[0]
            shield_b = tree_b.xpath(".//*[@id='primary_silhouette']")[0]

            combined_svg = etree.Element("svg", nsmap=tree_b.nsmap)
            combined_svg.set("viewBox", tree_b.get("viewBox", "0 0 100 100"))
            combined_svg.set("xmlns", "http://www.w3.org/2000/svg")

            combined_svg.append(shield_b)
            combined_svg.append(mascot_a)

            # 6. Send Result
            self.send_response(200)
            self.send_header('Content-type', 'image/svg+xml')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(etree.tostring(combined_svg, pretty_print=True))

        except Exception as e:
            self.send_error(500, f"Logic Error: {str(e)}")