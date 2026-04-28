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
  const [isBuilding, setIsBuilding] = useState(false);
  const canvasRef = useRef(null);

  const drawMandalaShard = (ctx, img, x, y, size, rotation, shapeType, wandSeed, scale, cX, cY) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.beginPath();
    
    const s = size / 2;
    // ROUNDED SHAPES: Pivoting from sharp wedges to flower-like petals
    if (shapeType === 'petal') {
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(s * 0.5, -s * 0.5, s * 1.5, -s * 0.2, s, 0);
      ctx.bezierCurveTo(s * 1.5, s * 0.2, s * 0.5, s * 0.5, 0, 0);
    } else if (shapeType === 'hex') {
      for (let i = 0; i < 6; i++) {
        const angle = (i * 60) * Math.PI / 180;
        ctx.lineTo(s * 0.8 * Math.cos(angle), s * 0.8 * Math.sin(angle));
      }
    } else if (shapeType === 'shield') {
      ctx.moveTo(s * 0.2, -s * 0.3);
      ctx.lineTo(s, -s * 0.3);
      ctx.quadraticCurveTo(s * 1.2, 0, s, s * 0.3);
      ctx.lineTo(s * 0.2, s * 0.3);
      ctx.closePath();
    } else {
      ctx.arc(0, 0, s * 0.8, 0, Math.PI * 2);
    }
    
    ctx.closePath();
    ctx.clip();
    ctx.rotate(wandSeed * Math.PI / 180);
    const finalSize = size * scale;
    ctx.drawImage(img, (-finalSize / 2) + cX, (-finalSize / 2) + cY, finalSize, finalSize);
    ctx.restore();
  };

  const generateMark = async () => {
    setIsBuilding(true);
    const canvas = canvasRef.current;
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

      ctx.clearRect(0, 0, size, size);

      // 12-LAYER SOCCER-FLOWER HIERARCHY
      for (let l = 0; l < 12; l++) {
        let folds, layerScale, layerShape, wandSeed, offsetRadius;
        const layerImg = imgs[l % 4];

        // ZONE 1: THE CORE (Hexagonal Pentagons)
        if (l < 4) {
          folds = [5, 6][l % 2]; // Evoking soccer ball panels
          layerScale = 0.3 + (l * 0.05);
          layerShape = 'hex';
          wandSeed = Math.random() * 360;
          offsetRadius = 0; // Locked center
        }
        // ZONE 2: HERO PETALS (Bloom Mid-ground)
        else if (l < 8) {
          folds = [6, 8][Math.floor(Math.random() * 2)];
          layerScale = 0.55;
          layerShape = 'shield';
          wandSeed = 0; // Upright for branding legibility
          offsetRadius = size * 0.14; 
        }
        // ZONE 3: OUTER REVEAL (Aired-out finish)
        else {
          folds = [12, 16, 20][Math.floor(Math.random() * 3)];
          layerScale = 0.2 + (Math.random() * 0.5);
          layerShape = 'petal';
          wandSeed = Math.random() * 360;
          // Capped offset to ensure it stays in the box
          offsetRadius = size * 0.32; 
        }

        const cropX = (Math.random() - 0.5) * (size * 0.2);
        const cropY = (Math.random() - 0.5) * (size * 0.2);
        const ringRotation = (l * 15); // Progressive rotation for depth

        for (let i = 0; i < folds; i++) {
          const angle = (i * (360 / folds) + ringRotation) * Math.PI / 180;
          const bloomX = center + offsetRadius * Math.cos(angle);
          const bloomY = center + offsetRadius * Math.sin(angle);

          drawMandalaShard(ctx, layerImg, bloomX, bloomY, size * layerScale, i * (360/folds), layerShape, wandSeed, 1.0, cropX, cropY);
        }
      }

      setGeneratedImg(canvas.toDataURL('image/png'));
    } catch (e) {
      console.error("BUILD_ERR:", e);
    } finally {
      setIsBuilding(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', padding: '20px', color: '#FFF', fontFamily: 'monospace' }}>
      <Head><title>SOCCER_BLOOM_v2.2.5</title></Head>
      <canvas ref={canvasRef} width="1024" height="1024" style={{ display: 'none' }} />
      <div style={{ maxWidth: '850px', margin: '0 auto', border: '1px solid #FFF', padding: '25px' }}>
        {!generatedImg ? (
          <>
            <h1 style={{ fontSize: '1.2rem', letterSpacing: '2px', borderBottom: '1px solid #FFF', paddingBottom: '10px' }}>SOCCER_BLOOM_SYNTHESIS</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '20px' }}>
              {selections.map((s, i) => (
                <button key={i} onClick={() => setActiveSlot(i)} style={{ height: '90px', background: s?.color || '#111', border: '1px solid #FFF', color: '#FFF', cursor: 'pointer', fontWeight: 'bold' }}>
                  {s ? s.code : `SLOT_0${i+1}`}
                </button>
              ))}
            </div>
            <button onClick={generateMark} disabled={selections.includes(null) || isBuilding} style={{ width: '100%', marginTop: '20px', padding: '30px', background: '#FFF', color: '#000', fontWeight: '900', cursor: 'pointer', fontSize: '1.1rem' }}>
              {isBuilding ? 'LOCKING_SYMMETRY...' : 'INITIATE_BLOOM'}
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <img src={generatedImg} style={{ width: '100%', border: '1px solid #FFF' }} alt="Synthesized Asset" />
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setGeneratedImg(null)} style={{ flex: 1, padding: '20px', background: '#FFF', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>RE-MAP</button>
              <button onClick={generateMark} style={{ flex: 1, padding: '20px', border: '1px solid #FFF', background: '#000', color: '#FFF', fontWeight: 'bold', cursor: 'pointer' }}>RE-BLOOM</button>
            </div>
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