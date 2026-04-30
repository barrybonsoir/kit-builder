import os
import base64

# Run this locally to create the data file
SVG_DIR = "api/assets/svg-logos" # or wherever they are currently
output = "api/data_assets.py"

with open(output, "w") as f:
    f.write("TEAM_SVG_DATA = {\n")
    for filename in os.listdir(SVG_DIR):
        if filename.endswith(".svg"):
            slug = filename.split("-national")[0]
            with open(os.path.join(SVG_DIR, filename), "rb") as svg_file:
                # Store as encoded string to avoid escape character mess
                encoded = base64.b64encode(svg_file.read()).decode('utf-8')
                f.write(f"    '{slug}': '{encoded}',\n")
    f.write("}\n")