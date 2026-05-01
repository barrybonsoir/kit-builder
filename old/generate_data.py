import os
import base64

# Local paths
SVG_DIR = "api/assets/svg-logos" 
OUTPUT_FILE = "api/data_assets.txt"

if not os.path.exists(SVG_DIR):
    print(f"Error: {SVG_DIR} not found.")
else:
    with open(OUTPUT_FILE, "w") as f:
        for filename in os.listdir(SVG_DIR):
            if filename.endswith(".svg"):
                # Aggressively clean the name to get just 'south-korea'
                slug = filename.split("-national")[0].strip().lower()
                
                with open(os.path.join(SVG_DIR, filename), "rb") as svg_file:
                    encoded = base64.b64encode(svg_file.read()).decode('utf-8')
                    f.write(f"{slug}:{encoded}\n")
    print(f"Success! Created {OUTPUT_FILE}")import os
import base64

# Point this to your actual SVG folder
SVG_DIR = "api/assets/svg-logos" 
OUTPUT_FILE = "api/data_assets.txt"

if not os.path.exists(SVG_DIR):
    print(f"Error: {SVG_DIR} not found. Check your path!")
else:
    with open(OUTPUT_FILE, "w") as f:
        for filename in os.listdir(SVG_DIR):
            if filename.endswith(".svg"):
                # Matches 'south-korea-national...' -> 'south-korea'
                slug = filename.split("-national")[0]
                with open(os.path.join(SVG_DIR, filename), "rb") as svg_file:
                    encoded = base64.b64encode(svg_file.read()).decode('utf-8')
                    f.write(f"{slug}:{encoded}\n")
    print(f"Success! {OUTPUT_FILE} created with your team data.")

