import os
import json
from lxml import etree

def analyze_logo_smart(filename):
    try:
        tree = etree.parse(filename)
        root = tree.getroot()
        ns = {"svg": "http://www.w3.org/2000/svg"}
        
        # 1. Identify the "Shield" (usually the path with the largest area/points)
        paths = root.xpath(".//svg:path", namespaces=ns)
        shield_dna = "null"
        if paths:
            # Simple heuristic: the longest path data is often the background/shield
            largest_path = max(paths, key=lambda p: len(p.get('d', '')))
            shield_dna = etree.tostring(largest_path, encoding='unicode')

        # 2. Identify the "Icon" (the main central element)
        # We'll look for groups that aren't the largest path
        groups = root.xpath(".//svg:g", namespaces=ns)
        icon_dna = "null"
        if groups:
            icon_dna = etree.tostring(groups[0], encoding='unicode')

        return {
            "viewBox": root.get('viewBox', "0 0 100 100"),
            "shield_path_dna": shield_dna,
            "primary_icon_dna": icon_dna,
            "filename_map": os.path.basename(filename)
        }
    except Exception as e:
        return {"error": str(e)}

# Execute locally on your 'assets/svg-logos' folder
assets_dir = "assets/svg-logos"
manifest = {}

for file in os.listdir(assets_dir):
    if file.endswith(".svg"):
        country = file.split("-national")[0]
        manifest[country] = analyze_logo_smart(os.path.join(assets_dir, file))

with open("assets/semantic_audit_manifest.json", "w") as f:
    json.dump(manifest, f, indent=2)

print(f"Audit Complete. Processed {len(manifest)} logos.")