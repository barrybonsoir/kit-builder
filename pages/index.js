import React, { useState, useRef } from 'react';
import Head from 'next/head';

const countries = [
  { name: "Algeria", code: "ALG", color: "#006233" }, { name: "Argentina", code: "ARG", color: "#74ACDF" },
  { name: "Australia", code: "AUS", color: "#00008B" }, { name: "Austria", code: "AUT", color: "#ED2939" },
  { name: "Belgium", code: "BEL", color: "#EF3340" }, { name: "Brazil", code: "BRA", color: "#009739" },
  { name: "Canada", code: "CAN", color: "#FF0000" }, { name: "Colombia", code: "COL", color: "#FCD1 yellow" },
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

  // V1.7: Wreckage Drawing Engine
  const drawWreckageShard = (ctx, img, x, y, size, rotation, shapeType, wandSeed) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation * Math.PI / 180);

    ctx.beginPath();
    // Use smaller, sharper shard masks for "shattered" look
    const shardSize = size / (3 + Math.random() * 2);
    if (shapeType === 'triangle') {
      ctx.moveTo(0, 0);
      ctx.lineTo(shardSize, -shardSize); // Sharp, aggressive point
      ctx.lineTo(shardSize, shardSize);
    } else if (shapeType === 'slant') {
      ctx.rect(shardSize / 2, -shardSize / 4, shardSize * 1.5, shardSize / 3);
    } else if (shapeType === 'pill') {
      ctx.roundRect(shardSize / 2, -shardSize / 8, shardSize, size / 4, 30);
    } else {
      // Precise 22.5-degree Wedge (for density)
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, size / 1.5, -11.25 * Math.PI / 180, 11.25 * Math.PI / 180);
    }
    ctx.closePath();
    ctx.clip();

    // 1. Hyper-Slide: Extreme crop, non-central
    const cropX = (Math.random() - 0.5) * size * 1.2;
    const cropY = (Math.random() - 0.5) * size * 1.2;
    
    // 2. Variable Rotation: internal element spin
    ctx.rotate(wandSeed * Math.PI / 180);
    
    // 3. Mirroring: 50% chance to flip texture
    if (Math.random() > 0.5) ctx.scale(-1, 1);
    
    ctx.drawImage(img, -size/2 + cropX, -size/2 + cropY, size, size);
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

    // LOAD THE 4 SELECTED IMAGES
    const imgs = await Promise.all(selections.map(s => 
      loadImg(`/logos/${s.name.toLowerCase().replace(/\s+/g, '-')}.png`)
    ));

    const getRandomLogo = () => imgs[Math.floor(Math.random() * imgs.length)];
    const shapePalette = ['triangle', 'slant', 'pill', 'wedge'];

    // Define background for non-generative feel
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, size, size);

    // DEPTH RANDOMIZATION SHUFFLE
    const taskSequence = [
      // 0: Deep Micro-Core (16-24 fold, intense density)
      () => {
        const shape = shapePalette[Math.floor(Math.random() * shapePalette.length)];
        const folds = 16 + Math.floor(Math.random() * 8);
        const wand = Math.random() * 360;
        for (let i = 0; i < folds; i++) {
          drawWreckageShard(ctx, getRandomLogo(), center, center, size * 0.45, i * (360/folds), shape, wand);
        }
      },
      // 1: Medium Ring (Prime Symmetry 7 or 13, sync breaker)
      () => {
        const shape = shapePalette[Math.floor(Math.random() * shapePalette.length)];
        const folds = Math.random() > 0.5 ? 7 : 13;
        for (let i = 0; i < folds; i++) {
          const wand = Math.random() * 360; // unique internal spin per shard
          drawWreckageShard(ctx, getRandomLogo(), center, center, size * 0.7, i * (360/folds), shape, wand);
        }
      },
      // 2: Large Turbine (8-10 fold, structural edge)
      () => {
        const wand = Math.random() * 360;
        const folds = 8 + Math.floor(Math.random() * 2);
        for (let i = 0; i < folds; i++) {
          drawWreckageShard(ctx, getRandomLogo(), center, center, size * 0.95, i * (360/folds), 'slant', wand);
        }
      },
      // 3: Sticker Bomb Drift (Breaking the grid)
      () => {
        for (let i = 0; i < 4; i++) {
          ctx.save();
          ctx.translate(center, center);
          ctx.rotate(Math.random() * 360 * Math.PI / 180);
          ctx.translate(size * (0.1 + Math.random() * 0.15), 0);
          const s = size * (0.35 + Math.random() * 0.35);
          ctx.rotate(Math.random() * 360 * Math.PI / 180);
          ctx.drawImage(getRandomLogo(), -s/2, -s/2, s, s);
          ctx.restore();
        }
      }
    ];

    // Shuffle the execution order to define depth (Z-Index Chaos)
    taskSequence.sort(() => Math.random() - 0.5).forEach(task => task());

    setGeneratedImg(canvas.toDataURL('image/png'));
  };

  return (
    <div style={{ backgroundColor: '#111', minHeight: '100vh', padding: '20px', color: '#FFF', fontFamily: 'monospace' }}>
      <Head><title>PLAYBOOK_SYNTH_2026</title></Head>
      <canvas ref={canvasRef} width="1024" height="1024" style={{ display: 'none' }} />
      
      <div style={{ maxWidth: '800px', margin: '0 auto', border: '2px solid #FFF', padding: '20px' }}>
        {!generatedImg ? (
          <>
            <h1 style={{ fontSize: '1.2rem', marginBottom: '20px', textTransform: 'uppercase', borderBottom: '1px solid #FFF', paddingBottom: '10px' }}>Wreckage_Synthesis_Protocol</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {selections.map((s, i) => (
                <button key={i} onClick={() => setActiveSlot(i)} style={{ height: '70px', background: s?.color || '#333', border: '1px solid #FFF', color: '#FFF', cursor: 'pointer', fontWeight: 'bold' }}>
                  {s ? s.code : `SLOT_0${i+1}`}
                </button>
              ))}
            </div>
            <button 
              onClick={generateMark} 
              disabled={selections.includes(null)} 
              style={{ width: '100%', marginTop: '20px', padding: '25px', background: '#FFF', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              EXECUTE_REITERATION
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <img src={generatedImg} style={{ width: '100%', border: '1px solid #FFF', maxWidth: '600px' }} />
            <div style={{ marginTop: '20px' }}>
              <button onClick={() => setGeneratedImg(null)} style={{ padding: '10px 20px', background: '#FFF', color: '#000', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>RE-RUN_PROTOCOL</button>
            </div>
          </div>
        )}
      </div>

      {activeSlot !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 100, padding: '20px', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
            {countries.map(c => (
              <div key={c.code} onClick={() => { const n = [...selections]; n[activeSlot] = c; setSelections(n); setActiveSlot(null); }} style={{ background: c.color, padding: '15px', cursor: 'pointer', border: '1px solid #FFF', fontSize: '0.8rem', textAlign: 'center' }}>
                {c.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}