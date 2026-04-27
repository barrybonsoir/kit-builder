"use client";
import React, { useState } from 'react';

const countries = [
  { name: "Algeria", code: "ALG", color: "#006233" }, { name: "Argentina", code: "ARG", color: "#74ACDF" },
  { name: "Australia", code: "AUS", color: "#00008B" }, { name: "Austria", code: "AUT", color: "#ED2939" },
  { name: "Belgium", code: "BEL", color: "#EF3340" }, { name: "Brazil", code: "BRA", color: "#009739" },
  { name: "Canada", code: "CAN", color: "#FF0000" }, { name: "Colombia", code: "COL", color: "#FCD116" },
  { name: "England", code: "ENG", color: "#FFFFFF" }, { name: "France", code: "FRA", color: "#002395" },
  { name: "Germany", code: "GER", color: "#000000" }, { name: "Japan", code: "JPN", color: "#BC002D" },
  { name: "Mexico", code: "MEX", color: "#006847" }, { name: "Netherlands", code: "NED", color: "#F36C21" },
  { name: "Spain", code: "ESP", color: "#C60B1E" }, { name: "United States", code: "USA", color: "#0A3161" }
];

const labels = ["SOURCE_01", "SOURCE_02", "SOURCE_03", "SOURCE_04"];

export default function Home() {
  const [activeSlot, setActiveSlot] = useState(null);
  const [selections, setSelections] = useState([null, null, null, null]);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [status, setStatus] = useState("IDLE"); // IDLE, PROCESSING, ERROR

  const getTextColor = (hex) => {
    const light = ["#FFFFFF", "#FCD116", "#FFCD00", "#74ACDF", "#F36C21"];
    return hex && light.includes(hex.toUpperCase()) ? "#000" : "#FFF";
  };

  const handleExecute = async () => {
    setStatus("PROCESSING");
    try {
      const response = await fetch('/api/generate-mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selections }),
      });

      const data = await response.json();
      if (data.image) {
        setGeneratedImage(data.image);
        setStatus("SUCCESS");
      } else {
        throw new Error(data.error || "Generation failed");
      }
    } catch (err) {
      console.error(err);
      setStatus("ERROR");
    }
  };

  const reset = () => {
    setSelections([null, null, null, null]);
    setGeneratedImage(null);
    setStatus("IDLE");
  };

  return (
    <main style={{ backgroundColor: '#FFF', minHeight: '100vh', color: '#000', fontFamily: 'sans-serif' }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono&display=swap" rel="stylesheet" />

      {status !== "SUCCESS" ? (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px' }}>
          <header style={{ borderBottom: '10px solid #000', marginBottom: '40px' }}>
            <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '5rem', margin: 0 }}>GEN_PROTOCOL_V8.0</h1>
            <p style={{ fontFamily: 'Space Mono', fontSize: '12px' }}>STATUS: {status}</p>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {labels.map((label, i) => (
              <button key={i} onClick={() => setActiveSlot(i)} style={{ 
                height: '200px', border: '6px solid #000', 
                backgroundColor: selections[i]?.color || '#EEE', cursor: 'pointer' 
              }}>
                <div style={{ fontFamily: 'Space Mono', fontSize: '10px', color: getTextColor(selections[i]?.color) }}>{label}</div>
                <div style={{ fontFamily: 'Bebas Neue', fontSize: '5rem', color: getTextColor(selections[i]?.color) }}>
                  {selections[i] ? selections[i].code : "+"}
                </div>
              </button>
            ))}
          </div>

          <button 
            disabled={selections.includes(null) || status === "PROCESSING"} 
            onClick={handleExecute}
            style={{ 
              width: '100%', marginTop: '30px', padding: '30px', 
              background: '#000', color: '#FFF', 
              fontFamily: 'Bebas Neue', fontSize: '3rem', 
              cursor: 'pointer', opacity: (selections.includes(null) || status === "PROCESSING") ? 0.3 : 1 
            }}
          >
            {status === "PROCESSING" ? "SYNTHESIZING..." : "COMPILE_MECHANICAL_MARK"}
          </button>
        </div>
      ) : (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
          <div style={{ border: '1px solid #FFF', padding: '20px' }}>
             <img src={generatedImage} alt="Generated Mark" style={{ width: '600px', height: '600px', display: 'block' }} />
          </div>
          
          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <p style={{ color: '#FFF', fontFamily: 'Space Mono', fontSize: '12px', marginBottom: '20px' }}>
              ARTEFACT_{selections.map(s => s.code).join('_')}
            </p>
            <button onClick={reset} style={{ 
              padding: '15px 40px', background: '#FFF', color: '#000', 
              fontFamily: 'Bebas Neue', fontSize: '1.5rem', cursor: 'pointer', border: 'none' 
            }}>NEW_SYNTHESIS</button>
          </div>
        </div>
      )}

      {/* SELECTION MODAL */}
      {activeSlot !== null && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 100, overflowY: 'auto' }}>
          <div style={{ position: 'sticky', top: 0, background: '#FF0000', padding: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#FFF', fontFamily: 'Space Mono' }}>LOAD_ASSET_{activeSlot + 1}</span>
            <button onClick={() => setActiveSlot(null)} style={{ background: '#000', color: '#FFF', border: 'none', padding: '10px 20px', fontFamily: 'Bebas Neue' }}>CLOSE</button>
          </div>
          {countries.map(c => (
            <button key={c.code} onClick={() => { 
              const s = [...selections]; 
              s[activeSlot] = c; 
              setSelections(s); 
              setActiveSlot(null); 
            }} style={{ 
              width: '100%', padding: '20px 40px', background: c.color, border: 'none', 
              textAlign: 'left', cursor: 'pointer', borderBottom: '1px solid rgba(0,0,0,0.1)' 
            }}>
              <span style={{ fontFamily: 'Bebas Neue', fontSize: '3rem', color: getTextColor(c.color) }}>{c.name}</span>
            </button>
          ))}
        </div>
      )}
    </main>
  );
}