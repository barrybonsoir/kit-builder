"use client";
import { useState } from 'react';
import { teams2026 } from '../lib/teams';

export default function Home() {
  const [selections, setSelections] = useState([null, null, null, null]);
  const [showArt, setShowArt] = useState(false);

  const updateSlot = (index, teamName) => {
    const match = teams2026.find(t => t.name.toLowerCase() === teamName.toLowerCase() || t.code === teamName.toUpperCase());
    const newPicks = [...selections];
    newPicks[index] = match || null;
    setSelections(newPicks);
    setShowArt(false);
  };

  const randomize = () => {
    const randomPicks = [...Array(4)].map(() => 
      teams2026[Math.floor(Math.random() * teams2026.length)]
    );
    setSelections(randomPicks);
    setShowArt(true);
  };

  const handleSubmit = () => {
    if (selections.some(s => s !== null)) setShowArt(true);
  };

  return (
    <main style={{ 
      minHeight: '100vh', 
      backgroundColor: '#F2F2F2', 
      color: '#000', 
      fontFamily: 'Helvetica Neue, Arial, sans-serif',
      padding: '0 0 100px 0'
    }}>
      
      {/* 1. MASSIVE LOGOTYPE */}
      <header style={{ 
        textAlign: 'center', 
        padding: '80px 20px 20px 20px',
        borderBottom: '1px solid #000'
      }}>
        <h1 style={{ 
          fontSize: 'clamp(4rem, 15vw, 12rem)', 
          fontWeight: '900', 
          lineHeight: '0.8', 
          letterSpacing: '-0.05em', 
          margin: '0',
          textTransform: 'uppercase',
          fontStretch: 'extra-condensed'
        }}>
          TEAM FAIR<br/>WEATHER
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          fontWeight: '500', 
          marginTop: '20px',
          letterSpacing: '-0.02em'
        }}>
          For when you just can't make up your mind
        </p>
      </header>

      {/* 2. COPY BLOCK */}
      <section style={{ maxWidth: '800px', margin: '60px auto', textAlign: 'center', padding: '0 20px' }}>
        <p style={{ fontSize: '1.5rem', lineHeight: '1.3', fontWeight: '400' }}>
          Pick up to four countries that you just so happen to love the most. We'll make a piece of custom art that's just right for you and where your loyalties lie.
        </p>
      </section>

      {/* 3. FOUR INPUT FIELDS */}
      <section style={{ 
        maxWidth: '1000px', 
        margin: '0 auto', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '2px',
        backgroundColor: '#000',
        border: '2px solid #000'
      }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ backgroundColor: '#FFF', padding: '30px' }}>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '900', marginBottom: '10px', textTransform: 'uppercase', color: '#FF4500' }}>
              Team {i + 1}
            </label>
            <input 
              list="team-list"
              placeholder="ENTER COUNTRY..."
              onChange={(e) => updateSlot(i, e.target.value)}
              value={selections[i]?.name || ""}
              style={{ 
                width: '100%', 
                border: 'none', 
                borderBottom: '2px solid #000',
                fontSize: '1.2rem', 
                fontWeight: '700',
                padding: '10px 0',
                outline: 'none',
                textTransform: 'uppercase'
              }}
            />
          </div>
        ))}
      </section>

      <datalist id="team-list">
        {teams2026.map(t => <option key={t.code} value={t.name} />)}
      </datalist>

      {/* 4. ACTIONS */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px' }}>
        <button 
          onClick={handleSubmit}
          style={{ backgroundColor: '#000', color: '#FFF', border: 'none', padding: '20px 40px', fontWeight: '900', cursor: 'pointer', textTransform: 'uppercase' }}>
          Generate Art
        </button>
        <button 
          onClick={randomize}
          style={{ backgroundColor: 'transparent', color: '#000', border: '2px solid #000', padding: '20px 40px', fontWeight: '900', cursor: 'pointer', textTransform: 'uppercase' }}>
          Randomizer
        </button>
      </div>

      {/* 5. DYNAMIC ART OUTPUT */}
      {showArt && (
        <section style={{ maxWidth: '1000px', margin: '80px auto', padding: '0 20px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            aspectRatio: '1/1', 
            border: '10px solid #000' 
          }}>
            {selections.map((s, i) => (
              <div key={i} style={{ 
                backgroundColor: s ? s.color : '#EEE', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '5rem',
                border: '1px solid rgba(0,0,0,0.1)'
              }}>
                {s?.icon || ""}
              </div>
            ))}
          </div>
          <div style={{ marginTop: '20px', textAlign: 'right', fontWeight: '900', fontSize: '2rem', color: '#FF4500' }}>
            84.5% NEUTRAL
          </div>
        </section>
      )}

    </main>
  );
}