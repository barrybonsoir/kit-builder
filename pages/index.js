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
    const shardBase = size / 2.8; 
    
    // Geometry Library: High-End Curvilinear Masks
    if (shapeType === 'shield') {
      ctx.moveTo(shardBase * 0.5, -shardBase / 3.5);
      ctx.lineTo(shardBase * 1.3, -shardBase / 3.5);
      ctx.quadraticCurveTo(shardBase * 1.45, 0, shardBase * 1.3, shardBase / 3.5);
      ctx.lineTo(shardBase * 0.5, shardBase / 3.5);
      ctx.quadraticCurveTo(shardBase * 0.35, 0, shardBase * 0.5, -shardBase / 3.5);
    } else if (shapeType === 'arcRing') {
      // Clean circular segments with generous negative space gaps
      ctx.arc(0, 0, shardBase * 1.25, -7 * Math.PI / 180, 7 * Math.PI / 180);
      ctx.arc(0, 0, shardBase * 1.0, 7 * Math.PI / 180, -7 * Math.PI / 180, true);
    } else if (shapeType === 'teardrop') {
      ctx.moveTo(shardBase * 0.4, 0);
      ctx.bezierCurveTo(shardBase * 0.8, -shardBase / 2, shardBase * 1.6, -shardBase / 4, shardBase * 1.6, 0);
      ctx.bezierCurveTo(shardBase * 1.6, shardBase / 4, shardBase * 0.8, shardBase / 2, shardBase * 0.4, 0);
    } else {
      // Minimalist wedge for structural support
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, size / 2.1, -2 * Math.PI / 180, 2 * Math.PI / 180);
    }
    ctx.closePath();
    ctx.clip();

    ctx.rotate(wandSeed * Math.PI / 180);
    const finalDrawSize = size * scale; 
    ctx.drawImage(img, (-finalDrawSize / 2) + cX, (-finalDrawSize / 2) + cY, finalDrawSize, finalDrawSize);
    ctx.restore();
  };

  const generateMark = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = 1024;
    const center = size / 2;

    const loadImg = (src) => new Promise((res) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => res(img);
      img.src = src;
    });

    try {
      const imgs = await Promise.all(selections.map(s => 
        loadImg(`/logos/${s.name.toLowerCase().replace(/\s+/g, '-')}.png`)
      ));

      const shapePalette = ['shield', 'arcRing', 'teardrop', 'wedge'];
      ctx.clearRect(0, 0, size, size);

      // Layer Logic: 8-10 layers to maximize negative space
      for (let l = 0; l < 10; l++) {
        // Alternating structural symmetry (6, 8, 12, 16 folds)
        const folds = [6, 8, 12, 16][Math.floor(Math.random() * 4)];
        const layerScale = 0.2 + (l * 0.075);
        
        // Lock selections per ring for "Emblem" consistency
        const layerImg = imgs[Math.floor(Math.random() * imgs.length)];
        const layerShape = shapePalette[Math.floor(Math.random() * shapePalette.length)];
        const layerWand = Math.random() * 360;
        
        // Specific "Logo Cut" for this ring
        const cropX = (Math.random() - 0.5) * (size * 0.35);
        const cropY = (Math.random() - 0.5) * (size * 0.35);

        for (let i = 0; i < folds; i++) {
          drawEmblemShard(ctx, layerImg, center, center, size * layerScale, i * (360/folds), layerShape, layerWand, 0.85, cropX, cropY);
        }
      }

      setGeneratedImg(canvas.toDataURL('image/png'));
    } catch (e) {
      console.error("Synthesis failed:", e);
    }
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', padding: '20px', color: '#FFF', fontFamily: 'monospace' }}>
      <Head><title>EMBLEM_SYNTH_V1.9.8</title></Head>
      <canvas ref={canvasRef} width="1024" height="1024" style={{ display: 'none' }} />
      
      <div style={{ maxWidth: '850px', margin: '0 auto', border: '1px solid #FFF', padding: '25px' }}>
        {!generatedImg ? (
          <>
            <h1 style={{ fontSize: '1.1rem', letterSpacing: '1px', borderBottom: '1px solid #FFF', paddingBottom: '10px' }}>SHIELD_ARC_SYNTHESIS</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '20px' }}>
              {selections.map((s, i) => (
                <button key={i} onClick={() => setActiveSlot(i)} style={{ height: '90px', background: s?.color || '#111', border: '1px solid #FFF', color: '#FFF', cursor: 'pointer', fontWeight: 'bold' }}>
                  {s ? s.code : `SLOT_0${i+1}`}
                </button>
              ))}
            </div>
            <button onClick={generateMark} disabled={selections.includes(null)} style={{ width: '100%', marginTop: '20px', padding: '30px', background: '#FFF', color: '#000', fontWeight: '900', cursor: 'pointer', fontSize: '1rem' }}>
              INITIALIZE_BUILD
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
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