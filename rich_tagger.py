"""
rich_tagger.py — Kit Builder 2026
Applies a rich semantic tagging schema to all 48 World Cup SVG logos.

SCHEMA:
  primary_silhouette     — Main bounding shape (shield, circle, badge outline)
  secondary_silhouette   — Inner border / secondary outline / double-line frame
  color_field_primary    — Largest color fill zone behind the crest
  color_field_secondary  — Secondary color zone / panel
  hero_graphic           — Main central icon/mascot/emblem (eagle, lion, star, badge)
  sub_graphic_a          — Secondary icon (wreath, laurel, cross, sword, etc.)
  sub_graphic_b          — Tertiary icon (small details, footballs, specific motifs)
  crest_top              — Element at top (crown, stars, banner above)
  crest_bottom           — Element at bottom (ribbon, scroll, base)
  crest_left             — Left side panel or supporter
  crest_right            — Right side panel or supporter
  star_cluster           — Stars (championship stars, decorative)
  pattern_fill           — Repeating decorative pattern (checker, stripes, dots)
  badge_element          — Specific badge, patch or seal within the crest
  typography_labels      — Federation name / abbreviation text → STRIP from output
  typography_motto       — Motto or secondary text → STRIP from output

DATA ATTRIBUTES on root <svg>:
  data-team, data-palette-primary, data-palette-secondary,
  data-palette-accent, data-palette-bg, data-shape
"""

import os, sys, copy
from xml.etree import ElementTree as ET

ET.register_namespace('', 'http://www.w3.org/2000/svg')
ET.register_namespace('xlink', 'http://www.w3.org/1999/xlink')

SVG_DIR = 'assets/svg-logos'
NS = 'http://www.w3.org/2000/svg'

# ─────────────────────────────────────────────
# Per-team tagging maps
# Format: list of (element_index_or_existing_id, new_id) tuples
# OR a dict of {existing_id: new_id} for files with element_ ids
# ─────────────────────────────────────────────

# Helper: find nth element (0-indexed) among all drawable elements in doc order
# (excludes svg, defs, style, title, clipPath, linearGradient, etc.)
SKIP_TAGS = {'svg','defs','style','title','clipPath','linearGradient','radialGradient',
             'stop','filter','feOffset','feGaussianBlur','feFlood','feComposite','use',
             'pattern','mask','symbol'}

def get_drawable_elements(root):
    skip = {f'{{{NS}}}{t}' for t in SKIP_TAGS} | set(SKIP_TAGS)
    return [el for el in root.iter() if el.tag not in skip]

# ─────────────────────────────────────────────────────────────────────────────
# TEAM CONFIGS
# Each entry: filename_slug → {
#   'file': filename in svg-logos/,
#   'palette': {primary, secondary, accent, bg},
#   'shape': shield|circle|oval|diamond|crest|badge,
#   'tags': {existing_id_or_int_index: new_semantic_id},
#   'data_tags': {element_id: new_id}  # for files with element_N ids
# }
# ─────────────────────────────────────────────────────────────────────────────

TEAM_CONFIGS = {

    "algeria": {
        "file": "algeria-national-team.football-logos.cc.svg",
        "palette": {"primary": "#006233", "secondary": "#FFFFFF", "accent": "#D21034", "bg": "#006233"},
        "shape": "circle",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
        }
    },

    "argentina": {
        "file": "argentina-national-team.football-logos.cc.svg",
        "palette": {"primary": "#74ACDF", "secondary": "#FFFFFF", "accent": "#D5B048", "bg": "#FFFFFF"},
        "shape": "shield",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",          # sun / sunburst top center
            "typography_labels": "typography_labels",
            # index-based: the AFA text elements
            7: "sub_graphic_a",                       # white stripe band
            13: "crest_top",                          # sun rays top group
            16: "color_field_primary",                # gold lower panel
            18: "crest_bottom",                       # lower gold arc
        }
    },

    "australia": {
        "file": "australia-national-team.football-logos.cc.svg",
        "palette": {"primary": "#00843D", "secondary": "#FFD200", "accent": "#FFFFFF", "bg": "#00843D"},
        "shape": "shield",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            3: "color_field_primary",
            4: "color_field_secondary",
            5: "sub_graphic_a",
            6: "crest_bottom",
            7: "badge_element",
        }
    },

    "austria": {
        "file": "austria-national-team.football-logos.cc.svg",
        "palette": {"primary": "#ED2939", "secondary": "#FFFFFF", "accent": "#ED2939", "bg": "#FFFFFF"},
        "shape": "shield",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            3: "color_field_primary",
            4: "color_field_secondary",
            5: "sub_graphic_a",
        }
    },

    "belgium": {
        "file": "belgium-national-team.football-logos.cc.svg",
        "palette": {"primary": "#000000", "secondary": "#EF3340", "accent": "#FFD200", "bg": "#000000"},
        "shape": "shield",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            3: "color_field_primary",
            4: "color_field_secondary",
            5: "crest_top",
        }
    },

    "bosnia-and-herzegovina": {
        "file": "bosnia-and-herzegovina-national-team.football-logos.cc.svg",
        "palette": {"primary": "#002395", "secondary": "#FFD700", "accent": "#FFFFFF", "bg": "#002395"},
        "shape": "shield",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            # star pattern elements — tag first 6 element_ as star_cluster, rest as pattern_fill
        },
        "data_tags_batch": {
            "hero_graphic": "hero_graphic",
            "primary_silhouette": "primary_silhouette",
            # All element_ ids with low numbers are stars in the diagonal
            **{f"element_{i}": "star_cluster" for i in range(2, 20)},
            **{f"element_{i}": "pattern_fill" for i in range(20, 80)},
            **{f"element_{i}": "sub_graphic_a" for i in range(80, 150)},
            **{f"element_{i}": "crest_bottom" for i in range(150, 210)},
        }
    },

    "brazil": {
        "file": "brazil-national-team.football-logos.cc.svg",
        "palette": {"primary": "#009B3A", "secondary": "#FEDF00", "accent": "#002776", "bg": "#009B3A"},
        "shape": "diamond",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            5: "color_field_primary",    # green outer diamond
            6: "color_field_secondary",  # yellow inner diamond
            7: "badge_element",          # globe circle
        }
    },

    "cabo-verde": {
        "file": "cabo-verde-national-team.football-logos.cc.svg",
        "palette": {"primary": "#003893", "secondary": "#CF2027", "accent": "#F7D116", "bg": "#003893"},
        "shape": "circle",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
        },
        "data_tags_batch": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            **{f"element_{i}": "star_cluster" for i in [17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]},
            **{f"element_{i}": "color_field_primary" for i in [2,3,4,5,6,7,8,9,10]},
            **{f"element_{i}": "pattern_fill" for i in [11,12,13,14,15,16]},
        }
    },

    "canada": {
        "file": "canada-national-team.football-logos.cc.svg",
        "palette": {"primary": "#FF0000", "secondary": "#FFFFFF", "accent": "#FF0000", "bg": "#FFFFFF"},
        "shape": "crest",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            4: "color_field_primary",
            5: "color_field_secondary",
            6: "sub_graphic_a",
            7: "crest_top",
        }
    },

    "colombia": {
        "file": "colombia-national-team.football-logos.cc.svg",
        "palette": {"primary": "#FCD116", "secondary": "#003087", "accent": "#CE1126", "bg": "#FCD116"},
        "shape": "oval",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            4: "color_field_primary",
            5: "secondary_silhouette",
            6: "sub_graphic_a",
            7: "sub_graphic_b",
            13: "color_field_secondary",
            14: "badge_element",
            15: "crest_top",
            27: "crest_bottom",
        }
    },

    "congo-dr": {
        "file": "congo-dr-national-team.football-logos.cc.svg",
        "palette": {"primary": "#007FFF", "secondary": "#F7D618", "accent": "#CE1020", "bg": "#007FFF"},
        "shape": "shield",
        "tags": {},
        "data_tags_batch": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "element_2": "color_field_primary",
            "element_3": "color_field_secondary",
            "element_4": "crest_top",
            "element_5": "sub_graphic_a",
            "element_6": "sub_graphic_b",
            "element_7": "star_cluster",
            "element_8": "star_cluster",
            "element_9": "badge_element",
            "element_10": "pattern_fill",
            "element_11": "pattern_fill",
            "element_12": "crest_bottom",
            **{f"element_{i}": "sub_graphic_a" for i in range(13,28)},
        }
    },

    "cote-d-ivoire": {
        "file": "cote-d-ivoire-national-team.football-logos.cc.svg",
        "palette": {"primary": "#FF8200", "secondary": "#009A44", "accent": "#FFFFFF", "bg": "#FF8200"},
        "shape": "shield",
        "tags": {},
        "data_tags_batch": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "element_2": "color_field_primary",
            "element_3": "color_field_secondary",
            "element_4": "sub_graphic_a",
            "element_5": "sub_graphic_b",
            "element_6": "crest_top",
            "element_7": "crest_bottom",
            "element_8": "badge_element",
            "element_9": "pattern_fill",
            "element_10": "pattern_fill",
            "element_11": "secondary_silhouette",
        }
    },

    "croatia": {
        "file": "croatia-national-team.football-logos.cc.svg",
        "palette": {"primary": "#FF0000", "secondary": "#FFFFFF", "accent": "#003DA5", "bg": "#FFFFFF"},
        "shape": "shield",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            4: "color_field_primary",
            5: "pattern_fill",           # famous red/white checkerboard
            6: "secondary_silhouette",
            7: "crest_top",
            8: "star_cluster",
            9: "sub_graphic_a",
            10: "color_field_secondary",
        }
    },

    "curacao": {
        "file": "curacao-national-team.football-logos.cc.svg",
        "palette": {"primary": "#002B7F", "secondary": "#F9E300", "accent": "#FFFFFF", "bg": "#002B7F"},
        "shape": "circle",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            3: "color_field_primary",
            4: "color_field_secondary",
            5: "star_cluster",
            6: "sub_graphic_a",
            7: "badge_element",
        }
    },

    "czech-republic": {
        "file": "czech-republic-national-team.football-logos.cc.svg",
        "palette": {"primary": "#11457E", "secondary": "#D7141A", "accent": "#FFFFFF", "bg": "#FFFFFF"},
        "shape": "shield",
        "tags": {},
        "data_tags_batch": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "element_2": "color_field_primary",
            "element_3": "color_field_secondary",
            "element_4": "sub_graphic_a",
            "element_5": "crest_top",
            "element_6": "crest_bottom",
            "element_7": "secondary_silhouette",
            "element_8": "pattern_fill",
            "element_9": "badge_element",
            "element_10": "star_cluster",
            **{f"element_{i}": "sub_graphic_b" for i in range(11,22)},
            **{f"element_{i}": "pattern_fill" for i in range(22,40)},
        }
    },

    "ecuador": {
        "file": "ecuador-national-team.football-logos.cc.svg",
        "palette": {"primary": "#FFD100", "secondary": "#003DA5", "accent": "#CE1126", "bg": "#FFD100"},
        "shape": "shield",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            3: "color_field_primary",
            4: "color_field_secondary",
            5: "sub_graphic_a",
        }
    },

    "egypt": {
        "file": "egypt-national-team.football-logos.cc.svg",
        "palette": {"primary": "#C8102E", "secondary": "#FFFFFF", "accent": "#000000", "bg": "#FFFFFF"},
        "shape": "circle",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            4: "color_field_primary",
            5: "color_field_secondary",
            6: "sub_graphic_a",
            7: "crest_bottom",
        }
    },

    "england": {
        "file": "england-national-team.football-logos.cc.svg",
        "palette": {"primary": "#FFFFFF", "secondary": "#CE1124", "accent": "#003082", "bg": "#FFFFFF"},
        "shape": "shield",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            4: "color_field_primary",
            5: "crest_top",
            6: "color_field_secondary",
            7: "sub_graphic_a",
            8: "secondary_silhouette",
            9: "star_cluster",
            10: "pattern_fill",         # Three lions pattern
        }
    },

    "france": {
        "file": "france-national-team.football-logos.cc.svg",
        "palette": {"primary": "#002395", "secondary": "#FFFFFF", "accent": "#ED2939", "bg": "#002395"},
        "shape": "shield",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            3: "color_field_primary",
            4: "color_field_secondary",
            5: "crest_top",
            6: "sub_graphic_a",
        }
    },

    "germany": {
        "file": "germany-national-team.football-logos.cc.svg",
        "palette": {"primary": "#000000", "secondary": "#DD0000", "accent": "#FFCE00", "bg": "#FFFFFF"},
        "shape": "badge",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            3: "color_field_primary",
            4: "secondary_silhouette",
        }
    },

    "ghana": {
        "file": "ghana-national-team.football-logos.cc.svg",
        "palette": {"primary": "#EF3340", "secondary": "#FCD116", "accent": "#009B3A", "bg": "#FFFFFF"},
        "shape": "circle",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            4: "color_field_primary",
            5: "color_field_secondary",
            6: "star_cluster",           # the Black Star
            7: "sub_graphic_a",
            8: "crest_bottom",
        }
    },

    "haiti": {
        "file": "haiti-national-team.football-logos.cc.svg",
        "palette": {"primary": "#00209F", "secondary": "#D21034", "accent": "#FFFFFF", "bg": "#00209F"},
        "shape": "crest",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            3: "color_field_primary",
            4: "color_field_secondary",
            5: "secondary_silhouette",
            6: "crest_top",
            7: "sub_graphic_a",
            8: "sub_graphic_b",
            9: "crest_bottom",
            10: "badge_element",
        }
    },

    "iran": {
        "file": "iran-national-team.football-logos.cc.svg",
        "palette": {"primary": "#239F40", "secondary": "#FFFFFF", "accent": "#C60C30", "bg": "#239F40"},
        "shape": "crest",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            3: "color_field_primary",
            4: "color_field_secondary",
            5: "sub_graphic_a",
            6: "sub_graphic_b",
            7: "crest_top",
        }
    },

    "iraq": {
        "file": "iraq-national-team.football-logos.cc.svg",
        "palette": {"primary": "#CE1126", "secondary": "#000000", "accent": "#FFFFFF", "bg": "#FFFFFF"},
        "shape": "shield",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            3: "color_field_primary",
        }
    },

    "japan": {
        "file": "japan-national-team.football-logos.cc.svg",
        "palette": {"primary": "#003DA5", "secondary": "#BC002D", "accent": "#FFFFFF", "bg": "#003DA5"},
        "shape": "badge",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            3: "color_field_primary",
            4: "color_field_secondary",
            5: "crest_top",
            6: "sub_graphic_a",
        }
    },

    "jordan": {
        "file": "jordan-national-team.football-logos.cc.svg",
        "palette": {"primary": "#CE1126", "secondary": "#007A3D", "accent": "#FFFFFF", "bg": "#FFFFFF"},
        "shape": "shield",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            3: "color_field_primary",
            4: "color_field_secondary",
            5: "secondary_silhouette",
            6: "sub_graphic_a",
            7: "star_cluster",
        }
    },

    "mexico": {
        "file": "mexico-national-team.football-logos.cc.svg",
        "palette": {"primary": "#006847", "secondary": "#CE1126", "accent": "#FFFFFF", "bg": "#006847"},
        "shape": "circle",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            5: "color_field_primary",
            6: "color_field_secondary",
            7: "secondary_silhouette",
            8: "sub_graphic_a",
            9: "crest_top",
            10: "badge_element",
        }
    },

    "morocco": {
        "file": "morocco-national-team.football-logos.cc.svg",
        "palette": {"primary": "#C1272D", "secondary": "#006233", "accent": "#FFFFFF", "bg": "#FFFFFF"},
        "shape": "shield",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            3: "color_field_primary",
            4: "color_field_secondary",
            5: "secondary_silhouette",
            6: "sub_graphic_a",
            7: "star_cluster",           # star of Morocco
            8: "badge_element",
            9: "crest_top",
            10: "crest_bottom",
        }
    },

    "netherlands": {
        "file": "dutch-national-team.football-logos.cc.svg",
        "palette": {"primary": "#F36C21", "secondary": "#FFFFFF", "accent": "#003DA5", "bg": "#FFFFFF"},
        "shape": "shield",
        "tags": {},
        "data_tags_batch": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "element_2": "color_field_primary",
            "element_3": "secondary_silhouette",
            "element_4": "sub_graphic_a",       # lion detail
            "element_5": "sub_graphic_b",
            "element_6": "sub_graphic_a",
            "element_7": "crest_top",
            "element_8": "crest_bottom",
            "element_9": "star_cluster",
            "element_10": "badge_element",
            "element_11": "pattern_fill",
            "element_12": "pattern_fill",
            "element_13": "sub_graphic_b",
            "element_14": "color_field_secondary",
            "element_15": "sub_graphic_a",
            "element_16": "crest_left",
            "element_17": "sub_graphic_b",
            "element_18": "crest_right",
            "element_19": "pattern_fill",
            "element_20": "sub_graphic_a",
            "element_21": "color_field_primary",
            "element_22": "sub_graphic_b",
            "element_23": "star_cluster",
            "element_24": "pattern_fill",
            "element_25": "sub_graphic_a",
            "element_26": "crest_top",
            **{f"element_{i}": "sub_graphic_b" for i in range(27,42)},
            "element_30": "color_field_secondary",
        }
    },

    "new-zealand": {
        "file": "new-zealand-national-team.football-logos.cc.svg",
        "palette": {"primary": "#000000", "secondary": "#FFFFFF", "accent": "#CC0000", "bg": "#000000"},
        "shape": "badge",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            # Only 1 element in this file — it's just the silhouette
        }
    },

    "norway": {
        "file": "norway-national-team.football-logos.cc.svg",
        "palette": {"primary": "#EF2B2D", "secondary": "#FFFFFF", "accent": "#003580", "bg": "#FFFFFF"},
        "shape": "shield",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
        },
        "data_tags_batch": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            "u": "color_field_primary",
            "w": "color_field_secondary",
            "x": "secondary_silhouette",
            "y": "crest_top",
            "z": "sub_graphic_a",
            "A": "sub_graphic_b",
            "B": "star_cluster",
            "C": "badge_element",
            "D": "pattern_fill",
        }
    },

    "panama": {
        "file": "panama-national-team.football-logos.cc.svg",
        "palette": {"primary": "#DA121A", "secondary": "#002B7F", "accent": "#FFFFFF", "bg": "#FFFFFF"},
        "shape": "crest",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            3: "color_field_primary",
            4: "color_field_secondary",
            5: "secondary_silhouette",
            6: "sub_graphic_a",        # eagle body
            7: "sub_graphic_b",        # eagle wings
            8: "crest_top",
            9: "crest_left",
            10: "crest_right",
            11: "crest_bottom",
            12: "badge_element",
            13: "star_cluster",
            14: "pattern_fill",
        }
    },

    "paraguay": {
        "file": "paraguay-national-team.football-logos.cc.svg",
        "palette": {"primary": "#D52B1E", "secondary": "#FFFFFF", "accent": "#0038A8", "bg": "#FFFFFF"},
        "shape": "circle",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            3: "color_field_primary",
            4: "color_field_secondary",
            5: "badge_element",
        }
    },

    "portugal": {
        "file": "portuguese-football-federation.football-logos.cc.svg",
        "palette": {"primary": "#E42518", "secondary": "#004595", "accent": "#D3C084", "bg": "#FFFFFF"},
        "shape": "shield",
        "tags": {},
        "data_tags_batch": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "element_2": "color_field_primary",
            "element_3": "color_field_secondary",
            "element_4": "secondary_silhouette",
            "element_5": "sub_graphic_a",           # white castles
            "element_6": "crest_left",
            "element_7": "crest_right",
            "element_8": "sub_graphic_a",
            "element_9": "sub_graphic_a",
            "element_10": "sub_graphic_b",
            "element_11": "sub_graphic_b",
            "element_12": "crest_top",
            "element_13": "color_field_primary",
            "element_14": "color_field_primary",
            "element_15": "color_field_secondary",
            "element_16": "badge_element",
            "element_17": "sub_graphic_b",
            "element_18": "pattern_fill",
            "element_19": "color_field_primary",
            "element_20": "color_field_secondary",
            "element_21": "sub_graphic_a",
            "element_22": "crest_bottom",
            "element_23": "crest_bottom",
            "element_24": "crest_bottom",
            "element_25": "crest_bottom",
            "element_26": "badge_element",
            "element_27": "badge_element",
            "element_28": "badge_element",
            "element_29": "badge_element",
            **{f"element_{i}": "pattern_fill" for i in range(30, 37)},
        }
    },

    "qatar": {
        "file": "qatar-national-team.football-logos.cc.svg",
        "palette": {"primary": "#8D1B3D", "secondary": "#FFFFFF", "accent": "#8D1B3D", "bg": "#8D1B3D"},
        "shape": "shield",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
        },
        "data_tags_batch": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            "e": "color_field_primary",
            "f": "color_field_secondary",
            "g": "secondary_silhouette",
            "h": "sub_graphic_a",
            "i": "crest_top",
            "j": "badge_element",
            "k": "pattern_fill",
            "l": "pattern_fill",
            "m": "star_cluster",
            "n": "crest_bottom",
            "o": "sub_graphic_b",
        }
    },

    "saudi-arabia": {
        "file": "saudi-arabia-national-team.football-logos.cc.svg",
        "palette": {"primary": "#006C35", "secondary": "#FFFFFF", "accent": "#006C35", "bg": "#006C35"},
        "shape": "shield",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            3: "color_field_primary",
            4: "sub_graphic_a",         # palm tree and swords
            5: "crest_bottom",
        }
    },

    "scotland": {
        "file": "scotland-national-team.football-logos.cc.svg",
        "palette": {"primary": "#005EB8", "secondary": "#FFFFFF", "accent": "#003DA5", "bg": "#005EB8"},
        "shape": "circle",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            3: "color_field_primary",
            4: "color_field_secondary",
            5: "secondary_silhouette",
            6: "sub_graphic_a",
            7: "crest_top",
            8: "crest_bottom",
            9: "badge_element",
            10: "pattern_fill",
        }
    },

    "senegal": {
        "file": "senegal-national-team.football-logos.cc.svg",
        "palette": {"primary": "#00853F", "secondary": "#FDEF42", "accent": "#E31B23", "bg": "#FFFFFF"},
        "shape": "shield",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            3: "color_field_primary",
            4: "color_field_secondary",
            5: "secondary_silhouette",
            6: "sub_graphic_a",
            7: "star_cluster",
            8: "badge_element",
            9: "crest_top",
            10: "crest_bottom",
        }
    },

    "south-africa": {
        "file": "south-africa-national-team.football-logos.cc.svg",
        "palette": {"primary": "#007A4D", "secondary": "#FFB81C", "accent": "#E03C31", "bg": "#FFFFFF"},
        "shape": "shield",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            4: "color_field_primary",
            5: "color_field_secondary",
            6: "secondary_silhouette",
            7: "sub_graphic_a",
            8: "crest_top",
            9: "crest_bottom",
        }
    },

    "south-korea": {
        "file": "south-korea-national-team.football-logos.cc.svg",
        "palette": {"primary": "#CD2E3A", "secondary": "#0047A0", "accent": "#FFFFFF", "bg": "#FFFFFF"},
        "shape": "shield",
        "tags": {
            "hero_graphic": "hero_graphic",
            "primary_silhouette": "primary_silhouette",
            "typography_labels": "typography_labels",
            4: "color_field_primary",
            5: "color_field_secondary",
            6: "sub_graphic_a",        # taeguk symbol
            7: "sub_graphic_b",        # trigrams
            8: "badge_element",
        }
    },

    "spain": {
        "file": "spain-national-team.football-logos.cc.svg",
        "palette": {"primary": "#AA151B", "secondary": "#F1BF00", "accent": "#FFFFFF", "bg": "#FFFFFF"},
        "shape": "shield",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            5: "color_field_primary",
            6: "color_field_secondary",
            7: "secondary_silhouette",
            8: "crest_left",
            9: "crest_right",
            10: "sub_graphic_a",
            11: "badge_element",
        }
    },

    "sweden": {
        "file": "sweden-national-team.football-logos.cc.svg",
        "palette": {"primary": "#015794", "secondary": "#FECC00", "accent": "#FFFFFF", "bg": "#015794"},
        "shape": "badge",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            3: "color_field_primary",
            4: "color_field_secondary",
            5: "sub_graphic_a",
            6: "sub_graphic_b",
            7: "crest_top",
            8: "badge_element",
        }
    },

    "switzerland": {
        "file": "switzerland-national-team.football-logos.cc.svg",
        "palette": {"primary": "#DA291C", "secondary": "#FFFFFF", "accent": "#DA291C", "bg": "#DA291C"},
        "shape": "shield",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
        }
    },

    "tunisia": {
        "file": "tunisia-national-team.football-logos.cc.svg",
        "palette": {"primary": "#E70013", "secondary": "#FFFFFF", "accent": "#E70013", "bg": "#FFFFFF"},
        "shape": "circle",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            3: "color_field_primary",
            4: "color_field_secondary",
            5: "secondary_silhouette",
            6: "sub_graphic_a",        # crescent
            7: "sub_graphic_b",        # star
            8: "badge_element",
            9: "crest_top",
        }
    },

    "turkey": {
        "file": "turkey-national-team.football-logos.cc.svg",
        "palette": {"primary": "#E30A17", "secondary": "#FFFFFF", "accent": "#E30A17", "bg": "#E30A17"},
        "shape": "shield",
        "tags": {
            "hero_graphic": "hero_graphic",
            "primary_silhouette": "primary_silhouette",
            "element_2": "color_field_primary",
        }
    },

    "uruguay": {
        "file": "uruguay-national-team.football-logos.cc.svg",
        "palette": {"primary": "#0081C6", "secondary": "#FFFFFF", "accent": "#000000", "bg": "#FFFFFF"},
        "shape": "shield",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            4: "color_field_primary",
            5: "color_field_secondary",
            6: "secondary_silhouette",
            7: "sub_graphic_a",        # sun of May
            8: "star_cluster",
            9: "crest_top",
            10: "crest_bottom",
        }
    },

    "usa": {
        "file": "usa-national-team.football-logos.cc.svg",
        "palette": {"primary": "#002868", "secondary": "#BF0D3E", "accent": "#FFFFFF", "bg": "#FFFFFF"},
        "shape": "shield",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            # Only 4 elements total, 3 already tagged
        }
    },

    "uzbekistan": {
        "file": "uzbekistan-national-team.football-logos.cc.svg",
        "palette": {"primary": "#1EB53A", "secondary": "#0099B5", "accent": "#CE1126", "bg": "#FFFFFF"},
        "shape": "circle",
        "tags": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
        },
        "data_tags_batch": {
            "primary_silhouette": "primary_silhouette",
            "hero_graphic": "hero_graphic",
            "typography_labels": "typography_labels",
            "a": "color_field_primary",
            "b": "color_field_secondary",
            "c": "secondary_silhouette",
            "d": "sub_graphic_a",
            "e": "star_cluster",
            "f": "star_cluster",
            "g": "star_cluster",
            "h": "star_cluster",
            "i": "badge_element",
            "j": "pattern_fill",
            "k": "pattern_fill",
            "l": "crest_top",
            **{letter: "sub_graphic_b" for letter in "mnopqrstuvwxyz"},
            **{letter: "pattern_fill" for letter in "ABCDEFGHIJKLMNOPQR"},
        }
    },
}

# ─────────────────────────────────────────────────────────────────────────────
# TAGGER ENGINE
# ─────────────────────────────────────────────────────────────────────────────

def apply_tags(svg_path, config, dry_run=False):
    """Apply rich semantic tags to a single SVG file."""
    if not os.path.exists(svg_path):
        print(f"  SKIP (not found): {svg_path}")
        return False

    # Parse preserving namespaces
    ET.register_namespace('', NS)
    ET.register_namespace('xlink', 'http://www.w3.org/1999/xlink')

    try:
        tree = ET.parse(svg_path)
    except ET.ParseError as e:
        print(f"  ERROR parsing {svg_path}: {e}")
        return False

    root = tree.getroot()

    # Apply data attributes to root
    palette = config.get("palette", {})
    root.set("data-team", config.get("slug", ""))
    root.set("data-shape", config.get("shape", "shield"))
    root.set("data-palette-primary", palette.get("primary", ""))
    root.set("data-palette-secondary", palette.get("secondary", ""))
    root.set("data-palette-accent", palette.get("accent", ""))
    root.set("data-palette-bg", palette.get("bg", ""))

    # Build index of drawable elements
    skip = {f'{{{NS}}}{t}' for t in SKIP_TAGS} | set(SKIP_TAGS)
    drawables = [el for el in root.iter() if el.tag not in skip]

    # Build id → element map
    id_map = {}
    for el in root.iter():
        eid = el.get("id")
        if eid:
            id_map[eid] = el

    changes = []

    # Apply index-based tags
    tags = config.get("tags", {})
    for key, new_id in tags.items():
        if isinstance(key, int):
            if key < len(drawables):
                el = drawables[key]
                old = el.get("id", "—")
                el.set("id", new_id)
                changes.append(f"  [idx {key:3d}] {old} → {new_id}")
        elif isinstance(key, str):
            if key in id_map:
                el = id_map[key]
                el.set("id", new_id)
                changes.append(f"  [id] {key} → {new_id}")

    # Apply data_tags_batch (id-based renames)
    data_tags = config.get("data_tags_batch", {})
    for old_id, new_id in data_tags.items():
        if old_id in id_map:
            el = id_map[old_id]
            el.set("id", new_id)
            changes.append(f"  [batch] {old_id} → {new_id}")

    if not dry_run:
        # Write back
        tree.write(svg_path, xml_declaration=True, encoding="utf-8")

    return changes

def run(svg_dir=SVG_DIR, dry_run=False):
    print(f"\n{'DRY RUN — ' if dry_run else ''}Tagging {len(TEAM_CONFIGS)} teams in {svg_dir}/\n")
    success, skipped, errors = 0, 0, 0

    for slug, config in TEAM_CONFIGS.items():
        config["slug"] = slug
        fname = config["file"]
        fpath = os.path.join(svg_dir, fname)
        print(f"\n▸ {slug.upper():30s} [{config['shape']:8s}] {config['palette']['primary']}")

        changes = apply_tags(fpath, config, dry_run=dry_run)
        if changes is False:
            skipped += 1
        elif changes:
            for c in changes[:12]:
                print(c)
            if len(changes) > 12:
                print(f"  ... +{len(changes)-12} more")
            success += 1
        else:
            print("  (no changes)")
            success += 1

    print(f"\n{'='*60}")
    print(f"Done: {success} tagged, {skipped} skipped, {errors} errors")

if __name__ == "__main__":
    dry = "--dry" in sys.argv
    svg_dir_arg = SVG_DIR
    for arg in sys.argv[1:]:
        if not arg.startswith("--"):
            svg_dir_arg = arg
    run(svg_dir=svg_dir_arg, dry_run=dry)
