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

  useEffect(() => {
    document.body.style.overflow = activeSlot !== null ? 'hidden' : 'unset';
  }, [activeSlot]);

  const selectCountry = (country) => {
    const newSels = [...selections];
    newSels[activeSlot] = country;
    setSelections(newSels);
    setActiveSlot(null);
  };

  // Helper for text contrast
  const getTextColor = (hex) => {
    const lightColors = ["#FFFFFF", "#FCD116", "#FFCD00", "#FFDD00"];
    return lightColors.includes(hex.toUpperCase()) ? "#000" : "#FFF";
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
          transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 220px;
          position: relative;
          z-index: 5;
          text-align: center;
        }

        .overlay {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background: #000;
          z-index: 1000;
          overflow-y: auto;
        }

        .country-row {
          width: 100%;
          padding: 30px 20px;
          cursor: pointer;
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(3rem, 7vw, 6rem);
          line-height: 0.8;
          text-transform: uppercase;
          border: none;
          text-align: left;
        }

        .country-row:hover {
          filter: brightness(1.2);
          padding-left: 50px;
          transition: 0.2s;
        }
      `}</style>

      <header style={{ textAlign: 'center', padding: '60px 20px 40px 20px', borderBottom: '25px solid #FF0000', position: 'relative', zIndex: 10, backgroundColor: '#FFF' }}>
        <img src="/logo-red.png" alt="Fair Weather Fandom" style={{ width: '100%', maxWidth: '750px', marginBottom: '30px' }} />
        <div style={{ borderTop: '4px solid #000', borderBottom: '4px solid #000', padding: '15px 0', width: '100%', maxWidth: '700px', margin: '0 auto' }}>
          <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '1rem', margin: 0 }}>
            For when you just can't decide who to root for. Pick up to four countries participating in this year's tournanent. The tool will then generate your custom loyalty art.
          </p>
        </div>
      </header>

      <div style={{ maxWidth: '1100px', margin: '60px auto', padding: '0 40px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {nationLabels.map((label, i) => {
            const selection = selections[i];
            const bgColor = selection ? selection.color : "#000";
            const textColor = selection ? getTextColor(selection.color) : "#FFF";

            return (
              <button 
                key={i} 
                className="nation-btn" 
                onClick={() => setActiveSlot(i)}
                style={{ backgroundColor: bgColor, color: textColor }}
              >
                <span style={{ 
                  fontFamily: '"Space Mono", monospace', 
                  fontSize: '0.7rem', 
                  opacity: 0.8, 
                  position: 'absolute', 
                  top: '20px' 
                }}>
                  {label}
                </span>
                <h2 style={{ 
                  fontFamily: '"Bebas Neue", sans-serif', 
                  fontSize: selection ? '8rem' : '3.5rem', 
                  margin: 0, 
                  lineHeight: '1' 
                }}>
                  {selection ? selection.code : "SELECT_"}
                </h2>
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: '80px', textAlign: 'center' }}>
          <button style={{ backgroundColor: '#000', color: '#FFF', padding: '30px 0', width: '100%', maxWidth: '850px', fontSize: '2.5rem', fontFamily: '"Bebas Neue", sans-serif', border: 'none', cursor: 'pointer', boxShadow: '15px 15px 0px #FF0000' }}>
            GENERATE ART
          </button>
        </div>
      </div>

      {activeSlot !== null && (
        <div className="overlay">
          <div style={{ position: 'sticky', top: 0, background: '#000', padding: '20px', display: 'flex', justifyContent: 'space-between', borderBottom: '5px solid #FFF' }}>
            <h3 style={{ color: '#FFF', fontFamily: '"Space Mono", monospace', margin: 0 }}>{nationLabels[activeSlot]}</h3>
            <button onClick={() => setActiveSlot(null)} style={{ background: '#FF0000', color: '#FFF', border: 'none', padding: '10px 20px', fontFamily: '"Space Mono", monospace', cursor: 'pointer' }}>CLOSE [X]</button>
          </div>
          {countries.map((c) => (
            <button 
              key={c.name} 
              className="country-row" 
              style={{ backgroundColor: c.color, color: getTextColor(c.color) }}
              onClick={() => selectCountry(c)}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}
    </main>
  );
}