// lib/teams.js
export const teams2026 = [
  // NORTH AMERICA (CONCACAF)
  { name: "United States", code: "USA", region: "North America", color: "#002868", icon: "🇺🇸", pattern: "stripes" },
  { name: "Mexico", code: "MEX", region: "North America", color: "#006341", icon: "🇲🇽", pattern: "aztec" },
  { name: "Canada", code: "CAN", region: "North America", color: "#FF0000", icon: "🇨🇦", pattern: "leaf" },
  { name: "Panama", code: "PAN", region: "North America", color: "#DA121A", icon: "🇵🇦", pattern: "geometric" },
  { name: "Haiti", code: "HAI", region: "North America", color: "#00209F", icon: "🇭🇹", pattern: "vibrant" },
  { name: "Curaçao", code: "CUW", region: "North America", color: "#002B7F", icon: "🇨🇼", pattern: "stars" },

  // SOUTH AMERICA (CONMEBOL)
  { name: "Argentina", code: "ARG", region: "South America", color: "#6CACE4", icon: "🇦🇷", pattern: "sun" },
  { name: "Brazil", code: "BRA", region: "South America", color: "#FEDF00", icon: "🇧🇷", pattern: "diamond" },
  { name: "Colombia", code: "COL", region: "South America", color: "#FCD116", icon: "🇨🇴", pattern: "diagonal" },
  { name: "Uruguay", code: "URU", region: "South America", color: "#0081C6", icon: "🇺🇾", pattern: "sky" },
  { name: "Ecuador", code: "ECU", region: "South America", color: "#FFDD00", icon: "🇪🇨", pattern: "condor" },
  { name: "Paraguay", code: "PAR", region: "South America", color: "#D52B1E", icon: "🇵🇾", pattern: "crest" },

  // EUROPE (UEFA)
  { name: "England", code: "ENG", region: "Europe", color: "#CE1124", icon: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", pattern: "cross" },
  { name: "France", code: "FRA", region: "Europe", color: "#002395", icon: "🇫🇷", pattern: "tricolor" },
  { name: "Germany", code: "GER", region: "Europe", color: "#000000", icon: "🇩🇪", pattern: "bauhaus" },
  { name: "Spain", code: "ESP", region: "Europe", color: "#AA151B", icon: "🇪🇸", pattern: "mosaic" },
  { name: "Portugal", code: "POR", region: "Europe", color: "#E42518", icon: "🇵🇹", pattern: "armillary" },
  { name: "Netherlands", code: "NED", region: "Europe", color: "#FF4F00", icon: "🇳🇱", pattern: "waves" },
  { name: "Belgium", code: "BEL", region: "Europe", color: "#EF3340", icon: "🇧🇪", pattern: "crown" },
  { name: "Croatia", code: "CRO", region: "Europe", color: "#FF0000", icon: "🇭🇷", pattern: "checker" },
  { name: "Norway", code: "NOR", region: "Europe", color: "#EF2B2D", icon: "🇳🇴", pattern: "nordic" },
  { name: "Sweden", code: "SWE", region: "Europe", color: "#FECC00", icon: "🇸🇪", pattern: "cross" },
  { name: "Austria", code: "AUT", region: "Europe", color: "#ED2939", icon: "🇦🇹", pattern: "bars" },
  { name: "Switzerland", code: "SUI", region: "Europe", color: "#FF0000", icon: "🇨🇭", pattern: "swiss" },
  { name: "Türkiye", code: "TUR", region: "Europe", color: "#E30A17", icon: "🇹🇷", pattern: "crescent" },
  { name: "Scotland", code: "SCO", region: "Europe", color: "#005EB8", icon: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", pattern: "tartan" },
  { name: "Czech Republic", code: "CZE", region: "Europe", color: "#11457E", icon: "🇨🇿", pattern: "triangle" },
  { name: "Bosnia and Herzegovina", code: "BIH", region: "Europe", color: "#002395", icon: "🇧🇦", pattern: "stars" },

  // AFRICA (CAF)
  { name: "Morocco", code: "MAR", region: "Africa", color: "#C1272D", icon: "🇲🇦", pattern: "star" },
  { name: "Senegal", code: "SEN", region: "Africa", color: "#118808", icon: "🇸🇳", pattern: "lion" },
  { name: "Egypt", code: "EGY", region: "Africa", color: "#C8102E", icon: "🇪🇬", pattern: "lotus" },
  { name: "Tunisia", code: "TUN", region: "Africa", color: "#E70013", icon: "🇹🇳", pattern: "eagle" },
  { name: "Algeria", code: "ALG", region: "Africa", color: "#006233", icon: "🇩🇿", pattern: "fennec" },
  { name: "Ghana", code: "GHA", region: "Africa", color: "#EF3340", icon: "🇬🇭", pattern: "kente" },
  { name: "South Africa", code: "RSA", region: "Africa", color: "#007A4D", icon: "🇿🇦", pattern: "protea" },
  { name: "Ivory Coast", code: "CIV", region: "Africa", color: "#FF8200", icon: "🇨🇮", pattern: "elephant" },
  { name: "DR Congo", code: "COD", region: "Africa", color: "#007FFF", icon: "🇨🇩", pattern: "leopard" },
  { name: "Cabo Verde", code: "CPV", region: "Africa", color: "#003893", icon: "🇨🇻", pattern: "island" },

  // ASIA (AFC)
  { name: "Japan", code: "JPN", region: "Asia", color: "#00008B", icon: "🇯🇵", pattern: "origami" },
  { name: "South Korea", code: "KOR", region: "Asia", color: "#CD2E3A", icon: "🇰🇷", pattern: "taeguk" },
  { name: "Iran", code: "IRN", region: "Asia", color: "#239F40", icon: "🇮🇷", pattern: "floral" },
  { name: "Australia", code: "AUS", region: "Asia", color: "#FFCD00", icon: "🇦🇺", pattern: "kangaroo" },
  { name: "Saudi Arabia", code: "KSA", region: "Asia", color: "#006C35", icon: "🇸🇦", pattern: "palm" },
  { name: "Qatar", code: "QAT", region: "Asia", color: "#8D1B3D", icon: "🇶🇦", pattern: "serrated" },
  { name: "Uzbekistan", code: "UZB", region: "Asia", color: "#0099B5", icon: "🇺🇿", pattern: "cotton" },
  { name: "Jordan", code: "JOR", region: "Asia", color: "#CE1126", icon: "🇯🇴", pattern: "star7" },
  { name: "Iraq", code: "IRQ", region: "Asia", color: "#CE1126", icon: "🇮🇶", pattern: "kufic" },

  // OCEANIA (OFC)
{ name: "New Zealand", code: "NZL", region: "Oceania", color: "#000000", icon: "🇳🇿", pattern: "fern" }
];