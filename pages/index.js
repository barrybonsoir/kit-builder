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

  const drawSymmetricShard = (ctx, img, x, y, size, rotation, shapeType, wandSeed, cropX, cropY) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation * Math.PI / 180);

    ctx.beginPath();
    const shardSize = size / 2.5;
    if (shapeType === 'triangle') {
      ctx.moveTo(0, 0);
      ctx.lineTo(shardSize, -shardSize / 2);
      ctx.lineTo(shardSize, shardSize / 2);
    } else if (shapeType === 'slant') {
      ctx.rect(shardSize / 2, -shardSize / 4, shardSize, shardSize / 2);
    } else if (shapeType === 'circle') {
      ctx.arc(shardSize, 0, shardSize / 3, 0, Math.PI * 2);
    } else {
      // Precise 15-degree Wedge
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, size / 2, -7.5 * Math.PI / 180, 7.5 * Math.PI / 180);
    }
    ctx.closePath();
    ctx.clip();

    // The crop is now PASSED IN to maintain symmetry across the ring
    ctx.rotate(wandSeed * Math.PI / 180);
    ctx.drawImage(img, -size / 2 + cropX, -size / 2 + cropY, size, size);
    
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

    const shapePalette = ['triangle', 'slant', 'circle', 'wedge'];
    ctx.clearRect(0, 0, size, size);

    // INCREASED DEPTH: 8-10 Radial Layers
    const numLayers = 8 + Math.floor(Math.random() * 3);

    for (let layer = 0; layer < numLayers; layer++) {
      const folds = [8, 12, 16, 24, 32][Math.floor(Math.random() * 5)];
      const layerShape = shapePalette[Math.floor(Math.random() * shapePalette.length)];
      const layerScale = 0.2 + (Math.random() * 0.85);
      const layerWand = Math.random() * 360;
      
      // FORCED SYMMETRY: Pick one logo and one crop for the ENTIRE ring
      const layerImg = imgs[Math.floor(Math.random() * 4)];
      const layerCropX = (Math.random() - 0.5) * size;
      const layerCropY = (Math.random() - 0.5) * size;

      for (let i = 0; i < folds; i++) {
        drawSymmetricShard(
          ctx, 
          layerImg, 
          center, center, 
          size * layerScale, 
          i * (360 / folds), 
          layerShape, 
          layerWand, 
          layerCropX, 
          layerCropY
        );
      }
    }

    setGeneratedImg(canvas.toDataURL('image/png'));
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', padding: '20px', color: '#FFF', fontFamily: 'monospace' }}>
      <Head><title>SYMMETRY_FORCE_V1.5</title></Head>
      <canvas ref={canvasRef} width="1024" height="1024" style={{ display: 'none' }} />
      
      <div style={{ maxWidth: '800px', margin: '0 auto', border: '1px solid #FFF', padding: '20px' }}>
        {!generatedImg ? (
          <>
            <h1 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '1px solid #FFF' }}>RADIAL_SYMMETRY_ENGINE</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {selections.map((s, i) => (
                <button key={i} onClick={() => setActiveSlot(i)} style={{ height: '80px', background: s?.color || '#111', border: '1px solid #FFF', color: '#FFF', cursor: 'pointer' }}>
                  {s ? s.code : `CHANNEL_0${i+1}`}
                </button>
              ))}
            </div>
            <button onClick={generateMark} disabled={selections.includes(null)} style={{ width: '100%', marginTop: '20px', padding: '25px', background: '#FFF', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>
              FORCE_SYMMETRY
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <img src={generatedImg} style={{ width: '100%', border: '1px solid #FFF' }} />
            <button onClick={() => setGeneratedImg(null)} style={{ marginTop: '20px', padding: '10px 20px', background: '#FFF', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>REITERATE</button>
          </div>
        )}
      </div>

      {activeSlot !== null && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', z_index: 100, padding: '20px', overflowY: 'auto' }}>
          {countries.map(c => (
            <div key={c.code} onClick={() => { const n = [...selections]; n[activeSlot] = c; setSelections(n); setActiveSlot(null); }} style={{ background: c.color, padding: '15px', margin: '5px 0', cursor: 'pointer', border: '1px solid #FFF', textAlign: 'center' }}>
              {c.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
