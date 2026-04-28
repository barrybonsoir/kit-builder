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

  const drawPrecisionShard = (ctx, img, x, y, size, rotation, shapeType, wandSeed, cropX, cropY) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation * Math.PI / 180);

    ctx.beginPath();
    const shardSize = size / 2.1;
    if (shapeType === 'triangle') {
      ctx.moveTo(0, 0);
      ctx.lineTo(shardSize, -shardSize / 1.8);
      ctx.lineTo(shardSize, shardSize / 1.8);
    } else if (shapeType === 'slant') {
      ctx.rect(shardSize / 4, -shardSize / 10, shardSize * 1.1, shardSize / 5);
    } else if (shapeType === 'circle') {
      ctx.arc(shardSize / 1.1, 0, shardSize / 3, 0, Math.PI * 2);
    } else {
      // High-precision 11.25-degree wedge
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, size / 1.7, -5.6 * Math.PI / 180, 5.6 * Math.PI / 180);
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

    // 10 Layers of Strict Symmetry
    const numLayers = 10;

    for (let l = 0; l < numLayers; l++) {
      const folds = [12, 16, 24, 32, 48][Math.floor(Math.random() * 5)];
      const layerShape = shapePalette[Math.floor(Math.random() * shapePalette.length)];
      const layerScale = 0.25 + (Math.random() * 0.75);
      const layerWand = Math.random() * 360;
      const layerImg = imgs[Math.floor(Math.random() * 4)];
      
      // Random but fixed crop per layer for mandatory symmetry
      const lCropX = (Math.random() - 0.5) * size;
      const lCropY = (Math.random() - 0.5) * size;

      for (let i = 0; i < folds; i++) {
        drawPrecisionShard(ctx, layerImg, center, center, size * layerScale, i * (360/folds), layerShape, layerWand, lCropX, lCropY);
      }
    }

    setGeneratedImg(canvas.toDataURL('image/png'));
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', padding: '20px', color: '#FFF', fontFamily: 'monospace' }}>
      <Head><title>PRECISION_SYNTH_V1.8</title></Head>
      <canvas ref={canvasRef} width="1024" height="1024" style={{ display: 'none' }} />
      
      <div style={{ maxWidth: '800px', margin: '0 auto', border: '1px solid #FFF', padding: '20px' }}>
        {!generatedImg ? (
          <>
            <h1 style={{ fontSize: '1.2rem', borderBottom: '1px solid #FFF', paddingBottom: '10px' }}>STRUCTURAL_MANDALA_ENGINE</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '20px' }}>
              {selections.map((s, i) => (
                <button key={i} onClick={() => setActiveSlot(i)} style={{ height: '80px', background: s?.color || '#111', border: '1px solid #FFF', color: '#FFF', cursor: 'pointer' }}>
                  {s ? s.code : `SLOT_0${i+1}`}
                </button>
              ))}
            </div>
            <button onClick={generateMark} disabled={selections.includes(null)} style={{ width: '100%', marginTop: '20px', padding: '25px', background: '#FFF', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>
              GENERATE_PRECISION_MARK
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <img src={generatedImg} style={{ width: '100%', border: '1px solid #FFF' }} />
            <button onClick={() => setGeneratedImg(null)} style={{ marginTop: '20px', padding: '10px 20px', background: '#FFF', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>RE-SYNTHESIZE</button>
          </div>
        )}
      </div>

      {activeSlot !== null && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 100, padding: '20px', overflowY: 'auto' }}>
          {countries.map(c => (
            <div key={c.code} onClick={() => { const n = [...selections]; n[activeSlot] = c; setSelections(n); setActiveSlot(null); }} style={{ background: c.color, padding: '15px', margin: '5px 0', cursor: 'pointer', border: '1px solid #FFF', textAlign: 'center' }}>
              {c.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}