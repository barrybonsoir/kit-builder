"use client";
import { useState } from 'react';

const countries = [
  "Argentina", "Australia", "Brazil", "Belgium", "Canada", "Cameroon", "Chile", "Colombia", "Croatia", "Denmark", "Ecuador", "England", "France", "Germany", "Ghana", "Italy", "Japan", "Mexico", "Morocco", "Netherlands", "Nigeria", "Portugal", "Qatar", "Saudi Arabia", "Senegal", "Serbia", "South Korea", "Spain", "Switzerland", "Tunisia", "Uruguay", "USA", "Wales"
];

// Helper for the labels
const nationLabels = ["NATION ONE", "NATION TWO", "NATION THREE", "NATION FOUR"];

export default function Home() {
  const [activeField, setActiveField] = useState(null);
  const [selections, setSelections] = useState(["", "", "", ""]);

  const handleUpdate = (index, value) => {
    const newSels = [...selections];
    newSels[index] = value;
    setSelections(newSels);
  };

  return (
    <main style={{ 
      backgroundColor: '#FFFFFF', 
      color: '#000000', 
      minHeight: '100vh', 
      fontFamily: '"Inter", sans-serif',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;700;900&family=Space+Mono&display=swap');
        
        main::before {
          content: "";
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none;
          opacity: 0.15;
          z-index: 1;
          background-image: 
            linear-gradient(#FF0000 1px, transparent 1px),
            linear-gradient(90deg, #FF0000 1px, transparent 1px),
            url('data:image/svg+xml;utf8,<svg width="180" height="180" xmlns="http://www.w3.org/2000/svg"><path d="M20 20 L50 50 M50 20 L20 50" stroke="black" stroke-width="2"/><circle cx="120" cy="40" r="18" fill="none" stroke="black" stroke-width="2"/><path d="M40 120 Q 80 80 150 140" stroke="red" stroke-width="2.5" fill="none" stroke-dasharray="5,5"/></svg>');
          background-size: 80px 80px, 80px 80px, 350px 350px;
        }

        .grid-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 40px 80px;
        }

        .nation-box {
          border: 6px solid #000;
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #FFF;
          min-height: 140px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .nation-box:hover {
          background: #F0F0F0;
          box-shadow: 10px 10px 0px #FF0000;
        }

        .nation-box.active {
          border-color: #FF0000;
          background: #FFF;
          box-shadow: 15px 15px 0px #000;
        }

        input {
          border: none;
          border-bottom: 4px solid #000;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 3rem;
          width: 100%;
          outline: none;
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .grid-container { grid-template-columns: 1fr; }
        }
      `}</style>

      <header style={{ textAlign: 'center', padding: '50px 20px 30px 20px', borderBottom: '20px solid #FF0000', position: 'relative', zIndex: 10, backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src="/logo-red.png" alt="Fair Weather Fandom Logo" style={{ width: '100%', maxWidth: '700px', height: 'auto', marginBottom: '30px' }} />
        
        <div style={{ borderTop: '4px solid #000', borderBottom: '4px solid #000', padding: '15px 0', width: '100%', maxWidth: '700px' }}>
          <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '1.05rem', lineHeight: '1.5', margin: 0 }}>
            For when you just don’t know who to root for. Pick up to four countries that you happen to love the most. We’ll create a piece of custom art that will cover all your bases.
          </p>
        </div>
      </header>

      <div style={{ maxWidth: '1000px', margin: '60px auto', padding: '0 30px', position: 'relative', zIndex: 10 }}>
        
        <div className="grid-container">
          {nationLabels.map((label, i) => (
            <div 
              key={i} 
              className={`nation-box ${activeField === i ? 'active' : ''}`}
              onClick={() => setActiveField(i)}
            >
              <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.8rem', fontWeight: 'bold', color: activeField === i ? '#FF0000' : '#000', marginBottom: '10px', display: 'block' }}>
                {label} {selections[i] && `// ${selections[i]}`}
              </span>
              
              {activeField === i ? (
                <input 
                  autoFocus
                  list="country-list"
                  value={selections[i]}
                  onChange={(e) => handleUpdate(i, e.target.value)}
                  onBlur={() => setActiveField(null)}
                  placeholder="SELECT..."
                />
              ) : (
                <h2 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '4.5rem', margin: 0, lineHeight: '1' }}>
                  {selections[i] || "EMPTY"}
                </h2>
              )}
            </div>
          ))}
        </div>

        <datalist id="country-list">
          {countries.map(c => <option key={c} value={c} />)}
        </datalist>

        <div style={{ marginTop: '100px', display: 'flex', justifyContent: 'center' }}>
          <button style={{ backgroundColor: '#000', color: '#FFF', padding: '35px 0', fontSize: '2.8rem', fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.2em', border: 'none', cursor: 'pointer', width: '100%', maxWidth: '850px', boxShadow: '15px 15px 0px #FF0000' }}>
            GENERATE LOYALTY ART
          </button>
        </div>
      </div>

      <footer style={{ marginTop: '100px', padding: '80px 20px', borderTop: '5px solid #000', textAlign: 'center', fontFamily: '"Space Mono", monospace', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
        FAIR WEATHER FANDOM // CHICAGO_CORE // 2026_FWF
      </footer>
    </main>
  );
}