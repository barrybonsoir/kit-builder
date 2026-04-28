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
    
    // Wedge Clip
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, size / 2, -shardAngle/2 * Math.PI / 180, shardAngle/2 * Math.PI / 180);
    ctx.closePath();
    ctx.clip();

    if (mirror) ctx.scale(1, -1);

    // Wand Seed: Rotate the SOURCE image inside the clip
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

    const shuffledLogos = [...selections].sort(() => Math.random() - 0.5);
    const imgs = await Promise.all(shuffledLogos.map(s => 
      loadImg(`/logos/${s.name.toLowerCase().replace(/\s+/g, '-')}.png`)
    ));

    ctx.clearRect(0, 0, size, size);

    // LAYER 1: 8-Fold Symmetrical Ring
    const wand1 = Math.random() * 360;
    const scale1 = 0.8 + Math.random() * 0.3;
    for (let i = 0; i < 8; i++) {
      drawShard(ctx, imgs[0], center, center, size * scale1, i * 45, 45, wand1, i % 2 === 0);
    }

    // LAYER 2: 4 or 6-Fold "Sticker" Chaos
    const stickers = Math.random() > 0.5 ? 4 : 6;
    const stickerScale = 0.4 + Math.random() * 0.3;
    const wand2 = Math.random() * 360;
    for (let i = 0; i < stickers; i++) {
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate((i * (360 / stickers)) * Math.PI / 180);
      
      // Offset placement
      ctx.translate(size * 0.2, 0);
      // Tier 4: Offset Rotation (±15° for sticker look)
      ctx.rotate((Math.random() * 30 - 15) * Math.PI / 180);
      
      const s = size * stickerScale;
      ctx.rotate(wand2 * Math.PI / 180);
      ctx.drawImage(imgs[1], -s/2, -s/2, s, s);
      ctx.restore();
    }

    // LAYER 3: Central Cluster
    const clusterFolds = 12;
    const wand3 = Math.random() * 360;
    for (let i = 0; i < clusterFolds; i++) {
      drawShard(ctx, imgs[2], center, center, size * 0.4, i * (360/clusterFolds), 30, wand3 + (i*10), false);
    }

    setGeneratedImg(canvas.toDataURL('image/png'));
  };

  return (
    <div style={{ backgroundColor: '#F0F0F0', minHeight: '100vh', padding: '20px', color: '#000', fontFamily: 'monospace' }}>
      <Head><title>BRAND_SYNTH_PROTOCOL</title></Head>
      <canvas ref={canvasRef} width="1024" height="1024" style={{ display: 'none' }} />
      
      <div style={{ maxWidth: '900px', margin: '0 auto', background: '#FFF', border: '10px solid #000', padding: '40px' }}>
        {!generatedImg ? (
          <>
            <h1 style={{ fontSize: '3rem', margin: '0 0 20px 0', background: '#000', color: '#FFF', padding: '10px' }}>NON-GEN_PROTOCOL_V12</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {selections.map((s, i) => (
                <div key={i} onClick={() => setActiveSlot(i)} style={{ height: '120px', border: '4px dashed #000', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: s?.color || 'transparent' }}>
                  {s ? s.code : `SELECT_ASSET_0${i+1}`}
                </div>
              ))}
            </div>
            <button onClick={generateMark} disabled={selections.includes(null)} style={{ width: '100%', marginTop: '30px', padding: '30px', background: '#000', color: '#FFF', border: 'none', cursor: 'pointer', fontSize: '1.5rem', fontWeight: 'bold' }}>
              EXECUTE_RADIAL_SYNTH
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <img src={generatedImg} style={{ width: '100%', border: '4px solid #000' }} />
            <button onClick={() => setGeneratedImg(null)} style={{ marginTop: '20px', padding: '20px 40px', background: '#000', color: '#FFF', border: 'none', cursor: 'pointer' }}>NEW_REITERATION</button>
          </div>
        )}
      </div>

      {activeSlot !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 100, padding: '40px', overflowY: 'auto' }}>
           <h2 style={{ color: '#FFF' }}>INPUT_MASTER_ASSET</h2>
           {countries.map(c => (
             <div key={c.code} onClick={() => { const n = [...selections]; n[activeSlot] = c; setSelections(n); setActiveSlot(null); }} style={{ background: c.color, color: '#FFF', padding: '15px', margin: '5px 0', cursor: 'pointer', border: '2px solid #FFF' }}>
               {c.name}
             </div>
           ))}
        </div>
      )}
    </div>
  );
}