"use client";
import { useState } from 'react';

const countries = [
  "Argentina", "Australia", "Brazil", "Belgium", "Canada", "Cameroon", "Chile", "Colombia", "Croatia", "Denmark", "Ecuador", "England", "France", "Germany", "Ghana", "Italy", "Japan", "Mexico", "Morocco", "Netherlands", "Nigeria", "Portugal", "Qatar", "Saudi Arabia", "Senegal", "Serbia", "South Korea", "Spain", "Switzerland", "Tunisia", "Uruguay", "USA", "Wales"
];

export default function Home() {
  const [showArt, setShowArt] = useState(false);

  return (
    <main style={{ 
      backgroundColor: '#AFB298', 
      color: '#000', 
      minHeight: '100vh', 
      fontFamily: '"Inter", sans-serif',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;700;900&family=Space+Mono&display=swap');
        
        /* THE SOCCER CHAOS OVERLAY */
        main::before {
          content: "";
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none;
          opacity: 0.2;
          z-index: 1;
          background-image: 
            linear-gradient(rgba(0,0,0,0.05) 1.5px, transparent 1.5px),
            linear-gradient(90deg, rgba(0,0,0,0.05) 1.5px, transparent 1.5px),
            /* Tactical Geometry & X/O markings from inspiration */
            url('data:image/svg+xml;utf8,<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><path d="M10 10 L30 30 M30 10 L10 30" stroke="black" stroke-width="1"/><circle cx="150" cy="50" r="20" fill="none" stroke="black" stroke-width="1"/><path d="M100 150 Q 130 110 180 160" stroke="rgba(255,69,0,0.4)" stroke-width="2" fill="none"/><text x="20" y="180" font-family="monospace" font-size="10" fill="rgba(0,0,0,0.3)">PHASE_01</text></svg>');
          background-size: 40px 40px, 40px 40px, 300px 300px;
        }

        .grid-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr); /* FORCED 2X2 */
          gap: 60px 100px;
        }

        @media (max-width: 768px) {
          .grid-container {
            grid-template-columns: 1fr; /* MOBILE STACK */
          }
        }

        input:focus {
          border-bottom: 4px solid #FF4500 !important;
          transition: 0.2s;
        }
      `}</style>

      {/* Top System Status */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', padding: '15px 20px', borderBottom: '2px solid #000', backgroundColor: '#AFB298' }}>
        <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.65rem' }}>// ANALYSIS_MODE: ALPHA // NEUTRALITY_INDEX: 1.0</span>
        <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.65rem', color: '#FF4500', fontWeight: 'bold' }}>● STATUS: ACTIVE_SYNTHESIS</span>
      </div>

      <header style={{ 
        textAlign: 'center', 
        padding: '100px 20px 60px 20px', 
        borderBottom: '14px solid #000',
        position: 'relative',
        zIndex: 10,
        backgroundColor: '#AFB298'
      }}>
        <h1 style={{ 
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: 'clamp(5rem, 26vw, 18rem)', 
          lineHeight: '0.75', 
          textTransform: 'uppercase',
          letterSpacing: '-0.08em', 
          margin: 0
        }}>
          TEAM FAIR<br/>WEATHER
        </h1>
        
        {/* INSTRUCTIONAL COPY RESTORED */}
        <div style={{ maxWidth: '600px', margin: '40px auto 0 auto' }}>
          <p style={{ fontSize: '1.2rem', fontWeight: '900', textTransform: 'uppercase', marginBottom: '10px' }}>
            For when you just don't know who to root for.
          </p>
          <p style={{ fontSize: '0.9rem', fontWeight: '500', lineHeight: '1.4', opacity: 0.8 }}>
            Pick up to four countries that you happen to love the most. <br/>
            We’ll create a piece of custom art that will cover all your bases.
          </p>
        </div>
      </header>

      <div style={{ maxWidth: '1000px', margin: '60px auto', padding: '0 30px', position: 'relative', zIndex: 10 }}>
        
        {/* Technical Header */}
        <div style={{ borderTop: '2px solid #000', borderBottom: '2px solid #000', padding: '15px 0', marginBottom: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.8rem', fontWeight: '700' }}>DATA_ENTRY_PROTOCOL_v4.2</div>
           <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.7rem' }}>[ REQUIRED: 04_NATIONS ]</div>
        </div>
        
        {/* Forced 2x2 Grid */}
        <div className="grid-container">
          {[1,2,3,4].map(i => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '15px', height: '15px', background: '#FF4500' }}></div>
                <label style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '3.5rem', lineHeight: '1' }}>NATION_{i}</label>
              </div>
              <input 
                list="country-list"
                placeholder="TYPE_ID"
                style={{ border: 'none', borderBottom: '5px solid #000', background: 'transparent', padding: '15px 0', fontSize: '1.6rem', fontWeight: '900', outline: 'none', textTransform: 'uppercase', borderRadius: '0' }}
              />
            </div>
          ))}
        </div>

        <datalist id="country-list">
          {countries.map(c => <option key={c} value={c} />)}
        </datalist>

        <div style={{ marginTop: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button onClick={() => setShowArt(true)} style={{ backgroundColor: '#000', color: '#AFB298', padding: '30px 120px', fontSize: '2.2rem', fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.15em', border: 'none', cursor: 'pointer', width: '100%', maxWidth: '700px', transition: '0.2s' }}>
            GENERATE LOYALTY ART
          </button>
        </div>
      </div>

      <footer style={{ marginTop: '120px', padding: '50px 20px', borderTop: '2px solid #000', textAlign: 'center', fontFamily: '"Space Mono", monospace', fontSize: '0.65rem' }}>
        FAIR WEATHER // CHICAGO_UNIT // MATCH_DATA_2026 // ALL_RIGHTS_RESERVED
      </footer>
    </main>
  );
}