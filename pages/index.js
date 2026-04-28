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

  const drawGeometricShard = (ctx, img, x, y, size, rotation, shapeType, wandSeed) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation * Math.PI / 180);

    ctx.beginPath();
    if (shapeType === 'circle') {
      ctx.arc(size / 3.5, 0, size / 4, 0, Math.PI * 2);
    } else if (shapeType === 'slant') {
      ctx.moveTo(0, -size / 4);
      ctx.lineTo(size / 1.8, -size / 2);
      ctx.lineTo(size / 1.8, size / 2);
      ctx.lineTo(0, size / 4);
    } else if (shapeType === 'pill') {
      ctx.roundRect(size / 6, -size / 8, size / 2.5, size / 4, 50);
    } else {
      // Classic Wedge
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, size / 2, -15 * Math.PI / 180, 15 * Math.PI / 180);
    }
    ctx.closePath();
    ctx.clip();

    // The "Slide" logic: Random crop location within the source
    const offsetX = (Math.random() - 0.5) * (size / 1.5);
    const offsetY = (Math.random() - 0.5) * (size / 1.5);
    ctx.rotate(wandSeed * Math.PI / 180);
    ctx.drawImage(img, -size / 2 + offsetX, -size / 2 + offsetY, size, size);
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

    const getRandomLogo = () => imgs[Math.floor(Math.random() * 4)];
    const shapes = ['circle', 'slant', 'pill', 'wedge'];

    ctx.clearRect(0, 0, size, size);

    // DEPTH RANDOMIZATION: We define 4 "Task Blocks" and shuffle their execution order
    const tasks = [
      // Task A: Large Perimeter Symmetry (8-12 fold)
      () => {
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const wand = Math.random() * 360;
        const folds = 8 + Math.floor(Math.random() * 4);
        for (let i = 0; i < folds; i++) {
          drawGeometricShard(ctx, getRandomLogo(), center, center, size * 0.9, i * (360/folds), shape, wand);
        }
      },
      // Task B: Fractal Ring (High frequency 16-24 fold)
      () => {
        const wand = Math.random() * 360;
        const folds = 16 + Math.floor(Math.random() * 8);
        for (let i = 0; i < folds; i++) {
          drawGeometricShard(ctx, getRandomLogo(), center, center, size * 0.5, i * (360/folds), 'circle', wand + (i * 5));
        }
      },
      // Task C: Sticker Bomb (Accented Chaos)
      () => {
        for (let i = 0; i < 5; i++) {
          ctx.save();
          ctx.translate(center, center);
          ctx.rotate(Math.random() * 360 * Math.PI / 180);
          ctx.translate(size * (0.1 + Math.random() * 0.2), 0);
          const s = size * (0.3 + Math.random() * 0.3);
          ctx.rotate(Math.random() * 360 * Math.PI / 180);
          ctx.drawImage(getRandomLogo(), -s/2, -s/2, s, s);
          ctx.restore();
        }
      },
      // Task D: The "Turbine" Core (Slants)
      () => {
        const wand = Math.random() * 360;
        for (let i = 0; i < 6; i++) {
          drawGeometricShard(ctx, getRandomLogo(), center, center, size * 0.4, i * 60, 'slant', wand);
        }
      }
    ];

    // Shuffle the tasks to change Z-index every time
    tasks.sort(() => Math.random() - 0.5).forEach(task => task());

    setGeneratedImg(canvas.toDataURL('image/png'));
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', padding: '20px', color: '#FFF', fontFamily: 'monospace' }}>
      <Head><title>BRAND_SYNTH_V1.4</title></Head>
      <canvas ref={canvasRef} width="1024" height="1024" style={{ display: 'none' }} />
      
      <div style={{ maxWidth: '800px', margin: '0 auto', border: '1px solid #FFF', padding: '20px' }}>
        {!generatedImg ? (
          <>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '20px' }}>Non-Generative_Multi-Radial_Art_Logic</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {selections.map((s, i) => (
                <button key={i} onClick={() => setActiveSlot(i)} style={{ height: '80px', background: s?.color || '#111', border: '1px solid #444', color: '#FFF', cursor: 'pointer' }}>
                  {s ? s.code : `ASSET_0${i+1}`}
                </button>
              ))}
            </div>
            <button 
              onClick={generateMark} 
              disabled={selections.includes(null)} 
              style={{ width: '100%', marginTop: '20px', padding: '25px', background: '#FFF', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
            >
              EXECUTE_REITERATION
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <img src={generatedImg} style={{ width: '100%', maxWidth: '600px', border: '1px solid #FFF' }} />
            <div style={{ marginTop: '20px' }}>
              <button onClick={() => setGeneratedImg(null)} style={{ background: '#FFF', padding: '10px 20px', color: '#000', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>RE-RUN_PROTOCOL</button>
            </div>
          </div>
        )}
      </div>

      {activeSlot !== null && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 100, padding: '20px', overflowY: 'auto' }}>
          <h2 style={{ borderBottom: '1px solid #FFF', paddingBottom: '10px' }}>SELECT_SOURCE</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px' }}>
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