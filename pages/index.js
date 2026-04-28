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
    const shardBase = size / 2.5; 
    
    // Strict geometric masks for the kaleidoscope effect
    if (shapeType === 'shield') {
      ctx.moveTo(shardBase * 0.4, -shardBase / 4);
      ctx.lineTo(shardBase * 1.2, -shardBase / 4);
      ctx.quadraticCurveTo(shardBase * 1.4, 0, shardBase * 1.2, shardBase / 4);
      ctx.lineTo(shardBase * 0.4, shardBase / 4);
      ctx.quadraticCurveTo(shardBase * 0.3, 0, shardBase * 0.4, -shardBase / 4);
    } else if (shapeType === 'tightRing') {
      ctx.arc(0, 0, size * 0.12, 0, Math.PI * 2);
      ctx.arc(0, 0, size * 0.04, 0, Math.PI * 2, true);
    } else if (shapeType === 'arc') {
      ctx.arc(0, 0, shardBase * 1.1, -12 * Math.PI / 180, 12 * Math.PI / 180);
      ctx.arc(0, 0, shardBase * 0.7, 12 * Math.PI / 180, -12 * Math.PI / 180, true);
    } else {
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, size / 2, -10 * Math.PI / 180, 10 * Math.PI / 180);
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

      // MANDALA HIERARCHY: 14 strict symmetrical layers

      // 1. DENSE CORE (Inner Nucleus)
      for (let l = 0; l < 4; l++) {
        drawMandalaShard(ctx, imgs[l], center, center, size, l * 90, 'tightRing', Math.random() * 360, 0.35, 0, 0);
      }

      // 2. HERO REVEAL (The Actual Logos)
      for (let l = 0; l < 4; l++) {
        const folds = [6, 8][Math.floor(Math.random() * 2)];
        const scale = 0.5 + (Math.random() * 0.2);
        for (let i = 0; i < folds; i++) {
          // Locked Wand at 0 for maximum legibility of the "badge"
          drawMandalaShard(ctx, imgs[l], center, center, size * 0.85, i * (360/folds), 'shield', 0, scale, 0, 0);
        }
      }

      // 3. KALEIDOSCOPE DETAIL (Surface Shards)
      for (let l = 0; l < 6; l++) {
        const folds = [16, 24, 32][Math.floor(Math.random() * 3)];
        const shape = ['arc', 'wedge'][Math.floor(Math.random() * 2)];
        const scale = 0.2 + (Math.random() * 0.7);
        const wand = Math.random() * 360;
        const cX = (Math.random() - 0.5) * (size * 0.8);
        const cY = (Math.random() - 0.5) * (size * 0.8);

        for (let i = 0; i < folds; i++) {
          drawMandalaShard(ctx, imgs[Math.floor(Math.random() * 4)], center, center, size, i * (360/folds), shape, wand, scale, cX, cY);
        }
      }

      setGeneratedImg(canvas.toDataURL('image/png'));
    } catch (e) {
      console.error("SYNTHESIS_ERROR:", e);
    } finally {
      setIsBuilding(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', padding: '20px', color: '#FFF', fontFamily: 'monospace' }}>
      <Head><title>KALEIDO_SYNTH_V2.2.2</title></Head>
      <canvas ref={canvasRef} width="1024" height="1024" style={{ display: 'none' }} />
      
      <div style={{ maxWidth: '850px', margin: '0 auto', border: '1px solid #FFF', padding: '25px' }}>
        {!generatedImg ? (
          <>
            <h1 style={{ fontSize: '1.2rem', letterSpacing: '2px', borderBottom: '1px solid #FFF', paddingBottom: '10px' }}>SYMMETRY_MANDALA_PROTOCOL</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '20px' }}>
              {selections.map((s, i) => (
                <button key={i} onClick={() => setActiveSlot(i)} style={{ height: '90px', background: s?.color || '#111', border: '1px solid #FFF', color: '#FFF', cursor: 'pointer', fontWeight: 'bold' }}>
                  {s ? s.code : `SLOT_0${i+1}`}
                </button>
              ))}
            </div>
            <button onClick={generateMark} disabled={selections.includes(null) || isBuilding} style={{ width: '100%', marginTop: '20px', padding: '30px', background: '#FFF', color: '#000', fontWeight: '900', cursor: 'pointer', fontSize: '1.1rem' }}>
              {isBuilding ? 'LOCKING_SYMMETRY...' : 'INITIATE_KALEIDOSCOPE'}
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <img src={generatedImg} style={{ width: '100%', border: '1px solid #FFF' }} alt="Generated Asset" />
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setGeneratedImg(null)} style={{ flex: 1, padding: '20px', background: '#FFF', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>REITERATE</button>
              <button onClick={generateMark} style={{ flex: 1, padding: '20px', border: '1px solid #FFF', background: '#000', color: '#FFF', fontWeight: 'bold', cursor: 'pointer' }}>REMIX</button>
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