"use client";
import { useState } from 'react';

// Raw data
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
      overflow: 'hidden'
    }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;700;900&family=Space+Mono&display=swap');
        
        /* THE NOISE TEXTURE - HIGH DENSITY STATIC */
        main::before {
          content: "";
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none;
          opacity: 0.22; /* Aggressive visibility of visual noise */
          z-index: 1;
          background-image: 
            /* Subtle blueprint grid */
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px),
            /* Layered tactical elements (arcs, X's, vectors) from image_0.png */
            url('data:image/svg+xml;utf8,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><path d="M10 10 L40 40 M40 10 L10 40" stroke="black" stroke-width="0.5"/><circle cx="70" cy="70" r="15" fill="none" stroke="black" stroke-width="0.5"/><path d="M50 10 A30 30 0 0 1 80 40 L80 10" stroke="black" stroke-width="0.5" fill="none"/></svg>');
          background-size: 30px 30px, 30px 30px, 120px 120px;
        }

        /* HUD ELEMENTS - TARGETING BRACKETS */
        .targeting-bracket {
          position: absolute;
          width: 30px;
          height: 30px;
          border: 4px solid #000;
          z-index: 5;
        }

        /* INPUT PROTOCOL */
        input:focus {
          border-bottom: 4px solid #FF4500 !important; /* International Orange */
          transition: 0.2s ease-out;
        }

        .input-cursor {
          display: inline-block;
          width: 12px;
          height: 12px;
          background-color: #FF4500;
          margin-right: 15px;
        }
      `}</style>

      {/* 1. Header Area - Tactical Targeting System */}
      <header style={{ 
        textAlign: 'center', 
        padding: '120px 20px', 
        borderBottom: '14px solid #000',
        position: 'relative',
        zIndex: 10,
        backgroundColor: '#AFB298',
        overflow: 'hidden' // Contain targeting brackets
      }}>
        {/* HUD Overlay Brackets */}
        <div className="targeting-bracket" style={{ top: '30px', left: '30px', borderRight: 'none', borderBottom: 'none' }} />
        <div className="targeting-bracket" style={{ top: '30px', right: '30px', borderLeft: 'none', borderBottom: 'none' }} />
        
        {/* Massive, Brutalist Title Block */}
        <h1 style={{ 
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: 'clamp(5rem, 26vw, 20rem)', 
          lineHeight: '0.72', 
          textTransform: 'uppercase',
          letterSpacing: '-0.1em', // CRUSHED KERNING - Very aggressive
          margin: 0
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

      {/* 2. System Status Bar (Metadata) */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', padding: '15px 20px', backgroundColor: 'rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.65rem' }}>// ANALYSIS_MODE: ALPHA // NEUTRALITY_BUILD: 1.0</span>
        <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.65rem', color: '#FF4500', fontWeight: 'bold' }}>● STATUS: LIVE_ACTIVE</span>
      </div>

      {/* 3. The Input Protocol with Coordination Brackets */}
      <div style={{ maxWidth: '1100px', margin: '60px auto', padding: '0 30px', position: 'relative', zIndex: 10 }}>
        
        {/* Instructional Header - Pure Metadata */}
        <div style={{ borderTop: '2px solid #000', borderBottom: '2px solid #000', padding: '15px 0', marginBottom: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.8rem', fontWeight: '700' }}>CORE_INPUT_PROTOCOL</div>
           <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.7rem', textTransform: 'uppercase' }}>[ 04_COORDINATES_REQD ]</div>
        </div>
        
        {/* The Bold, Brutal Input Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '60px' }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="input-cursor"></div> {/* International Orange Pulse Point */}
                <label style={{ 
                    fontFamily: '"Bebas Neue", sans-serif', 
                    fontSize: '3rem', 
                    color: '#000',
                    lineHeight: '1'
                }}>
                    NATION
                </label>
              </div>
              <input 
                list="country-list"
                placeholder="TYPE_ID"
                style={{ 
                    border: 'none', 
                    borderBottom: '4px solid #000', // Substantial brutalist weight
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

        {/* 4. Action synthesis */}
        <div style={{ marginTop: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
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
             ALGORITHM CALCULATES OPTIMAL GEOGRAPHICAL NEUTRALITY BASED ON SELECTED DATA POINTS.
          </div>
        </div>
      </div>

      {/* 5. Footer Metadata - Proprietary Line */}
      <footer style={{ marginTop: '100px', padding: '40px 20px', borderTop: '1px solid rgba(0,0,0,0.1)', textAlign: 'center', fontFamily: '"Space Mono", monospace', fontSize: '0.6rem', position: 'relative', zIndex: 10 }}>
        FAIR WEATHER v.2026 // CHICAGO_UNIT // PROPRIETARY LOYALTY MAPPING // ALL ASSETS CONFIDENTIAL
      </footer>
    </main>
  );
}
