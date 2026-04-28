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

  const drawShard = (ctx, img, x, y, size, rotation, shape, wand, scale) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.beginPath();
    const s = size / 2;
    
    if (shape === 'petal') {
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(s * 0.4, -s * 0.7, s * 1.6, -s * 0.4, s, 0);
      ctx.bezierCurveTo(s * 1.6, s * 0.4, s * 0.4, s * 0.7, 0, 0);
    } else if (shape === 'capsule') {
      ctx.moveTo(s * 0.2, -s * 0.35);
      ctx.lineTo(s * 0.8, -s * 0.35);
      ctx.arc(s * 0.8, 0, s * 0.35, -Math.PI/2, Math.PI/2);
      ctx.lineTo(s * 0.2, s * 0.35);
      ctx.arc(s * 0.2, 0, s * 0.35, Math.PI/2, -Math.PI/2);
    } else if (shape === 'orb') {
      ctx.arc(s * 0.5, 0, s * 0.4, 0, Math.PI * 2);
    } else {
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, s * 0.85, -18 * Math.PI / 180, 18 * Math.PI / 180);
    }
    
    ctx.closePath();
    ctx.clip();
    ctx.rotate(wand * Math.PI / 180);
    const fSize = size * scale;
    ctx.drawImage(img, -fSize/2, -fSize/2, fSize, fSize);
    ctx.restore();
  };

  const generateMark = async () => {
    setIsBuilding(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = 1024, center = 512;

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

      // BOUNDED LAYERS: Strictly controlled to avoid canvas bleed
      const layers = [
        { f: 12, sc: 0.3, sh: 'softWedge', off: 0, w: 45 },      // NUCLEUS
        { f: 6,  sc: 0.65, sh: 'capsule', off: 0.14, w: 0 },    // HERO PENTAGON
        { f: 6,  sc: 0.65, sh: 'capsule', off: 0.14, w: 180 },  // HERO HEXAGON
        { f: [6, 8][Math.floor(Math.random()*2)], sc: 0.55, sh: 'petal', off: 0.25, w: 90 }, // FLOWER
        { f: 16, sc: 0.3, sh: 'orb', off: 0.35, w: 0 }          // OUTER RING
      ];

      layers.forEach((l, idx) => {
        const img = imgs[Math.floor(Math.random() * 4)];
        const ringRot = Math.random() * 360; 

        // CALCULATE BOUNDARY: (center + offset + shard radius) must be < 512
        const safeOffset = (size * l.off);
        const shardRadius = (size * l.sc) / 2;
        
        // Final pixel check to force contain within canvas
        if (safeOffset + shardRadius > 510) {
            l.sc = (510 - safeOffset) * 2 / size;
        }

        for (let i = 0; i < l.f; i++) {
          const angle = (i * (360 / l.f) + ringRot) * Math.PI / 180;
          const x = center + safeOffset * Math.cos(angle);
          const y = center + safeOffset * Math.sin(angle);
          drawShard(ctx, img, x, y, size * l.sc, i * (360/l.f), l.sh, l.w, 0.95);
        }
      });

      setGeneratedImg(canvas.toDataURL('image/png'));
    } catch (e) { console.error(e); } finally { setIsBuilding(false); }
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', padding: '20px', color: '#FFF', fontFamily: 'monospace' }}>
      <Head><title>BOUND_BLOOM_v2.2.9</title></Head>
      <canvas ref={canvasRef} width="1024" height="1024" style={{ display: 'none' }} />
      <div style={{ maxWidth: '850px', margin: '0 auto', border: '1px solid #FFF', padding: '25px' }}>
        {!generatedImg ? (
          <>
            <h1 style={{ fontSize: '1.2rem', letterSpacing: '2px', borderBottom: '1px solid #FFF', paddingBottom: '10px' }}>BOUNDED_BLOOM_SYNTH</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '20px' }}>
              {selections.map((s, i) => (
                <button key={i} onClick={() => setActiveSlot(i)} style={{ height: '90px', background: s?.color || '#111', border: '1px solid #FFF', color: '#FFF', cursor: 'pointer', fontWeight: 'bold' }}>
                  {s ? s.code : `SLOT_0${i+1}`}
                </button>
              ))}
            </div>
            <button onClick={generateMark} disabled={selections.includes(null) || isBuilding} style={{ width: '100%', marginTop: '20px', padding: '30px', background: '#FFF', color: '#000', fontWeight: '900', cursor: 'pointer', fontSize: '1.1rem' }}>
              {isBuilding ? 'CONSTRAINING...' : 'INITIATE_BOUND_BLOOM'}
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <img src={generatedImg} style={{ width: '100%', border: '1px solid #FFF' }} alt="Synthesized Mark" />
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setGeneratedImg(null)} style={{ flex: 1, padding: '20px', background: '#FFF', color: '#000', fontWeight: 'bold' }}>RESET</button>
              <button onClick={generateMark} style={{ flex: 1, padding: '20px', border: '1px solid #FFF', background: '#000', color: '#FFF', fontWeight: 'bold' }}>RE-BLOOM (REMIX)</button>
            </div>
          </div>
        )}
      </div>
      {activeSlot !== null && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 100, padding: '30px', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
            {countries.map(c => (
              <div key={c.code} onClick={() => { const n = [...selections]; n[activeSlot] = c; setSelections(n); setActiveSlot(null); }} style={{ background: c.color, padding: '20px', border: '1px solid #FFF', textAlign: 'center', cursor: 'pointer' }}>{c.name}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
