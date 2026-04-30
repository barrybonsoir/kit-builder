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
                    vb = tree.get("viewBox", "0 0 1000 1000")
                    
                    # Purge typography labels
                    for noise in tree.xpath(".//*[@id='typography_labels']"):
                        noise.getparent().remove(noise)
                    
                    target = tree.xpath(f".//*[@id='{role_id}']")
                    if target:
                        # NEW: Force centering and scaling for each harvested element
                        wrapper = etree.Element("svg", {
                            "viewBox": vb,
                            "preserveAspectRatio": "xMidYMid meet",
                            "width": "100%",
                            "height": "100%"
                        })
                        wrapper.append(target[0])
                        elements[key] = wrapper

            # Final High-Vibe Assembly
            combined_svg = etree.Element("svg", viewBox="0 0 1000 1000", xmlns="http://www.w3.org/2000/svg")
            
            style = etree.SubElement(combined_svg, "style")
            style.text = """
                svg { background: #000; }
                .chassis { fill: #fff; }
                .texture { opacity: 0.3; }
                .hero-main { fill: #fff; filter: drop-shadow(0 0 15px rgba(255,255,255,0.3)); }
                .hero-chaos { fill: #ff0000; opacity: 0.8; mix-blend-mode: hard-light; }
            """

            # Helper to place layers into centered containers[cite: 1]
            def add_layer(el, cls, size="800", offset="100"):
                # Nested SVG acts as a centering frame[cite: 1]
                inner_svg = etree.SubElement(combined_svg, "svg", {
                    "x": offset, "y": offset, 
                    "width": size, "height": size,
                    "class": cls
                })
                inner_svg.append(el)

            # 1. Base Shield (Largest)
            if 'a' in elements: add_layer(elements['a'], "chassis", "900", "50")
            
            # 2. Pattern/Texture[cite: 1, 2]
            if 'b' in elements: add_layer(elements['b'], "texture", "850", "75")
            
            # 3. Main Mascot (Center)[cite: 1, 2]
            if 'c' in elements: add_layer(elements['c'], "hero-main", "500", "250")
            
            # 4. Chaos Mascot (Strange Offset)[cite: 1, 2]
            if 'd' in elements: 
                # Slightly rotate the chaos element[cite: 1]
                g = etree.SubElement(combined_svg, "g", transform="rotate(-15 500 500)")
                inner_svg = etree.SubElement(g, "svg", {
                    "x": "300", "y": "300", 
                    "width": "400", "height": "400",
                    "class": "hero-chaos"
                })
                inner_svg.append(elements['d'])

            self.send_response(200)
            self.send_header('Content-type', 'image/svg+xml')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(etree.tostring(combined_svg))

        except Exception as e:
            self.send_error(500, f"Logic Error: {str(e)}")