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
        team_slugs = {k: query.get(k, [None])[0] for k in ['a', 'b', 'c', 'd']}
        
        if not team_slugs['a']:
            self.send_error(400, "Missing base parameter 'a'")
            return

        svg_data_map = {}
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r') as f:
                for line in f:
                    if ':' not in line: continue
                    slug, enc = line.split(":", 1)
                    svg_data_map[slug.strip().lower()] = enc.strip()

        try:
            parser = etree.XMLParser(remove_blank_text=True)
            elements = {}
            roles = {'a': 'primary_silhouette', 'b': 'secondary_elements', 'c': 'hero_graphic', 'd': 'hero_graphic'}

            for key, role_id in roles.items():
                slug = team_slugs[key].strip().lower() if team_slugs[key] else None
                if slug and slug in svg_data_map:
                    tree = etree.fromstring(base64.b64decode(svg_data_map[slug]), parser)
                    # Use the original viewbox if available to help with centering
                    vb = tree.get("viewBox", "0 0 1000 1000")
                    for noise in tree.xpath(".//*[@id='typography_labels']"):
                        noise.getparent().remove(noise)
                    target = tree.xpath(f".//*[@id='{role_id}']")
                    if target:
                        # Wrap the target in a group that preserves its original context
                        wrapper = etree.Element("svg", viewBox=vb, width="1000", height="1000")
                        wrapper.append(target[0])
                        elements[key] = wrapper

            combined_svg = etree.Element("svg", viewBox="0 0 1000 1000", xmlns="http://www.w3.org/2000/svg")
            
            # CSS for that 2026 Brand Playbook aesthetic[cite: 1, 2]
            style = etree.SubElement(combined_svg, "style")
            style.text = """
                svg { background: #000; }
                .chassis { fill: #fff; }
                .texture { opacity: 0.3; }
                .hero-main { filter: drop-shadow(0 0 10px rgba(255,255,255,0.5)); }
                .hero-chaos { fill: #ff3e3e; opacity: 0.8; }
            """

            # Sequential Layering
            def add_layer(el, cls, transform=""):
                g = etree.SubElement(combined_svg, "g", attrib={"class": cls, "transform": transform})
                g.append(el)

            if 'a' in elements: add_layer(elements['a'], "chassis")
            if 'b' in elements: add_layer(elements['b'], "texture")
            if 'c' in elements: add_layer(elements['c'], "hero-main", "scale(0.8) translate(125, 125)")
            if 'd' in elements: add_layer(elements['d'], "hero-chaos", "scale(0.5) translate(500, 500) rotate(15)")

            self.send_response(200)
            self.send_header('Content-type', 'image/svg+xml')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(etree.tostring(combined_svg))

        except Exception as e:
            self.send_error(500, f"Logic Error: {str(e)}")