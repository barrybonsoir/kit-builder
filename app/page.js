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
        
        /* THE SOCCER TACTICAL OVERLAY */
        main::before {
          content: "";
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none;
          z-index: 1;
          opacity: 0.35;
          background-image: 
            /* Layer 1: Fine Grid */
            linear-gradient(rgba(0,0,0,0.1) 1.5px, transparent 1.5px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1.5px, transparent 1.5px),
            /* Layer 2: Pitch Geometry & Whiteboard Marks */
            url('data:image/svg+xml;utf8,<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg"><rect x="50" y="50" width="300" height="200" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="2"/><circle cx="200" cy="150" r="40" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="2"/><path d="M50 100 H100 V200 H50" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="2"/><text x="220" y="80" font-family="monospace" font-size="14" fill="rgba(0,0,0,0.4)" transform="rotate(-15 220 80)">ZONE_14</text><text x="70" y="140" font-family="cursive" font-size="24" fill="rgba(0,0,0,0.3)">X</text><text x="280" y="180" font-family="cursive" font-size="24" fill="rgba(0,0,0,0.3)">O</text><path d="M80 140 Q 150 100 270 170" stroke="rgba(255,69,0,0.4)" stroke-width="3" fill="none" marker-end="url(%23arrow)"/></svg>');
          background-size: 60px 60px, 60px 60px, 800px 800px;
        }

        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }

        .scanner {
          position: absolute;
          width: 100%;
          height: 1.5px;
          background: rgba(255, 69, 0, 0.5);
          z-index: 5;
          animation: scan 10s linear infinite;
        }

        header, div, footer { position: relative; z-index: 10; }
        
        .corner-bracket {
          position: absolute;
          width: 25px;
          height: 25px;
          border: 4px solid #000;
        }
      `}</style>

      {/* Top Metadata Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 20px', fontFamily: '"Space Mono", monospace', fontSize: '0.65rem', borderBottom: '2px solid #000', backgroundColor: 'rgba(175, 178, 152, 0.9)' }}>
        <div>MATCH_ID: //T_FW_2026.PROTO</div>
        <div style={{ color: '#FF4500', fontWeight: 'bold' }}>● STATUS: ACTIVE_SYNTHESIS</div>
      </div>

      <header style={{ 
        textAlign: 'center', 
        padding: '120px 20px 80px 20px', 
        borderBottom: '14px solid #000',
        backgroundColor: 'rgba(175, 178, 152, 0.98)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="scanner" />
        
        {/* HUD Brackets */}
        <div className="corner-bracket" style={{ top: '30px', left: '30px', borderRight: 'none', borderBottom: 'none' }} />
        <div className="corner-bracket" style={{ top: '30px', right: '30px', borderLeft: 'none', borderBottom: 'none' }} />
        <div className="corner-bracket" style={{ bottom: '30px', left: '30px', borderRight: 'none', borderTop: 'none' }} />
        <div className="corner-bracket" style={{ bottom: '30px', right: '30px', borderLeft: 'none', borderTop: 'none' }} />
        
        <div style={{ position: 'absolute', top: '50px', left: '60px', fontFamily: '"Space Mono", monospace', fontSize: '0.6rem', opacity: 0.6, textAlign: 'left', lineHeight: '1.5' }}>
          FIELD_POS: //ATTACKING_THIRD<br/>
          METRIC: //EXP_NEUTRALITY_v4.2<br/>
          COORD: 41.8781 N / 87.6298 W
        </div>

        <h1 style={{ 
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: 'clamp(5rem, 26vw, 20rem)', 
          lineHeight: '0.8', 
          textTransform: 'uppercase',
          letterSpacing: '0.02em', 
          margin: 0,
          position: 'relative'
        }}>
          TEAM FAIR<br/>WEATHER
        </h1>
        
        <p style={{ 
          fontSize: '1.4rem', 
          marginTop: '30px', 
          fontWeight: '900', 
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          borderTop: '2px solid #000',
          display: 'inline-block',
          paddingTop: '10px'
        }}>
          FOR WHEN YOU JUST DON'T KNOW WHO TO ROOT FOR.
        </p>
      </header>

      <div style={{ maxWidth: '1100px', margin: '60px auto', padding: '0 30px' }}>
        <div style={{ borderTop: '2px solid #000', borderBottom: '2px solid #000', padding: '15px 0', marginBottom: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(175, 178, 152, 0.9)' }}>
           <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.8rem', fontWeight: '700' }}>INPUT_SELECTION_PROTOCOL_v4</div>
           <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.7rem' }}>[ FOUR_COORDINATES_REQUIRED ]</div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '60px' }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '15px', height: '15px', background: '#000' }}></div>
                <label style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '3rem', lineHeight: '1' }}>NATION_{i}</label>
              </div>
              <input 
                list="country-list"
                placeholder="TYPE_ID"
                style={{ border: 'none', borderBottom: '5px solid #000', background: 'transparent', padding: '15px 0', fontSize: '1.5rem', fontWeight: '900', outline: 'none', textTransform: 'uppercase', borderRadius: '0' }}
              />
            </div>
          ))}
        </div>

        <datalist id="country-list">
          {countries.map(c => <option key={c} value={c} />)}
        </datalist>

        <div style={{ marginTop: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button onClick={() => setShowArt(true)} style={{ backgroundColor: '#000', color: '#AFB298', padding: '35px 120px', fontSize: '2.2rem', fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.2em', border: 'none', cursor: 'pointer', width: '100%', maxWidth: '800px', boxShadow: '10px 10px 0px #FF4500' }}>
            GENERATE LOYALTY ART
          </button>
        </div>
      </div>

      <footer style={{ marginTop: '120px', padding: '50px 20px', borderTop: '2px solid #000', textAlign: 'center', fontFamily: '"Space Mono", monospace', fontSize: '0.65rem' }}>
        FAIR WEATHER v.2026 // CHICAGO_UNIT // PROPRIETARY LOYALTY MAPPING // ALL DATA_POINTS FINAL
      </footer>
    </main>
  );
}