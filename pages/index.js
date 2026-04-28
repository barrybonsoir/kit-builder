import React, { useState, useRef } from 'react';
import Head from 'next/head';

const countries = [
  { name: "Algeria", code: "ALG", color: "#006233" }, { name: "Argentina", code: "ARG", color: "#74ACDF" },
  { name: "Australia", code: "AUS", color: "#00008B" }, { name: "Austria", code: "AUT", color: "#ED2939" },
  { name: "Belgium", code: "BEL", color: "#EF3340" }, { name: "Brazil", code: "BRA", color: "#009739" },
  { name: "Canada", code: "CAN", color: "#FF0000" }, { name: "Colombia", code: "COL", color: "#FCD116" },
  { name: "England", code: "ENG", color: "#FFFFFF" }, { name: "France", code: "FRA", color: "#002395" },
  { name: "Germany", code: "GER", color: "#000000" }, { name: "Japan", code: "JPN", color: "#BC002D" },
  { name: "Mexico", code: "MEX", color: "#006847" }, { name: "Netherlands", code: "NED", color: "#F36C21" },
  { name: "Spain", code: "ESP", color: "#C60B1E" }, { name: "United States", code: "USA", color: "#0A3161" }
];

export default function Home() {
  const [selections, setSelections] = useState([null, null, null, null]);
  const [activeSlot, setActiveSlot] = useState(null);
  const [generatedImg, setGeneratedImg] = useState(null);
  const canvasRef = useRef(null);

  const drawEmblemShard = (ctx, img, x, y, size, rotation, shapeType, wandSeed, scale, cX, cY) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation * Math.PI / 180);

    ctx.beginPath();
    const shardBase = size / 3; 
    
    // Geometry Library: Balanced Curvilinear Masks
    if (shapeType === 'capsule') {
      // Manual capsule drawing for maximum compatibility
      const w = shardBase * 0.8;
      const h = shardBase / 6;
      const r = h / 2;
      ctx.moveTo(shardBase/2 + r, -h/2);
      ctx.arcTo(shardBase/2 + w, -h/2, shardBase/2 + w, h/2, r);
      ctx.arcTo(shardBase/2 + w, h/2, shardBase/2, h/2, r);
      ctx.arcTo(shardBase/2, h/2, shardBase/2, -h/2, r);
      ctx.arcTo(shardBase/2, -h/2, shardBase/2 + w, -h/2, r);
    } else if (shapeType === 'donut') {
      // Ring segment logic
      ctx.arc(0, 0, shardBase * 1.05, -6 * Math.PI / 180, 6 * Math.PI / 180);
      ctx.arc(0, 0, shardBase * 0.85, 6 * Math.PI / 180, -6 * Math.PI / 180, true);
    } else if (shapeType === 'arcPlate') {
      // Wide curved plate for "Badge" feel
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, size / 2.4, -12 * Math.PI / 180, 12 * Math.PI / 180);
    } else if (shapeType === 'circle') {
      ctx.arc(shardBase * 0.8, 0, shardBase / 8, 0, Math.PI * 2);
    } else {
      // Structural Precision Wedge
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, size / 2, -2.5 * Math.PI / 180, 2.5 * Math.PI / 180);
    }
    ctx.closePath();
    ctx.clip();

    ctx.rotate(wandSeed * Math.PI / 180);
    const finalDrawSize = size * scale; 
    
    // Controlled crop placement
    ctx.drawImage(img, (-finalDrawSize / 2) + cX, (-finalDrawSize / 2) + cY, finalDrawSize, finalDrawSize);
    ctx.restore();
  };

  const generateMark = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = 1024;
    const center = size / 2;

    const loadImg = (src) => new Promise((res) => {
      const img = new Image();
      img.onload = () => res(img);
      img.src = src;
    });

    const imgs = await Promise.all(selections.map(s => 
      loadImg(`/logos/${s.name.toLowerCase().replace(/\s+/g, '-')}.png`)
    ));

    const shapePalette = ['capsule', 'donut', 'arcPlate', 'circle', 'wedge'];
    ctx.clearRect(0, 0, size, size);

    // 15 Structured Layers
    for (let l = 0; l < 15; l++) {
      // Alternate high density (texture) and low density (structure)
      const folds = l % 2 === 0 ? [16, 24, 32, 48][Math.floor(Math.random() * 4)] : [6, 8, 12][Math.floor(Math.random() * 3)];
      const layerScale = 0.15 + (Math.random() * 0.85);
      
      // Ring-Level Lock: Keeps it from looking like "Spin Art"
      const layerImg = imgs[Math.floor(Math.random() * imgs.length)];
      const layerShape = shapePalette[Math.floor(Math.random() * shapePalette.length)];
      const layerWand = Math.random() * 360;
      const internalScale = 0.5 + (Math.random() * 0.5);
      
      // The "Fixed Crop" for this specific ring
      const cropX = (Math.random() - 0.5) * (size * 0.3);
      const cropY = (Math.random() - 0.5) * (size * 0.3);

      for (let i = 0; i < folds; i++) {
        drawEmblemShard(
          ctx, 
          layerImg, 
          center, 
          center, 
          size * layerScale, 
          i * (360/folds), 
          layerShape, 
          layerWand, 
          internalScale,
          cropX,
          cropY
        );
      }
    }

    setGeneratedImg(canvas.toDataURL('image/png'));
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', padding: '20px', color: '#FFF', fontFamily: 'monospace' }}>
      <Head><title>EMBLEM_SYNTH_V1.9.6</title></Head>
      <canvas ref={canvasRef} width="1024" height="1024" style={{ display: 'none' }} />
      
      <div style={{ maxWidth: '850px', margin: '0 auto', border: '1px solid #FFF', padding: '25px' }}>
        {!generatedImg ? (
          <>
            <h1 style={{ fontSize: '1.2rem', borderBottom: '1px solid #FFF', paddingBottom: '10px' }}>CURVILINEAR_EMBLEM_SYNTH</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '20px' }}>
              {selections.map((s, i) => (
                <button key={i} onClick={() => setActiveSlot(i)} style={{ height: '90px', background: s?.color || '#111', border: '1px solid #FFF', color: '#FFF', cursor: 'pointer', fontWeight: 'bold' }}>
                  {s ? s.code : `SLOT_0${i+1}`}
                </button>
              ))}
            </div>
            <button onClick={generateMark} disabled={selections.includes(null)} style={{ width: '100%', marginTop: '20px', padding: '30px', background: '#FFF', color: '#000', fontWeight: '900', cursor: 'pointer', fontSize: '1.1rem' }}>
              GENERATE_EMBLEM
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <img src={generatedImg} style={{ width: '100%', border: '1px solid #FFF' }} />
            <button onClick={() => setGeneratedImg(null)} style={{ marginTop: '20px', padding: '15px 40px', background: '#FFF', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>REITERATE</button>
          </div>
        )}
      </div>

      {activeSlot !== null && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 100, padding: '30px', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '15px' }}>
            {countries.map(c => (
              <div key={c.code} onClick={() => { const n = [...selections]; n[activeSlot] = c; setSelections(n); setActiveSlot(null); }} style={{ background: c.color, padding: '20px', cursor: 'pointer', border: '1px solid #FFF', textAlign: 'center' }}>
                {c.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}