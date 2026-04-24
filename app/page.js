"use client";
import { useState } from 'react';
import { teams2026 } from '../lib/teams';

export default function Home() {
  const [selections, setSelections] = useState([null, null, null, null]);

  const updateSlot = (index, teamName) => {
    const match = teams2026.find(t => t.name.toLowerCase() === teamName.toLowerCase());
    const newPicks = [...selections];
    newPicks[index] = match || null;
    setSelections(newPicks);
  };

  return (
    <main style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0a0a0a', 
      color: 'white', 
      padding: '60px 40px', 
      fontFamily: 'Inter, system-ui, sans-serif' 
    }}>
      {/* HEADER SECTION */}
      <header style={{ 
        maxWidth: '1200px', 
        margin: '0 auto 80px auto', 
        borderLeft: '1px solid #333', 
        paddingLeft: '30px' 
      }}>
        <h1 style={{ 
          fontSize: 'clamp(2rem, 8vw, 5rem)', 
          fontWeight: '900', 
          lineHeight: '0.9', 
          letterSpacing: '-0.05em', 
          margin: '0 0 10px 0' 
        }}>
          TEAM FAIR <br /> WEATHER
        </h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ letterSpacing: '0.3em', fontSize: '0.7rem', color: '#888', fontWeight: 'bold' }}>
            PROJECT: HERITAGE KIT // REV 001
          </p>
          <p style={{ fontSize: '0.7rem', color: '#444' }}>©2026 GLOBAL NEUTRALITY</p>
        </div>
      </header>

      {/* MAIN CONTENT GRID */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '100px' 
      }}>
        
        {/* LEFT: SELECTION BOXES */}
        <section>
          <h2 style={{ fontSize: '0.7rem', color: '#555', letterSpacing: '2px', marginBottom: '30px' }}>
            INPUT PARAMETERS
          </h2>
          { [0,1,2,3].map(i => (
            <div key={i} style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.6rem', color: '#444', marginBottom: '5px' }}>
                SELECTION_SLOT_0{i+1}
              </label>
              <input 
                list="team-list"
                placeholder="TYPE COUNTRY..."
                onChange={(e) => updateSlot(i, e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '20px', 
                  backgroundColor: 'transparent', 
                  border: '1px solid #333', 
                  color: 'white', 
                  fontSize: '1rem', 
                  outline: 'none',
                  transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#666'}
                onBlur={(e) => e.target.style.borderColor = '#333'}
              />
            </div>
          ))}
          <datalist id="team-list">
            {teams2026.map(t => <option key={t.code} value={t.name} />)}
          </datalist>
        </section>

        {/* RIGHT: THE CANVAS PREVIEW */}
        <section>
          <h2 style={{ fontSize: '0.7rem', color: '#555', letterSpacing: '2px', marginBottom: '30px' }}>
            GENERATIVE_OUTPUT
          </h2>
          <div style={{ 
            aspectRatio: '1/1', 
            border: '1px solid #333', 
            position: 'relative', 
            backgroundColor: '#111', 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gridTemplateRows: '1fr 1fr',
            overflow: 'hidden'
          }}>
            {selections.map((s, i) => (
              <div key={i} style={{ 
                backgroundColor: s ? s.color : 'transparent', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '0.5px solid #222',
                transition: 'background-color 0.5s ease'
              }}>
                {s ? (
                  <span style={{ fontSize: '1.5rem', opacity: 0.8 }}>{s.icon}</span>
                ) : (
                  <span style={{ fontSize: '0.6rem', color: '#222' }}>VOID</span>
                )}
              </div>
            ))}
            
            {/* CROSSHAIR OVERLAY */}
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
          </div>
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
             <p style={{ fontSize: '0.6rem', color: '#444' }}>STATUS: {selections.filter(s => s).length}/4 READY</p>
             <p style={{ fontSize: '0.6rem', color: '#444' }}>RENDER_ENGINE: P5_V1</p>
          </div>
        </section>
      </div>
    </main>
  );
}