import base64
import os
import copy
from lxml import etree
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(CURRENT_DIR, "data_assets.txt")

def load_svg_map():
                svg_map = {}
                if os.path.exists(DATA_FILE):
                                    with open(DATA_FILE, 'r') as f:
                                                            for line in f:
                                                                                        if ':' not in line: continue
                                                                                                                    slug, enc = line.split(":", 1)
                                                                                        svg_map[slug.strip().lower()] = enc.strip()
                                                                            return svg_map

def parse_svg(encoded):
                parser = etree.XMLParser(remove_blank_text=True, recover=True)
                return etree.fromstring(base64.b64decode(encoded), parser)

def get_attr(tree, attr, fallback=''):
                return tree.get(attr, fallback)

def get_palette(tree):
                return {
                                    'primary':   get_attr(tree, 'data-palette-primary',   '#1a1a2e'),
                                    'secondary': get_attr(tree, 'data-palette-secondary', '#ffffff'),
                                    'accent':    get_attr(tree, 'data-palette-accent',    '#c8a84b'),
                }

def strip_typography(tree):
                for eid in ('typography_labels', 'typography_motto'):
                                    for el in tree.xpath(f".//*[@id='{eid}']"):
                                                            p = el.getparent()
                                                            if p is not None:
                                                                                        p.remove(el)

                                                def extract_tagged(tree, *tag_ids):
                                                                for tag_id in tag_ids:
                                                                                    targets = tree.xpath(f".//*[@id='{tag_id}']")
                                                                                    if targets:
                                                                                                            el = copy.deepcopy(targets[0])
                                                                                                            vb = get_attr(tree, 'viewBox', '0 0 500 500')
                                                                                                            return el, vb
                                                                                                    return None, None

                                                            def force_color(el, fill):
                                                                            for node in [el] + list(el.iter()):
                                                                                                existing = (node.get('fill') or '').lower()
                                                                                                if existing != 'none':
                                                                                                                        node.set('fill', fill)
                                                                                                                    if node.get('style'):
                                                                                                                                            node.attrib.pop('style')
                                                                                                                                    return el

                                                                        def nested_svg(el, vb, x, y, w, h):
                                                                                        s = etree.Element('svg', {
                                                                                                            'x': str(x), 'y': str(y),
                                                                                                            'width': str(w), 'height': str(h),
                                                                                                            'viewBox': vb,
                                                                                                            'preserveAspectRatio': 'xMidYMid meet',
                                                                                                            'overflow': 'visible',
                                                                                                    })
                                                                                        s.append(el)
                                                                                        return s

                            def mirrored_pair(el, vb, color, cx, cy, size, gap):
                                            g = etree.Element('g')
                                            el_left = copy.deepcopy(el)
                                            force_color(el_left, color)
                                            x_left = cx - gap - size
                                            g.append(nested_svg(el_left, vb, x_left, cy - size//2, size, size))
                                            el_right = copy.deepcopy(el)
                                            force_color(el_right, color)
                                            x_right = cx + gap
                                            right_svg = nested_svg(el_right, vb, x_right, cy - size//2, size, size)
                                            right_g = etree.Element('g', {'transform': f'scale(-1,1) translate({-(x_right*2 + size)},0)'})
                                            right_g.append(right_svg)
                                            g.append(right_g)
                                            return g


class handler(BaseHTTPRequestHandler):
                def do_GET(self):
                                    query = parse_qs(urlparse(self.path).query)
                                    slugs = {k: (query.get(k, [None])[0] or '').strip().lower() for k in ['a','b','c','d']}

        if not slugs['a']:
                                self.send_error(400, "Missing parameter 'a'")
                                return

        try:
                                svg_map = load_svg_map()
                                teams = {}
                                for key in ['a','b','c','d']:
                                                            slug = slugs[key]
                                                            if slug and slug in svg_map:
                                                                                            tree = parse_svg(svg_map[slug])
                                                                                            strip_typography(tree)
                                                                                            teams[key] = {
                                                                                                'tree':    tree,
                                                                                                'viewBox': get_attr(tree, 'viewBox', '0 0 500 500'),
                                                                                                'palette': get_palette(tree),
                                                                                            }

                                                        W, H = 800, 900
            CX, CY = W // 2, H // 2

            combined = etree.Element('svg', {
                                        'viewBox': f'0 0 {W} {H}',
                                        'xmlns': 'http://www.w3.org/2000/svg',
                                        'style': 'background: white',
            })

            p_a = teams['a']['palette'] if 'a' in teams else {'primary':'#1a1a2e','secondary':'#fff','accent':'#c8a84b'}
            p_b = teams['b']['palette'] if 'b' in teams else p_a
            p_c = teams['c']['palette'] if 'c' in teams else p_a
            p_d = teams['d']['palette'] if 'd' in teams else p_a

            # Layer 1: Team A shield
            if 'a' in teams:
                                        t = teams['a']
                                        el, vb = extract_tagged(t['tree'], 'primary_silhouette')
                                        if el is not None:
                                                                        force_color(el, p_a['primary'])
                                                                        combined.append(nested_svg(el, vb, 40, 30, W-80, H-60))
                                                                    el2, vb2 = extract_tagged(t['tree'], 'secondary_silhouette', 'color_field_secondary', 'color_field_primary')
                if el2 is not None:
                                                force_color(el2, p_a['secondary'])
                                                combined.append(nested_svg(el2, vb2, 60, 50, W-120, H-100))

            # Layer 2: Team B hero graphic centered
            if 'b' in teams:
                                        t = teams['b']
                el, vb = extract_tagged(t['tree'], 'hero_graphic')
                if el is not None:
                                                force_color(el, p_b['primary'])
                                                size = 340
                                                combined.append(nested_svg(el, vb, CX - size//2, CY - size//2 - 20, size, size))

            # Layer 3: Team C flanking pair mirrored
            if 'c' in teams:
                                        t = teams['c']
                el, vb = extract_tagged(t['tree'], 'sub_graphic_a', 'star_cluster', 'badge_element', 'hero_graphic')
                if el is not None:
                                                combined.append(mirrored_pair(el, vb, p_c['primary'], CX, CY + 20, 130, 20))

            # Layer 4: Team D crown top and reflected bottom
            if 'd' in teams:
                                        t = teams['d']
                el, vb = extract_tagged(t['tree'], 'crest_top', 'star_cluster', 'sub_graphic_a', 'badge_element')
                if el is not None:
                                                el_top = copy.deepcopy(el)
                                                force_color(el_top, p_d['accent'])
                                                combined.append(nested_svg(el_top, vb, CX - 80, 20, 160, 120))
                                                el_bot = copy.deepcopy(el)
                                                force_color(el_bot, p_d['accent'])
                                                bot_g = etree.SubElement(combined, 'g', {'transform': f'scale(1,-1) translate(0,{-H})'})
                                                bot_g.append(nested_svg(el_bot, vb, CX - 80, 20, 160, 120))

            # Dividing bar
            etree.SubElement(combined, 'rect', {
                                        'x': str(80), 'y': str(CY + 120),
                                        'width': str(W - 160), 'height': '6',
                                        'fill': p_b['accent'], 'rx': '3'
            })

            self.send_response(200)
            self.send_header('Content-type', 'image/svg+xml')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(etree.tostring(combined, pretty_print=True))

except Exception as e:
            import traceback
            self.send_error(500, f"Assembly error: {str(e)}\n{traceback.format_exc()}")
