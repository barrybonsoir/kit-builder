import os
from lxml import etree
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# Configuration
ASSETS_DIR = os.path.join(os.path.dirname(__file__), "..", "assets", "svg-logos")

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # 1. Parse Parameters
        query = parse_qs(urlparse(self.path).query)
        team_a_slug = query.get('a', [None])[0]
        team_b_slug = query.get('b', [None])[0]

        if not team_a_slug or not team_b_slug:
            self.send_error(400, "Missing team parameters 'a' or 'b'")
            return

        try:
            # 2. Locate and Parse SVGs
            file_a = os.path.join(ASSETS_DIR, f"{team_a_slug}-national-team-logo.svg")
            file_b = os.path.join(ASSETS_DIR, f"{team_b_slug}-national-team-logo.svg")

            parser = etree.XMLParser(remove_blank_text=True)
            tree_a = etree.parse(file_a, parser)
            tree_b = etree.parse(file_b, parser)

            # 3. THE SURGICAL PURGE
            # This removes 'OREA', 'CBF', and other text artifacts labeled by the inject script
            for tree in [tree_a, tree_b]:
                for noise in tree.xpath(".//*[@id='typography_labels']"):
                    noise.getparent().remove(noise)

            # 4. Extract Key Semantic Elements
            # We prioritize the Mascot from Team A and the Shield from Team B
            mascot_a = tree_a.xpath(".//*[@id='hero_graphic']")[0]
            shield_b = tree_b.xpath(".//*[@id='primary_silhouette']")[0]

            # 5. Build the Amalgamated Emblem
            # Create a fresh SVG container
            combined_svg = etree.Element("svg", nsmap=tree_a.getroot().nsmap)
            combined_svg.set("viewBox", tree_b.getroot().get("viewBox", "0 0 100 100"))
            combined_svg.set("xmlns", "http://www.w3.org/2000/svg")

            # Layering: Shield in back, Mascot in front
            combined_svg.append(shield_b)
            combined_svg.append(mascot_a)

            # 6. Return the Response
            self.send_response(200)
            self.send_header('Content-type', 'image/svg+xml')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(etree.tostring(combined_svg, pretty_print=True))

        except Exception as e:
            self.send_error(500, f"Kit-Builder Error: {str(e)}")