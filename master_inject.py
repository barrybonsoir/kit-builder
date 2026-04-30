import os
from lxml import etree

LOGO_DIR = "assets/svg-logos"

# The Individualized 2026 Semantic Map
# Format: "slug": (silhouette_idx, mascot_idx, [noise_indices])
SURGICAL_MAP = {
    "usa": (0, 1, [2, 3]), 
    "mexico": (0, 2, [1, 3, 4]), 
    "canada": (0, 1, [2]),
    "argentina": (0, 1, [2, 3, 4]), 
    "brazil": (0, 1, [2, 3, 4]), # Specifically identifies 'CBF' as noise
    "france": (0, 1, [2]),
    "england": (0, 1, [2, 3]), 
    "germany": (0, 1, [2]),
    "japan": (0, 2, [1]), 
    "south-korea": (1, 0, [2, 3, 4, 5]), # Specifically targets 'OREA' as noise
    "netherlands": (0, 1, [2]),
    "spain": (0, 2, [1, 3, 4]),
    "italy": (0, 1, [2, 3, 4]),
    "portugal": (0, 1, [2]),
    "belgium": (0, 2, [1, 3, 4, 5]), 
    "morocco": (0, 1, [2]),
    "senegal": (0, 1, [2]),
    "uruguay": (0, 1, [2, 3, 4, 5]), 
    "colombia": (0, 1, [2]),
    "croatia": (0, 1, [2]),
    "australia": (0, 1, [2]),
    "switzerland": (0, 1, [2]),
    "norway": (0, 1, [2]),
    "sweden": (0, 1, [2]),
    "scotland": (0, 1, [2]),
    "egypt": (0, 1, [2, 3, 4, 5]),
    "ghana": (0, 1, [2, 3, 4, 5]), 
    "ivory-coast": (0, 1, [2]),
    "saudi-arabia": (0, 1, [2]),
    "south-africa": (0, 1, [2, 3, 4]),
    "tunisia": (0, 1, [2]),
    "algeria": (0, 1, [2]),
    "ecuador": (0, 1, [2]),
    "paraguay": (0, 1, [2]),
    "turkiye": (0, 1, [2]),
    "jordan": (0, 1, [2]),
    "uzbekistan": (0, 1, [2]),
    "qatar": (0, 1, [2]),
    "curacao": (0, 1, [2]),
    "haiti": (0, 1, [2]),
    "panama": (0, 1, [2]),
    "czechia": (0, 1, [2]),
    "bosnia": (0, 1, [2]),
    "dr-congo": (0, 1, [2]),
    "iraq": (0, 1, [2]),
    "cape-verde": (0, 1, [2]),
    "new-zealand": (0, 1, [2]),
    "austria": (0, 1, [2])
}

def run_precision_injection():
    for filename in os.listdir(LOGO_DIR):
        if not filename.endswith(".svg"): continue
        slug = filename.split('-national')[0]
        if slug not in SURGICAL_MAP: continue
            
        file_path = os.path.join(LOGO_DIR, filename)
        parser = etree.XMLParser(remove_blank_text=True)
        tree = etree.parse(file_path, parser)
        root = tree.getroot()
        
        elements = root.xpath(".//*[local-name()='path' or local-name()='polygon' or local-name()='circle' or local-name()='rect']")
        sil_idx, hero_idx, noise_indices = SURGICAL_MAP[slug]
        
        for i, el in enumerate(elements):
            if 'id' in el.attrib: del el.attrib['id']
            if i == sil_idx: el.set('id', 'primary_silhouette')
            elif i == hero_idx: el.set('id', 'hero_graphic')
            elif i in noise_indices: el.set('id', 'typography_labels')

        with open(file_path, 'wb') as f:
            f.write(etree.tostring(tree, pretty_print=True, xml_declaration=True, encoding='utf-8'))
        print(f"Injected: {slug}")

if __name__ == "__main__":
    run_precision_injection()