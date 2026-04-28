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

  const drawEmblemShard = (ctx, img, x, y, size, rotation, shapeType, wandSeed, scale, cX, cY) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation * Math.PI / 180);

    ctx.beginPath();
    const shardBase = size / 2.8; 
    
    if (shapeType === 'shield') {
      ctx.moveTo(shardBase * 0.5, -shardBase / 3.5);
      ctx.lineTo(shardBase * 1.3, -shardBase / 3.5);
      ctx.quadraticCurveTo(shardBase * 1.45, 0, shardBase * 1.3, shardBase / 3.5);
      ctx.lineTo(shardBase * 0.5, shardBase / 3.5);
      ctx.quadraticCurveTo(shardBase * 0.35, 0, shardBase * 0.5, -shardBase / 3.5);
    } else if (shapeType === 'tightRing') {
      // Pinning the foundation to the inside
      ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
      ctx.arc(0, 0, size * 0.05, 0, Math.PI * 2, true);
    } else if (shapeType === 'arcRing') {
      ctx.arc(0, 0, shardBase * 1.25, -15 * Math.PI / 180, 15 * Math.PI / 180);
      ctx.arc(0, 0, shardBase * 0.8, 15 * Math.PI / 180, -15 * Math.PI / 180, true);
    } else {
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, size / 1.8, -8 * Math.PI / 180, 8 * Math.PI / 180);
    }
    ctx.closePath();
    ctx.clip();

    ctx.rotate(wandSeed * Math.PI / 180);
    const finalDrawSize = size * scale; 
    ctx.drawImage(img, (-finalDrawSize / 2) + cX, (-finalDrawSize / 2) + cY, finalDrawSize, finalDrawSize);
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

      // 1. TIGHT INNER NUCLEUS (Bottom 4)
      for (let l = 0; l < 4; l++) {
        drawEmblemShard(ctx, imgs[l], center, center, size, l * 90, 'tightRing', Math.random() * 360, 0.4, 0, 0);
      }

      // 2. ACTUAL LOGO LAYERS (Middle 4 - High Legibility)
      for (let l = 0; l < 4; l++) {
        const folds = [4, 6][Math.floor(Math.random() * 2)];
        const scale = 0.6 + (Math.random() * 0.2);
        for (let i = 0; i < folds; i++) {
          // Low rotation/crop to keep these "Rules"
          drawEmblemShard(ctx, imgs[l], center, center, size * 0.8, i * (360/folds), 'shield', 0, scale, 0, 0);
        }
      }

      // 3. SHARD & SHAPE LAYERS (Top 6 - The Grit)
      for (let l = 0; l < 6; l++) {
        const folds = [12, 16, 24, 32][Math.floor(Math.random() * 4)];
        const shape = ['arcRing', 'wedge', 'shield'][Math.floor(Math.random() * 3)];
        const scale = 0.15 + (Math.random() * 0.9);
        const cX = (Math.random() - 0.5) * size;
        const cY = (Math.random() - 0.5) * size;

        for (let i = 0; i < folds; i++) {
          drawEmblemShard(ctx, imgs[Math.floor(Math.random() * 4)], center, center, size, i * (360/folds), shape, Math.random() * 360, scale, cX, cY);
        }
      }

      setGeneratedImg(canvas.toDataURL('image/png'));
    } catch (e) {
      console.error("BUILD_FAILURE:", e);
    } finally {
      setIsBuilding(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', padding: '20px', color: '#FFF', fontFamily: 'monospace' }}>
      <Head><title>BRAND_PLAYBOOK_V2.2.1</title></Head>
      <canvas ref={canvasRef} width="1024" height="1024" style={{ display: 'none' }} />
      
      <div style={{ maxWidth: '850px', margin: '0 auto', border: '1px solid #FFF', padding: '25px' }}>
        {!generatedImg ? (
          <>
            <h1 style={{ fontSize: '1.2rem', letterSpacing: '2px', borderBottom: '1px solid #FFF', paddingBottom: '10px' }}>NUCLEUS_SYNTH_PRO</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '20px' }}>
              {selections.map((s, i) => (
                <button key={i} onClick={() => setActiveSlot(i)} style={{ height: '90px', background: s?.color || '#111', border: '1px solid #FFF', color: '#FFF', cursor: 'pointer', fontWeight: 'bold' }}>
                  {s ? s.code : `SLOT_0${i+1}`}
                </button>
              ))}
            </div>
            <button onClick={generateMark} disabled={selections.includes(null) || isBuilding} style={{ width: '100%', marginTop: '20px', padding: '30px', background: '#FFF', color: '#000', fontWeight: '900', cursor: 'pointer', fontSize: '1.1rem' }}>
              {isBuilding ? 'LOCKING_NUCLEUS...' : 'INITIATE_BLOOM'}
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <img src={generatedImg} style={{ width: '100%', border: '1px solid #FFF' }} alt="Generated Asset" />
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setGeneratedImg(null)} style={{ flex: 1, padding: '20px', background: '#FFF', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>RESET</button>
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