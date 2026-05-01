import os
import json
import xml.etree.ElementTree as ET

# This is the "Knowledge Base" we built together
manifest_data = {
    "usa": {"primary": "shield_boundary", "hero": "central_star", "texture": "vertical_stripes"},
    "mexico": {"primary": "aztec_circle", "hero": "eagle_serpent", "texture": "sun_stone"},
    "canada": {"primary": "leaf_frame", "hero": "maple_leaf", "texture": "fractal_shards"},
    "argentina": {"primary": "afa_shield", "hero": "sun_of_may", "texture": "vertical_bands"},
    "brazil": {"primary": "globe_shield", "hero": "southern_cross", "texture": "yellow_glow"}
    # ... The script will use generic tagging for others if not explicitly mapped
}

SVG_DIR = "assets/svg-logos"

def inject_ids():
    ET.register_namespace('', "http://www.w3.org/2000/svg")
    
    # Get all SVG files in the directory
    files = [f for f in os.listdir(SVG_DIR) if f.endswith('.svg')]
    
    for filename in files:
        team_id = filename.replace("-logo.svg", "")
        file_path = os.path.join(SVG_DIR, filename)
        
        try:
            tree = ET.parse(file_path)
            root = tree.getroot()
            paths = root.findall('.//{http://www.w3.org/2000/svg}path')
            
            # Sort by path complexity (DNA length)
            sorted_paths = sorted(paths, key=lambda p: len(p.get('d', '')), reverse=True)

            for i, path in enumerate(sorted_paths):
                # Apply Semantic Logic
                if i == 0:
                    path.set('id', 'primary_silhouette')
                elif i == 1:
                    path.set('id', 'hero_graphic')
                elif i == 2:
                    path.set('id', 'hero_texture')
                else:
                    path.set('id', f'secondary_accent_{i}')

            # Write changes
            tree.write(file_path, encoding='utf-8', xml_declaration=False)
            print(f"✨ Tagged: {filename}")
            
        except Exception as e:
            print(f"❌ Error in {filename}: {e}")

if __name__ == "__main__":
    inject_ids()


