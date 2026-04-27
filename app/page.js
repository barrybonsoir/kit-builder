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

const labels = ["TOP LEFT", "TOP RIGHT", "BOTTOM LEFT", "BOTTOM RIGHT"];

const RenderHeraldicCrest = ({ selections, getImagePath }) => {
  const clips = [
    'inset(0 50% 50% 0)', 
    'inset(0 0 50% 50%)', 
    'inset(50% 50% 0 0)', 
    'inset(50% 0 0 50%)'  
  ];

  const CornerPlus = ({ style }) => (
    <div style={{ position: 'absolute', fontFamily: 'monospace', fontSize: '24px', color: '#000', fontWeight: 'bold', ...style }}>+</div>
  );

  return (
    <div style={{ position: 'relative', width: '500px', height: '500px' }}>
      {/* Corner Pluses as Register Marks */}
      <CornerPlus style={{ top: '-10px', left: '-10px' }} />
      <CornerPlus style={{ top: '-10px', right: '-10px' }} />
      <CornerPlus style={{ bottom: '-10px', left: '-10px' }} />
      <CornerPlus style={{ bottom: '-10px', right: '-10px' }} />

      <div style={{ 
        width: '500px', 
        height: '500px', 
        position: 'relative', 
        overflow: 'hidden', 
        backgroundColor: '#FFF' 
      }}>
        {selections.map((country, i) => (
          <div key={i} style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            clipPath: clips[i],
            zIndex: i
          }}>
            <img 
              src={getImagePath(country)} 
              alt={country?.name}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%', // Normalizing scale across all variants
                height: '100%',
                objectFit: 'contain',
                padding: '20px'
              }}
            />
          </div>
        ))}
        {/* Hairline Stitch Guide */}
        <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', background: 'rgba(0,0,0,0.05)', zIndex: 10 }}></div>
        <div style={{ position: 'absolute', top: 0, left: '50%', width: '1px', height: '100%', background: 'rgba(0,0,0,0.05)', zIndex: 10 }}></div>
      </div>

      <div style={{ 
        marginTop: '30px', 
        fontFamily: 'monospace', 
        fontSize: '11px', 
        color: '#000', 
        display: 'flex', 
        justifyContent: 'space-between'
      }}>
        <span>SYSTEM_STATUS // ASSET_STITCH_NORM</span>
        <span>{selections.map(s => s?.code).join(' / ')}</span>
      </div>
    </div>
  );
};

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

  return (
    <main style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono&display=swap" rel="stylesheet" />

      {!showResult ? (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 20px' }}>
          <header style={{ textAlign: 'center', marginBottom: '60px' }}>
            <img src="/logo-red.png" alt="FAIR WEATHER" style={{ width: '100%', maxWidth: '600px', marginBottom: '20px' }} />
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {labels.map((label, i) => (
              <button key={i} onClick={() => setActiveSlot(i)} style={{ height: '220px', border: '6px solid #000', backgroundColor: selections[i]?.color || '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.85rem', color: getTextColor(selections[i]?.color), marginBottom: '10px' }}>{label}</span>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '6rem', lineHeight: '1', color: getTextColor(selections[i]?.color) }}>
                  {selections[i] ? selections[i].code : "+"}
                </span>
              </button>
            ))}
          </div>

          <button disabled={selections.includes(null)} onClick={() => { setIsGenerating(true); setTimeout(() => { setIsGenerating(false); setShowResult(true); }, 2500); }} style={{ width: '100%', marginTop: '40px', padding: '30px', background: '#000', color: '#FFF', fontSize: '3.5rem', fontFamily: "'Bebas Neue', sans-serif", cursor: 'pointer', opacity: selections.includes(null) ? 0.2 : 1, border: 'none' }}>COMPILE EMBLEM</button>
        </div>
      ) : (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <RenderHeraldicCrest selections={selections} getImagePath={getImagePath} />
          <button onClick={() => { setShowResult(false); setSelections([null, null, null, null]); }} style={{ marginTop: '80px', padding: '20px 40px', background: '#000', color: '#FFF', fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', border: 'none', cursor: 'pointer' }}>NEW SESSION [X]</button>
        </div>
      )}

      {activeSlot !== null && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000', zIndex: 9999, overflowY: 'scroll' }}>
          <div style={{ position: 'sticky', top: 0, background: '#FF0000', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#FFF', fontFamily: "'Space Mono', monospace" }}>SELECT_QUADRANT // {labels[activeSlot]}</span>
            <button onClick={() => setActiveSlot(null)} style={{ background: '#000', color: '#FFF', border: 'none', padding: '10px 20px', cursor: 'pointer' }}>BACK</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {countries.map(c => (
              <button key={c.code} onClick={() => selectCountry(c)} style={{ width: '100%', padding: '30px 40px', background: c.color, border: 'none', borderBottom: '1px solid rgba(0,0,0,0.1)', textAlign: 'left', cursor: 'pointer' }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '4rem', color: getTextColor(c.color) }}>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {isGenerating && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 10000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ color: '#FFF', fontSize: '6rem', fontFamily: "'Bebas Neue', sans-serif" }}>SYNCHRONIZING</h1>
        </div>
      )}
    </main>
  );
}