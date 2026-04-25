"use client";
import { useState } from 'react';

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
        
        /* Tactical Blueprint Grid */
        main::before {
          content: "";
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background-image: 
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          z-index: 1;
        }

        .data-dot {
          width: 6px; height: 6px;
          background: #FF4500;
          border-radius: 50%;
          display: inline-block;
          margin-right: 8px;
        }

        .tactical-line {
          position: absolute;
          border-top: 1px solid rgba(0,0,0,0.1);
          z-index: 2;
        }
      `}</style>

      {/* Technical Scouting Overlays */}
      <div style={{ position: 'absolute', top: '20px', right: '20px', fontFamily: '"Space Mono", monospace', fontSize: '0.6rem', textAlign: 'right', zIndex: 10 }}>
        [ ANALYSIS MODE: ACTIVE ]<br/>
        SAM_DEV_ENV // 2026.BETA<br/>
        <span style={{ color: '#FF4500' }}>● NEUTRALITY_INDEX: 1.0</span>
      </div>

      <header style={{ 
        textAlign: 'center', 
        padding: '50px 20px', 
        borderBottom: '10px solid #000',
        position: 'relative',
        zIndex: 10,
        backgroundColor: '#F9F9F7'
      }}>
        <h1 style={{ 
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: 'clamp(5rem, 24vw, 18rem)', 
          lineHeight: '0.75', 
          textTransform: 'uppercase',
          letterSpacing: '-0.06em',
          margin: 0
        }}>
          TEAM FAIR<br/>WEATHER
        </h1>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', display: 'grid', gridTemplateColumns: '1fr 3fr 1fr', gap: '40px', position: 'relative', zIndex: 10 }}>
        
        {/* LEFT COLUMN: THE DATA PANEL */}
        <div style={{ borderRight: '1px solid #DDD', paddingRight: '20px' }}>
            <div style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '30px' }}>
                <div style={{ marginBottom: '15px' }}><span className="data-dot"></span>Tactical Bias</div>
                <div style={{ height: '2px', background: '#000', width: '100%', marginBottom: '5px' }}></div>
                <div style={{ height: '2px', background: '#FF4500', width: '85%' }}></div>
                <p style={{ marginTop: '10px' }}>Global Coverage: Optimizing...</p>
            </div>
            
            <div style={{ width: '100%', aspectRatio: '1/1', border: '1px solid #000', position: 'relative', overflow: 'hidden' }}>
                 <div style={{ position: 'absolute', top: '50%', left: '0', width: '100%', height: '1px', background: 'rgba(0,0,0,0.1)' }}></div>
                 <div style={{ position: 'absolute', left: '50%', top: '0', width: '1px', height: '100%', background: 'rgba(0,0,0,0.1)' }}></div>
                 <div style={{ position: 'absolute', top: '30%', left: '40%', width: '10px', height: '10px', background: '#FF4500', borderRadius: '50%' }}></div>
                 <div style={{ position: 'absolute', bottom: '10%', right: '20%', width: '6px', height: '6px', border: '1px solid #000', borderRadius: '50%' }}></div>
            </div>
        </div>

        {/* MIDDLE COLUMN: THE FORM */}
        <div>
            <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.9rem', textAlign: 'center', marginBottom: '60px', textTransform: 'uppercase' }}>
               Input loyalty coordinates to generate a multi-vector kit asset.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                {[1,2,3,4].map(i => (
                    <div key={i} style={{ border: '1px solid #000', padding: '20px', backgroundColor: '#FFF' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                             <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.6rem' }}>SLOT_0{i}</span>
                             <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.6rem', color: '#FF4500' }}>[ REQUIRED ]</span>
                        </div>
                        <input 
                            placeholder="SELECT NATION"
                            style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontFamily: '"Bebas Neue", sans-serif', fontSize: '2.5rem', textTransform: 'uppercase' }}
                        />
                    </div>
                ))}
            </div>

            <button style={{ 
                width: '100%', marginTop: '40px', background: '#000', color: '#FFF', padding: '25px', 
                fontFamily: '"Bebas Neue", sans-serif', fontSize: '2rem', cursor: 'pointer', border: 'none'
            }}>
                RUN ANALYTICS & GENERATE
            </button>
        </div>

        {/* RIGHT COLUMN: MOMENTUM INDEX */}
        <div style={{ borderLeft: '1px solid #DDD', paddingLeft: '20px', fontFamily: '"Space Mono", monospace', fontSize: '0.7rem' }}>
            <p>MOMENTUM_INDEX</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '100px', marginTop: '20px' }}>
                {[20, 50, 80, 40, 90, 30, 60].map((h, i) => (
                    <div key={i} style={{ flex: 1, background: i === 4 ? '#FF4500' : '#000', height: `${h}%` }}></div>
                ))}
            </div>
            <p style={{ marginTop: '20px' }}>v.2026.WorldCup<br/>Protocol: FairWeather</p>
        </div>

      </div>
    </main>
  );
}