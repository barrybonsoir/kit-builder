"use client";
import React, { useState, useMemo } from 'react';

const countries = [
  { name: "Algeria", code: "ALG", color: "#006233" }, { name: "Argentina", code: "ARG", color: "#74ACDF" },
  { name: "Australia", code: "AUS", color: "#00008B" }, { name: "Austria", code: "AUT", color: "#ED2939" },
  { name: "Belgium", code: "BEL", color: "#EF3340" }, { name: "Bosnia Herzegovina", code: "BIH", color: "#002395" },
  { name: "Brazil", code: "BRA", color: "#009739" }, { name: "Canada", code: "CAN", color: "#FF0000" },
  { name: "Cape Verde", code: "CPV", color: "#003893" }, { name: "Colombia", code: "COL", color: "#FCD116" },
  { name: "Croatia", code: "CRO", color: "#FF0000" }, { name: "Curacao", code: "CUR", color: "#002B7F" },
  { name: "Czechia", code: "CZE", color: "#11457E" }, { name: "DR Congo", code: "COD", color: "#007FFF" },
  { name: "Ecuador", code: "ECU", color: "#FFD931" }, { name: "Egypt", code: "EGY", color: "#C1272D" },
  { name: "England", code: "ENG", color: "#FFFFFF" }, { name: "France", code: "FRA", color: "#002395" },
  { name: "Germany", code: "GER", color: "#000000" }, { name: "Ghana", code: "GHA", color: "#EF3340" },
  { name: "Haiti", code: "HAI", color: "#00209F" }, { name: "Iran", code: "IRN", color: "#239f40" },
  { name: "Iraq", code: "IRQ", color: "#007A3D" }, { name: "Ivory Coast", code: "CIV", color: "#FF8800" },
  { name: "Japan", code: "JPN", color: "#BC002D" }, { name: "Jordan", code: "JOR", color: "#CE1126" },
  { name: "Mexico", code: "MEX", color: "#006847" }, { name: "Morocco", code: "MAR", color: "#C1272D" },
  { name: "Netherlands", code: "NED", color: "#F36C21" }, { name: "New Zealand", code: "NZL", color: "#000000" },
  { name: "Norway", code: "NOR", color: "#BA0C2F" }, { name: "Panama", code: "PAN", color: "#DA121A" },
  { name: "Paraguay", code: "PAR", color: "#D52B1E" }, { name: "Portugal", code: "POR", color: "#FF0000" },
  { name: "Qatar", code: "QAT", color: "#8D1B3D" }, { name: "Saudi Arabia", code: "KSA", color: "#006C35" },
  { name: "Scotland", code: "SCO", color: "#005EB8" }, { name: "Senegal", code: "SEN", color: "#00853F" },
  { name: "South Africa", code: "RSA", color: "#007749" }, { name: "South Korea", code: "KOR", color: "#CD2E3A" },
  { name: "Spain", code: "ESP", color: "#C60B1E" }, { name: "Sweden", code: "SWE", color: "#006AA7" },
  { name: "Switzerland", code: "SUI", color: "#FF0000" }, { name: "Tunisia", code: "TUN", color: "#E70013" },
  { name: "Turkiye", code: "TUR", color: "#E30A17" }, { name: "United States", code: "USA", color: "#0A3161" },
  { name: "Uruguay", code: "URU", color: "#0081C6" }, { name: "Uzbekistan", code: "UZB", color: "#0099B5" }
];

export default function Home() {
  const [activeSlot, setActiveSlot] = useState(null);
  const [selections, setSelections] = useState([null, null, null, null]);
  const [isGenerating, setIsGenerating] = useState(false);

  const protocolText = useMemo(() => {
    if (selections.includes(null)) return "";
    const f = selections.map(s => `${s.name.toLowerCase().replace(/\s+/g, '-')}.png`);
    return `SYSTEM COMMAND:
Execute multi-source i2i synthesis. Reference: image_6.png.

CONTENT COMMAND:
16-fold radial symmetry. Solid black background.
Complex mosaic from:
1. ${f[0]}
2. ${f[1]}
3. ${f[2]}
4. ${f[3]}

INSTRUCTIONS:
Shatter all heraldic elements into geometric slivers. Names become unrecognizable glyphs. Intermix all colors/textures into a high-complexity visual puzzle. Sharp vector clarity.`;
  }, [selections]);

  const getTextColor = (hex) => {
    const light = ["#FFFFFF", "#FCD116", "#FFCD00", "#74ACDF", "#F36C21"];
    return hex && light.includes(hex.toUpperCase()) ? "#000" : "#FFF";
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#FFF', color: '#000', fontFamily: 'sans-serif' }}>
      {!isGenerating ? (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px' }}>
          <div style={{ borderBottom: '5px solid #000', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '3rem', margin: 0, fontWeight: '900' }}>GEN_PROTOCOL_V7</h1>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {selections.map((s, i) => (
              <button key={i} onClick={() => setActiveSlot(i)} style={{ 
                height: '150px', border: '4px solid #000', cursor: 'pointer',
                backgroundColor: s?.color || '#EEE', color: getTextColor(s?.color),
                fontWeight: 'bold', fontSize: '2rem'
              }}>
                {s ? s.code : `SLOT_0${i+1}`}
              </button>
            ))}
          </div>

          <button 
            disabled={selections.includes(null)} 
            onClick={() => setIsGenerating(true)}
            style={{ 
              width: '100%', marginTop: '20px', padding: '20px', backgroundColor: '#000', color: '#FFF',
              border: 'none', fontWeight: 'bold', fontSize: '1.5rem', cursor: 'pointer',
              opacity: selections.includes(null) ? 0.2 : 1
            }}
          >COMPILE_MARK</button>
        </div>
      ) : (
        <div style={{ backgroundColor: '#000', color: '#0F0', minHeight: '100vh', padding: '40px', fontFamily: 'monospace' }}>
          <p>>>> PROTOCOL_READY</p>
          <div style={{ border: '1px solid #0F0', padding: '20px', margin: '20px 0' }}>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{protocolText}</pre>
          </div>
          <button onClick={() => setIsGenerating(false)} style={{ background: '#0F0', border: 'none', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold' }}>BACK</button>
        </div>
      )}

      {activeSlot !== null && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: '#000', overflowY: 'auto', zIndex: 100 }}>
          <div style={{ position: 'sticky', top: 0, backgroundColor: '#F00', padding: '15px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#FFF', fontWeight: 'bold' }}>SELECT_ASSET</span>
            <button onClick={() => setActiveSlot(null)}>CLOSE</button>
          </div>
          {countries.map(c => (
            <button key={c.code} onClick={() => {
              const newSels = [...selections];
              newSels[activeSlot] = c;
              setSelections(newSels);
              setActiveSlot(null);
            }} style={{ 
              width: '100%', padding: '20px', textAlign: 'left', border: 'none', borderBottom: '1px solid #333',
              backgroundColor: c.color, color: getTextColor(c.color), fontWeight: 'bold', fontSize: '1.2rem'
            }}>
              {c.name}
            </button>
          ))}
        </div>
      )}
    </main>
  );
}