import os
import json
import xml.etree.ElementTree as ET

# Load the manifest
with open('semantic_audit_manifest.json', 'r') as f:
    manifest = json.load(f)

SVG_DIR = "assets/svg-logos"

def inject_ids():
    # Register the SVG namespace to prevent 'ns0' prefixes in the output
    ET.register_namespace('', "http://www.w3.org/2000/svg")
    
    for team_id, data in manifest['teams'].items():
        # Correct pathing based on your local repo structure
        file_path = os.path.join(SVG_DIR, f"{team_id}-logo.svg")
        
        if not os.path.exists(file_path):
            print(f"⚠️  Skipping {team_id}: File not found at {file_path}")
            continue

        try:
            tree = ET.parse(file_path)
            root = tree.getroot()
            
            # Find all paths using the namespace
            paths = root.findall('.//{http://www.w3.org/2000/svg}path')
            
            # Sort paths by the length of the 'd' attribute (Complexity)
            # This is the "Smart" part: Longest strings are usually the main shapes
            sorted_paths = sorted(paths, key=lambda p: len(p.get('d', '')), reverse=True)

            for i, path in enumerate(sorted_paths):
                if i == 0:
                    path.set('id', 'primary_silhouette')
                elif i == 1:
                    path.set('id', 'hero_graphic')
                elif i == 2:
                    path.set('id', 'hero_texture')
                else:
                    # Lettering and small stars get unique incremental IDs
                    path.set('id', f'secondary_accent_{i}')

            # Write the changes back to the file
            tree.write(file_path, encoding='utf-8', xml_declaration=False)
            print(f"✨ Successfully injected IDs into {team_id}-logo.svg")
            
        except Exception as e:
            print(f"❌ Error processing {team_id}: {e}")

if __name__ == "__main__":
    inject_ids()
