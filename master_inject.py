import os
import xml.etree.ElementTree as ET

SVG_DIR = "assets/svg-logos"

# Semantic Map based on visual audit logic
TEAM_RULES = {
    "belgium": {"text_color": "#1d1d1b", "shield_color": "#b59c56"},
    "brazil": {"hero_color": "#0c87d1", "silhouette_color": "#fddc02"},
    "usa": {"hero_color": "#ffffff", "silhouette_color": "#002868"},
    # The script will apply these specific rules where defined, 
    # and use the "Complexity" fallback for the others.
}

def master_inject():
    ET.register_namespace('', "http://www.w3.org/2000/svg")
    files = [f for f in os.listdir(SVG_DIR) if f.endswith('.svg')]
    
    for filename in files:
        team_id = filename.replace("-logo.svg", "")
        file_path = os.path.join(SVG_DIR, filename)
        tree = ET.parse(file_path)
        root = tree.getroot()
        paths = root.findall('.//{http://www.w3.org/2000/svg}path')
        
        # Sort paths by data length (Complexity)
        sorted_paths = sorted(paths, key=lambda p: len(p.get('d', '')), reverse=True)

        for i, path in enumerate(sorted_paths):
            # 1. STRIP OFFSETS (Mechanical Necessity)
            if 'transform' in path.attrib:
                del path.attrib['transform']
            
            # 2. APPLY SEMANTIC IDs
            style = path.get('style', '') or ""
            fill = path.get('fill', '') or ""
            
            # Rule-based injection for outliers (like Belgium)
            if team_id in TEAM_RULES:
                rules = TEAM_RULES[team_id]
                if any(c in style or c in fill for c in rules.values()):
                    if "text_color" in rules and rules["text_color"] in (style + fill):
                        path.set('id', 'text_labels')
                        continue
            
            # General Fallback Logic
            if i == 0:
                path.set('id', 'primary_silhouette')
            elif i == 1:
                path.set('id', 'hero_graphic')
            else:
                path.set('id', f'accent_{i}')

        tree.write(file_path, encoding='utf-8', xml_declaration=False)
        print(f"✅ Semantic Audit Applied: {filename}")

if __name__ == "__main__":
    master_inject()
