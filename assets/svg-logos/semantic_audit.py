import os
import json
from lxml import etree
import re

# ==========================================
# Geometric DNA Target ID Definitions
# ==========================================
# These specific XML IDs tell the Vercel Agent which parts to dissect for automated blending.

ID_MAIN_ICON = "main-icon"
ID_TEXT_ELEMENT = "main-text"
ID_SHIELD_PATH = "shield-base-path"
ID_PATTERNS = "texture-patterns"

# ==========================================
# MASTER LOGO FILE GUIDE (Visually Synced via image_0.png)
# ==========================================
logo_asset_map = {
    "algeria": "algeria-national-team.football-logos.cc.svg",
    "argentina": "argentina-national-team.football-logos.cc.svg",
    "australia": "australia-national-team.football-logos.cc.svg",
    "austria": "austria-national-team.football-logos.cc.svg",
    "belgium": "belgium-national-team.football-logos.cc.svg",
    "bosnia-herzegovina": "bosnia-and-herzegovina-national-team.football-logos.cc.svg",
    "brazil": "brazil-national-team.football-logos.cc.svg",
    "cabo-verde": "cabo-verde-national-team.football-logos.cc.svg",
    "canada": "canada-national-team.football-logos.cc.svg",
    "colombia": "colombia-national-team.football-logos.cc.svg",
    "congo-dr": "congo-dr-national-team.football-logos.cc.svg",
    "cote-d-ivoire": "cote-d-ivoire-national-team.football-logos.cc.svg",
    "croatia": "croatia-national-team.football-logos.cc.svg",
    "curacao": "curacao-national-team.football-logos.cc.svg",
    "czech-republic": "czech-republic-national-team.football-logos.cc.svg",
    "netherlands": "dutch-national-team.football-logos.cc.svg",
    "ecuador": "ecuador-national-team.football-logos.cc.svg",
    "egypt": "egypt-national-team.football-logos.cc.svg",
    "england": "england-national-team.football-logos.cc.svg",
    "france": "france-national-team.football-logos.cc.svg",
    "germany": "germany-national-team.football-logos.cc.svg",
    "ghana": "ghana-national-team.football-logos.cc.svg",
    "haiti": "haiti-national-team.football-logos.cc.svg",
    "iran": "iran-national-team.football-logos.cc.svg",
    "iraq": "iraq-national-team.football-logos.cc.svg",
    "japan": "japan-national-team.football-logos.cc.svg",
    "jordan": "jordan-national-team.football-logos.cc.svg",
    "mexico": "mexico-national-team.football-logos.cc.svg",
    "morocco": "morocco-national-team.football-logos.cc.svg",
    "new-zealand": "new-zealand-national-team.football-logos.cc.svg",
    "norway": "norway-national-team.football-logos.cc.svg",
    "panama": "panama-national-team.football-logos.cc.svg",
    "paraguay": "paraguay-national-team.football-logos.cc.svg",
    "portugal": "portuguese-football-federation.football-logos.cc.svg",
    "qatar": "qatar-national-team.football-logos.cc.svg",
    "saudi-arabia": "saudi-arabia-national-team.football-logos.cc.svg",
    "scotland": "scotland-national-team.football-logos.cc.svg",
    "senegal": "senegal-national-team.football-logos.cc.svg",
    "south-africa": "south-africa-national-team.football-logos.cc.svg",
    "south-korea": "south-korea-national-team.football-logos.cc.svg",
    "spain": "spain-national-team.football-logos.cc.svg",
    "sweden": "sweden-national-team.football-logos.cc.svg",
    "switzerland": "switzerland-national-team.football-logos.cc.svg",
    "tunisia": "tunisia-national-team.football-logos.cc.svg",
    "turkiye": "turkey-national-team.football-logos.cc.svg",
    "uruguay": "uruguay-national-team.football-logos.cc.svg",
    "usa": "usa-national-team.football-logos.cc.svg",
    "uzbekistan": "uzbekistan-national-team.football-logos.cc.svg"
}

results = {}

def get_base_geometry(root):
    """Finds the geometric properties of the root SVG."""
    return {
        "viewBox": root.get('viewBox'),
        "width": root.get('width'),
        "height": root.get('height')
    }

def find_named_object(root, target_id):
    """Finds a specific SVG element (group or path) based on its semantic ID."""
    # This action allows Prototype 1B to perform a multi-radial reassembly in milliseconds.
    obj = root.find(f".//*[@id='{target_id}']")
    if obj is not None:
        return {
            "type": etree.QName(obj.tag).localname,
            "element": etree.tostring(obj, encoding='unicode')
        }
    return None

def analyze_logo(filename):
    """Analyzes a single SVG file."""
    try:
        tree = etree.parse(filename)
        root = tree.getroot()
        
        # 1. Base Geometry
        geometry = get_base_geometry(root)
        
        # 2. Semantic Identifiers (sequencing the DNA)
        main_icon = find_named_object(root, ID_MAIN_ICON)
        shield_path = find_named_object(root, ID_SHIELD_PATH)
        text_element = find_named_object(root, ID_TEXT_ELEMENT)
        patterns_element = find_named_object(root, ID_PATTERNS)
        
        # 3. Fallback text finding
        text_content = etree.tostring(root, encoding='unicode', method='text').strip()
        text_content = re.sub(r'\s+', ' ', text_content)

        return {
            "viewBox": geometry["viewBox"],
            "primary_icon_dna": main_icon if main_icon else "null",
            "shield_path_dna": shield_path if shield_path else "null",
            "semantic_text_dna": text_element if text_element else "null",
            "semantic_pattern_dna": patterns_element if patterns_element else "null",
            "fallback_raw_text": text_content if text_content else "null"
        }
    except Exception as e:
        return {"error": str(e)}

# ==========================================
# Execute the Audit Experiment locally
# ==========================================
print(">>> Initializing Geometric DNA Sequencing Experiment...")

LOGO_DIR = "public/svg-logos"

if not os.path.exists(LOGO_DIR):
    print(f">>> CRITICAL ERROR: Directory '{LOGO_DIR}' not found. Cannot proceed.")
    exit()

# Navigate locally
os.chdir(LOGO_DIR)

count = 0
for country_slug, actual_filename in logo_asset_map.items():
    if os.path.exists(actual_filename):
        results[country_slug] = analyze_logo(actual_filename)
        count += 1
    else:
        results[country_slug] = {"error": f"File {actual_filename} (slug: {country_slug}) not found."}

# ==========================================
# Final Output (The "Rosetta Stone" guide)
# ==========================================
manifest_filename = "semantic_audit_manifest.json"
with open(manifest_filename, 'w') as f:
    json.dump(results, f, indent=2)

print(">>> SUCCESS.")
print(f">>> Analysed {count} of {len(logo_asset_map)} high-quality SVGs.")
print(f">>> Rosetta Stone Manifest generated securely at ./{manifest_filename}.")
print(">>> Agent is sequenced. Keep this guide next to the master files on GitHub.")
