import os
import xml.etree.ElementTree as ET

SVG_DIR = "assets/svg-logos"

# THE MASTER BLUEPRINT
# We define the exact path index for the Silhouette, Hero, and Text.
# 0 is the longest path (most complex), 1 is the next longest, etc.
BLUEPRINT = {
    "belgium": {"primary_silhouette": 2, "hero_graphic": 1, "typography_labels": 0},
    "ghana":   {"primary_silhouette": 1, "hero_graphic": 2, "typography_labels": 0},
    "spain":   {"primary_silhouette": 1, "hero_graphic": 2, "typography_labels": 0},
    "mexico":  {"primary_silhouette": 0, "hero_graphic": 1, "typography_labels": 2},
    "brazil":  {"primary_silhouette": 0, "hero_graphic": 1, "accent_1": 2},
    "usa":     {"primary_silhouette": 0, "hero_graphic": 1, "accent_1": 2},
    # Add more teams here as you spot them!
}

def final_pass_inject():
    ET.register_namespace('', "http://www.w3.org/2000/svg")
    files = [f for f in os.listdir(SVG_DIR) if f.endswith('.svg')]
    
    for filename in files:
        # Get the team name (e.g., 'belgium' from 'belgium-logo.svg')
        team_id = filename.split('-')[0].lower()
        file_path = os.path.join(SVG_DIR, filename)
        
        tree = ET.parse(file_path)
        root = tree.getroot()
        paths = root.findall('.//{*}path')
        
        # Sort by complexity (Data length)
        sorted_paths = sorted(paths, key=lambda p: len(p.get('d', '')), reverse=True)

        # Check if we have a specific blueprint for this team
        team_config = BLUEPRINT.get(team_id)

        for i, path in enumerate(sorted_paths):
            # 1. REMOVE TRANSFORMS (Crucial for centering in the UI)
            if 'transform' in path.attrib:
                del path.attrib['transform']
            
            # 2. ASSIGN IDs
            if team_config:
                # Use the manual blueprint mapping
                assigned = False
                for id_name, target_index in team_config.items():
                    if i == target_index:
                        path.set('id', id_name)
                        assigned = True
                if not assigned:
                    path.set('id', f'element_{i}')
            else:
                # Default logic for teams not in the blueprint yet
                if i == 0: path.set('id', 'primary_silhouette')
                elif i == 1: path.set('id', 'hero_graphic')
                else: path.set('id', f'element_{i}')

        tree.write(file_path, encoding='utf-8', xml_declaration=False)
        print(f"🎯 Precision Injected: {filename}")

if __name__ == "__main__":
    final_pass_inject()