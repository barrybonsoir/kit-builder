from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import requests
from lxml import etree

# Direct link to the DNA map to ensure the agent never loses the guide.
MANIFEST_URL = "https://raw.githubusercontent.com/barrybonsoir/kit-builder/main/public/semantic_audit_manifest.json"

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        query = urlparse(self.path).query
        params = parse_qs(query)
        
        sel_a = params.get('a', ['england'])[0].lower()
        sel_b = params.get('b', ['algeria'])[0].lower()

        try:
            # 1. Load the Guide
            manifest = requests.get(MANIFEST_URL).json()
            
            # 2. Get the SVG data for B (The Icon source)
            target_dna_asset = manifest[sel_b]['filename_map']
            # We fetch the raw SVG directly from your public folder
            asset_url = f"https://kit-builder-nu.vercel.app/public/svg-logos/{target_dna_asset}"
            logo_svg = requests.get(asset_url).content
            
            # 3. SMART DISSECTION (The Safety Net)
            root = etree.fromstring(logo_svg)
            # We try to find the "Smart" icon ID first...
            isolated_geometry = root.find(f".//*[@id='main-icon']")
            
            # IF SMART DISSECTION FAILS: Fallback to capturing the whole group
            if isolated_geometry is None:
                isolated_geometry = root.find(".//{http://www.w3.org/2000/svg}g")
                if isolated_geometry is None:
                    isolated_geometry = root # Final fallback to whole file
            
            dissected_icon_code = etree.tostring(isolated_geometry, encoding='unicode')

            # 4. REASSEMBLY (The Frankenstein Engine)
            # We wrap the icon in a transform so it sits in the middle of the anchor shield.
            final_svg_output = f"""
<svg xmlns="http://www.w3.org/2000/svg" viewBox="{manifest[sel_a]['viewBox']}">
    <rect width="100%" height="100%" fill="none" />
    <g id="base-shield-placeholder" opacity="0.3">
        <text x="10" y="20" font-family="Arial" font-size="10">Anchor: {sel_a}</text>
    </g>
    <g id="reassembled-icon" transform="translate(50, 50) scale(0.8)">
        {dissected_icon_code}
    </g>
</svg>
"""
            self.send_response(200)
            self.send_header('Content-type', 'image/svg+xml')
            self.end_headers()
            self.wfile.write(final_svg_output.encode('utf-8'))

        except Exception as e:
            # Emergency Recovery Logic: Return a text-based SVG error instead of crashing
            error_svg = f'<svg xmlns="http://www.w3.org/2000/svg"><text x="10" y="20">Engine Error: {str(e)}</text></svg>'
            self.send_response(200)
            self.send_header('Content-type', 'image/svg+xml')
            self.end_headers()
            self.wfile.write(error_svg.encode('utf-8'))