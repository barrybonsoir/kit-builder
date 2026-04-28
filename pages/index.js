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

  // Advanced Masking Logic: Supports Wedge, Circle, and Slant (Parallelogram)
  const drawComplexMask = (ctx, img, x, y, size, rotation, maskType, wandSeed) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation * Math.PI / 180);

    ctx.beginPath();
    if (maskType === 'circle') {
      ctx.arc(size / 4, 0, size / 4, 0, Math.PI * 2);
    } else if (maskType === 'slant') {
      ctx.moveTo(0, -size / 4);
      ctx.lineTo(size / 2, -size / 2);
      ctx.lineTo(size / 2, size / 2);
      ctx.lineTo(0, size / 4);
    } else {
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, size / 2, -22.5 * Math.PI / 180, 22.5 * Math.PI / 180);
    }
    ctx.closePath();
    ctx.clip();

    // Internal Wand Seed + Random XY Slide (The "Shattered Mirror" effect)
    const offsetX = (Math.random() - 0.5) * (size / 2);
    const offsetY = (Math.random() - 0.5) * (size / 2);
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

    const getRandomLogo = () => imgs[Math.floor(Math.random() * imgs.length)];

    ctx.clearRect(0, 0, size, size);

    // LAYER 1: The Outer Turbine (8-fold Slants)
    const wand1 = Math.random() * 360;
    for (let i = 0; i < 8; i++) {
      drawComplexMask(ctx, getRandomLogo(), center, center, size * 0.95, i * 45, 'slant', wand1);
    }

    // LAYER 2: Randomized Sticker Chaos
    for (let i = 0; i < 6; i++) {
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate((i * 60 + (Math.random() * 30)) * Math.PI / 180);
      ctx.translate(size * 0.22, 0);
      const s = size * (0.35 + Math.random() * 0.25);
      ctx.rotate(Math.random() * 360 * Math.PI / 180);
      ctx.drawImage(getRandomLogo(), -s / 2, -s / 2, s, s);
      ctx.restore();
    }

    // LAYER 3: The Intricate Core (16-fold Circles)
    const wand3 = Math.random() * 360;
    for (let i = 0; i < 16; i++) {
      drawComplexMask(ctx, getRandomLogo(), center, center, size * 0.45, i * 22.5, 'circle', wand3 + (i * 15));
    }

    setGeneratedImg(canvas.toDataURL('image/png'));
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', padding: '20px', color: '#FFF', fontFamily: 'monospace' }}>
      <Head><title>BRAND_SYNTH_2026</title></Head>
      <canvas ref={canvasRef} width="1024" height="1024" style={{ display: 'none' }} />
      
      <div style={{ maxWidth: '800px', margin: '0 auto', border: '2px solid #FFF', padding: '30px' }}>
        {!generatedImg ? (
          <>
            <h1 style={{ fontSize: '2rem', letterSpacing: '-1px', marginBottom: '30px' }}>GEOMETRIC_SYNTH_V13</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {selections.map((s, i) => (
                <button key={i} onClick={() => setActiveSlot(i)} style={{ height: '100px', background: s?.color || '#111', border: '1px solid #FFF', color: '#FFF', cursor: 'pointer', fontSize: '1.1rem' }}>
                  {s ? s.code : `[ SOURCE_0${i+1} ]`}
                </button>
              ))}
            </div>
            <button onClick={generateMark} disabled={selections.includes(null)} style={{ width: '100%', marginTop: '30px', padding: '20px', background: '#FFF', color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.3rem' }}>
              GENERATE_MANDALA
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <img src={generatedImg} style={{ width: '100%', maxWidth: '600px', border: '2px solid #FFF' }} />
            <br />
            <button onClick={() => setGeneratedImg(null)} style={{ marginTop: '20px', padding: '15px 30px', background: '#FFF', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>NEW_REITERATION</button>
          </div>
        )}
      </div>

      {activeSlot !== null && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 100, padding: '40px', overflowY: 'auto', border: '10px solid #FFF' }}>
          <button onClick={() => setActiveSlot(null)} style={{ float: 'right', color: '#000', background: '#FFF', border: 'none', padding: '10px 20px', fontWeight: 'bold' }}>X</button>
          <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>LOAD_COUNTRY_DATA</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
            {countries.map(c => (
              <div key={c.code} onClick={() => { const n = [...selections]; n[activeSlot] = c; setSelections(n); setActiveSlot(null); }} style={{ background: c.color, padding: '15px', cursor: 'pointer', border: '1px solid #FFF', textAlign: 'center', fontWeight: 'bold' }}>
                {c.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}