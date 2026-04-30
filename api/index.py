import base64
from lxml import etree
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
# This is the file you just generated
from .data_assets import TEAM_SVG_DATA 

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        query = parse_qs(urlparse(self.path).query)
        team_a_slug = query.get('a', [None])[0]
        team_b_slug = query.get('b', [None])[0]

        if not team_a_slug or not team_b_slug:
            self.send_error(400, "Missing parameters 'a' or 'b'")
            return

        # Get the Base64 strings from our internal dictionary
        svg_a_enc = TEAM_SVG_DATA.get(team_a_slug)
        svg_b_enc = TEAM_SVG_DATA.get(team_b_slug)

        if not svg_a_enc or not svg_b_enc:
            self.send_error(404, f"Team data not found for: {team_a_slug if not svg_a_enc else team_b_slug}")
            return

        try:
            # Decode and Parse
            parser = etree.XMLParser(remove_blank_text=True)
            tree_a = etree.fromstring(base64.b64decode(svg_a_enc), parser)
            tree_b = etree.fromstring(base64.b64decode(svg_b_enc), parser)

            # Surgical Purge (The removal of 'OREA', 'CBF', etc.)
            for tree in [tree_a, tree_b]:
                for noise in tree.xpath(".//*[@id='typography_labels']"):
                    noise.getparent().remove(noise)

            # Extract Elements
            mascot_a = tree_a.xpath(".//*[@id='hero_graphic']")[0]
            shield_b = tree_b.xpath(".//*[@id='primary_silhouette']")[0]

            # Build Combined SVG
            combined_svg = etree.Element("svg", nsmap=tree_b.nsmap)
            # Ensure we use the proper viewBox from the shield
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
            self.send_error(500, f"Logic Error: {str(e)}")