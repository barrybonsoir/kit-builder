import base64
import os
import io
from lxml import etree
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from svglib.svglib import svg2rlg
from reportlab.graphics import renderPM

# Path to the plain text data file
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(CURRENT_DIR, "data_assets.txt")

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        query = parse_qs(urlparse(self.path).query)
        
        team_slugs = {
            'a': query.get('a', [None])[0],
            'b': query.get('b', [None])[0],
            'c': query.get('c', [None])[0],
            'd': query.get('d', [None])[0]
        }
        
        if not all(team_slugs.values()):
            self.send_error(400, "Missing parameters 'a', 'b', 'c', or 'd'")
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
                slug = team_slugs[key].strip().lower()
                if slug in svg_data_map:
                    tree = etree.fromstring(base64.b64decode(svg_data_map[slug]), parser)
                    # Clean typography noise[cite: 1]
                    for noise in tree.xpath(".//*[@id='typography_labels']"):
                        noise.getparent().remove(noise)
                    
                    target = tree.xpath(f".//*[@id='{role_id}']")
                    if target: elements[key] = target[0]

            # Build the 1000x1000 Canvas
            combined_svg = etree.Element("svg", nsmap=elements['a'].nsmap if 'a' in elements else None)
            combined_svg.set("viewBox", "0 0 1000 1000")
            combined_svg.set("width", "1000")
            combined_svg.set("height", "1000")

            if 'a' in elements: combined_svg.append(elements['a']) # Chassis
            if 'b' in elements: 
                elements['b'].set("style", "opacity:0.4;") # Texture
                combined_svg.append(elements['b'])
            if 'c' in elements: combined_svg.append(elements['c']) # Main Hero
            if 'd' in elements: 
                elements['d'].set("transform", "rotate(20 500 500) scale(0.7)") # Chaos Hero
                combined_svg.append(elements['d'])

            # Render to PNG using svglib + reportlab
            svg_str = etree.tostring(combined_svg)
            drawing = svg2rlg(io.BytesIO(svg_str))
            
            # Scale to 1000x1000
            drawing.width, drawing.height = 1000, 1000
            drawing.scale(1000/drawing.contents[0].getBounds()[2], 1000/drawing.contents[0].getBounds()[3])

            png_output = io.BytesIO()
            renderPM.drawToFile(drawing, png_output, fmt="PNG")

            self.send_response(200)
            self.send_header('Content-type', 'image/png')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(png_output.getvalue())

        except Exception as e:
            self.send_error(500, f"Vibe Check Failed: {str(e)}")