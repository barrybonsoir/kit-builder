"use client";
import { useState, useEffect } from 'react';

const countries = [
  { name: "Argentina", code: "ARG", color: "#74ACDF" }, { name: "Australia", code: "AUS", color: "#FFCD00" },
  { name: "Brazil", code: "BRA", color: "#009739" }, { name: "Belgium", code: "BEL", color: "#EF3340" },
  { name: "Canada", code: "CAN", color: "#FF0000" }, { name: "Cameroon", code: "CMR", color: "#007A5E" },
  { name: "Chile", code: "CHI", color: "#0039A6" }, { name: "Colombia", code: "COL", color: "#FCD116" },
  { name: "Croatia", code: "CRO", color: "#FF0000" }, { name: "Denmark", code: "DEN", color: "#C60C30" },
  { name: "Ecuador", code: "ECU", color: "#FFDD00" }, { name: "England", code: "ENG", color: "#FFFFFF" },
  { name: "France", code: "FRA", color: "#002395" }, { name: "Germany", code: "GER", color: "#000000" },
  { name: "Ghana", code: "GHA", color: "#FCD116" }, { name: "Italy", code: "ITA", color: "#008C45" },
  { name: "Japan", code: "JPN", color: "#BC002D" }, { name: "Mexico", code: "MEX", color: "#006847" },
  { name: "Morocco", code: "MAR", color: "#C1272D" }, { name: "Netherlands", code: "NED", color: "#F36C21" },
  { name: "Nigeria", code: "NGA", color: "#008751" }, { name: "Portugal", code: "POR", color: "#FF0000" },
  { name: "Qatar", code: "QAT", color: "#8A1538" }, { name: "Saudi Arabia", code: "KSA", color: "#006C35" },
  { name: "Senegal", code: "SEN", color: "#FCD116" }, { name: "Serbia", code: "SRB", color: "#C6363C" },
  { name: "South Korea", code: "KOR", color: "#CD2E3A" }, { name: "Spain", code: "ESP", color: "#C60B1E" },
  { name: "Switzerland", code: "SUI", color: "#D52B1E" }, { name: "Tunisia", code: "TUN", color: "#E70013" },
  { name: "Uruguay", code: "URU", color: "#0038A8" }, { name: "USA", code: "USA", color: "#0A3161" },
  { name: "Wales", code: "WAL", color: "#D30731" }
];

const nationLabels = ["NATION ONE", "NATION TWO", "NATION THREE", "NATION FOUR"];

export default function Home() {
  const [activeSlot, setActiveSlot] = useState(null);
  const [selections, setSelections] = useState([null, null, null, null]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [uiHidden, setUiHidden] = useState(false);

  useEffect(() => {
    document.body.style.overflow = (activeSlot !== null || isGenerating) ? 'hidden' : 'unset';
  }, [activeSlot, isGenerating]);

  const selectCountry = (country) => {
    const newSels = [...selections];
    newSels[activeSlot] = country;
    setSelections(newSels);
    setActiveSlot(null);
  };

  const triggerSynthesis = () => {
    if (selections.includes(null)) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowResult(true);
    }, 3200);
  };

  const getTextColor = (hex) => {
    const light = ["#FFFFFF", "#FCD116", "#FFCD00", "#FFDD00", "#74ACDF"];
    return light.includes(hex?.toUpperCase()) ? "#000" : "#FFF";
  };

  return (
    <main style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', position: 'relative' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono&display=swap');
        
        main::before {
          content: "";
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none;
          opacity: 0.15;
          z-index: 1;
          background-image: linear-gradient(#FF0000 1px, transparent 1px), linear-gradient(90deg, #FF0000 1px, transparent 1px);
          background-size: 80px 80px;
        }

        .nation-btn {
          border: none;
          padding: 20px;
          cursor: pointer;
          transition: 0.3s cubic-bezier(0.19, 1, 0.22, 1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 240px;
          position: relative;
          z-index: 5;
        }

        .overlay {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background: #000;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .bar-container { width: 300px; height: 4px; background: #222; margin-top: 20px; overflow: hidden; }
        .bar-fill { height: 100%; background: #FF0000; animation: fill 3s forwards; }
        @keyframes fill { 0% { width: 0%; } 100% { width: 100%; } }

        .result-quad {
          display: grid;
          grid-template-columns: 1fr 1fr;
          width: 90vw;
          max-width: 550px;
          aspect-ratio: 1/1;
          border: 15px solid #000;
          position: relative;
        }

        .country-row {
          width: 100%;
          border: none;
          text-align: left;
          padding: 12px 30px;
          font-family: "Bebas Neue", sans-serif;
          font-size: 4rem;
          cursor: pointer;
        }

        .meta-tag {
          font-family: "Space Mono", monospace;
          font-size: 0.65rem;
          text-transform: uppercase;
          background: #000;
          color: #FFF;
          padding: 4px 8px;
          margin-bottom: 2px;
          display: inline-block;
        }
      `}</style>

      {!showResult ? (
        <>
          <header style={{ textAlign: 'center', padding: '60px 20px 40px 20px', borderBottom: '25px solid #FF0000', position: 'relative', zIndex: 10, backgroundColor: '#FFF' }}>
            <img src="/logo-red.png" alt="Fair Weather Fandom" style={{ width: '100%', maxWidth: '750px', marginBottom: '30px' }} />
            <div style={{ borderTop: '4px solid #000', borderBottom: '4px solid #000', padding: '15px 0', width: '100%', maxWidth: '700px', margin: '0 auto' }}>
              <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '1rem', margin: 0 }}>
                SYNTHESIZING MULTIPLE LOYALTIES INTO A SINGLE VISUAL ASSET.
              </p>
            </div>
          </header>

          <div style={{ maxWidth: '1100px', margin: '60px auto', padding: '0 40px', position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              {nationLabels.map((label, i) => (
                <button 
                  key={i} 
                  className="nation-btn" 
                  onClick={() => setActiveSlot(i)}
                  style={{ backgroundColor: selections[i]?.color || "#000", color: getTextColor(selections[i]?.color || "#000") }}
                >
                  <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.7rem', position: 'absolute', top: '20px', opacity: 0.8 }}>{label}</span>
                  <h2 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: selections[i] ? '9rem' : '3.5rem', margin: 0 }}>
                    {selections[i] ? selections[i].code : "SELECT"}
                  </h2>
                </button>
              ))}
            </div>

            <div style={{ marginTop: '80px', textAlign: 'center' }}>
              <button 
                onClick={triggerSynthesis}
                disabled={selections.includes(null)}
                style={{ 
                  backgroundColor: selections.includes(null) ? '#CCC' : '#000', 
                  color: '#FFF', 
                  padding: '35px 0', 
                  width: '100%', 
                  maxWidth: '850px', 
                  fontSize: '2.5rem', 
                  fontFamily: '"Bebas Neue", sans-serif', 
                  border: 'none', 
                  cursor: selections.includes(null) ? 'not-allowed' : 'pointer',
                  boxShadow: selections.includes(null) ? 'none' : '15px 15px 0px #FF0000',
                  letterSpacing: '0.15em'
                }}
              >
                GENERATE ART
              </button>
            </div>
          </div>
        </>
      ) : (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', position: 'relative', zIndex: 10, padding: '20px' }}>
           
           {!uiHidden && <h1 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '3rem', marginBottom: '30px' }}>LOYALTY_MAPPING_COMPLETE</h1>}
           
           <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end', flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>
              {/* Metadata Column */}
              {!uiHidden && (
                <div style={{ width: '180px', textAlign: 'left' }}>
                  <div className="meta-tag">Device: Web_V1</div>
                  <div className="meta-tag">Loc: Chicago_Core</div>
                  <div className="meta-tag">Date: 04.27.2026</div>
                  <div style={{ marginTop: '20px', borderTop: '2px solid #000', paddingTop: '10px' }}>
                    {selections.map((s, i) => (
                      <div key={i} style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.6rem', marginBottom: '5px' }}>
                        [{s.code}] HEX: {s.color}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* The Core Asset */}
              <div className="result-quad">
                  {selections.map((s, i) => (
                    <div key={i} style={{ backgroundColor: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '9rem', color: getTextColor(s.color) }}>{s.code}</span>
                    </div>
                  ))}
                  {/* Subtle Branding Overlays */}
                  <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: '#000', color: '#FFF', padding: '2px 6px', fontFamily: '"Space Mono", monospace', fontSize: '0.5rem' }}>
                    FWF_2026_GEN
                  </div>
              </div>
           </div>

           {!uiHidden && (
             <div style={{ display: 'flex', gap: '15px', marginTop: '60px' }}>
                <button 
                  onClick={() => { setUiHidden(true); setTimeout(() => setUiHidden(false), 5000); }}
                  style={{ background: '#FF0000', color: '#FFF', padding: '15px 30px', border: 'none', fontFamily: '"Bebas Neue", sans-serif', fontSize: '1.5rem', cursor: 'pointer' }}
                >
                  CLEAN VIEW FOR SCREENSHOT
                </button>
                <button 
                  onClick={() => { setShowResult(false); setSelections([null, null, null, null]); }}
                  style={{ background: '#000', color: '#FFF', padding: '15px 30px', border: 'none', fontFamily: '"Bebas Neue", sans-serif', fontSize: '1.5rem', cursor: 'pointer' }}
                >
                  NEW SESSION [X]
                </button>
             </div>
           )}

           {uiHidden && <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', fontFamily: '"Space Mono", monospace', fontSize: '0.8rem', color: '#888' }}>UI HIDDEN FOR CAPTURE... RESTORING IN 5S</div>}
        </div>
      )}

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="overlay">
          <h2 style={{ color: '#FFF', fontFamily: '"Bebas Neue", sans-serif', fontSize: '6rem', margin: 0 }}>SYNTHESIZING</h2>
          <div className="bar-container"><div className="bar-fill"></div></div>
        </div>
      )}

      {/* Country List Overlay */}
      {activeSlot !== null && (
        <div className="overlay" style={{ display: 'block', overflowY: 'auto' }}>
          <div style={{ position: 'sticky', top: 0, background: '#000', padding: '20px', display: 'flex', justifyContent: 'space-between', borderBottom: '5px solid #FFF', zIndex: 1100 }}>
            <h3 style={{ color: '#FFF', fontFamily: '"Space Mono", monospace', margin: 0 }}>ASSIGNING NATION {activeSlot + 1}</h3>
            <button onClick={() => setActiveSlot(null)} style={{ background: '#FF0000', color: '#FFF', border: 'none', padding: '10px 20px', fontFamily: '"Space Mono", monospace', cursor: 'pointer' }}>BACK</button>
          </div>
          {countries.map((c) => (
            <button key={c.name} className="country-row" style={{ backgroundColor: c.color, color: getTextColor(c.color) }} onClick={() => selectCountry(c)}>
              {c.name}
            </button>
          ))}
        </div>
      )}
    </main>
  );
}