"use client";
import { useState } from 'react';

const countries = [
  "Argentina", "Australia", "Brazil", "Belgium", "Canada", "Cameroon", "Chile", "Colombia", "Croatia", "Denmark", "Ecuador", "England", "France", "Germany", "Ghana", "Italy", "Japan", "Mexico", "Morocco", "Netherlands", "Nigeria", "Portugal", "Qatar", "Saudi Arabia", "Senegal", "Serbia", "South Korea", "Spain", "Switzerland", "Tunisia", "Uruguay", "USA", "Wales"
];

export default function Home() {
  const [showArt, setShowArt] = useState(false);

  return (
    <main style={{ 
      backgroundColor: '#F9F9F7', 
      color: '#000', 
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
          opacity: 0.04;
          pointer-events: none;
          background-image: url("https://www.transparenttextures.com/patterns/stardust.png");
          z-index: 50;
        }

        /* The X's and O's Motif */
        .whiteboard-mark {
          position: absolute;
          font-family: '"Inter", sans-serif';
          font-weight: 100;
          color: rgba(0,0,0,0.05);
          pointer-events: none;
          user-select: none;
          z-index: 1;
        }

        input:focus {
          border-bottom: 3px solid #FF4500 !important;
          transition: 0.3s;
        }
      `}</style>

      {/* Decorative Whiteboard Elements */}
      <div className="whiteboard-mark" style={{ top: '10%', left: '5%', fontSize: '15rem' }}>X</div>
      <div className="whiteboard-mark" style={{ top: '40%', right: '2%', fontSize: '20rem' }}>O</div>
      <div className="whiteboard-mark" style={{ bottom: '5%', left: '15%', fontSize: '12rem' }}>X</div>
      <div style={{ 
        position: 'absolute', top: '150px', left: '20px', 
        fontFamily: '"Space Mono", monospace', fontSize: '0.6rem', 
        textTransform: 'uppercase', transform: 'rotate(-90deg)', transformOrigin: 'left' 
      }}>
        Tactical Framework v.2026 // Global Loyalty Distribution
      </div>
      
      <header style={{ 
        textAlign: 'center', 
        padding: '60px 20px 40px 20px', // Compressed padding
        borderBottom: '8px solid #000',
        position: 'relative',
        zIndex: 10
      }}>
        <h1 style={{ 
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: 'clamp(5rem, 22vw, 18rem)', 
          lineHeight: '0.7', // Ultra tight
          textTransform: 'uppercase',
          letterSpacing: '-0.05em',
          margin: 0
        }}>
          TEAM FAIR<br/>WEATHER
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          marginTop: '15px', 
          fontWeight: '900', 
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#FF4500'
        }}>
          For when you just don't know who to root for.
        </p>
      </header>

      <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        <p style={{ 
          fontSize: '1.1rem', 
          textAlign: 'center', 
          marginBottom: '60px', 
          maxWidth: '500px', 
          margin: '0 auto 60px auto', 
          lineHeight: '1.4',
          fontFamily: '"Space Mono", monospace',
          textTransform: 'uppercase'
        }}>
          [ SELECT FOUR NATIONS ] <br/>
          System will synthesize a high-utility loyalty asset covering all tactical bases.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.7rem' }}>POS_{i+1}</span>
                <label style={{ 
                    fontFamily: '"Bebas Neue", sans-serif', 
                    fontSize: '2.2rem', 
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
                    borderBottom: '2px solid #000', 
                    background: 'transparent',
                    padding: '10px 0', 
                    fontSize: '1.2rem', 
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

        <div style={{ marginTop: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <button 
            onClick={() => setShowArt(true)}
            style={{ 
              backgroundColor: '#000', 
              color: '#FFF', 
              padding: '24px 80px', 
              fontSize: '1.6rem', 
              fontFamily: '"Bebas Neue", sans-serif', 
              letterSpacing: '0.1em',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              maxWidth: '500px'
            }}>
            GENERATE LOYALTY ART
          </button>
          <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.6rem' }}>
            TOTAL NEUTRALITY RATIO: 100% // NO BIAS DETECTED
          </div>
        </div>
      </div>
    </main>
  );
}