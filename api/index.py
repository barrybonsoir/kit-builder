import base64
import os
from lxml import etree
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(CURRENT_DIR, "data_assets.txt")

STRIP_IDS = {'typography_labels', 'typography_motto'}

def load_svg_map():
    svg_map = {}
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            for line in f:
                if ':' not in line: continue
                slug, enc = line.split(":", 1)
                svg_map[slug.strip().lower()] = enc.strip()
    return svg_map

def parse_svg(encoded, parser):
    return etree.fromstring(base64.b64decode(encoded), parser)

def get_attr(tree, attr, fallback=''):
    return tree.get(attr, fallback)

def strip_typography(tree):
    for noise in tree.xpath(".//*[@id='typography_labels'] | .//*[@id='typography_motto']"):
        p = noise.getparent()
        if p is not None:
            p.remove(noise)

def extract_element(tree, element_id):
    """Extract a tagged element, return (element, viewBox) or (None, None)."""
    targets = tree.xpath(f".//*[@id='{element_id}']")
    if not targets:
        return None, None
    vb = get_attr(tree, 'viewBox', '0 0 500 500')
    return targets[0], vb

def recolor_element(el, primary, secondary, accent):
    """Walk the element and apply palette colors to fills that are black/none/missing."""
    color_map = {
        '#000000': primary, '#000': primary, 'black': primary,
        '#ffffff': secondary, '#fff': secondary, '#fffffe': secondary, 'white': secondary,
    }
    for node in [el] + list(el.iter()):
        fill = node.get('fill', '')
        stroke = node.get('stroke', '')
        if fill.lower() in color_map:
            node.set('fill', color_map[fill.lower()])
        elif not fill or fill == 'none':
            pass  # leave transparent elements transparent
        if stroke.lower() in color_map:
            node.set('stroke', color_map[stroke.lower()])

def wrap_in_svg(el, viewBox, x, y, width, height, extra_attrs=None):
    """Wrap an element in a positioned nested SVG."""
    attrs = {
        'x': str(x), 'y': str(y),
        'width': str(width), 'height': str(height),
        'viewBox': viewBox,
        'preserveAspectRatio': 'xMidYMid meet',
        'overflow': 'visible',
    }
    if extra_attrs:
        attrs.update(extra_attrs)
    svg = etree.Element('svg', attrs)
    svg.append(el)
    return svg

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        query = parse_qs(urlparse(self.path).query)
        slugs = {k: (query.get(k, [None])[0] or '').strip().lower() for k in ['a', 'b', 'c', 'd']}

        if not slugs['a']:
            self.send_error(400, "Missing base parameter 'a'")
            return

        try:
            parser = etree.XMLParser(remove_blank_text=True, recover=True)
            svg_map = load_svg_map()

            # Parse each team's SVG and extract metadata
            teams = {}
            for key in ['a', 'b', 'c', 'd']:
                slug = slugs[key]
                if slug and slug in svg_map:
                    tree = parse_svg(svg_map[slug], parser)
                    strip_typography(tree)
                    teams[key] = {
                        'tree': tree,
                        'slug': slug,
                        'viewBox': get_attr(tree, 'viewBox', '0 0 500 500'),
                        'shape': get_attr(tree, 'data-shape', 'shield'),
                        'palette': {
                            'primary':   get_attr(tree, 'data-palette-primary',   '#1a1a2e'),
                            'secondary': get_attr(tree, 'data-palette-secondary', '#ffffff'),
                            'accent':    get_attr(tree, 'data-palette-accent',    '#e94560'),
                            'bg':        get_attr(tree, 'data-palette-bg',        '#16213e'),
                        }
                    }

            # ─── CANVAS ──────────────────────────────────────────────
            CANVAS = 1000
            combined = etree.Element('svg', {
                'viewBox': f'0 0 {CANVAS} {CANVAS}',
                'xmlns': 'http://www.w3.org/2000/svg',
            })

            # Background — use team A's bg palette color
            bg_color = teams['a']['palette']['bg'] if 'a' in teams else '#0d0d1a'
            etree.SubElement(combined, 'rect', {
                'width': '1000', 'height': '1000', 'fill': bg_color
            })

            # ─── LAYER 1: Team A — primary_silhouette (the shield/frame) ───
            if 'a' in teams:
                t = teams['a']
                el, vb = extract_element(t['tree'], 'primary_silhouette')
                if el is not None:
                    # Fill with team A's primary color if element has no fill
                    if not el.get('fill') or el.get('fill') in ('none', ''):
                        el.set('fill', t['palette']['primary'])
                    layer = wrap_in_svg(el, vb, 50, 50, 900, 900)
                    combined.append(layer)

                # Also pull color_field_secondary for a second color band
                el2, vb2 = extract_element(t['tree'], 'color_field_secondary')
                if el2 is not None:
                    if not el2.get('fill') or el2.get('fill') in ('none', ''):
                        el2.set('fill', t['palette']['secondary'])
                    layer2 = wrap_in_svg(el2, vb2, 50, 50, 900, 900)
                    combined.append(layer2)

            # ─── LAYER 2: Team B — pattern_fill or color_field_primary ───
            if 'b' in teams:
                t = teams['b']
                # Try pattern_fill first, then color_field_primary, then sub_graphic_a
                el, vb = (None, None)
                for tag_id in ['pattern_fill', 'color_field_primary', 'sub_graphic_a']:
                    el, vb = extract_element(t['tree'], tag_id)
                    if el is not None: break
                if el is not None:
                    if not el.get('fill') or el.get('fill') in ('none', ''):
                        el.set('fill', t['palette']['accent'])
                    g = etree.SubElement(combined, 'g', {'opacity': '0.55', 'style': 'mix-blend-mode:screen'})
                    layer = wrap_in_svg(el, vb, 100, 100, 800, 800)
                    g.append(layer)

            # ─── LAYER 3: Team C — hero_graphic (main mascot, centered) ───
            if 'c' in teams:
                t = teams['c']
                el, vb = extract_element(t['tree'], 'hero_graphic')
                if el is not None:
                    if not el.get('fill') or el.get('fill') in ('none', ''):
                        el.set('fill', t['palette']['secondary'])
                    g = etree.SubElement(combined, 'g', {
                        'filter': 'url(#glow)',
                        'style': f'filter: drop-shadow(0 0 18px {t["palette"]["accent"]})'
                    })
                    layer = wrap_in_svg(el, vb, 200, 200, 600, 600)
                    g.append(layer)

            # ─── LAYER 4: Team D — sub_graphic_a or star_cluster (accent, offset) ───
            if 'd' in teams:
                t = teams['d']
                el, vb = (None, None)
                for tag_id in ['sub_graphic_a', 'star_cluster', 'crest_top', 'hero_graphic']:
                    el, vb = extract_element(t['tree'], tag_id)
                    if el is not None: break
                if el is not None:
                    if not el.get('fill') or el.get('fill') in ('none', ''):
                        el.set('fill', t['palette']['accent'])
                    g = etree.SubElement(combined, 'g', {
                        'transform': 'rotate(-12 500 500)',
                        'opacity': '0.75',
                        'style': f'filter: drop-shadow(0 0 10px {t["palette"]["primary"]}); mix-blend-mode: hard-light'
                    })
                    layer = wrap_in_svg(el, vb, 300, 300, 400, 400)
                    g.append(layer)

            # ─── ACCENT RING — team B's primary color as a decorative circle ───
            if 'b' in teams:
                p = teams['b']['palette']
                etree.SubElement(combined, 'circle', {
                    'cx': '500', 'cy': '500', 'r': '440',
                    'fill': 'none',
                    'stroke': p['primary'],
                    'stroke-width': '6',
                    'opacity': '0.4'
                })
                etree.SubElement(combined, 'circle', {
                    'cx': '500', 'cy': '500', 'r': '430',
                    'fill': 'none',
                    'stroke': p['secondary'],
                    'stroke-width': '2',
                    'opacity': '0.25'
                })

            self.send_response(200)
            self.send_header('Content-type', 'image/svg+xml')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(etree.tostring(combined, pretty_print=True))

        except Exception as e:
            self.send_error(500, f"Assembly error: {str(e)}")