"use client";
import { useState } from 'react';

const countries = [
  "Argentina", "Australia", "Brazil", "Belgium", "Canada", "Cameroon", "Chile", "Colombia", "Croatia", "Denmark", "Ecuador", "England", "France", "Germany", "Ghana", "Italy", "Japan", "Mexico", "Morocco", "Netherlands", "Nigeria", "Portugal", "Qatar", "Saudi Arabia", "Senegal", "Serbia", "South Korea", "Spain", "Switzerland", "Tunisia", "Uruguay", "USA", "Wales"
];

export default function Home() {
  const [showArt, setShowArt] = useState(false);

  return (
    <main style={{ 
      backgroundColor: '#FFFFFF', // New strict palette: white background
      color: '#000000', // All primary text is black
      minHeight: '100vh', 
      fontFamily: '"Inter", sans-serif', // Clean body copy
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Global CSS for the custom background texture and fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;700;900&family=Space+Mono&display=swap');
        
        /* The Sporting Propaganda BACKGROUND */
        main::before {
          content: "";
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none;
          opacity: 0.12; /* Visibility of background clutter */
          z-index: 1;
          background-image: 
            /* Subtle grid overlay */
            linear-gradient(#FF0000 1.5px, transparent 1.5px),
            linear-gradient(90deg, #FF0000 1.5px, transparent 1.5px),
            /* Layered tactical elements (arcs, X's, vectors from inspiration) */
            url('data:image/svg+xml;utf8,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><path d="M10 10 L40 40 M40 10 L10 40" stroke="black" stroke-width="0.75"/><circle cx="70" cy="70" r="15" fill="none" stroke="black" stroke-width="0.75"/><path d="M50 10 A30 30 0 0 1 80 40 L80 10" stroke="black" stroke-width="0.75" fill="none"/></svg>');
          background-size: 50px 50px, 50px 50px, 150px 150px;
        }

        /* High-contrast Red and Black inputs */
        input:focus {
          border-bottom: 5px solid #FF0000 !important; /* Pure Red active border */
          transition: 0.2s;
        }

        /* Fixed symmetrical 2x2 grid */
        .grid-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 60px 80px; /* Symmetrical gaps */
        }

        /* The reconstructed logotype CSS (Based on image_17.png) */
        .logo-script {
          font-family: cursive; /* Using generic for example, should be Fair Weather font */
          font-style: italic;
          font-size: 5rem;
          color: #FF0000;
          position: absolute;
          top: -45px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          white-space: nowrap;
        }

        .logo-block {
          font-family: '"Bebas Neue", sans-serif';
          font-size: 10rem;
          color: #FF0000;
          text-transform: uppercase;
          line-height: 0.8;
          margin: 0;
          position: relative;
          z-index: 1;
        }
      `}</style>

      {/* 1. Header with reconstructed Logotype (based on image_17.png) */}
      <header style={{ 
        textAlign: 'center', 
        padding: '120px 20px 100px 20px', 
        borderBottom: '20px solid #FF0000', // Pure Red brutality line
        position: 'relative',
        zIndex: 10,
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Reconstructed Logotype Block */}
        <div style={{ position: 'relative', display: 'inline-block', width: 'auto', marginBottom: '40px' }}>
          <span className="logo-script">Fair Weather</span>
          <h1 className="logo-block">FANDOM</h1>
        </div>

        {/* Narrative description restored */}
        <p style={{ 
          maxWidth: '650px',
          fontSize: '1.4rem', 
          fontWeight: '900', 
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
          margin: '0 auto',
          color: '#000000',
          borderTop: '2px solid #000',
          borderBottom: '2px solid #000',
          padding: '10px 0'
        }}>
          Pick up to four countries you happen to love. <br/>
          We'll create custom art that covers all your bases.
        </p>
      </header>

      {/* 2. System Status Bar (Metadata) */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', padding: '15px 20px', borderBottom: '1px solid rgba(0,0,0,0.1)', backgroundColor: 'rgba(0,0,0,0.02)' }}>
        <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.65rem', textTransform: 'uppercase' }}>// ANALYSIS_MODE: ALPHA // NEUTRALITY INDEX: 1.0</span>
        <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.65rem', color: '#FF0000', fontWeight: 'bold' }}>● STATUS: LIVE_SYNTHESIS</span>
      </div>

      {/* 3. The Input Protocol Section (Technical Clutter + 2x2 Grid) */}
      <div style={{ maxWidth: '1000px', margin: '60px auto', padding: '0 30px', position: 'relative', zIndex: 10 }}>
        
        {/* High-visibility input labels */}
        <div style={{ borderTop: '2px solid #000', borderBottom: '2px solid #000', padding: '15px 0', marginBottom: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
           <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.8rem', fontWeight: '700' }}>INPUT_SELECTION_PROTOCOL_v4.2</div>
           <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.7rem', textTransform: 'uppercase' }}>[ FOUR_COORDINATES_REQD ]</div>
        </div>
        
        {/* Strictly symmetrical 2x2 grid */}
        <div className="grid-container">
          {[1,2,3,4].map(i => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '15px', height: '15px', background: '#FF0000' }}></div>
                <label style={{ 
                    fontFamily: '"Bebas Neue", sans-serif', 
                    fontSize: '4.5rem', // Maximum visibility for input labels
                    color: '#000000',
                    lineHeight: '1'
                }}>
                    NATION
                </label>
              </div>
              <input 
                list="country-list"
                placeholder="---"
                style={{ 
                    border: 'none', 
                    borderBottom: '6px solid #000', // Heavy input underline
                    background: 'transparent',
                    padding: '15px 0', 
                    fontSize: '1.6rem', 
                    fontWeight: '900', 
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

        {/* 4. Action synthesis */}
        <div style={{ marginTop: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button 
            onClick={() => setShowArt(true)}
            style={{ 
              backgroundColor: '#000000', // Black button
              color: '#FFFFFF', // White text
              padding: '35px 120px', 
              fontSize: '2.5rem', // Massive button text
              fontFamily: '"Bebas Neue", sans-serif', 
              letterSpacing: '0.15em',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              maxWidth: '800px',
              transition: 'all 0.2s ease',
              textTransform: 'uppercase'
            }}>
            GENERATE LOYALTY ART
          </button>
        </div>
      </div>

      {/* 5. Footer Metadata - Proprietary Line */}
      <footer style={{ marginTop: '100px', padding: '60px 20px', borderTop: '2px solid #000', textAlign: 'center', fontFamily: '"Space Mono", monospace', fontSize: '0.65rem', textTransform: 'uppercase' }}>
        FAIR WEATHER FANDOM // CHICAGO_UNIT // PROPRIETARY LOYALTY MAPPING // ALL ASSETS CONFIDENTIAL
      </footer>
    </main>
  );
}