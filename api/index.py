import os
from pathlib import Path
from lxml import etree
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# FORCE BUNDLING: This tells the builder the folder is a dependency
# We use __file__ to ensure the path is pinned to the Lambda's task root
CURRENT_DIR = Path(__file__).parent.resolve()
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

        if not file_a.exists() or not file_b.exists():
            # If the folder is still missing, we'll try to find it in the parent
            # This is a fallback for different Vercel environment configurations
            alt_path = CURRENT_DIR.parent / "api" / "assets" / "svg-logos"
            if alt_path.exists():
                file_a = alt_path / f"{team_a_slug}-national-team.football-logos.cc.svg"
                file_b = alt_path / f"{team_b_slug}-national-team.football-logos.cc.svg"
            
            if not file_a.exists():
                self.send_error(404, f"Asset missing. Path checked: {ASSETS_DIR}")
                return

        try:
            parser = etree.XMLParser(remove_blank_text=True)
            tree_a = etree.parse(str(file_a), parser)
            tree_b = etree.parse(str(file_b), parser)

            # Surgical Purge (removes OREA/CBF/Stars)
            for tree in [tree_a, tree_b]:
                for noise in tree.xpath(".//*[@id='typography_labels']"):
                    noise.getparent().remove(noise)

            # Extract elements based on your semantic_audit.py findings
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