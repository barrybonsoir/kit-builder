"use client";
import { useState, useEffect } from 'react';

const countries = [
  { name: "Argentina", color: "#74ACDF" }, { name: "Australia", color: "#FFCD00" },
  { name: "Brazil", color: "#009739" }, { name: "Belgium", color: "#EF3340" },
  { name: "Canada", color: "#FF0000" }, { name: "Cameroon", color: "#007A5E" },
  { name: "Chile", color: "#0039A6" }, { name: "Colombia", color: "#FCD116" },
  { name: "Croatia", color: "#FF0000" }, { name: "Denmark", color: "#C60C30" },
  { name: "Ecuador", color: "#FFDD00" }, { name: "England", color: "#FFFFFF" },
  { name: "France", color: "#002395" }, { name: "Germany", color: "#000000" },
  { name: "Ghana", color: "#FCD116" }, { name: "Italy", color: "#008C45" },
  { name: "Japan", color: "#BC002D" }, { name: "Mexico", color: "#006847" },
  { name: "Morocco", color: "#C1272D" }, { name: "Netherlands", color: "#F36C21" },
  { name: "Nigeria", color: "#008751" }, { name: "Portugal", color: "#FF0000" },
  { name: "Qatar", color: "#8A1538" }, { name: "Saudi Arabia", color: "#006C35" },
  { name: "Senegal", color: "#FCD116" }, { name: "Serbia", color: "#C6363C" },
  { name: "South Korea", color: "#CD2E3A" }, { name: "Spain", color: "#C60B1E" },
  { name: "Switzerland", color: "#D52B1E" }, { name: "Tunisia", color: "#E70013" },
  { name: "Uruguay", color: "#0038A8" }, { name: "USA", color: "#0A3161" },
  { name: "Wales", color: "#D30731" }
];

const nationLabels = ["NATION ONE", "NATION TWO", "NATION THREE", "NATION FOUR"];

export default function Home() {
  const [activeSlot, setActiveSlot] = useState(null);
  const [selections, setSelections] = useState([null, null, null, null]);

  // Prevent background scroll when overlay is open
  useEffect(() => {
    if (activeSlot !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [activeSlot]);

  const selectCountry = (country) => {
    const newSels = [...selections];
    newSels[activeSlot] = country;
    setSelections(newSels);
    setActiveSlot(null);
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
          background: #000;
          color: #FFF;
          border: none;
          padding: 40px 25px;
          cursor: pointer;
          text-align: left;
          transition: 0.1s;
          display: flex;
          flex-direction: column;
          min-height: 180px;
          position: relative;
          z-index: 5;
        }

        .nation-btn:hover { background: #FF0000; }

        .overlay {
          position: fixed;
          top: 0; left: 0; 
          width: 100vw; height: 100vh;
          background: #000;
          z-index: 1000;
          overflow-y: auto; /* ENABLES SCROLL */
          -webkit-overflow-scrolling: touch;
        }

        .overlay-header {
          position: sticky;
          top: 0;
          background: #000;
          padding: 20px;
          z-index: 1001;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 5px solid #FFF;
        }

        .country-row {
          width: 100%;
          padding: 25px 20px;
          cursor: pointer;
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(3.5rem, 8vw, 6.5rem);
          line-height: 0.85;
          text-transform: uppercase;
          border: none;
          text-align: left;
          display: block;
        }

        .country-row:hover {
          filter: brightness(1.2);
          padding-left: 50px;
          transition: 0.2s ease;
        }

        /* Minimal scrollbar for the list */
        .overlay::-webkit-scrollbar { width: 8px; }
        .overlay::-webkit-scrollbar-track { background: #000; }
        .overlay::-webkit-scrollbar-thumb { background: #FF0000; }
      `}</style>

      {/* Header */}
      <header style={{ textAlign: 'center', padding: '60px 20px 40px 20px', borderBottom: '25px solid #FF0000', position: 'relative', zIndex: 10, backgroundColor: '#FFF' }}>
        <img src="/logo-red.png" alt="Fair Weather Fandom" style={{ width: '100%', maxWidth: '750px', marginBottom: '30px' }} />
        <div style={{ borderTop: '4px solid #000', borderBottom: '4px solid #000', padding: '15px 0', width: '100%', maxWidth: '700px', margin: '0 auto' }}>
          <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '1rem', margin: 0, color: '#000' }}>
            For when you just don’t know who to root for. Pick up to four countries.
          </p>
        </div>
      </header>

      {/* The 4 Nation Slots */}
      <div style={{ maxWidth: '1100px', margin: '60px auto', padding: '0 30px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {nationLabels.map((label, i) => (
            <button key={i} className="nation-btn" onClick={() => setActiveSlot(i)}>
              <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.75rem', opacity: 0.8, marginBottom: '10px' }}>
                {label}
              </span>
              <h2 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '4.5rem', margin: 0, lineHeight: '1' }}>
                {selections[i] ? selections[i].name : "EMPTY_"}
              </h2>
            </button>
          ))}
        </div>

        <div style={{ marginTop: '80px', textAlign: 'center' }}>
          <button style={{ backgroundColor: '#000', color: '#FFF', padding: '30px 0', width: '100%', maxWidth: '850px', fontSize: '2.5rem', fontFamily: '"Bebas Neue", sans-serif', border: 'none', cursor: 'pointer', boxShadow: '15px 15px 0px #FF0000', letterSpacing: '0.15em' }}>
            GENERATE ART
          </button>
        </div>
      </div>

      {/* Scrollable Overlay List */}
      {activeSlot !== null && (
        <div className="overlay">
          <div className="overlay-header">
            <h3 style={{ color: '#FFF', fontFamily: '"Space Mono", monospace', margin: 0 }}>
              SELECTING: {nationLabels[activeSlot]}
            </h3>
            <button 
              onClick={() => setActiveSlot(null)} 
              style={{ background: '#FF0000', color: '#FFF', border: 'none', padding: '12px 25px', fontFamily: '"Space Mono", monospace', fontWeight: 'bold', cursor: 'pointer' }}
            >
              CANCEL [X]
            </button>
          </div>
          
          <div style={{ paddingBottom: '100px' }}>
            {countries.map((c) => (
              <button 
                key={c.name} 
                className="country-row" 
                style={{ 
                  backgroundColor: c.color, 
                  color: (c.color === "#FFFFFF" || c.color === "#FCD116" || c.color === "#FFCD00") ? "#000" : "#FFF" 
                }}
                onClick={() => selectCountry(c)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <footer style={{ marginTop: '100px', padding: '80px 20px', borderTop: '5px solid #000', textAlign: 'center', fontFamily: '"Space Mono", monospace', fontSize: '0.8rem', fontWeight: 'bold' }}>
        FAIR WEATHER FANDOM // CHICAGO_CORE // 2026_FWF
      </footer>
    </main>
  );
}