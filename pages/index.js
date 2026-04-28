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

  const generateMark = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = 1024;
    const center = size / 2;

    const loadImg = (src) => new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => res(img);
      img.onerror = () => rej(new Error(`Failed to load: ${src}`));
      img.src = src;
    });

    try {
      const imgs = await Promise.all(selections.map(s => 
        loadImg(`/logos/${s.name.toLowerCase().replace(/\s+/g, '-')}.png`)
      ));

      ctx.clearRect(0, 0, size, size);
      for (let i = 0; i < 8; i++) {
        const img = imgs[i % 4];
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate((i * 45) * Math.PI / 180);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, center, -22.5 * Math.PI / 180, 22.5 * Math.PI / 180);
        ctx.closePath();
        ctx.clip();
        if (i % 2 === 1) ctx.scale(1, -1);
        ctx.drawImage(img, -center, -center, size, size);
        ctx.restore();
      }
      setGeneratedImg(canvas.toDataURL('image/png'));
    } catch (err) {
      alert("IMAGE LOAD ERROR: Check filenames in public/logos/");
    }
  };

  return (
    <div style={{ backgroundColor: '#FFF', minHeight: '100vh', padding: '40px', color: '#000', fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <Head>
        <title>FAIR WEATHER // BRAND_SYNTH</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <canvas ref={canvasRef} width="1024" height="1024" style={{ display: 'none' }} />
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {!generatedImg ? (
          <>
            <header style={{ borderBottom: '12px solid #000', marginBottom: '30px' }}>
              <h1 style={{ fontSize: '4rem', fontWeight: '900', margin: '0', letterSpacing: '-3px' }}>SYNTH_V.11</h1>
              <p style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Loyalty Mapping Protocol // 2026</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
              {selections.map((s, i) => (
                <button key={i} onClick={() => setActiveSlot(i)} style={{ height: '180px', background: s?.color || '#EEE', border: '6px solid #000', fontSize: '1.8rem', fontWeight: '900', cursor: 'pointer', transition: 'all 0.1s' }}>
                  {s ? s.code : `SLOT_0${i+1}`}
                </button>
              ))}
            </div>

            <button 
              disabled={selections.includes(null)} 
              onClick={generateMark} 
              style={{ width: '100%', marginTop: '20px', padding: '25px', background: '#000', color: '#FFF', fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer', opacity: selections.includes(null) ? 0.2 : 1 }}
            >
              EXECUTE_GENERATION
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <img src={generatedImg} style={{ width: '100%', maxWidth: '600px', border: '12px solid #000' }} alt="Generated Mark" />
            <div style={{ marginTop: '30px' }}>
              <button onClick={() => setGeneratedImg(null)} style={{ padding: '15px 40px', background: '#000', color: '#FFF', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.2rem' }}>NEW_SEQUENCE</button>
            </div>
          </div>
        )}
      </div>

      {activeSlot !== null && (
        <div style={{ position: 'fixed', inset: 0, background: '#FFF', zIndex: 100, overflowY: 'auto', padding: '40px', border: '20px solid #000' }}>
          <button onClick={() => setActiveSlot(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: '#000', color: '#FFF', padding: '10px 20px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>CLOSE</button>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', borderBottom: '5px solid #000', paddingBottom: '10px' }}>SELECT_ORIGIN</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', marginTop: '20px' }}>
            {countries.map(c => (
              <div key={c.code} onClick={() => { const n = [...selections]; n[activeSlot] = c; setSelections(n); setActiveSlot(null); }} style={{ background: c.color, padding: '20px', cursor: 'pointer', fontWeight: '900', border: '4px solid #000', textAlign: 'center' }}>
                {c.name.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}