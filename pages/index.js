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

  const drawHyperShard = (ctx, img, x, y, size, rotation, shapeType, wandSeed, cropX, cropY) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation * Math.PI / 180);

    ctx.beginPath();
    const shardSize = size / 2.2;
    if (shapeType === 'triangle') {
      ctx.moveTo(0, 0);
      ctx.lineTo(shardSize, -shardSize / 1.5);
      ctx.lineTo(shardSize, shardSize / 1.5);
    } else if (shapeType === 'slant') {
      ctx.rect(shardSize / 3, -shardSize / 6, shardSize * 1.2, shardSize / 3);
    } else if (shapeType === 'circle') {
      ctx.arc(shardSize / 1.2, 0, shardSize / 2.5, 0, Math.PI * 2);
    } else {
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, size / 1.8, -11.25 * Math.PI / 180, 11.25 * Math.PI / 180);
    }
    ctx.closePath();
    ctx.clip();

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

    // DEPTH ARCHITECTURE: 12 Layers of varying centers
    const layers = 12;

    for (let l = 0; l < layers; l++) {
      // Logic for Satellite Centers (Every 3rd layer blooms off-center)
      const isSatellite = l % 3 === 0 && l > 0;
      const bloomX = isSatellite ? center + (Math.random() - 0.5) * 150 : center;
      const bloomY = isSatellite ? center + (Math.random() - 0.5) * 150 : center;

      const folds = [8, 12, 16, 24, 32, 48][Math.floor(Math.random() * 6)];
      const shape = shapePalette[Math.floor(Math.random() * shapePalette.length)];
      const scale = 0.15 + (Math.random() * 0.9);
      const wand = Math.random() * 360;
      
      const layerImg = imgs[Math.floor(Math.random() * 4)];
      const cX = (Math.random() - 0.5) * size;
      const cY = (Math.random() - 0.5) * size;

      for (let i = 0; i < folds; i++) {
        drawHyperShard(ctx, layerImg, bloomX, bloomY, size * scale, i * (360/folds), shape, wand, cX, cY);
      }
    }

    setGeneratedImg(canvas.toDataURL('image/png'));
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', padding: '20px', color: '#FFF', fontFamily: 'monospace' }}>
      <Head><title>PLAYBOOK_SYNTH_V1.6</title></Head>
      <canvas ref={canvasRef} width="1024" height="1024" style={{ display: 'none' }} />
      
      <div style={{ maxWidth: '900px', margin: '0 auto', border: '1px solid #FFF', padding: '25px' }}>
        {!generatedImg ? (
          <>
            <h1 style={{ fontSize: '1.4rem', letterSpacing: '2px', borderBottom: '2px solid #FFF', paddingBottom: '10px' }}>CONCENTRIC_BLOOM_PROTOCOL</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '20px' }}>
              {selections.map((s, i) => (
                <button key={i} onClick={() => setActiveSlot(i)} style={{ height: '100px', background: s?.color || '#111', border: '1px solid #FFF', color: '#FFF', cursor: 'pointer', fontWeight: 'bold' }}>
                  {s ? s.code : `L_0${i+1}`}
                </button>
              ))}
            </div>
            <button onClick={generateMark} disabled={selections.includes(null)} style={{ width: '100%', marginTop: '20px', padding: '30px', background: '#FFF', color: '#000', fontWeight: '900', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
              INITIATE_SYNTHESIS
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <img src={generatedImg} style={{ width: '100%', border: '2px solid #FFF' }} />
            <button onClick={() => setGeneratedImg(null)} style={{ marginTop: '20px', padding: '15px 40px', background: '#FFF', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>REITERATE</button>
          </div>
        )}
      </div>

      {activeSlot !== null && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 100, padding: '30px', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '15px' }}>
            {countries.map(c => (
              <div key={c.code} onClick={() => { const n = [...selections]; n[activeSlot] = c; setSelections(n); setActiveSlot(null); }} style={{ background: c.color, padding: '20px', cursor: 'pointer', border: '1px solid #FFF', textAlign: 'center', fontWeight: 'bold' }}>
                {c.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}