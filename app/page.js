"use client";
import { useState, useEffect } from 'react';

const countries = [
  { name: "Argentina", code: "ARG", color: "#74ACDF", pattern: "stripes" },
  { name: "Brazil", code: "BRA", color: "#009739", pattern: "diamonds" },
  { name: "Croatia", code: "CRO", color: "#FF0000", pattern: "checkers" },
  { name: "Germany", code: "GER", color: "#000000", pattern: "solid" },
  { name: "USA", code: "USA", color: "#0A3161", pattern: "stars" },
  { name: "Japan", code: "JPN", color: "#BC002D", pattern: "circle" },
  { name: "England", code: "ENG", color: "#FFFFFF", pattern: "cross" },
  { name: "Mexico", code: "MEX", color: "#006847", pattern: "triangles" },
  { name: "Netherlands", code: "NED", color: "#F36C21", pattern: "diagonal" },
  { name: "Portugal", code: "POR", color: "#FF0000", pattern: "split" }
  // ... (Add others as needed, but this is the core logic set)
];

const nationLabels = ["VESSEL", "TEXTURE", "SYMBOL", "BORDER"];

export default function Home() {
  const [activeSlot, setActiveSlot] = useState(null);
  const [selections, setSelections] = useState([null, null, null, null]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const selectCountry = (country) => {
    const newSels = [...selections];
    newSels[activeSlot] = country;
    setSelections(newSels);
    setActiveSlot(null);
  };

  const getTextColor = (hex) => {
    const light = ["#FFFFFF", "#FCD116", "#FFCD00", "#74ACDF"];
    return light.includes(hex?.toUpperCase()) ? "#000" : "#FFF";
  };

  // GENERATIVE SVG COMPONENT
  const RenderCrest = () => {
    const s = selections;
    const vesselColor = s[0].color;
    const textureColor = s[1].color;
    const symbolColor = s[2].color;
    const borderColor = s[3].color;

    return (
      <svg width="500" height="500" viewBox="0 0 500 500" style={{ filter: 'drop-shadow(25px 25px 0px #000)' }}>
        <defs>
          {/* Pattern Definitions based on Selections */}
          <pattern id="selPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            {s[1].pattern === 'checkers' && (
              <>
                <rect width="20" height="20" fill={textureColor} />
                <rect x="20" y="20" width="20" height="20" fill={textureColor} />
              </>
            )}
            {s[1].pattern === 'stripes' && <rect width="20" height="40" fill={textureColor} />}
            {s[1].pattern === 'diamonds' && <path d="M20 0 L40 20 L20 40 L0 20 Z" fill={textureColor} />}
            {s[1].pattern === 'diagonal' && <path d="M-10,10 l20,-20 M0,40 l40,-40 M30,50 l20,-20" stroke={textureColor} strokeWidth="15" />}
          </pattern>
        </defs>

        {/* LAYER 0: THE VESSEL (Random shape selection logic could go here) */}
        <path d="M50,50 L450,50 L450,350 L250,480 L50,350 Z" fill={vesselColor} stroke={borderColor} strokeWidth="25" />
        
        {/* LAYER 1: THE TEXTURE */}
        <path d="M70,70 L430,70 L430,340 L250,450 L70,340 Z" fill="url(#selPattern)" opacity="0.6" />

        {/* LAYER 2: THE SYMBOL (Brutalist Interpretation) */}
        <g transform="translate(250, 250)">
          <rect x="-80" y="-80" width="160" height="160" fill="#000" transform="rotate(45)" />
          <circle r="60" fill={symbolColor} stroke="#000" strokeWidth="10" />
          {/* Abstract Soccer 'X' */}
          <path d="M-30,-30 L30,30 M30,-30 L-30,30" stroke={getTextColor(symbolColor)} strokeWidth="12" strokeLinecap="square" />
        </g>

        {/* LAYER 3: TOPOGRAPHY (Codes) */}
        <style>{`.code-style { font-family: 'Bebas Neue', sans-serif; font-size: 42px; fill: #000; letter-spacing: 2px; }`}</style>
        <rect x="180" y="30" width="140" height="50" fill="#000" />
        <text x="250" y="72" className="code-style" fill="#FFF" textAnchor="middle">{s[0].code}</text>
        
        <text x="250" y="420" className="code-style" fill={getTextColor(vesselColor)} textAnchor="middle" transform="rotate(-90, 250, 420)" opacity="0.4">
          {s[1].code}_{s[2].code}_{s[3].code}
        </text>
      </svg>
    );
  };

  return (
    <main style={{ backgroundColor: '#F4F1EA', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono&display=swap');
        
        .grid-bg {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background-image: radial-gradient(#000 1px, transparent 1px);
          background-size: 30px 30px; opacity: 0.1; z-index: 0;
        }

        .nation-btn {
          border: 4px solid #000; padding: 20px; cursor: pointer;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          min-height: 180px; transition: transform 0.1s;
        }

        .nation-btn:active { transform: scale(0.95); }
      `}</style>

      <div className="grid-bg" />

      {!showResult ? (
        <div style={{ position: 'relative', zPosition: 10, maxWidth: '1000px', margin: '0 auto', padding: '60px 20px' }}>
          <header style={{ marginBottom: '60px', textAlign: 'center' }}>
            <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '6rem', lineHeight: '0.8', margin: 0 }}>FAIR_WEATHER</h1>
            <h2 style={{ fontFamily: 'Space Mono', fontSize: '1rem', background: '#000', color: '#FFF', display: 'inline-block', padding: '5px 15px' }}>2026_GEN_CREST_ENGINE</h2>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {nationLabels.map((label, i) => (
              <button key={i} className="nation-btn" onClick={() => setActiveSlot(i)} style={{ backgroundColor: selections[i]?.color || "#FFF" }}>
                <span style={{ fontFamily: 'Space Mono', fontSize: '0.7rem', marginBottom: '10px' }}>{label}</span>
                <span style={{ fontFamily: 'Bebas Neue', fontSize: '4rem' }}>{selections[i] ? selections[i].code : "???"}</span>
              </button>
            ))}
          </div>

          <button 
            disabled={selections.includes(null)}
            onClick={() => { setIsGenerating(true); setTimeout(() => { setIsGenerating(false); setShowResult(true); }, 2500); }}
            style={{ width: '100%', marginTop: '40px', padding: '30px', background: '#000', color: '#FFF', fontFamily: 'Bebas Neue', fontSize: '2.5rem', cursor: 'pointer', opacity: selections.includes(null) ? 0.2 : 1 }}
          >
            SYNTHESIZE_MARK
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '40px' }}>
          <RenderCrest />
          <div style={{ marginTop: '60px', display: 'flex', gap: '20px' }}>
            <button onClick={() => setShowResult(false)} style={{ background: '#000', color: '#FFF', padding: '20px 40px', border: 'none', fontFamily: 'Bebas Neue', fontSize: '1.5rem', cursor: 'pointer' }}>NEW_REMIX</button>
          </div>
        </div>
      )}

      {isGenerating && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: '#000', zIndex: 2000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '5rem' }}>CRUNCHING_DNA</h2>
          <div style={{ width: '300px', height: '10px', background: '#333' }}>
            <div style={{ height: '100%', background: '#FF0000', animation: 'load 2.5s forwards' }} />
          </div>
          <style>{`@keyframes load { from { width: 0% } to { width: 100% } }`}</style>
        </div>
      )}

      {activeSlot !== null && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', zIndex: 3000, overflowY: 'auto', padding: '40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
            {countries.map(c => (
              <button key={c.name} onClick={() => selectCountry(c)} style={{ background: c.color, color: getTextColor(c.color), border: 'none', padding: '20px', fontFamily: 'Bebas Neue', fontSize: '2rem', cursor: 'pointer', textAlign: 'left' }}>
                {c.name}
              </button>
            ))}
          </div>
          <button onClick={() => setActiveSlot(null)} style={{ position: 'fixed', bottom: '20px', right: '20px', background: '#FF0000', color: '#FFF', border: 'none', padding: '15px 30px', fontFamily: 'Space Mono' }}>CANCEL</button>
        </div>
      )}
    </main>
  );
}