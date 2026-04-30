import os
import base64

# Updated to look in the root assets folder
SVG_DIR = "assets/svg-logos" 
OUTPUT_FILE = "api/data_assets.txt"

if not os.path.exists(SVG_DIR):
    print(f"Error: Cannot find {SVG_DIR}")
    # List current directory to help you find the right path if this fails
    print("Current directory contains:", os.listdir('.'))
else:
    with open(OUTPUT_FILE, "w") as f:
        for filename in os.listdir(SVG_DIR):
            if filename.endswith(".svg"):
                slug = filename.split("-national")[0].strip().lower()
                with open(os.path.join(SVG_DIR, filename), "rb") as svg_file:
                    encoded = base64.b64encode(svg_file.read()).decode('utf-8')
                    f.write(f"{slug}:{encoded}\n")
    print(f"Successfully generated {OUTPUT_FILE}")

import os
import base64

# This path must match your local folder structure
SVG_DIR = "api/assets/svg-logos" 
OUTPUT_FILE = "api/data_assets.txt"

if not os.path.exists(SVG_DIR):
    print(f"Error: Cannot find {SVG_DIR}")
else:
    with open(OUTPUT_FILE, "w") as f:
        for filename in os.listdir(SVG_DIR):
            if filename.endswith(".svg"):
                # Extracts 'south-korea' from 'south-korea-national-team...'
                slug = filename.split("-national")[0].strip().lower()
                
                with open(os.path.join(SVG_DIR, filename), "rb") as svg_file:
                    encoded = base64.b64encode(svg_file.read()).decode('utf-8')
                    # Write the line in the format the API expects
                    f.write(f"{slug}:{encoded}\n")
    print(f"Successfully generated {OUTPUT_FILE}")

