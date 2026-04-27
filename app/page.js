const RenderHeraldicCrest = () => {
    // Precise quadrant clipping: Top-Left, Top-Right, Bottom-Left, Bottom-Right
    const clips = [
      'inset(0 50% 50% 0)', 
      'inset(0 0 50% 50%)', 
      'inset(50% 50% 0 0)', 
      'inset(50% 0 0 50%)'  
    ];

    return (
      <div style={{ position: 'relative', width: '500px', height: '500px' }}>
        {/* The "Emblem" Container with heavy "Crop Mark" border */}
        <div style={{ 
          width: '500px', 
          height: '500px', 
          border: '15px solid #000', 
          position: 'relative', 
          overflow: 'hidden', 
          backgroundColor: '#FFF' // Clean white base for the PNGs
        }}>
          {selections.map((country, i) => (
            <div key={i} style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              clipPath: clips[i],
              zIndex: i
            }}>
              <img 
                src={getImagePath(country)} 
                alt={country.name}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  padding: '10px', // Prevents logos from hitting the outer edge too hard
                  opacity: 1 // Back to full original color
                }}
              />
            </div>
          ))}
          
          {/* Brutalist Stitching Guides */}
          <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', background: '#000', opacity: 0.1, zIndex: 10 }}></div>
          <div style={{ position: 'absolute', top: 0, left: '50%', width: '1px', height: '100%', background: '#000', opacity: 0.1, zIndex: 10 }}></div>
        </div>

        {/* Minimal Metadata Footer */}
        <div style={{ 
          marginTop: '15px', 
          fontFamily: "'Space Mono', monospace", 
          fontSize: '10px', 
          color: '#000', 
          display: 'flex', 
          justifyContent: 'space-between',
          letterSpacing: '0.1em'
        }}>
          <span>COMPOSITE // {selections.map(s => s.code).join('.') }</span>
          <span>STITCH_MARK_V4_RAW</span>
        </div>
      </div>
    );
  };