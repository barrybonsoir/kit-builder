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
                    for noise in tree.xpath(".//*[@id='typography_labels']"):
                        noise.getparent().remove(noise)
                    target = tree.xpath(f".//*[@id='{role_id}']")
                    if target: elements[key] = target[0]

            # 2. Build a high-fidelity container
            combined_svg = etree.Element("svg", nsmap=elements['a'].nsmap if 'a' in elements else None)
            combined_svg.set("viewBox", "0 0 1000 1000")
            
            # Inject CSS for unified "Bespoke" look
            style = etree.SubElement(combined_svg, "style")
            style.text = """
                .chassis { fill: #1a1a1a; }
                .texture { fill: #333333; mix-blend-mode: overlay; }
                .hero-main { fill: #f5f5f5; }
                .hero-chaos { fill: #e61e2e; mix-blend-mode: screen; }
            """

            # Create a Mask so textures stay inside the shield
            defs = etree.SubElement(combined_svg, "defs")
            if 'a' in elements:
                mask = etree.SubElement(defs, "clipPath", id="shieldMask")
                mask.append(etree.fromstring(etree.tostring(elements['a'])))

            # Layering with Alignment
            def add_layer(el, cls, transform="translate(500,500) scale(1)"):
                g = etree.SubElement(combined_svg, "g", attrib={
                    "class": cls,
                    "transform": transform,
                    "clip-path": "url(#shieldMask)" if "chassis" not in cls else ""
                })
                # Wrap internal paths to center them
                inner_g = etree.SubElement(g, "g", transform="translate(-500,-500)")
                inner_g.append(el)

            if 'a' in elements: add_layer(elements['a'], "chassis")
            if 'b' in elements: add_layer(elements['b'], "texture")
            if 'c' in elements: add_layer(elements['c'], "hero-main", "translate(500,500) scale(0.6)")
            if 'd' in elements: add_layer(elements['d'], "hero-chaos", "translate(500,500) rotate(15) scale(0.4)")

            self.send_response(200)
            self.send_header('Content-type', 'image/svg+xml')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(etree.tostring(combined_svg))

        except Exception as e:
            self.send_error(500, f"Vibe Error: {str(e)}")