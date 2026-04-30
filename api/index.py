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
        
        # Get team slugs, but don't fail if c or d are missing
        team_slugs = {
            'a': query.get('a', [None])[0],
            'b': query.get('b', [None])[0],
            'c': query.get('c', [None])[0],
            'd': query.get('d', [None])[0]
        }
        
        # We only strictly need 'a' to have a base[cite: 1]
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
            roles = {
                'a': 'primary_silhouette',
                'b': 'secondary_elements',
                'c': 'hero_graphic',
                'd': 'hero_graphic'
            }

            for key, role_id in roles.items():
                slug = team_slugs[key].strip().lower() if team_slugs[key] else None
                if slug and slug in svg_data_map:
                    tree = etree.fromstring(base64.b64decode(svg_data_map[slug]), parser)
                    
                    # Clean typography noise[cite: 1]
                    for noise in tree.xpath(".//*[@id='typography_labels']"):
                        noise.getparent().remove(noise)
                    
                    target = tree.xpath(f".//*[@id='{role_id}']")
                    if target:
                        elements[key] = target[0]

            # Build the container[cite: 1]
            # Removing manual 'xmlns' set to avoid the "Attribute redefined" error[cite: 1]
            combined_svg = etree.Element("svg", nsmap=elements['a'].nsmap if 'a' in elements else None)
            combined_svg.set("viewBox", "0 0 1000 1000")

            if 'a' in elements:
                elements['a'].set("style", "opacity:1;")
                combined_svg.append(elements['a'])

            if 'b' in elements:
                elements['b'].set("style", "opacity:0.4;")
                combined_svg.append(elements['b'])

            if 'c' in elements:
                elements['c'].set("style", "opacity:1;")
                combined_svg.append(elements['c'])

            if 'd' in elements:
                # Add a bit of "strange" offset so the heroes don't perfectly overlap[cite: 1]
                elements['d'].set("transform", "rotate(20 500 500) scale(0.8)")
                elements['d'].set("style", "opacity:0.7;")
                combined_svg.append(elements['d'])

            self.send_response(200)
            self.send_header('Content-type', 'image/svg+xml')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            # tostring() will handle the xmlns declaration correctly on its own[cite: 1]
            self.wfile.write(etree.tostring(combined_svg))

        except Exception as e:
            self.send_error(500, f"Kit-Builder Logic Error: {str(e)}")