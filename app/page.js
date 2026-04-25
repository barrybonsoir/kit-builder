"use client";
import { useState } from 'react';

const countries = [
  "Argentina", "Australia", "Brazil", "Belgium", "Canada", "Cameroon", "Chile", "Colombia", "Croatia", "Denmark", "Ecuador", "England", "France", "Germany", "Ghana", "Italy", "Japan", "Mexico", "Morocco", "Netherlands", "Nigeria", "Portugal", "Qatar", "Saudi Arabia", "Senegal", "Serbia", "South Korea", "Spain", "Switzerland", "Tunisia", "Uruguay", "USA", "Wales"
];

export default function Home() {
  const [showArt, setShowArt] = useState(false);

  return (
    <main style={{ 
      backgroundColor: '#AFB298', // The muted tactical olive from image_3.png
      color: '#000', 
      minHeight: '100vh', 
      fontFamily: '"Inter", sans-serif',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;700;900&family=Space+Mono&display=swap');
        
        /* The Deep Technical Static Wallpaper - Merged Tactical Noise */
        main::before {
          content: "";
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none;
          opacity: 0.08; // Extremely subtle noise
          z-index: 1;
          background-image: 
            /* Subtle blueprint grid */
            linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px),
            /* Merged Tactical Static (charts, arrows, X's, O's) pattern */
            url('data:image/svg+xml;utf8,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><path d="M10 10 L40 40 M40 10 L10 40" stroke="rgba(0,0,0,0.4)" stroke-width="0.5"/><circle cx="70" cy="70" r="15" fill="none" stroke="rgba(0,0,0,0.4)" stroke-width="0.5"/><path d="M50 10 A30 30 0 0 1 80 40 L80 10" stroke="rgba(0,0,0,0.4)" stroke-width="0.5" fill="none"/></svg>');
          background-size: 30px 30px, 30px 30px, 200px 200px;
        }

        input:focus {
          border-bottom: 3px solid #FF4500 !important;
          transition: 0.3s;
        }
      `}</style>

      {/* The Actual Application Structure */}
      <header style={{ 
        textAlign: 'center', 
        padding: '100px 20px 60px 20px', 
        borderBottom: '10px solid #000',
        position: 'relative',
        zIndex: 10, // Content sits above the static
        backgroundColor: 'rgba(175, 178, 152, 0.8)' // Semi-opaque to soften the noise
      }}>
        <h1 style={{ 
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: 'clamp(5rem, 24vw, 18rem)', 
          lineHeight: '0.7', 
          textTransform: 'uppercase',
          letterSpacing: '-0.11em', // Dramatic kerning
          margin: 0
        }}>
          TEAM FAIR<br/>WEATHER
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          marginTop: '25px', 
          fontWeight: '900', 
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: '#000'
        }}>
          For when you just don't know who to root for.
        </p>
      </header>

      <div style={{ maxWidth: '1000px', margin: '80px auto', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        
        <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.8rem', textAlign: 'center', marginBottom: '80px', textTransform: 'uppercase' }}>
           Input loyalty coordinates // System synthesis asset for global distribution
        </p>
        
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
                placeholder="TYPE_NATION"
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
              color: '#AFB298', 
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
          
          <div style={{ paddingTop: '20px', textAlign: 'center', fontFamily: '"Space Mono", monospace', fontSize: '0.6rem', textTransform: 'uppercase' }}>
             Veri: International FairWeather Index // v2026 // NEUTRALITY_BUILD
          </div>
        </div>
      </div>
    </main>
  );
}