const RenderHeraldicCrest = () => {
    const s = selections;
    const logoPaths = s.map(n => `/logos/${n.code}.png`);

    // Randomized values for Generative Texture
    const stripeDensity = Math.floor(Math.random() * 40) + 10; // 10 to 50 stripes
    const rotation = (Math.random() > 0.5 ? -15 : 15);
    const complexKnotScale = Math.random() * 0.3 + 0.8; // 0.8 to 1.1

    return (
      <svg width="500" height="600" viewBox="0 0 500 600" style={{ 
        backgroundColor: s[3]?.color || '#000', // Use Nation 4 color as canvas flood
        border: '20px solid #000',
        boxShadow: '40px 40px 0px rgba(0,0,0,0.1)'
      }}>
        <defs>
          {/* L1 Pattern: Generated Stripe Field */}
          <pattern id="dataStripe" x="0" y="0" width="10" height={40 + stripeDensity} patternUnits="userSpaceOnUse" patternTransform={`rotate(${rotation})`}>
            <rect x="0" y="0" width="5" height="100%" fill="#000" fillOpacity="0.15" />
          </pattern>

          {/* L2 Mask: The Shield Framework */}
          <clipPath id="shieldMask">
            <path d="M100,20 L400,20 L400,420 Q400,560 250,590 Q100,560 100,420 Z" />
          </clipPath>

          {/* L3 Complex Mirror Knot: Nation 2 Logo synthesized into a pattern */}
          <pattern id="mirrorKnotPattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse" patternTransform={`scale(${complexKnotScale}) rotate(45)`}>
            <image href={logoPaths[1]} x="0" y="0" width="100" height="100" filter="grayscale(1)" />
            <image href={logoPaths[1]} x="100" y="0" width="100" height="100" filter="grayscale(1)" transform="scaleX(-1) translate(-200, 0)" />
            <image href={logoPaths[1]} x="0" y="100" width="100" height="100" filter="grayscale(1)" transform="scaleY(-1) translate(0, -200)" />
            <image href={logoPaths[1]} x="100" y="100" width="100" height="100" filter="grayscale(1)" transform="scale(-1) translate(-200, -200)" />
          </pattern>
        </defs>

        {/* L0: CANVASS FLOOD (Nation 4 color) */}
        <rect width="100%" height="100%" fill="inherit" />

        {/* L1: GENERATIVE STRIPE FIELD */}
        <rect width="100%" height="100%" fill="url(#dataStripe)" opacity="0.3" style={{ mixBlendMode: 'overlay' }} />

        {/* L2: THE SHIELD FRAME (Vector Distortions) */}
        <g clipPath="url(#shieldMask)">
          {/* Main Shield Fill (Nation 1) */}
          <rect width="100%" height="100%" fill={s[0]?.color} stroke="#000" strokeWidth="15" />
          
          {/* Texture Injections (Nation 1 logo distorted as luminosity mask) */}
          <image href={logoPaths[0]} x="-100" y="-100" width="700" height="700" opacity="0.4" style={{ mixBlendMode: 'color-dodge', filter: 'grayscale(1) contrast(300%)' }} />
          
          {/* L3: MIRROR KNOT FIELD (Nation 2 synthesized pattern) */}
          <rect x="100" y="20" width="300" height="570" fill="url(#mirrorKnotPattern)" style={{ mixBlendMode: 'difference' }} />
        </g>

        {/* L4: THE CORE COMPLEX (Multi-layered Nested Synthesis) */}
        <g transform="translate(250, 300)" opacity="0.95" style={{ mixBlendMode: 'hard-light' }}>
          <circle r="160" fill="#000" />
          {/* Core Sub-Synthesis of Nations 2 and 3 */}
          <image href={logoPaths[2]} x="-120" y="-120" width="240" height="240" filter="grayscale(1) contrast(250%)" style={{ mixBlendMode: 'screen' }} />
          <image href={logoPaths[1]} x="-120" y="-120" width="240" height="240" filter="grayscale(1) contrast(250%)" style={{ mixBlendMode: 'multiply' }} />
        </g>

        {/* L5: TYPOGRAPHY DISTORTIONS (Glitch Text Overlay) */}
        <rect x="0" y="550" width="100%" height="50" fill="#000" />
        <text x="250" y="582" style={{ fontFamily: '"Space Mono", monospace', fontSize: '11px', fill: '#FFF', textAnchor: 'middle', letterSpacing: '4px' }}>
          TACTICAL_ASSET // {s[0]?.code}x{s[1]?.code}x{s[2]?.code} // COMPLEXITY_VER_3.02
        </text>
      </svg>
    );
  };