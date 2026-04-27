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

  useEffect(() => {
    if (activeSlot !== null || isGenerating) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [activeSlot, isGenerating]);

  const selectCountry = (country) => {
    const newSels = [...selections];
    newSels[activeSlot] = country;
    setSelections(newSels);
    setActiveSlot(null);
  };

  const getTextColor = (hex) => {
    const light = ["#FFFFFF", "#FCD116", "#FFCD00", "#74ACDF", "#F36C21", "#F4F1EA", "#FED100", "#FFD700"];
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
        <path d="M80,100 L50,200 L80,350 M420,100 L450,200 L420,350" fill="none" stroke={s[3]?.color} strokeWidth="40" strokeOpacity="0.3" />
        <path d="M100,50 L400,50 L400,400 Q400,550 250,580 Q100,550 100,400 Z" fill={s[0]?.color} stroke="#000" strokeWidth="12" />
        <g clipPath="url(#shieldClip)" opacity="0.5">
          <rect x="250" y="50" width="150" height="550" fill={s[1]?.color} />
          <path d="M100,280 L400,280" stroke="#000" strokeWidth="8" />
        </g>
        <g transform="translate(250, 250)">
          <circle r="90" fill="#000" />
          <circle r="82" fill={s[2]?.color} />
          <path d="M-40,-40 L40,40 M40,-40 L-40,40" stroke="#000" strokeWidth="15" />
          <rect x="-20" y="-20" width="40" height="40" fill="#000" />
        </g>
        <rect x="150" y="480" width="200" height="60" fill="#000" />
        <text x="250" y="525" style={{ fontFamily: 'Bebas Neue', fontSize: '48px', fill: '#FFF', textAnchor: 'middle', letterSpacing: '2px' }}>{s[0]?.code}</text>
        <path d="M100,50 L400,50" stroke="#000" strokeWidth="30" />
        <text x="250" y="38" style={{ fontFamily: 'Space Mono', fontSize: '11px', fill: '#FFF', textAnchor: 'middle', letterSpacing: '5px' }}>
          PRO_GEN // {s[1]?.code} // {s[2]?.code}
        </text>
      </svg>
    );
  };

  return (
    <main style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', position: 'relative' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono&display=swap');
        .country-row {
          width: 100%; border: none; text-align: left; padding: 12px 40px;
          font-family: "Bebas Neue", sans-serif; font-size: 2.2rem; cursor: pointer;
          border-bottom: 1px solid rgba(255,255,255,0.1); transition: opacity 0.2s;
        }
        .country-row:hover { opacity: 0.8; }
        .nation-btn {
          border: 4px solid #000; display: flex; flex-direction: column; 
          align-items: center; justify-content: center; min-height: 220px; cursor: pointer;
          transition: background 0.2s cubic-bezier(0.19, 1, 0.22, 1);
        }
      `}</style>

      {!showResult ? (
        <>
          <header style={{ textAlign: 'center', padding: '60px 20px 40px 20px', borderBottom: '20px solid #FF0000', position: 'relative', zIndex: 10, backgroundColor: '#FFF' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-red.png" alt="Fair Weather Fandom" style={{ width: '100%', maxWidth: '700px', marginBottom: '20px' }} />
            <div style={{ borderTop: '4px solid #000', borderBottom: '4px solid #000', padding: '15px 0', width: '100%', maxWidth: '700px', margin: '0 auto' }}>
              <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.9rem', margin: 0, letterSpacing: '0.05em' }}>
                FOR THE UNDECIDED. SELECT FOUR NATIONS TO SYNTHESIZE A DYNAMIC CREST.
              </p>
            </div>
          </header>

          <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 40px', position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
              {nationLabels.map((label, i) => (
                <button 
                  key={label} 
                  className="nation-btn" 
                  onClick={() => setActiveSlot(i)}
                  style={{ backgroundColor: selections[i]?.color || "#FFF" }}
                >
                  <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.65rem', marginBottom: '10px', color: (selections[i] && getTextColor(selections[i].color) === "#FFF") ? "#FFF" : "#000" }}>{label}</span>
                  <h2 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: selections[i] ? '7rem' : '3rem', margin: 0, color: (selections[i] && getTextColor(selections[i].color) === "#FFF") ? "#FFF" : "#000" }}>
                    {selections[i] ? selections[i].code : "SELECT+"}
                  </h2>
                </button>
              ))}
            </div>

            <div style={{ marginTop: '60px', textAlign: 'center' }}>
              <button 
                onClick={() => { setIsGenerating(true); setTimeout(() => { setIsGenerating(false); setShowResult(true); }, 3000); }}
                disabled={selections.includes(null)}
                style={{ 
                  backgroundColor: '#000', color: '#FFF', padding: '30px 0', width: '100%', 
                  maxWidth: '800px', fontSize: '2.5rem', fontFamily: '"Bebas Neue", sans-serif', 
                  border: 'none', cursor: selections.includes(null) ? 'not-allowed' : 'pointer',
                  opacity: selections.includes(null) ? 0.3 : 1, boxShadow: '15px 15px 0px #FF0000', letterSpacing: '0.1em'
                }}
              >
                GENERATE CREST
              </button>
            </div>
          </div>
        </>
      ) : (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9F7F2', padding: '40px' }}>
          <RenderHeraldicCrest />
          <div style={{ marginTop: '60px', display: 'flex', gap: '20px' }}>
             <button onClick={() => { setShowResult(false); setSelections([null, null, null, null]); }} style={{ background: '#000', color: '#FFF', padding: '20px 40px', border: 'none', fontFamily: 'Bebas Neue', fontSize: '1.8rem', cursor: 'pointer' }}>NEW SESSION [X]</button>
          </div>
        </div>
      )}

      {activeSlot !== null && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: '#000', zIndex: 3000, overflowY: 'auto' }}>
          <div style={{ position: 'sticky', top: 0, background: '#FF0000', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 3001 }}>
             <span style={{ color: '#FFF', fontFamily: 'Space Mono', fontSize: '1.1rem' }}>SELECT DATA // {nationLabels[activeSlot]}</span>
             <button onClick={() => setActiveSlot(null)} style={{ background: '#000', color: '#FFF', border: 'none', padding: '8px 15px', fontFamily: 'Bebas Neue', fontSize: '1rem', cursor: 'pointer' }}>CLOSE</button>
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
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '5rem', color: '#FFF' }}>SYNTHESIZING_HERALDRY</h2>
          <div style={{ width: '300px', height: '6px', background: '#222', marginTop: '20px' }}>
            <div style={{ height: '100%', background: '#FF0000', animation: 'load 3s forwards' }} />
          </div>
        </div>
      )}
      <style>{`@keyframes load { from { width: 0% } to { width: 100% } }`}</style>
    </main>
  );
}