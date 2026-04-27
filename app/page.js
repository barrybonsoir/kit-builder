"use client";
import { useState, useEffect } from 'react';

const countries = [
  { name: "Argentina", code: "ARG", color: "#74ACDF" },
  { name: "Brazil", code: "BRA", color: "#009739" },
  { name: "Croatia", code: "CRO", color: "#FF0000" },
  { name: "Germany", code: "GER", color: "#000000" },
  { name: "USA", code: "USA", color: "#0A3161" },
  { name: "Japan", code: "JPN", color: "#BC002D" },
  { name: "England", code: "ENG", color: "#FFFFFF" },
  { name: "Mexico", code: "MEX", color: "#006847" },
  { name: "Netherlands", code: "NED", color: "#F36C21" },
  { name: "Italy", code: "ITA", color: "#008C45" },
  { name: "France", code: "FRA", color: "#002395" },
  { name: "Spain", code: "ESP", color: "#C60B1E" },
  { name: "Canada", code: "CAN", color: "#FF0000" },
  { name: "Morocco", code: "MAR", color: "#C1272D" },
  { name: "Portugal", code: "POR", color: "#FF0000" },
  { name: "Belgium", code: "BEL", color: "#EF3340" },
  { name: "Colombia", code: "COL", color: "#FCD116" },
  { name: "Uruguay", code: "URU", color: "#0081C6" },
  { name: "Switzerland", code: "SUI", color: "#FF0000" },
  { name: "Senegal", code: "SEN", color: "#00853F" },
  { name: "Korea Republic", code: "KOR", color: "#CD2E3A" },
  { name: "Denmark", code: "DEN", color: "#C60C30" },
  { name: "Poland", code: "POL", color: "#DC143C" },
  { name: "Australia", code: "AUS", color: "#00008B" },
  { name: "Sweden", code: "SWE", color: "#006AA7" },
  { name: "Ukraine", code: "UKR", color: "#FFD700" },
  { name: "Austria", code: "AUT", color: "#ED2939" },
  { name: "Ecuador", code: "ECU", color: "#FFD931" },
  { name: "Peru", code: "PER", color: "#D91023" },
  { name: "Chile", code: "CHI", color: "#0039A6" },
  { name: "Nigeria", code: "NGA", color: "#008751" },
  { name: "Cameroon", code: "CMR", color: "#478A3E" },
  { name: "Ghana", code: "GHA", color: "#EF3340" },
  { name: "Egypt", code: "EGY", color: "#C1272D" },
  { name: "Tunisia", code: "TUN", color: "#E70013" },
  { name: "Algeria", code: "ALG", color: "#006233" },
  { name: "Saudi Arabia", code: "KSA", color: "#006C35" },
  { name: "Iran", code: "IRN", color: "#239f40" },
  { name: "Iraq", code: "IRQ", color: "#007A3D" },
  { name: "Qatar", code: "QAT", color: "#8D1B3D" },
  { name: "Panama", code: "PAN", color: "#DA121A" },
  { name: "Costa Rica", code: "CRC", color: "#EF3340" },
  { name: "Jamaica", code: "JAM", color: "#FED100" },
  { name: "Norway", code: "NOR", color: "#BA0C2F" },
  { name: "Turkey", code: "TUR", color: "#E30A17" },
  { name: "Scotland", code: "SCO", color: "#005EB8" },
  { name: "Wales", code: "WAL", color: "#D30731" },
  { name: "New Zealand", code: "NZL", color: "#000000" }
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

  const RenderHeraldicCrest = () => {
    const s = selections;
    const paths = s.map(n => `/logos/${n.code}.png`);

    return (
      <svg width="500" height="600" viewBox="0 0 500 600" style={{ 
        backgroundColor: s[3]?.color || '#000', 
        border: '15px solid #000',
        boxShadow: '30px 30px 0px rgba(0,0,0,0.1)',
        display: 'block'
      }}>
        <defs>
          <pattern id="diagStripes" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="2" height="10" fill="#000" fillOpacity="0.1" />
          </pattern>
          
          <clipPath id="shield">
            <path d="M50,20 L450,20 L450,400 C450,550 250,580 250,580 C250,580 50,550 50,400 Z" />
          </clipPath>

          <pattern id="kaleidoscope" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
             <image href={paths[1]} x="0" y="0" width="100" height="100" filter="grayscale(1)" opacity="0.4" />
             <image href={paths[1]} x="100" y="0" width="100" height="100" filter="grayscale(1)" opacity="0.4" transform="scale(-1, 1) translate(-200, 0)" />
             <image href={paths[1]} x="0" y="100" width="100" height="100" filter="grayscale(1)" opacity="0.4" transform="scale(1, -1) translate(0, -200)" />
          </pattern>
        </defs>

        <rect width="500" height="600" fill="url(#diagStripes)" />

        <g clipPath="url(#shield)">
          <rect width="500" height="600" fill={s[0]?.color} />
          <rect width="500" height="600" fill="url(#kaleidoscope)" style={{ mixBlendMode: 'multiply' }} />
          <image href={paths[0]} x="-50" y="-50" width="600" height="600" opacity="0.2" filter="contrast(200%) grayscale(1)" />
          
          <g transform="translate(250, 300)">
            <path d="M-150,0 L0,-180 L150,0 L0,180 Z" fill="#000" />
            <image href={paths[2]} x="-100" y="-100" width="200" height="200" filter="invert(1) brightness(2)" />
          </g>
        </g>

        <rect x="0" y="555" width="500" height="45" fill="#000" />
        <text x="250" y="585" fontFamily="monospace" fontSize="12" fill="#FFF" textAnchor="middle" letterSpacing="3">
          {s[0].code} // {s[1].code} // {s[2].code} // REV_4.0
        </text>
      </svg>
    );
  };

  return (
    <main style={{ backgroundColor: '#FFF', minHeight: '100vh', padding: '40px' }}>
      {!showResult ? (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {nationLabels.map((label, i) => (
              <button 
                key={i}
                onClick={() => setActiveSlot(i)}
                style={{ 
                  height: '180px', border: '5px solid #000', backgroundColor: selections[i]?.color || '#EEE',
                  fontSize: '2rem', fontWeight: 'bold', cursor: 'pointer'
                }}
              >
                {selections[i] ? selections[i].code : label}
              </button>
            ))}
          </div>
          <button 
            disabled={selections.includes(null)}
            onClick={() => { setIsGenerating(true); setTimeout(() => { setIsGenerating(false); setShowResult(true); }, 2000); }}
            style={{ width: '100%', marginTop: '40px', padding: '30px', background: '#000', color: '#FFF', fontSize: '2rem', cursor: 'pointer' }}
          >
            GENERATE COMPLEX ARTEFACT
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <RenderHeraldicCrest />
          <button onClick={() => setShowResult(false)} style={{ marginTop: '40px', padding: '20px', border: '5px solid #000', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>RESET SYSTEM</button>
        </div>
      )}

      {activeSlot !== null && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 100, overflowY: 'auto', padding: '20px' }}>
          <button onClick={() => setActiveSlot(null)} style={{ color: '#FFF', marginBottom: '20px' }}>[CLOSE]</button>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
            {countries.map(c => (
              <button key={c.code} onClick={() => selectCountry(c)} style={{ padding: '15px', background: c.color, border: 'none', fontWeight: 'bold' }}>
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {isGenerating && (
        <div style={{ position: 'fixed', inset: 0, background: '#FF0000', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ color: '#FFF', fontSize: '5rem' }}>BUILDING_HERALDRY...</h1>
        </div>
      )}
    </main>
  );
}