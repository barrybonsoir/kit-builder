"use client";
import { useState } from 'react';

const countries = [
  { name: "Algeria", code: "ALG", color: "#006233" }, { name: "Argentina", code: "ARG", color: "#74ACDF" },
  { name: "Australia", code: "AUS", color: "#00008B" }, { name: "Austria", code: "AUT", color: "#ED2939" },
  { name: "Belgium", code: "BEL", color: "#EF3340" }, { name: "Bosnia Herzegovina", code: "BIH", color: "#002395" },
  { name: "Brazil", code: "BRA", color: "#009739" }, { name: "Canada", code: "CAN", color: "#FF0000" },
  { name: "Cape Verde", code: "CPV", color: "#003893" }, { name: "Colombia", code: "COL", color: "#FCD116" },
  { name: "Croatia", code: "CRO", color: "#FF0000" }, { name: "Curacao", code: "CUR", color: "#002B7F" },
  { name: "Czechia", code: "CZE", color: "#11457E" }, { name: "DR Congo", code: "COD", color: "#007FFF" },
  { name: "Ecuador", code: "ECU", color: "#FFD931" }, { name: "Egypt", code: "EGY", color: "#C1272D" },
  { name: "England", code: "ENG", color: "#FFFFFF" }, { name: "France", code: "FRA", color: "#002395" },
  { name: "Germany", code: "GER", color: "#000000" }, { name: "Ghana", code: "GHA", color: "#EF3340" },
  { name: "Haiti", code: "HAI", color: "#00209F" }, { name: "Iran", code: "IRN", color: "#239f40" },
  { name: "Iraq", code: "IRQ", color: "#007A3D" }, { name: "Ivory Coast", code: "CIV", color: "#FF8800" },
  { name: "Japan", code: "JPN", color: "#BC002D" }, { name: "Jordan", code: "JOR", color: "#CE1126" },
  { name: "Mexico", code: "MEX", color: "#006847" }, { name: "Morocco", code: "MAR", color: "#C1272D" },
  { name: "Netherlands", code: "NED", color: "#F36C21" }, { name: "New Zealand", code: "NZL", color: "#000000" },
  { name: "Norway", code: "NOR", color: "#BA0C2F" }, { name: "Panama", code: "PAN", color: "#DA121A" },
  { name: "Paraguay", code: "PAR", color: "#D52B1E" }, { name: "Portugal", code: "POR", color: "#FF0000" },
  { name: "Qatar", code: "QAT", color: "#8D1B3D" }, { name: "Saudi Arabia", code: "KSA", color: "#006C35" },
  { name: "Scotland", code: "SCO", color: "#005EB8" }, { name: "Senegal", code: "SEN", color: "#00853F" },
  { name: "South Africa", code: "RSA", color: "#007749" }, { name: "South Korea", code: "KOR", color: "#CD2E3A" },
  { name: "Spain", code: "ESP", color: "#C60B1E" }, { name: "Sweden", code: "SWE", color: "#006AA7" },
  { name: "Switzerland", code: "SUI", color: "#FF0000" }, { name: "Tunisia", code: "TUN", color: "#E70013" },
  { name: "Turkiye", code: "TUR", color: "#E30A17" }, { name: "United States", code: "USA", color: "#0A3161" },
  { name: "Uruguay", code: "URU", color: "#0081C6" }, { name: "Uzbekistan", code: "UZB", color: "#0099B5" }
];

const labels = ["NATION ONE", "NATION TWO", "NATION THREE", "NATION FOUR"];

export default function Home() {
  const [activeSlot, setActiveSlot] = useState(null);
  const [selections, setSelections] = useState([null, null, null, null]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // HELPER FUNCTIONS INSIDE COMPONENT FOR BUILD SAFETY
  const getImagePath = (country) => {
    if (!country) return "";
    const fileName = country.name.toLowerCase().replace(/\s+/g, '-');
    return `/logos/${fileName}.png`;
  };

  const getTextColor = (hex) => {
    if (!hex) return "#000000";
    const light = ["#FFFFFF", "#FCD116", "#FFCD00", "#74ACDF", "#F36C21", "#F4F1EA", "#FED100", "#FFD700", "#FFD931"];
    return light.includes(hex.toUpperCase()) ? "#000000" : "#FFFFFF";
  };

  const selectCountry = (country) => {
    const newSels = [...selections];
    newSels[activeSlot] = country;
    setSelections(newSels);
    setActiveSlot(null);
  };

  const RenderHeraldicCrest = () => {
    const positions = ['right bottom', 'left bottom', 'right top', 'left top'];
    return (
      <div style={{ 
        width: '500px', 
        height: '500px', 
        backgroundColor: '#000', 
        border: '20px solid #000',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: '4px',
        boxShadow: '40px 40px 0px rgba(0,0,0,0.1)',
        position: 'relative'
      }}>
        {selections.map((country, i) => (
          <div key={i} style={{ backgroundColor: country.color, overflow: 'hidden', display: 'flex' }}>
            <img 
              src={getImagePath(country)} 
              alt={country.name}
              style={{
                width: '200%',
                height: '200%',
                objectFit: 'contain',
                objectPosition: positions[i],
                mixBlendMode: 'multiply',
                opacity: 0.85
              }}
            />
          </div>
        ))}
        <div style={{ position: 'absolute', bottom: '-45px', left: '-20px', width: 'calc(100% + 40px)', display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: '10px', color: '#000', background: '#FFF', padding: '5px 10px' }}>
          <span>REF: {selections.map(s => s.code).join('x')}</span>
          <span>COMPOSITE_BUILD_V5</span>
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
                SYNTHESIZING HERALDRY FOR THE UNDECIDED. 48 NATIONS // INFINITE COMBINATIONS.
              </p>
            </div>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {labels.map((label, i) => (
              <button key={i} onClick={() => setActiveSlot(i)} style={{ height: '220px', border: '6px solid #000', borderRadius: 0, backgroundColor: selections[i]?.color || '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.85rem', color: getTextColor(selections[i]?.color), marginBottom: '10px', pointerEvents: 'none' }}>{label}</span>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '6rem', lineHeight: '1', color: getTextColor(selections[i]?.color), pointerEvents: 'none' }}>{selections[i] ? selections[i].code : "+"}</span>
              </button>
            ))}
          </div>

          <button disabled={selections.includes(null)} onClick={() => { setIsGenerating(true); setTimeout(() => { setIsGenerating(false); setShowResult(true); }, 2500); }} style={{ width: '100%', marginTop: '40px', padding: '30px', background: '#000000', color: '#FFFFFF', fontSize: '3.5rem', fontFamily: "'Bebas Neue', sans-serif", cursor: 'pointer', opacity: selections.includes(null) ? 0.2 : 1, border: 'none' }}>COMPILE EMBLEM</button>
        </div>
      ) : (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
          <RenderHeraldicCrest />
          <button onClick={() => { setShowResult(false); setSelections([null, null, null, null]); }} style={{ marginTop: '80px', padding: '20px 40px', background: '#000', color: '#FFF', fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', border: 'none', cursor: 'pointer' }}>NEW SESSION [X]</button>
        </div>
      )}

      {activeSlot !== null && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000', zIndex: 9999, overflowY: 'scroll' }}>
          <div style={{ position: 'sticky', top: 0, background: '#FF0000', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10000 }}>
            <span style={{ color: '#FFFFFF', fontFamily: "'Space Mono', monospace", fontSize: '1.2rem' }}>SELECT_STREAM // {labels[activeSlot]}</span>
            <button onClick={() => setActiveSlot(null)} style={{ background: '#000000', color: '#FFFFFF', border: 'none', padding: '10px 20px', cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem' }}>CLOSE</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {countries.map(c => (
              <button key={c.code} onClick={() => selectCountry(c)} style={{ width: '100%', padding: '30px 40px', background: c.color, border: 'none', borderBottom: '1px solid rgba(0,0,0,0.1)', textAlign: 'left', cursor: 'pointer', display: 'block' }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '4rem', color: getTextColor(c.color), pointerEvents: 'none' }}>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {isGenerating && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000', zIndex: 10000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ color: '#FFFFFF', fontSize: '6rem', fontFamily: "'Bebas Neue', sans-serif", margin: 0 }}>GENERATING_EMBLEM</h1>
          <div style={{ width: '400px', height: '20px', background: '#333333', marginTop: '30px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: '#FF0000', width: '100%', transformOrigin: 'left', animation: 'progress 2.5s ease-in-out forwards' }}></div>
          </div>
        </div>
      )}
      <style>{`@keyframes progress { 0% { transform: scaleX(0); } 100% { transform: scaleX(1); } }`}</style>
    </main>
  );
}