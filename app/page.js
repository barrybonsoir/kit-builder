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

const labels = ["QUAD_01", "QUAD_02", "CORE_GEOM", "BG_TINT"];

const getImagePath = (country) => {
  if (!country) return "";
  const fileName = country.name.toLowerCase().replace(/\s+/g, '-');
  return `/logos/${fileName}.png`;
};

const RenderHeraldicCrest = ({ selections }) => {
  if (selections.includes(null)) return null;

  const bgImage = getImagePath(selections[0]);
  const coreImage = getImagePath(selections[2]);

  return (
    <div style={{ position: 'relative', width: '600px', height: '600px', backgroundColor: selections[3]?.color || '#000', overflow: 'hidden' }}>
      
      {/* LAYER 1: RORSCHACH BASE */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.2, filter: 'grayscale(1) contrast(300%)' }}>
        <img src={bgImage} style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '50%', objectFit: 'contain' }} alt="" />
        <img src={bgImage} style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '50%', objectFit: 'contain', transform: 'scaleX(-1)' }} alt="" />
        <img src={bgImage} style={{ position: 'absolute', bottom: 0, left: 0, width: '50%', height: '50%', objectFit: 'contain', transform: 'scaleY(-1)' }} alt="" />
        <img src={bgImage} style={{ position: 'absolute', bottom: 0, right: 0, width: '50%', height: '50%', objectFit: 'contain', transform: 'scale(-1, -1)' }} alt="" />
      </div>

      {/* LAYER 2: KALEIDOSCOPE GRID */}
      <div style={{ 
        position: 'absolute', 
        inset: '40px', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gridTemplateRows: 'repeat(4, 1fr)',
        mixBlendMode: 'screen',
      }}>
        {[...Array(16)].map((_, index) => {
          const isFlippedX = index % 2 === 1;
          const isFlippedY = Math.floor(index / 4) % 2 === 1;
          return (
            <div key={index} style={{ position: 'relative', width: '100%', height: '100%' }}>
              <img 
                src={coreImage} 
                style={{
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain',
                  transform: `scale(${isFlippedX ? -1 : 1}, ${isFlippedY ? -1 : 1})`,
                  opacity: 0.8
                }} 
                alt=""
              />
            </div>
          );
        })}
      </div>

      {/* LAYER 3: FIXED TOP OVERLAY (GRID & + MARKS) */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 50, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', background: '#000', opacity: 0.2 }}></div>
        <div style={{ position: 'absolute', top: 0, left: '50%', width: '1px', height: '100%', background: '#000', opacity: 0.2 }}></div>
        
        {/* Registration Pluses */}
        {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(pos => (
          <div key={pos} style={{ 
            position: 'absolute', 
            fontFamily: 'monospace', 
            fontSize: '24px', 
            color: '#000', 
            fontWeight: 'bold',
            top: pos.includes('top') ? '10px' : 'auto',
            bottom: pos.includes('bottom') ? '10px' : 'auto',
            left: pos.includes('left') ? '10px' : 'auto',
            right: pos.includes('right') ? '10px' : 'auto'
          }}>+</div>
        ))}

        <div style={{ 
          position: 'absolute', 
          bottom: '40px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          fontFamily: 'monospace', 
          fontSize: '10px', 
          color: '#FFF', 
          backgroundColor: '#000', 
          padding: '5px 12px',
          letterSpacing: '2px'
        }}>
          ARTEFACT_{selections.map(s => s?.code).join('_')}
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [activeSlot, setActiveSlot] = useState(null);
  const [selections, setSelections] = useState([null, null, null, null]);
  const [showResult, setShowResult] = useState(false);

  const getTextColor = (hex) => {
    const light = ["#FFFFFF", "#FCD116", "#FFCD00", "#74ACDF", "#F36C21"];
    return hex && light.includes(hex.toUpperCase()) ? "#000" : "#FFF";
  };

  return (
    <main style={{ backgroundColor: '#FFF', minHeight: '100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono&display=swap" rel="stylesheet" />

      {!showResult ? (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {labels.map((label, i) => (
              <button key={i} onClick={() => setActiveSlot(i)} style={{ 
                height: '200px', 
                border: '4px solid #000', 
                backgroundColor: selections[i]?.color || '#EEE', 
                cursor: 'pointer' 
              }}>
                <div style={{ fontFamily: 'monospace', fontSize: '12px', color: getTextColor(selections[i]?.color) }}>{label}</div>
                <div style={{ fontFamily: 'Bebas Neue', fontSize: '5rem', color: getTextColor(selections[i]?.color) }}>
                  {selections[i] ? selections[i].code : "+"}
                </div>
              </button>
            ))}
          </div>
          <button 
            disabled={selections.includes(null)} 
            onClick={() => setShowResult(true)}
            style={{ width: '100%', marginTop: '30px', padding: '25px', background: '#000', color: '#FFF', fontFamily: 'Bebas Neue', fontSize: '3rem', cursor: 'pointer', opacity: selections.includes(null) ? 0.3 : 1 }}
          >COMPILE_GEN_MARK</button>
        </div>
      ) : (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <RenderHeraldicCrest selections={selections} />
          <button onClick={() => { setShowResult(false); setSelections([null, null, null, null]); }} style={{ marginTop: '50px', padding: '15px 30px', background: '#000', color: '#FFF', fontFamily: 'Bebas Neue', fontSize: '1.5rem', cursor: 'pointer' }}>RESET_ARRAY</button>
        </div>
      )}

      {activeSlot !== null && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 100, overflowY: 'auto' }}>
          <div style={{ position: 'sticky', top: 0, background: '#FF0000', padding: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#FFF', fontFamily: 'monospace' }}>LOAD_COMPONENT_{activeSlot}</span>
            <button onClick={() => setActiveSlot(null)} style={{ background: '#000', color: '#FFF', border: 'none', padding: '10px' }}>BACK</button>
          </div>
          {countries.map(c => (
            <button key={c.code} onClick={() => { const s = [...selections]; s[activeSlot] = c; setSelections(s); setActiveSlot(null); }} style={{ width: '100%', padding: '20px', background: c.color, border: 'none', textAlign: 'left', cursor: 'pointer' }}>
              <span style={{ fontFamily: 'Bebas Neue', fontSize: '3rem', color: getTextColor(c.color) }}>{c.name}</span>
            </button>
          ))}
        </div>
      )}
    </main>
  );
}