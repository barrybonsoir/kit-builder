"use client";
import { useState } from 'react';

// ... (countries and labels arrays remain exactly the same)

const RenderHeraldicCrest = () => {
  const s = selections;
  
  // Helper to get the correct quadrant alignment
  // 0: Top-Left (Bottom-Right of PNG visible)
  // 1: Top-Right (Bottom-Left of PNG visible)
  // 2: Bottom-Left (Top-Right of PNG visible)
  // 3: Bottom-Right (Top-Left of PNG visible)
  const positions = ['right bottom', 'left bottom', 'right top', 'left top'];

  return (
    <div style={{ 
      width: '600px', 
      height: '600px', 
      backgroundColor: '#000', 
      border: '20px solid #000',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '1fr 1fr',
      gap: '4px', // Brutalist "cut" lines
      boxShadow: '40px 40px 0px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      {selections.map((country, i) => (
        <div key={i} style={{ 
          backgroundColor: country.color, 
          width: '100%', 
          height: '100%', 
          overflow: 'hidden',
          display: 'flex'
        }}>
          <img 
            src={getImagePath(country)} 
            alt={country.name}
            style={{
              width: '200%', // Scale up to ensure we only see one quadrant
              height: '200%',
              objectFit: 'contain',
              objectPosition: positions[i],
              filter: i % 2 === 0 ? 'none' : 'contrast(120%) brightness(1.1)', // Subtle variation
              mixBlendMode: 'multiply',
              opacity: 0.9
            }}
          />
        </div>
      ))}
      
      {/* Overlay Technical Metadata */}
      <div style={{ 
        position: 'absolute', 
        bottom: '-40px', 
        left: 0, 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'space-between',
        fontFamily: "'Space Mono', monospace",
        fontSize: '10px',
        color: '#000'
      }}>
        <span>COMPOSITE // TYPE_QUADRANT</span>
        <span>{selections.map(s => s.code).join(' x ')}</span>
      </div>
    </div>
  );
};