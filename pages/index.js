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

  const drawShatteredShard = (ctx, img, x, y, size, rotation, shapeType, wandSeed, internalScale) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation * Math.PI / 180);

    ctx.beginPath();
    // Thinner bases to force more negative space
    const shardBase = size / 3.2; 
    
    if (shapeType === 'triangle') {
      ctx.moveTo(0, 0);
      ctx.lineTo(shardBase, -shardBase / 5); 
      ctx.lineTo(shardBase, shardBase / 5);
    } else if (shapeType === 'slant') {
      ctx.rect(shardBase / 2, -shardBase / 15, shardBase * 0.6, shardBase / 12);
    } else if (shapeType === 'circle') {
      ctx.arc(shardBase * 0.7, 0, shardBase / 8, 0, Math.PI * 2);
    } else {
      // 5-degree wedge for mechanical precision and black gaps
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, size / 2, -2.5 * Math.PI / 180, 2.5 * Math.PI / 180);
    }
    ctx.closePath();
    ctx.clip();

    // Small random crop shifts (within 15% range) to catch different logo edges
    const cropShiftX = (Math.random() - 0.5) * (size * 0.15);
    const cropShiftY = (Math.random() - 0.5) * (size * 0.15);
    
    ctx.rotate(wandSeed * Math.PI / 180);
    const finalDrawSize = size * internalScale; 
    
    ctx.drawImage(img, (-finalDrawSize / 2) + cropShiftX, (-finalDrawSize / 2) + cropShiftY, finalDrawSize, finalDrawSize);
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

    // 14 Layers for a dense but sharp build
    for (let l = 0; l < 14; l++) {
      const folds = [12, 16, 24, 32, 48][Math.floor(Math.random() * 5)];
      const layerScale = 0.15 + (Math.random() * 0.85);
      const internalScale = 0.4 + (Math.random() * 0.6);

      for (let i = 0; i < folds; i++) {
        // Randomize image and shape for every single shard in the ring
        const randomImg = imgs[Math.floor(Math.random() * imgs.length)];
        const randomShape = shapePalette[Math.floor(Math.random() * shapePalette.length)];
        const individualWand = Math.random() * 360;

        drawShatteredShard(
          ctx, 
          randomImg, 
          center, 
          center, 
          size * layerScale, 
          i * (360/folds), 
          randomShape, 
          individualWand, 
          internalScale
        );
      }
    }

    setGeneratedImg(canvas.toDataURL('image/png'));
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', padding: '20px', color: '#FFF', fontFamily: 'monospace' }}>
      <Head><title>SHATTER_SYNTH_V1.9.3</title></Head>
      <canvas ref={canvasRef} width="1024" height="1024" style={{ display: 'none' }} />
      
      <div style={{ maxWidth: '850px', margin: '0 auto', border: '1px solid #FFF', padding: '25px' }}>
        {!generatedImg ? (
          <>
            <h1 style={{ fontSize: '1.1rem', borderBottom: '1px solid #FFF', paddingBottom: '10px' }}>SHATTERED_COLLAGE_PROTOCOL</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '20px' }}>
              {selections.map((s, i) => (
                <button key={i} onClick={() => setActiveSlot(i)} style={{ height: '90px', background: s?.color || '#111', border: '1px solid #FFF', color: '#FFF', cursor: 'pointer', fontWeight: 'bold' }}>
                  {s ? s.code : `SLOT_0${i+1}`}
                </button>
              ))}
            </div>
            <button onClick={generateMark} disabled={selections.includes(null)} style={{ width: '100%', marginTop: '20px', padding: '30px', background: '#FFF', color: '#000', fontWeight: '900', cursor: 'pointer', fontSize: '1.1rem' }}>
              GENERATE_SHATTER
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <img src={generatedImg} style={{ width: '100%', border: '1px solid #FFF' }} />
            <button onClick={() => setGeneratedImg(null)} style={{ marginTop: '20px', padding: '15px 40px', background: '#FFF', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>NEW_VERSION</button>
          </div>
        )}
      </div>

      {activeSlot !== null && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 100, padding: '30px', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '15px' }}>
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