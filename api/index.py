import base64
import os
import io
from lxml import etree
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from cairosvg import svg2png

# Path to the plain text data file (slug:base64)
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(CURRENT_DIR, "data_assets.txt")

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        query = parse_qs(urlparse(self.path).query)
        
        # 1. Capture four teams: a, b, c, d
        team_slugs = {
            'a': query.get('a', [None])[0],
            'b': query.get('b', [None])[0],
            'c': query.get('c', [None])[0],
            'd': query.get('d', [None])[0]
        }
        
        if not all(team_slugs.values()):
            self.send_error(400, "Missing parameters. Need 'a', 'b', 'c', and 'd'.")
            return

        # 2. Optimized Retrieval: Read data_assets.txt once into a dict
        svg_data_map = {}
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r') as f:
                for line in f:
                    if ':' not in line: continue
                    slug, enc = line.split(":", 1)
                    svg_data_map[slug.strip().lower()] = enc.strip()

        # 3. Parse SVGs for all four selections
        try:
            parser = etree.XMLParser(remove_blank_text=True)
            elements = {}
            
            # Map specific roles to each team selection
            roles = {
                'a': 'primary_silhouette', # The Chassis
                'b': 'secondary_elements', # The Texture
                'c': 'hero_graphic',       # The Main Mascot
                'd': 'hero_graphic'        # The "Chaos" Mascot
            }

            for key, role_id in roles.items():
                slug = team_slugs[key].strip().lower()
                if slug not in svg_data_map:
                    self.send_error(404, f"Team '{slug}' not found.")
                    return
                
                tree = etree.fromstring(base64.b64decode(svg_data_map[slug]), parser)
                
                # Cleanup: Always remove typography to keep it visual[cite: 1]
                for noise in tree.xpath(".//*[@id='typography_labels']"):
                    noise.getparent().remove(noise)
                
                target = tree.xpath(f".//*[@id='{role_id}']")
                if target:
                    elements[key] = target[0]

            # 4. Assemble the "Strange" Logo
            # Use nsmap from the first team for the container
            combined_svg = etree.Element("svg", nsmap=elements['a'].nsmap if 'a' in elements else None)
            combined_svg.set("viewBox", "0 0 1000 1000")
            combined_svg.set("width", "1000")
            combined_svg.set("height", "1000")

            # Layer 1: Chassis (Base)[cite: 2]
            if 'a' in elements:
                elements['a'].set("style", "opacity:1;")
                combined_svg.append(elements['a'])

            # Layer 2: Texture Overlay[cite: 2]
            if 'b' in elements:
                elements['b'].set("style", "opacity:0.4;") # Fade the texture
                combined_svg.append(elements['b'])

            # Layer 3: Main Hero[cite: 2]
            if 'c' in elements:
                elements['c'].set("style", "opacity:1;")
                combined_svg.append(elements['c'])

            # Layer 4: Chaos Hero (Rotated & Scaled)[cite: 1]
            if 'd' in elements:
                # Apply a 'bespoke' transform to make it look strange
                elements['d'].set("transform", "rotate(15 500 500) scale(0.8)")
                elements['d'].set("style", "opacity:0.7;")
                combined_svg.append(elements['d'])

            # 5. Output as PNG
            png_output = svg2png(
                bytestring=etree.tostring(combined_svg),
                output_width=1000,
                output_height=1000
            )

            self.send_response(200)
            self.send_header('Content-type', 'image/png')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(png_output)

        except Exception as e:
            self.send_error(500, f"Kit-Builder Execution Error: {str(e)}")