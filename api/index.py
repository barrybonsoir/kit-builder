import os
from pathlib import Path
from lxml import etree
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# Absolute path resolution for Vercel's Lambda environment
# This finds the 'api' folder, then goes up to the project root
ROOT_DIR = Path(__file__).parent.parent
ASSETS_DIR = ROOT_DIR / "assets" / "svg-logos"

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # 1. Parse Parameters
        query = parse_qs(urlparse(self.path).query)
        team_a_slug = query.get('a', [None])[0]
        team_b_slug = query.get('b', [None])[0]

        if not team_a_slug or not team_b_slug:
            self.send_error(400, "Missing parameters 'a' or 'b'")
            return

        # 2. Map file paths
        file_a = ASSETS_DIR / f"{team_a_slug}-national-team-logo.svg"
        file_b = ASSETS_DIR / f"{team_b_slug}-national-team-logo.svg"

        # 3. Guard against missing assets
        if not file_a.exists() or not file_b.exists():
            missing = str(file_a) if not file_a.exists() else str(file_b)
            self.send_error(404, f"SVG Asset Not Found: {missing}")
            return

        try:
            # 4. Parse SVGs
            parser = etree.XMLParser(remove_blank_text=True)
            tree_a = etree.parse(str(file_a), parser)
            tree_b = etree.parse(str(file_b), parser)

            # 5. THE SURGICAL PURGE
            # Clears the 'typography_labels' (OREA, CBF, stars) tagged by your inject script
            for tree in [tree_a, tree_b]:
                for noise in tree.xpath(".//*[@id='typography_labels']"):
                    noise.getparent().remove(noise)

            # 6. Extract Semantic Elements
            # mascot_a: The primary character graphic
            # shield_b: The container/shield silhouette
            mascot_a = tree_a.xpath(".//*[@id='hero_graphic']")[0]
            shield_b = tree_b.xpath(".//*[@id='primary_silhouette']")[0]

            # 7. Construct Amalgamated SVG
            combined_svg = etree.Element("svg", nsmap=tree_b.getroot().nsmap)
            combined_svg.set("viewBox", tree_b.getroot().get("viewBox", "0 0 100 100"))
            combined_svg.set("xmlns", "http://www.w3.org/2000/svg")

            # Layering order: Shield (B) background, Mascot (A) foreground
            combined_svg.append(shield_b)
            combined_svg.append(mascot_a)

            # 8. Send Response
            self.send_response(200)
            self.send_header('Content-type', 'image/svg+xml')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(etree.tostring(combined_svg, pretty_print=True))

        except Exception as e:
            self.send_error(500, f"Kit-Builder Logic Error: {str(e)}")