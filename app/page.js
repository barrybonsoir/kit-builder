"use client";
import { useState } from 'react';

const countries = [
  { name: "Algeria", code: "ALG" }, { name: "Argentina", code: "ARG" },
  { name: "Australia", code: "AUS" }, { name: "Austria", code: "AUT" },
  { name: "Belgium", code: "BEL" }, { name: "Bosnia Herzegovina", code: "BIH" },
  { name: "Brazil", code: "BRA" }, { name: "Canada", code: "CAN" },
  { name: "Cape Verde", code: "CPV" }, { name: "Colombia", code: "COL" },
  { name: "Croatia", code: "CRO" }, { name: "Curacao", code: "CUR" },
  { name: "Czechia", code: "CZE" }, { name: "DR Congo", code: "COD" },
  { name: "Ecuador", code: "ECU" }, { name: "Egypt", code: "EGY" },
  { name: "England", code: "ENG" }, { name: "France", code: "FRA" },
  { name: "Germany", code: "GER" }, { name: "Ghana", code: "GHA" },
  { name: "Haiti", code: "HAI" }, { name: "Iran", code: "IRN" },
  { name: "Iraq", code: "IRQ" }, { name: "Ivory Coast", code: "CIV" },
  { name: "Japan", code: "JPN" }, { name: "Jordan", code: "JOR" },
  { name: "Mexico", code: "MEX" }, { name: "Morocco", code: "MAR" },
  { name: "Netherlands", code: "NED" }, { name: "New Zealand", code: "NZL" },
  { name: "Norway", code: "NOR" }, { name: "Panama", code: "PAN" },
  { name: "Paraguay", code: "PAR" }, { name: "Portugal", code: "POR" },
  { name: "Qatar", code: "QAT" }, { name: "Saudi Arabia", code: "KSA" },
  { name: "Scotland", code: "SCO" }, { name: "Senegal", code: "SEN" },
  { name: "South Africa", code: "RSA" }, { name: "South Korea", code: "KOR" },
  { name: "Spain", code: "ESP" }, { name: "Sweden", code: "SWE" },
  { name: "Switzerland", code: "SUI" }, { name: "Tunisia", code: "TUN" },
  { name: "Turkiye", code: "TUR" }, { name: "United States", code: "USA" },
  { name: "Uruguay", code: "URU" }, { name: "Uzbekistan", code: "UZB" }
];

const labels = ["TOP LEFT", "TOP RIGHT", "BOTTOM LEFT", "BOTTOM RIGHT"];

export default function Home() {
  const [activeSlot, setActiveSlot] = useState(null);
  const [selections, setSelections] = useState([null, null, null, null]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const getImagePath = (country) => {
    if (!country) return "";
    const fileName = country.name.toLowerCase().replace(/\s+/g, '-');
    return `/logos/${fileName}.png`;
  };

  const selectCountry = (country) => {
    const newSels = [...selections];
    newSels[activeSlot] = country;
    setSelections(newSels);
    setActiveSlot(null);
  };

  const RenderHeraldicCrest = () => {
    // These insets define the crop for each layer:
    // [top, right, bottom, left]
    const clips = [
      'inset(0 50% 50% 0)', // Top Left
      'inset(0 0 50% 50%)', // Top Right
      'inset(50% 50% 0 0)', // Bottom Left
      'inset(50% 0 0 50%)'  // Bottom Right
    ];

    return (
      <div style={{ position: 'relative', width: '500px', height: '500px' }}>
        {/* Main Emblem Container */}
        <div style={{ 
          width: '500px', 
          height: '500px', 
          backgroundColor: '#FFF', 
          border: '10px solid #000',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {selections.map((country, i) => (
            <img 
              key={i}
              src={getImagePath(country)} 
              alt={country.name}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                clipPath: clips[i],
                filter: 'grayscale(1) contrast(300%)',
                mixBlendMode: 'multiply'
              }}
            />
          ))}
          
          {/* Subtle Crosshair Grid */}
          <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', background: 'rgba(0,0,0,0.1)' }}></div>
          <div style={{ position: 'absolute', top: 0, left: '50%', width: '1px', height: '100%', background: 'rgba(0,0,0,0.1)' }}></div>
        </div>

        {/* Technical Footer */}
        <div style={{ 
          marginTop: '20px',
          padding: '10px',
          border: '2px solid #000',
          fontFamily: "'Space Mono', monospace",
          fontSize: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          textTransform: 'uppercase'
        }}>
          <span>EMBLEM_ID: {selections.map(s => s.code).join('/')}</span>
          <span>STITCH_SYNC_V2.0</span>
        </div>
      </div>
    );
  };

  return (
    <main style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', width: '100%' }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono&display=swap" rel="stylesheet" />

      {!showResult ? (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 20px' }}>
          <header style={{ textAlign: 'center', marginBottom: '60px' }}>
            <img src="/logo-red.png" alt="FAIR WEATHER" style={{ width: '100%', maxWidth: '600px', marginBottom: '20px' }} />
            <div style={{ borderTop: '4px solid #000', borderBottom: '4px solid #000', padding: '15px 0', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.9rem', margin: 0, color: '#000', letterSpacing: '0.05em' }}>
                MONOCHROME HERALDRY SYNTHESIZER // QUADRANT STITCHING ENABLED.
              </p>
            </div>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {labels.map((label, i) => (
              <button key={i} onClick={() => setActiveSlot(i)} style={{ 
                height: '220px', 
                border: '6px solid #000', 
                backgroundColor: selections[i] ? '#000' : '#FFF', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer' 
              }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.85rem', color: selections[i] ? '#FFF' : '#000', marginBottom: '10px' }}>{label}</span>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '6rem', lineHeight: '1', color: selections[i] ? '#FFF' : '#000' }}>
                  {selections[i] ? selections[i].code : "+"}
                </span>
              </button>
            ))}
          </div>

          <button disabled={selections.includes(null)} onClick={() => { setIsGenerating(true); setTimeout(() => { setIsGenerating(false); setShowResult(true); }, 2500); }} style={{ width: '100%', marginTop: '40px', padding: '30px', background: '#000000', color: '#FFFFFF', fontSize: '3.5rem', fontFamily: "'Bebas Neue', sans-serif", cursor: 'pointer', opacity: selections.includes(null) ? 0.2 : 1, border: 'none' }}>GENERATE EMBLEM</button>
        </div>
      ) : (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
          <RenderHeraldicCrest />
          <button onClick={() => { setShowResult(false); setSelections([null, null, null, null]); }} style={{ marginTop: '80px', padding: '20px 40px', background: '#000', color: '#FFF', fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', border: 'none', cursor: 'pointer' }}>REBOOT SYSTEM [X]</button>
        </div>
      )}

      {activeSlot !== null && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000', zIndex: 9999, overflowY: 'scroll' }}>
          <div style={{ position: 'sticky', top: 0, background: '#FFF', borderBottom: '4px solid #000', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10000 }}>
            <span style={{ color: '#000', fontFamily: "'Space Mono', monospace", fontSize: '1.2rem' }}>SELECT_COMPONENT // {labels[activeSlot]}</span>
            <button onClick={() => setActiveSlot(null)} style={{ background: '#000', color: '#FFF', border: 'none', padding: '10px 20px', cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem' }}>BACK</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            {countries.map(c => (
              <button key={c.code} onClick={() => selectCountry(c)} style={{ padding: '40px', background: '#000', border: '1px solid #333', textAlign: 'left', cursor: 'pointer' }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '4rem', color: '#FFF' }}>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {isGenerating && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000', zIndex: 10000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ color: '#FFFFFF', fontSize: '6rem', fontFamily: "'Bebas Neue', sans-serif", margin: 0 }}>SYNCHRONIZING_MARK</h1>
          <div style={{ width: '400px', height: '2px', background: '#333333', marginTop: '30px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: '#FFF', width: '100%', transformOrigin: 'left', animation: 'progress 2.5s ease-in-out forwards' }}></div>
          </div>
        </div>
      )}
      <style>{`@keyframes progress { 0% { transform: scaleX(0); } 100% { transform: scaleX(1); } }`}</style>
    </main>
  );
}