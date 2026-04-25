"use client";
import { useState } from 'react';

const countries = [
  "Argentina", "Australia", "Brazil", "Belgium", "Canada", "Cameroon", "Chile", "Colombia", "Croatia", "Denmark", "Ecuador", "England", "France", "Germany", "Ghana", "Italy", "Japan", "Mexico", "Morocco", "Netherlands", "Nigeria", "Portugal", "Qatar", "Saudi Arabia", "Senegal", "Serbia", "South Korea", "Spain", "Switzerland", "Tunisia", "Uruguay", "USA", "Wales"
];

export default function Home() {
  const [showArt, setShowArt] = useState(false);

  return (
    <main style={{ 
      backgroundColor: '#F9F9F7', // Gallery/Paper White
      color: '#000', 
      minHeight: '100vh', 
      fontFamily: '"Inter", sans-serif',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Import the dramatic fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;900&display=swap');
        
        /* The Texture Overlay */
        main::before {
          content: "";
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          opacity: 0.04;
          pointer-events: none;
          background-image: url("https://www.transparenttextures.com/patterns/stardust.png");
          z-index: 10;
        }

        input:focus {
          border-bottom: 3px solid #FF4500 !important;
          transition: 0.3s;
        }
      `}</style>
      
      <header style={{ textAlign: 'center', padding: '120px 20px', borderBottom: '5px solid #000' }}>
        <h1 style={{ 
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: 'clamp(5rem, 20vw, 16rem)', 
          lineHeight: '0.75', 
          textTransform: 'uppercase',
          letterSpacing: '-0.04em',
          margin: 0
        }}>
          TEAM FAIR<br/>WEATHER
        </h1>
        <p style={{ 
          fontSize: '1.4rem', 
          marginTop: '30px', 
          fontWeight: '600', 
          letterSpacing: '-0.02em',
          textTransform: 'uppercase'
        }}>
          For when you just don't know who to root for.
        </p>
      </header>

      <div style={{ maxWidth: '1000px', margin: '80px auto', padding: '0 20px' }}>
        <p style={{ 
          fontSize: '1.2rem', 
          textAlign: 'center', 
          marginBottom: '80px', 
          maxWidth: '550px', 
          margin: '0 auto 80px auto', 
          lineHeight: '1.5',
          fontWeight: '400'
        }}>
          Pick up to four countries that you happen to love the most. We'll create a piece of custom art that will cover all your bases.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '50px' }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ 
                fontFamily: '"Bebas Neue", sans-serif', 
                fontSize: '2rem', 
                color: '#000',
                letterSpacing: '0.02em'
              }}>
                COUNTRY 0{i+1}
              </label>
              <input 
                list="country-list"
                placeholder="TYPE NATION..."
                style={{ 
                    border: 'none', 
                    borderBottom: '3px solid #000', 
                    background: 'transparent',
                    padding: '12px 0', 
                    fontSize: '1.1rem', 
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

        <div style={{ marginTop: '100px', display: 'flex', justifyContent: 'center' }}>
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
              boxShadow: '10px 10px 0px #FF4500' // Brutalist shadow
            }}>
            GENERATE LOYALTY ART
          </button>
        </div>
      </div>
    </main>
  );
}