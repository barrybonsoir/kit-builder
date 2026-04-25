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
        
        /* Tactical Wallpaper Overlay */
        main::before {
          content: "";
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none;
          opacity: 0.1;
          z-index: 1;
          background-image: 
            linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px),
            url('data:image/svg+xml;utf8,<svg width="120" height="120" xmlns="http://www.w3.org/2000/svg"><path d="M10 10 L50 50 M50 10 L10 50" stroke="black" stroke-width="0.5" opacity="0.3"/><circle cx="80" cy="80" r="20" fill="none" stroke="black" stroke-width="0.5" opacity="0.3"/><path d="M60 20 Q 90 20 90 50" stroke="black" stroke-width="1" fill="none" opacity="0.3" /></svg>');
          background-size: 40px 40px, 40px 40px, 240px 240px;
        }

        input:focus {
          border-bottom: 4px solid #FF4500 !important;
          transition: 0.2s;
        }

        ::placeholder {
          color: rgba(0,0,0,0.3);
          font-family: "Space Mono", monospace;
          font-size: 0.8rem;
        }
      `}</style>

      {/* Top Metadata Bar */}
      <div style={{ position: 'relative', zIndex: 20, display: 'flex', justifyContent: 'space-between', padding: '15px 20px', fontFamily: '"Space Mono", monospace', fontSize: '0.65rem', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <div>SYSTEM_REF: T_FW_2026 // CHICAGO_UNIT</div>
        <div style={{ color: '#FF4500' }}>● STATUS: LIVE_SYNTHESIS</div>
      </div>

      <header style={{ 
        textAlign: 'center', 
        padding: '80px 20px 60px 20px', 
        borderBottom: '14px solid #000',
        position: 'relative',
        zIndex: 10,
        backgroundColor: 'rgba(175, 178, 152, 0.95)'
      }}>
        <h1 style={{ 
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: 'clamp(5rem, 24vw, 18rem)', 
          lineHeight: '0.85', 
          textTransform: 'uppercase',
          letterSpacing: '0.02em', // Fixed letter spacing
          margin: '0 auto',
          display: 'inline-block',
          textAlign: 'center'
        }}>
          TEAM FAIR<br/>WEATHER
        </h1>
        <p style={{ 
          fontSize: '1.4rem', 
          marginTop: '25px', 
          fontWeight: '900', 
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}>
          For when you just don't know who to root for.
        </p>
      </header>

      <div style={{ maxWidth: '1100px', margin: '60px auto', padding: '0 30px', position: 'relative', zIndex: 10 }}>
        
        <div style={{ borderTop: '2px solid #000', borderBottom: '2px solid #000', padding: '15px 0', marginBottom: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.8rem', fontWeight: '700' }}>CORE_INPUT_PROTOCOL</div>
           <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.7rem' }}>[ 04_COORDINATES_REQD ]</div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '60px' }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '12px', height: '12px', background: '#000' }}></div>
                <label style={{ 
                    fontFamily: '"Bebas Neue", sans-serif', 
                    fontSize: '2.8rem', 
                    lineHeight: '1'
                }}>
                    COUNTRY
                </label>
              </div>
              <input 
                list="country-list"
                placeholder="TYPE_NATION_ID"
                style={{ 
                    border: 'none', 
                    borderBottom: '4px solid #000', 
                    background: 'transparent',
                    padding: '12px 0', 
                    fontSize: '1.4rem', 
                    fontWeight: '800', 
                    outline: 'none',
                    textTransform: 'uppercase',
                    borderRadius: '0',
                    fontFamily: '"Inter", sans-serif'
                }}
              />
            </div>
          ))}
        </div>

        <datalist id="country-list">
          {countries.map(c => <option key={c} value={c} />)}
        </datalist>

        <div style={{ marginTop: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px' }}>
          <button 
            onClick={() => setShowArt(true)}
            style={{ 
              backgroundColor: '#000', 
              color: '#AFB298', 
              padding: '30px 100px', 
              fontSize: '2rem', 
              fontFamily: '"Bebas Neue", sans-serif', 
              letterSpacing: '0.15em',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              maxWidth: '700px',
              transition: 'all 0.2s ease'
            }}>
            GENERATE LOYALTY ART
          </button>
          
          <div style={{ textAlign: 'center', fontFamily: '"Space Mono", monospace', fontSize: '0.7rem', opacity: '0.6', maxWidth: '400px', lineHeight: '1.5' }}>
             ALGORITHM CALCULATES OPTIMAL NEUTRALITY RATIO BASED ON SELECTED GEOGRAPHICAL COORDINATES.
          </div>
        </div>
      </div>

      <footer style={{ marginTop: '100px', padding: '40px 20px', borderTop: '1px solid rgba(0,0,0,0.1)', textAlign: 'center', fontFamily: '"Space Mono", monospace', fontSize: '0.6rem' }}>
        FAIR WEATHER v.2026 // PROPRIETARY LOYALTY MAPPING // CHICAGO, IL
      </footer>
    </main>
  );
}
