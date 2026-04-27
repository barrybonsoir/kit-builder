"use client";
import { useState } from 'react';

// Country data with hex codes for the "Graphic List"
const countries = [
  { name: "Argentina", color: "#74ACDF" },
  { name: "Australia", color: "#FFCD00" },
  { name: "Brazil", color: "#009739" },
  { name: "Belgium", color: "#EF3340" },
  { name: "Canada", color: "#FF0000" },
  { name: "Cameroon", color: "#007A5E" },
  { name: "Chile", color: "#0039A6" },
  { name: "Colombia", color: "#FCD116" },
  { name: "Croatia", color: "#FF0000" },
  { name: "Denmark", color: "#C60C30" },
  { name: "Ecuador", color: "#FFDD00" },
  { name: "England", color: "#FFFFFF" },
  { name: "France", color: "#002395" },
  { name: "Germany", color: "#000000" },
  { name: "Ghana", color: "#FCD116" },
  { name: "Italy", color: "#008C45" },
  { name: "Japan", color: "#BC002D" },
  { name: "Mexico", color: "#006847" },
  { name: "Morocco", color: "#C1272D" },
  { name: "Netherlands", color: "#F36C21" },
  { name: "Nigeria", color: "#008751" },
  { name: "Portugal", color: "#FF0000" },
  { name: "Qatar", color: "#8A1538" },
  { name: "Saudi Arabia", color: "#006C35" },
  { name: "Senegal", color: "#FCD116" },
  { name: "Serbia", color: "#C6363C" },
  { name: "South Korea", color: "#CD2E3A" },
  { name: "Spain", color: "#C60B1E" },
  { name: "Switzerland", color: "#D52B1E" },
  { name: "Tunisia", color: "#E70013" },
  { name: "Uruguay", color: "#0038A8" },
  { name: "USA", color: "#0A3161" },
  { name: "Wales", color: "#D30731" }
];

const nationLabels = ["NATION ONE", "NATION TWO", "NATION THREE", "NATION FOUR"];

export default function Home() {
  const [activeSlot, setActiveSlot] = useState(null);
  const [selections, setSelections] = useState([null, null, null, null]);

  const selectCountry = (country) => {
    const newSels = [...selections];
    newSels[activeSlot] = country;
    setSelections(newSels);
    setActiveSlot(null);
  };

  return (
    <main style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono&display=swap');
        
        main::before {
          content: "";
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none;
          opacity: 0.15;
          z-index: 1;
          background-image: 
            linear-gradient(#FF0000 1px, transparent 1px),
            linear-gradient(90deg, #FF0000 1px, transparent 1px);
          background-size: 80px 80px;
        }

        .nation-btn {
          background: #000;
          color: #FFF;
          border: none;
          padding: 40px 20px;
          cursor: pointer;
          text-align: left;
          transition: transform 0.1s ease;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 200px;
        }

        .nation-btn:hover {
          background: #FF0000;
          transform: scale(0.98);
        }

        /* The Custom Graphic List Overlay */
        .overlay {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: #000;
          z-index: 100;
          overflow-y: scroll;
          padding: 20px;
        }

        .country-row {
          width: 100%;
          padding: 20px;
          margin-bottom: 5px;
          cursor: pointer;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 6rem;
          line-height: 0.8;
          text-transform: uppercase;
          transition: padding-left 0.2s ease;
          border: none;
          text-align: left;
        }

        .country-row:hover {
          padding-left: 60px;
          filter: brightness(1.2);
        }

        @media (max-width: 768px) {
          .country-row { font-size: 3.5rem; }
        }
      `}</style>

      {/* Header */}
      <header style={{ textAlign: 'center', padding: '60px 20px 40px 20px', borderBottom: '25px solid #FF0000', position: 'relative', zIndex: 10, backgroundColor: '#FFF' }}>
        <img src="/logo-red.png" alt="Fair Weather Fandom" style={{ width: '100%', maxWidth: '750px', marginBottom: '30px' }} />
        <div style={{ borderTop: '4px solid #000', borderBottom: '4px solid #000', padding: '15px 0', width: '100%', maxWidth: '700px', margin: '0 auto' }}>
          <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '1rem', margin: 0 }}>
            For when you just don’t know who to root for. Pick up to four countries.
          </p>
        </div>
      </header>

      {/* Main Grid */}
      <div style={{ maxWidth: '1100px', margin: '60px auto', padding: '0 30px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {nationLabels.map((label, i) => (
            <button 
              key={i} 
              className="nation-btn" 
              onClick={() => setActiveSlot(i)}
            >
              <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.8rem', opacity: 0.7, marginBottom: '10px' }}>
                {label}
              </span>
              <h2 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '4rem', margin: 0 }}>
                {selections[i] ? selections[i].name : "SELECT +"}
              </h2>
            </button>
          ))}
        </div>

        <div style={{ marginTop: '80px', textAlign: 'center' }}>
          <button style={{ backgroundColor: '#000', color: '#FFF', padding: '30px 100px', fontSize: '2.5rem', fontFamily: '"Bebas Neue", sans-serif', border: 'none', cursor: 'pointer', boxShadow: '15px 15px 0px #FF0000' }}>
            GENERATE ART
          </button>
        </div>
      </div>

      {/* Custom Graphic Overlay */}
      {activeSlot !== null && (
        <div className="overlay">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '5px solid #FFF', paddingBottom: '20px' }}>
            <h3 style={{ color: '#FFF', fontFamily: '"Space Mono", monospace' }}>SELECTING FOR {nationLabels[activeSlot]}</h3>
            <button onClick={() => setActiveSlot(null)} style={{ background: '#FF0000', color: '#FFF', border: 'none', padding: '10px 20px', fontFamily: '"Space Mono", monospace', cursor: 'pointer' }}>CLOSE [X]</button>
          </div>
          {countries.map((c) => (
            <button 
              key={c.name} 
              className="country-row" 
              style={{ backgroundColor: c.color, color: c.color === "#FFFFFF" || c.color === "#FCD116" ? "#000" : "#FFF" }}
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