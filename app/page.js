"use client";
import { useState } from 'react';

const countries = [
  "Argentina", "Australia", "Brazil", "Belgium", "Canada", "Cameroon", "Chile", "Colombia", "Croatia", "Denmark", "Ecuador", "England", "France", "Germany", "Ghana", "Italy", "Japan", "Mexico", "Morocco", "Netherlands", "Nigeria", "Portugal", "Qatar", "Saudi Arabia", "Senegal", "Serbia", "South Korea", "Spain", "Switzerland", "Tunisia", "Uruguay", "USA", "Wales"
];

export default function Home() {
  const [showArt, setShowArt] = useState(false);

  return (
    <main style={{ 
      backgroundColor: '#FFFFFF', // Pure White
      color: '#000000', // Black
      minHeight: '100vh', 
      fontFamily: '"Inter", sans-serif',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;700;900&family=Space+Mono&display=swap');
        
        /* THE TACTICAL WHITEBOARD CHAOS */
        main::before {
          content: "";
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none;
          opacity: 0.18;
          z-index: 1;
          background-image: 
            linear-gradient(#FF0000 1px, transparent 1px),
            linear-gradient(90deg, #FF0000 1px, transparent 1px),
            /* X and O Tactical Markings */
            url('data:image/svg+xml;utf8,<svg width="180" height="180" xmlns="http://www.w3.org/2000/svg"><path d="M20 20 L50 50 M50 20 L20 50" stroke="black" stroke-width="2"/><circle cx="120" cy="40" r="18" fill="none" stroke="black" stroke-width="2"/><path d="M40 120 Q 80 80 150 140" stroke="red" stroke-width="2.5" fill="none" stroke-dasharray="5,5"/><text x="10" y="170" font-family="monospace" font-size="8" fill="red">ZONE_14</text></svg>');
          background-size: 80px 80px, 80px 80px, 350px 350px;
        }

        .grid-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 60px 100px;
        }

        @media (max-width: 768px) {
          .grid-container { grid-template-columns: 1fr; }
        }

        input:focus {
          border-bottom: 10px solid #FF0000 !important;
          outline: none;
        }
      `}</style>

      {/* HEADER: Shortened, Red Bottom Border, Script Logo */}
      <header style={{ 
        textAlign: 'center', 
        padding: '60px 20px 40px 20px', 
        borderBottom: '25px solid #FF0000',
        position: 'relative',
        zIndex: 10,
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* LOGOTYPE PNG */}
        <img 
          src="/logo-red.png" 
          alt="Fair Weather Fandom" 
          style={{ width: '100%', maxWidth: '750px', height: 'auto', marginBottom: '30px' }} 
        />
        
        {/* Instructional Copy: Mono Font, Standard Case */}
        <div style={{ borderTop: '4px solid #000', borderBottom: '4px solid #000', padding: '15px 0', width: '100%', maxWidth: '700px' }}>
          <p style={{ 
            fontFamily: '"Space Mono", monospace', 
            fontSize: '1.1rem', 
            lineHeight: '1.5', 
            margin: 0,
            color: '#000'
          }}>
            For when you just don’t know who to root for. Pick up to four countries from the 48 that are participating in this year's tournament. The tool will create a piece of custom art that will cover all your bases.
          </p>
        </div>
      </header>

      <div style={{ maxWidth: '1000px', margin: '60px auto', padding: '0 30px', position: 'relative', zIndex: 10 }}>
        
        {/* 2x2 Symmetrical Grid */}
        <div className="grid-container">
          {[1,2,3,4].map(i => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '20px', height: '20px', background: '#000' }}></div>
                <label style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '5rem', lineHeight: '1' }}>NATION</label>
              </div>
              <input 
                list="country-list"
                placeholder="TYPE_ID"
                style={{ border: 'none', borderBottom: '10px solid #000', background: 'transparent', padding: '15px 0', fontSize: '2rem', fontWeight: '900', textTransform: 'uppercase', borderRadius: '0' }}
              />
            </div>
          ))}
        </div>

        <datalist id="country-list">
          {countries.map(c => <option key={c} value={c} />)}
        </datalist>

        <div style={{ marginTop: '100px', display: 'flex', justifyContent: 'center' }}>
          <button onClick={() => setShowArt(true)} style={{ backgroundColor: '#000', color: '#FFF', padding: '35px 0', fontSize: '2.8rem', fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.2em', border: 'none', cursor: 'pointer', width: '100%', maxWidth: '850px', boxShadow: '15px 15px 0px #FF0000' }}>
            GENERATE LOYALTY ART
          </button>
        </div>
      </div>

      <footer style={{ marginTop: '150px', padding: '80px 20px', borderTop: '5px solid #000', textAlign: 'center', fontFamily: '"Space Mono", monospace', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
        FAIR WEATHER FANDOM // CHICAGO_CORE // 2026_FWF
      </footer>
    </main>
  );
}