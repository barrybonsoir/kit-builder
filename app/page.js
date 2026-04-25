"use client";
import { useState } from 'react';

const countries = [
  "Argentina", "Australia", "Brazil", "Belgium", "Canada", "Cameroon", "Chile", "Colombia", "Croatia", "Denmark", "Ecuador", "England", "France", "Germany", "Ghana", "Italy", "Japan", "Mexico", "Morocco", "Netherlands", "Nigeria", "Portugal", "Qatar", "Saudi Arabia", "Senegal", "Serbia", "South Korea", "Spain", "Switzerland", "Tunisia", "Uruguay", "USA", "Wales"
];

export default function Home() {
  const [showArt, setShowArt] = useState(false);

  return (
    <main style={{ 
      backgroundColor: '#AFB298', // The muted tactical olive from image_2.png
      color: '#000', 
      minHeight: '100vh', 
      fontFamily: '"Inter", sans-serif',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;700;900&family=Space+Mono&display=swap');
        
        /* The High-Fidelity Tactical Background */
        main::before {
          content: "";
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none;
          opacity: 0.15; // Subtle texture
          z-index: 1;
          background-image: 
            linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px),
            /* Subtle X and O pattern derived from the tactical layout */
            url('data:image/svg+xml;utf8,<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><text x="10" y="30" font-family="Arial" font-weight="100" font-size="20" fill="rgba(0,0,0,0.2)">X</text><text x="35" y="55" font-family="Arial" font-weight="100" font-size="20" fill="rgba(0,0,0,0.2)">O</text></svg>');
          background-size: 30px 30px, 30px 30px, 120px 120px;
        }

        .system-panel {
          border: 1px solid rgba(0,0,0,0.1);
          background-color: #AFB298; // Match main BG
          position: absolute;
          padding: 10px;
          z-index: 10;
        }

        input:focus {
          border-bottom: 3px solid #FF4500 !important;
          transition: 0.3s;
        }
      `}</style>

      {/* Decorative Technical Panels - Inspired by image_2.png layout */}
      <div className="system-panel" style={{ top: '20px', left: '20px', width: '250px' }}>
        <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.65rem', display: 'grid', gridTemplateColumns: '80px 1fr' }}>
          <div>MATCH:</div> <div>T_FW // 2026.PROTO</div>
          <div>SCOPE:</div> <div>GLOBAL_NEUTRALITY</div>
          <div>STATUS:</div> <div style={{ color: '#FF4500' }}>[ ACTIVE_SYNTHESIS ]</div>
        </div>
      </div>
      
      <div style={{ position: 'absolute', top: '20px', right: '20px', textAlign: 'right' }}>
         <div style={{ display: 'inline-block', width: '20px', height: '20px', background: '#FF4500', borderRadius: '50%', marginBottom: '5px' }}></div>
         <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.65rem' }}>BIAS_INDEX: 1.0</div>
      </div>
      
      <header style={{ 
        textAlign: 'center', 
        padding: '80px 20px 40px 20px', 
        borderBottom: '10px solid #000',
        position: 'relative',
        zIndex: 10,
        backgroundColor: '#AFB298'
      }}>
        <h1 style={{ 
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: 'clamp(5rem, 24vw, 18rem)', 
          lineHeight: '0.7', 
          textTransform: 'uppercase',
          letterSpacing: '-0.11em', // CRUSHED KERNING - Dramatic overlap
          margin: 0
        }}>
          TEAM FAIR<br/>WEATHER
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          marginTop: '15px', 
          fontWeight: '900', 
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: '#000'
        }}>
          For when you just don't know who to root for.
        </p>
      </header>

      <div style={{ maxWidth: '1000px', margin: '60px auto', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        
        {/* Technical Instructional Line */}
        <div style={{ borderTop: '2px solid rgba(0,0,0,0.1)', borderBottom: '2px solid rgba(0,0,0,0.1)', padding: '15px 0', marginBottom: '80px', display: 'flex', justifyContent: 'space-between' }}>
           <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.8rem' }}>INPUT_SELECTION_PROTOCOL_v4</div>
           <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.8rem', color: '#FF4500' }}>[ FOUR_COORDINATES_REQUIRED ]</div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '50px' }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <div style={{ width: '10px', height: '10px', background: '#000' }}></div>
                <label style={{ 
                    fontFamily: '"Bebas Neue", sans-serif', 
                    fontSize: '2.5rem', 
                    color: '#000',
                    lineHeight: '1'
                }}>
                    COUNTRY
                </label>
              </div>
              <input 
                list="country-list"
                placeholder="---"
                style={{ 
                    border: 'none', 
                    borderBottom: '3px solid #000', 
                    background: 'transparent',
                    padding: '10px 0', 
                    fontSize: '1.3rem', 
                    fontWeight: '700', 
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

        <div style={{ marginTop: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
          <button 
            onClick={() => setShowArt(true)}
            style={{ 
              backgroundColor: '#000', 
              color: '#AFB298', // Invert to the BG color
              padding: '24px 80px', 
              fontSize: '1.8rem', 
              fontFamily: '"Bebas Neue", sans-serif', 
              letterSpacing: '0.1em',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              maxWidth: '600px'
            }}>
            GENERATE LOYALTY ART
          </button>
          
          {/* Subtle tactical legend */}
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '20px', textAlign: 'center', fontFamily: '"Space Mono", monospace', fontSize: '0.6rem', textTransform: 'uppercase' }}>
             Veri: International FairWeather Index // v2026 // NEUTRALITY_INDEX_ALPHA_BUILD
          </div>
        </div>
      </div>
    </main>
  );
}