"use client";
import { useState, useEffect } from 'react';

const countries = [
  { name: "Argentina", code: "ARG", color: "#74ACDF", emblem: "sun" },
  { name: "Brazil", code: "BRA", color: "#009739", emblem: "diamond" },
  { name: "Croatia", code: "CRO", color: "#FF0000", emblem: "checkers" },
  { name: "Germany", code: "GER", color: "#000000", emblem: "eagle" },
  { name: "USA", code: "USA", color: "#0A3161", emblem: "stars" },
  { name: "Japan", code: "JPN", color: "#BC002D", emblem: "circle" },
  { name: "England", code: "ENG", color: "#FFFFFF", emblem: "lion" },
  { name: "Mexico", code: "MEX", color: "#006847", emblem: "eagle-snake" },
  { name: "Netherlands", code: "NED", color: "#F36C21", emblem: "lion-rampant" },
  { name: "Italy", code: "ITA", color: "#008C45", emblem: "star-shield" }
];

const nationLabels = ["NATION ONE", "NATION TWO", "NATION THREE", "NATION FOUR"];

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
    const light = ["#FFFFFF", "#FCD116", "#FFCD00", "#74ACDF", "#F36C21"];
    return light.includes(hex?.toUpperCase()) ? "#000" : "#FFF";
  };

  const RenderHeraldicCrest = () => {
    const s = selections;
    return (
      <svg width="500" height="600" viewBox="0 0 500 600" style={{ filter: 'drop-shadow(30px 30px 0px rgba(0,0,0,0.15))' }}>
        <defs>
          <clipPath id="shieldClip">
            <path d="M100,50 L400,50 L400,400 Q400,550 250,580 Q100,550 100,400 Z" />
          </clipPath>
        </defs>

        {/* LAYER 0: HERALDIC SUPPORTERS (NATION 4 Influence) */}
        <path d="M80,100 L50,200 L80,350 M420,100 L450,200 L420,350" fill="none" stroke={s[3].color} strokeWidth="40" strokeOpacity="0.3" />

        {/* LAYER 1: THE MAIN SHIELD (NATION 1) */}
        <path d="M100,50 L400,50 L400,400 Q400,550 250,580 Q100,550 100,400 Z" fill={s[0].color} stroke="#000" strokeWidth="12" />

        {/* LAYER 2: SHIELD DIVISIONS (NATION 2 Influence) */}
        <g clipPath="url(#shieldClip)" opacity="0.5">
          <rect x="250" y="50" width="150" height="550" fill={s[1].color} />
          <path d="M100,280 L400,280" stroke="#000" strokeWidth="8" />
        </g>

        {/* LAYER 3: CENTRAL EMBLEM (NATION 3 Influence - Abstracted Geometry) */}
        <g transform="translate(250, 250)">
          <circle r="90" fill="#000" />
          <circle r="82" fill={s[2].color} />
          {/* Brutalist Soccer Ball / Target Motif */}
          <path d="M-40,-40 L40,40 M40,-40 L-40,40" stroke="#000" strokeWidth="15" />
          <rect x="-20" y="-20" width="40" height="40" fill="#000" />
        </g>

        {/* LAYER 4: REFINED TYPOGRAPHY */}
        <rect x="150" y="480" width="200" height="60" fill="#000" />
        <text x="250" y="525" style={{ fontFamily: 'Bebas Neue', fontSize: '48px', fill: '#FFF', textAnchor: 'middle', letterSpacing: '2px' }}>{s[0].code}</text>
        
        {/* Banner with ARTE ET LABORE style vibe */}
        <path d="M100,50 L400,50" stroke="#000" strokeWidth="30" />
        <text x="250" y="38" style={{ fontFamily: 'Space Mono', fontSize: '11px', fill: '#FFF', textAnchor: 'middle', letterSpacing: '5px' }}>
          PRO_GEN // {s[1].code} // {s[2].code}
        </text>
      </svg>
    );
  };

  return (
    <main style={{ backgroundColor: '#F9F7F2', minHeight: '100vh', position: 'relative' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono&display=swap');
        
        .country-row {
          width: 100%; border: none; text-align: left; padding: 18px 40px;
          font-family: "Bebas Neue", sans-serif; font-size: 4.5rem; cursor: pointer;
          border-bottom: 1px solid rgba(255,255,255,0.2);
        }
        
        .nation-btn {
          border: 5px solid #000; display: flex; flex-direction: column; 
          align-items: center; justify-content: center; min-height: 250px; cursor: pointer;
          background-color: #FFF; transition: background 0.2s;
        }
      `}</style>

      {!showResult ? (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 20px', position: 'relative', zIndex: 10 }}>
          <header style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '7rem', margin: 0, lineHeight: 0.9 }}>FAIR_WEATHER</h1>
            <p style={{ fontFamily: 'Space Mono', fontSize: '0.9rem', color: '#000', marginTop: '15px' }}>GEOMETRIC_HERALDRY_SYNTHESIZER_V2.6</p>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px' }}>
            {nationLabels.map((label, i) => (
              <button key={i} className="nation-btn" onClick={() => setActiveSlot(i)} style={{ backgroundColor: selections[i]?.color || "#FFF" }}>
                <span style={{ fontFamily: 'Space Mono', fontSize: '0.75rem', marginBottom: '15px', color: selections[i] ? getTextColor(selections[i].color) : '#000' }}>{label}</span>
                <span style={{ fontFamily: 'Bebas Neue', fontSize: '6rem', color: selections[i] ? getTextColor(selections[i].color) : '#000' }}>{selections[i] ? selections[i].code : "---"}</span>
              </button>
            ))}
          </div>

          <button 
            disabled={selections.includes(null)}
            onClick={() => { setIsGenerating(true); setTimeout(() => { setIsGenerating(false); setShowResult(true); }, 3000); }}
            style={{ width: '100%', marginTop: '50px', padding: '35px', background: '#000', color: '#FFF', fontFamily: 'Bebas Neue', fontSize: '3rem', cursor: 'pointer', opacity: selections.includes(null) ? 0.1 : 1, border: 'none' }}
          >
            GENERATE_ASSET
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#F9F7F2' }}>
          <RenderHeraldicCrest />
          <button onClick={() => { setShowResult(false); setSelections([null, null, null, null]); }} style={{ marginTop: '50px', background: 'transparent', color: '#000', padding: '15px 30px', fontFamily: 'Space Mono', fontSize: '0.8rem', border: '2px solid #000', cursor: 'pointer' }}>[ RELOAD_SEQUENCE ]</button>
        </div>
      )}

      {/* FULL WIDTH ROW OVERLAY */}
      {activeSlot !== null && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: '#000', zIndex: 3000, overflowY: 'auto' }}>
          <div style={{ position: 'sticky', top: 0, background: '#FF0000', padding: '25px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <span style={{ color: '#FFF', fontFamily: 'Space Mono', fontSize: '1.2rem' }}>SELECT_CORE_DATA: {nationLabels[activeSlot]}</span>
             <button onClick={() => setActiveSlot(null)} style={{ background: '#000', color: '#FFF', border: 'none', padding: '10px 20px', fontFamily: 'Bebas Neue', fontSize: '1.2rem', cursor: 'pointer' }}>ESC_CLOSE</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {countries.map(c => (
              <button key={c.name} className="country-row" onClick={() => selectCountry(c)} style={{ backgroundColor: c.color, color: getTextColor(c.color) }}>
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {isGenerating && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: '#000', zIndex: 4000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ border: '2px solid #FFF', padding: '40px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '4rem', color: '#FFF', margin: 0 }}>SYNTHESIZING_HERALDRY</h2>
            <p style={{ fontFamily: 'Space Mono', color: '#FF0000', fontSize: '0.8rem' }}>VECTOR_PATHS_MAPPING_IN_PROGRESS...</p>
          </div>
        </div>
      )}
    </main>
  );
}