import base64
import os
from lxml import etree
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# Path to the plain text data file
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(CURRENT_DIR, "data_assets.txt")

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        query = parse_qs(urlparse(self.path).query)
        
        # Get four teams: a, b, c, d
        team_slugs = {
            'a': query.get('a', [None])[0],
            'b': query.get('b', [None])[0],
            'c': query.get('c', [None])[0],
            'd': query.get('d', [None])[0]
        }
        
        if not all(team_slugs.values()):
            self.send_error(400, "Missing parameters. Need 'a', 'b', 'c', and 'd'.")
            return

        # Read data_assets.txt once into memory[cite: 1]
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
            # Functional roles based on your semantic audit[cite: 2]
            roles = {
                'a': 'primary_silhouette', # The Base
                'b': 'secondary_elements', # The Texture
                'c': 'hero_graphic',       # Main Mascot
                'd': 'hero_graphic'        # Chaos Mascot
            }

            for key, role_id in roles.items():
                slug = team_slugs[key].strip().lower()
                if slug in svg_data_map:
                    tree = etree.fromstring(base64.b64decode(svg_data_map[slug]), parser)
                    
                    # Purge typography noise as planned[cite: 1]
                    for noise in tree.xpath(".//*[@id='typography_labels']"):
                        noise.getparent().remove(noise)
                    
                    target = tree.xpath(f".//*[@id='{role_id}']")
                    if target:
                        elements[key] = target[0]

            # Build the 1000x1000 Canvas[cite: 1]
            # Use the namespace of the first team to prevent rendering errors
            combined_svg = etree.Element("svg", nsmap=elements['a'].nsmap if 'a' in elements else None)
            combined_svg.set("viewBox", "0 0 1000 1000")
            combined_svg.set("xmlns", "http://www.w3.org/2000/svg")

            # Layer 1: The Chassis[cite: 2]
            if 'a' in elements:
                elements['a'].set("style", "opacity:1;")
                combined_svg.append(elements['a'])

            # Layer 2: Texture (Team B)[cite: 2]
            if 'b' in elements:
                elements['b'].set("style", "opacity:0.4;")
                combined_svg.append(elements['b'])

            # Layer 3: Main Mascot (Team C)[cite: 2]
            if 'c' in elements:
                elements['c'].set("style", "opacity:1;")
                combined_svg.append(elements['c'])

            # Layer 4: Chaos Mascot (Team D)[cite: 1]
            if 'd' in elements:
                elements['d'].set("transform", "rotate(20 500 500) scale(0.8)")
                elements['d'].set("style", "opacity:0.7;")
                combined_svg.append(elements['d'])

            # Output as clean SVG string (Safe for Vercel)[cite: 1]
            self.send_response(200)
            self.send_header('Content-type', 'image/svg+xml')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(etree.tostring(combined_svg))

        except Exception as e:
            self.send_error(500, f"Kit-Builder Execution Error: {str(e)}")