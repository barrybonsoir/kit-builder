"use client";
import { useState } from 'react';

// Countries and Labels remain locked in.

const RenderHeraldicCrest = ({ selections, getImagePath }) => {
  if (selections.includes(null)) return null;

  // L1 & L2 form a Rorschach texture background using Nation One and Two
  const textureImage1 = getImagePath(selections[0]);
  const textureImage2 = getImagePath(selections[1]);
  // L3 provides the core mark complexity using Nation Three
  const coreImage = getImagePath(selections[2]);

  return (
    <div style={{ position: 'relative', width: '600px', height: '600px', backgroundColor: selections[3]?.color || '#000', overflow: 'hidden' }}>
      
      {/* LAYER 1: RORSCHACH TEXTURE CLOUD */}
      {/* Multiplies Nations 1 & 2 together, mirrors them, and forces high-contrast greyscale */}
      <div style={{ 
        position: 'absolute', 
        inset: '0px', 
        zIndex: 1, 
        mixBlendMode: 'normal', 
        filter: 'grayscale(1) contrast(400%) invert(1)', // Forces raw binary texture
        opacity: 0.15 // Subtle, complex background haze
      }}>
        {/* TOP LEFT */}
        <img src={textureImage1} style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '50%', objectFit: 'contain' }} />
        {/* TOP RIGHT (Mirrored) */}
        <img src={textureImage2} style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '50%', objectFit: 'contain', transform: 'scaleX(-1)' }} />
        {/* BOTTOM LEFT (Mirrored) */}
        <img src={textureImage2} style={{ position: 'absolute', bottom: 0, left: 0, width: '50%', height: '50%', objectFit: 'contain', transform: 'scaleY(-1)' }} />
        {/* BOTTOM RIGHT */}
        <img src={textureImage1} style={{ position: 'absolute', bottom: 0, right: 0, width: '50%', height: '50%', objectFit: 'contain', transform: 'scale(-1, -1)' }} />
      </div>

      {/* LAYER 2: CHROMA KALEIDOSCOPE GRID */}
      {/* Takes the Core image (Nation 3), mirrors it tightly, and uses mix-blend-mode for crazy colors. */}
      <div style={{ 
        position: 'absolute', 
        inset: '0px', 
        zIndex: 2, 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', // Intricate grid
        gridTemplateRows: 'repeat(4, 1fr)',
        gap: '2px', // Minimal stitch
        mixBlendMode: 'color-dodge', // Reacts violently with L1 haze
        filter: 'saturate(3) contrast(150%)', // Pops original colors
      }}>
        {[...Array(16)].map((_, index) => {
          // Generative mapping based on cell index
          const isFlippedX = index % 2 === 1;
          const isFlippedY = Math.floor(index / 4) % 2 === 1;
          
          return (
            <div key={index} style={{ overflow: 'hidden', position: 'relative' }}>
              <img 
                src={coreImage} 
                style={{
                  position: 'absolute',
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain',
                  transform: `scale(${isFlippedX ? -1 : 1}, ${isFlippedY ? -1 : 1})`,
                  mixBlendMode: 'screen', // Blends logo colors together
                  opacity: 0.95
                }} 
              />
            </div>
          );
        })}
      </div>

      {/* LAYER 3: DEFINITION FRAME & METADATA */}
      <div style={{ position: 'absolute', inset: '0', zIndex: 100, pointerEvents: 'none' }}>
        {/* Heavy registration cross in center, now part of the frame */}
        <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '2px', background: '#000', zIndex: 10 }}></div>
        <div style={{ position: 'absolute', top: 0, left: '50%', width: '2px', height: '100%', background: '#000', zIndex: 10 }}></div>
        
        {/* The four + signs are now forced on top by stacking context */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', fontFamily: 'monospace', fontSize: '24px', color: '#000', fontWeight: 'bold' }}>+</div>
        <div style={{ position: 'absolute', top: '10px', right: '10px', fontFamily: 'monospace', fontSize: '24px', color: '#000', fontWeight: 'bold' }}>+</div>
        <div style={{ position: 'absolute', bottom: '10px', left: '10px', fontFamily: 'monospace', fontSize: '24px', color: '#000', fontWeight: 'bold' }}>+</div>
        <div style={{ position: 'absolute', bottom: '10px', right: '10px', fontFamily: 'monospace', fontSize: '24px', color: '#000', fontWeight: 'bold' }}>+</div>

        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'monospace', fontSize: '10px', color: '#FFF', textAlign: 'center', backgroundColor: '#000', padding: '10px', borderRadius: '5px' }}>
          ARTEFACT // {selections.map(s => s?.code).join(' x ')} // REV_6.0.2
        </div>
      </div>
    </div>
  );
};