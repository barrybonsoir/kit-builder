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
    // REFINED SHAPES: Larger apertures for better logo visibility
    if (shapeType === 'shield') {
      ctx.moveTo(s * 0.1, -s * 0.4);
      ctx.lineTo(s * 1.1, -s * 0.4);
      ctx.quadraticCurveTo(s * 1.3, 0, s * 1.1, s * 0.4);
      ctx.lineTo(s * 0.1, s * 0.4);
    } else if (shapeType === 'circle') {
      ctx.arc(s * 0.6, 0, s * 0.45, 0, Math.PI * 2);
    } else {
      // Geometric "Wedge" for the core
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, s * 0.9, -15 * Math.PI / 180, 15 * Math.PI / 180);
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

      // REDUCED TO 6 LAYERS FOR MAX NEGATIVE SPACE
      const layers = [
        { folds: 12, scale: 0.35, shape: 'wedge', offset: 0, wand: 45 },      // CORE
        { folds: 6,  scale: 0.75, shape: 'shield', offset: 0.18, wand: 0 },   // HERO 1 (Upright)
        { folds: 6,  scale: 0.75, shape: 'shield', offset: 0.18, wand: 180 }, // HERO 2 (Inverted)
        { folds: 18, scale: 0.45, shape: 'circle', offset: 0.38, wand: 90 },   // PERIPHERAL 1
        { folds: 24, scale: 0.25, shape: 'wedge', offset: 0.42, wand: 0 }      // OUTER GRIT
      ];

      layers.forEach((layer, index) => {
        const layerImg = imgs[index % 4];
        // Mandatory Symmetrical Crop for legibility
        const cropX = 0; 
        const cropY = 0;
        const ringRotation = (index * 30);

        for (let i = 0; i < layer.folds; i++) {
          const angle = (i * (360 / layer.folds) + ringRotation) * Math.PI / 180;
          const bloomX = center + (size * layer.offset) * Math.cos(angle);
          const bloomY = center + (size * layer.offset) * Math.sin(angle);

          drawMandalaShard(ctx, layerImg, bloomX, bloomY, size * layer.scale, i * (360/layer.folds), layer.shape, layer.wand, 0.9, cropX, cropY);
        }
      });

      setGeneratedImg(canvas.toDataURL('image/png'));
    } catch (e) {
      console.error("BUILD_ERR:", e);
    } finally {
      setIsBuilding(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', padding: '20px', color: '#FFF', fontFamily: 'monospace' }}>
      <Head><title>AIRED_BLUEPRINT_v2.2.6</title></Head>
      <canvas ref={canvasRef} width="1024" height="1024" style={{ display: 'none' }} />
      <div style={{ maxWidth: '850px', margin: '0 auto', border: '1px solid #FFF', padding: '25px' }}>
        {!generatedImg ? (
          <>
            <h1 style={{ fontSize: '1.2rem', letterSpacing: '2px', borderBottom: '1px solid #FFF', paddingBottom: '10px' }}>AIRED_BLUEPRINT_SYNTHESIS</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '20px' }}>
              {selections.map((s, i) => (
                <button key={i} onClick={() => setActiveSlot(i)} style={{ height: '90px', background: s?.color || '#111', border: '1px solid #FFF', color: '#FFF', cursor: 'pointer', fontWeight: 'bold' }}>
                  {s ? s.code : `SLOT_0${i+1}`}
                </button>
              ))}
            </div>
            <button onClick={generateMark} disabled={selections.includes(null) || isBuilding} style={{ width: '100%', marginTop: '20px', padding: '30px', background: '#FFF', color: '#000', fontWeight: '900', cursor: 'pointer', fontSize: '1.1rem' }}>
              {isBuilding ? 'CLEARING_SPACE...' : 'INITIATE_AIRED_MARK'}
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <img src={generatedImg} style={{ width: '100%', border: '1px solid #FFF' }} alt="Synthesized Asset" />
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setGeneratedImg(null)} style={{ flex: 1, padding: '20px', background: '#FFF', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>RESET</button>
              <button onClick={generateMark} style={{ flex: 1, padding: '20px', border: '1px solid #FFF', background: '#000', color: '#FFF', fontWeight: 'bold', cursor: 'pointer' }}>RE-SYNTH</button>
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