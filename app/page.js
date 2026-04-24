"use client";
import { useState } from 'react';

// Team data bundled directly to avoid file-linking errors
const teams = [
  { name: "Mexico", color: "#006847", icon: "🇲🇽" },
  { name: "USA", color: "#B22234", icon: "🇺🇸" },
  { name: "Nigeria", color: "#008751", icon: "🇳🇬" },
  { name: "South Korea", color: "#0047A0", icon: "🇰🇷" },
  { name: "Argentina", color: "#74ACDF", icon: "🇦🇷" },
  { name: "France", color: "#002395", icon: "🇫🇷" },
  { name: "Brazil", color: "#FFDC00", icon: "🇧🇷" },
  { name: "Italy", color: "#004B94", icon: "🇮🇹" }
];

export default function Home() {
  const [selections, setSelections] = useState([null, null, null, null]);
  const [showArt, setShowArt] = useState(false);

  const updateSlot = (index, val) => {
    const match = teams.find(t => t.name.toLowerCase() === val.toLowerCase());
    const newPicks = [...selections];
    newPicks[index] = match || { name: val, color: "#DDD", icon: "🏳️" };
    setSelections(newPicks);
  };

  const randomize = () => {
    const randomPicks = [...Array(4)].map(() => teams[Math.floor(Math.random() * teams.length)]);
    setSelections(randomPicks);
    setShowArt(true);
  }

  return (
    <main style={{ backgroundColor: '#FFF', color: '#000', minHeight: '100vh', paddingBottom: '100px' }}>
      
      {/* HEADER SECTION */}
      <header style={{ textAlign: 'center', padding: '100px 20px', borderBottom: '2px solid #000' }}>
        <h1 style={{ 
          fontSize: 'clamp(3rem, 12vw, 10rem)', 
          fontWeight: '900', 
          lineHeight: '0.8', 
          textTransform: 'uppercase',
          letterSpacing: '-0.05em',
          margin: 0
        }}>
          TEAM FAIR<br/>WEATHER
        </h1>
        <p style={{ fontSize: '1.2rem', marginTop: '20px', fontWeight: '600' }}>
          For when you just can't make up your mind
        </p>
      </header>

      {/* INPUT SECTION */}
      <div style={{ maxWidth: '900px', margin: '50px auto', padding: '0 20px' }}>
        <p style={{ fontSize: '1.4rem', textAlign: 'center', marginBottom: '40px' }}>
          Pick up to four countries that you just so happen to love the most. We'll make a piece of custom art that's just right for you and where your loyalties lie.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ border: '2px solid #000', padding: '15px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '900', color: '#FF4500' }}>TEAM {i+1}</span>
              <input 
                onChange={(e) => updateSlot(i, e.target.value)}
                placeholder="TYPE COUNTRY..."
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: '1.1rem', fontWeight: '700', textTransform: 'uppercase' }}
              />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button onClick={() => setShowArt(true)} style={{ flex: 2, padding: '20px', backgroundColor: '#000', color: '#FFF', fontWeight: '900', cursor: 'pointer' }}>GENERATE ART</button>
          <button onClick={randomize} style={{ flex: 1, padding: '20px', border: '2px solid #000', backgroundColor: 'transparent', fontWeight: '900', cursor: 'pointer' }}>RANDOMIZER</button>
        </div>
      </div>

      {/* ART OUTPUT */}
      {showArt && (
        <div style={{ maxWidth: '800px', margin: '50px auto', padding: '0 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '10px solid #000', aspectRatio: '1/1' }}>
                {selections.map((s, i) => (
                    <div key={i} style={{ backgroundColor: s?.color || '#EEE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
                        {s?.icon || ""}
                    </div>
                ))}
            </div>
            <div style={{ textAlign: 'right', color: '#FF4500', fontWeight: '900', fontSize: '3rem', marginTop: '10px' }}>84.5% NEUTRAL</div>
        </div>
      )}
    </main>
  );
}