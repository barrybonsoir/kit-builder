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

  const drawShard = (ctx, img, x, y, size, angle, shardAngle, wandSeed, mirror = false) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle * Math.PI / 180);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, size / 2, -shardAngle/2 * Math.PI / 180, shardAngle/2 * Math.PI / 180);
    ctx.closePath();
    ctx.clip();
    if (mirror) ctx.scale(1, -1);
    ctx.rotate(wandSeed * Math.PI / 180);
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
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

    ctx.clearRect(0, 0, size, size);

    // LAYER 1: Logo 1 (8-fold mirrored ring)
    const wand1 = Math.random() * 360;
    for (let i = 0; i < 8; i++) {
      drawShard(ctx, imgs[0], center, center, size * 0.9, i * 45, 45, wand1, i % 2 === 0);
    }

    // LAYER 2: Logo 2 (4-fold stickers with offset rotation)
    const wand2 = Math.random() * 360;
    for (let i = 0; i < 4; i++) {
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate((i * 90 + 45) * Math.PI / 180);
      ctx.translate(size * 0.25, 0);
      ctx.rotate((Math.random() * 30 - 15) * Math.PI / 180);
      const s = size * 0.5;
      ctx.rotate(wand2 * Math.PI / 180);
      ctx.drawImage(imgs[1], -s/2, -s/2, s, s);
      ctx.restore();
    }

    // LAYER 3: Logo 3 & 4 (12-fold interlocking core)
    for (let i = 0; i < 12; i++) {
      const img = i % 2 === 0 ? imgs[2] : imgs[3];
      const wand3 = Math.random() * 360; // Every shard gets a unique "bite"
      drawShard(ctx, img, center, center, size * 0.4, i * 30, 30, wand3, false);
    }

    setGeneratedImg(canvas.toDataURL('image/png'));
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', padding: '20px', color: '#FFF', fontFamily: 'monospace' }}>
      <Head><title>BRAND_SYNTH_V12</title></Head>
      <canvas ref={canvasRef} width="1024" height="1024" style={{ display: 'none' }} />
      
      <div style={{ maxWidth: '800px', margin: '0 auto', border: '4px solid #FFF', padding: '20px' }}>
        {!generatedImg ? (
          <>
            <h1 style={{ fontSize: '2.5rem', borderBottom: '4px solid #FFF', paddingBottom: '10px' }}>SYNTH_PROTOCOL_V12</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
              {selections.map((s, i) => (
                <button key={i} onClick={() => setActiveSlot(i)} style={{ height: '120px', background: s?.color || '#333', border: '2px solid #FFF', color: '#FFF', cursor: 'pointer', fontWeight: 'bold' }}>
                  {s ? s.code : `SLOT_0${i+1}`}
                </button>
              ))}
            </div>
            <button onClick={generateMark} disabled={selections.includes(null)} style={{ width: '100%', marginTop: '20px', padding: '20px', background: '#FFF', color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.2rem' }}>
              COMPILE_ARTEFACT
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <img src={generatedImg} style={{ width: '100%', maxWidth: '500px', border: '4px solid #FFF' }} />
            <br />
            <button onClick={() => setGeneratedImg(null)} style={{ marginTop: '20px', padding: '10px 20px', background: '#FFF', color: '#000', cursor: 'pointer' }}>RESET_SEQUENCE</button>
          </div>
        )}
      </div>

      {activeSlot !== null && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 100, padding: '20px', overflowY: 'auto' }}>
          <button onClick={() => setActiveSlot(null)} style={{ float: 'right', color: '#FFF', background: 'none', border: '1px solid #FFF', padding: '5px 10px' }}>CLOSE</button>
          <h2>SELECT_DATA_SOURCE</h2>
          {countries.map(c => (
            <div key={c.code} onClick={() => { const n = [...selections]; n[activeSlot] = c; setSelections(n); setActiveSlot(null); }} style={{ background: c.color, padding: '15px', margin: '5px 0', cursor: 'pointer', border: '1px solid #FFF' }}>
              {c.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}