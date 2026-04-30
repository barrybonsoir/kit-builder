import os
from pathlib import Path
from lxml import etree
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# Absolute path resolution
CURRENT_DIR = Path(__file__).parent
ASSETS_DIR = CURRENT_DIR / "assets" / "svg-logos"

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        query = parse_qs(urlparse(self.path).query)
        team_a_slug = query.get('a', [None])[0]
        team_b_slug = query.get('b', [None])[0]

        if not team_a_slug or not team_b_slug:
            self.send_error(400, "Missing parameters 'a' or 'b'")
            return

        # Matches your screenshot: {slug}-national-team.football-logos.cc.svg
        file_a = ASSETS_DIR / f"{team_a_slug}-national-team.football-logos.cc.svg"
        file_b = ASSETS_DIR / f"{team_b_slug}-national-team.football-logos.cc.svg"

        # Diagnostic Check
        if not file_a.exists() or not file_b.exists():
            # Let's see what the container actually contains
            existing_files = [f.name for f in ASSETS_DIR.glob('*')] if ASSETS_DIR.exists() else "Folder missing"
            self.send_error(404, f"Asset Not Found. Looking for: {file_a.name}. Available assets: {existing_files}")
            return

        try:
            parser = etree.XMLParser(remove_blank_text=True)
            tree_a = etree.parse(str(file_a), parser)
            tree_b = etree.parse(str(file_b), parser)

            # Surgical Purge
            for tree in [tree_a, tree_b]:
                for noise in tree.xpath(".//*[@id='typography_labels']"):
                    noise.getparent().remove(noise)

            # Extract Elements
            mascot_a = tree_a.xpath(".//*[@id='hero_graphic']")[0]
            shield_b = tree_b.xpath(".//*[@id='primary_silhouette']")[0]

            combined_svg = etree.Element("svg", nsmap=tree_b.getroot().nsmap)
            combined_svg.set("viewBox", tree_b.getroot().get("viewBox", "0 0 100 100"))
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