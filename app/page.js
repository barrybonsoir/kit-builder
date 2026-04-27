"use client";
import React, { useState } from 'react';

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
  const [finalProtocol, setFinalProtocol] = useState("");

  const getTextColor = (hex) => {
    const light = ["#FFFFFF", "#FCD116", "#FFCD00", "#74ACDF", "#F36C21", "#F4F1EA"];
    return hex && light.includes(hex.toUpperCase()) ? "#000" : "#FFF";
  };

  const getFileName = (country) => {
    if (!country) return "";
    return `${country.name.toLowerCase().replace(/\s+/g, '-')}.png`;
  };

  const constructProtocol = () => {
    const filenames = selections.map(s => getFileName(s));
    return `SYSTEM COMMAND:
Execute a multi-source image-to-image synthesis, creating a complex, perfect kaleidoscopic pattern. Use image_6.png as a text reference to retrieve the visual data for the literal list of filenames provided.

CONTENT COMMAND:
Create a centered, perfectly symmetrical kaleidoscopic emblem with 16-fold radial symmetry. The final image must have a clean, high-resolution graphic style with a solid black background.
The emblem is a complex mosaic built from heavily randomized and arbitrarily cropped fragments of the following four specific icons:
${filenames[0]} (extracted visual data)
${filenames[1]} (extracted visual data)
${filenames[2]} (extracted visual data)
${filenames[3]} (extracted visual data)

DETAILED EXECUTION INSTRUCTIONS:
Retrieve and process each specified icon file. Convert all text elements into abstract geometric textures; names and words must become unrecognizable, shattered glyphs.
Deconstruct all original heraldic elements and national flags into small, distorted geometric slivers, shattered glass fragments, and abstract color panels.
For circular icons, shatter their borders into repeated gear-like or radiating point patterns. For shields, fragment their unique shapes into interlocking polygonal mosaic tiles.
Intermix all 16 colors and all textures from the four input images, ensuring each color is present in small, distributed clusters across the final kaleidoscopic form.
Unified by an intricate network of fine geometric line work that partitions the entire structure into a high-complexity visual puzzle. Sharp vector-like clarity.`;
  };

  const handleExecute = () => {
    setFinalProtocol(constructProtocol());
    setIsGenerating(true);
  };

  return (
    <main style={{ backgroundColor: '#FFF', minHeight: '100vh', color: '#000' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono&display=swap');
        body { margin: 0; padding: 0; }
      `}} />

      {!isGenerating ? (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px' }}>
          <header style={{ borderBottom: '10px solid #000', marginBottom: '40px', paddingBottom: '20px' }}>
            <h1 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '5rem', margin: 0 }}>GEN_PROTOCOL_V7.0</h1>
            <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '12px' }}>STATUS: READY_FOR_SYNTHESIS</p>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {[0, 1, 2, 3].map((i) => (
              <button key={i} onClick={() => setActiveSlot(i)} style={{ 
                height: '220px', 
                border: '6px solid #000', 
                backgroundColor: selections[i]?.color || '#EEE', 
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: getTextColor(selections[i]?.color) }}>SOURCE_0{i + 1}</span>
                <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '5rem', color: getTextColor(selections[i]?.color) }}>
                  {selections[i] ? selections[i].code : "+"}
                </span>
              </button>
            ))}
          </div>

          <button 
            disabled={selections.includes(null)} 
            onClick={handleExecute}
            style={{ 
              width: '100%', marginTop: '30px', padding: '30px', 
              background: '#000', color: '#FFF', 
              fontFamily: '"Bebas Neue", sans-serif', fontSize: '3rem', 
              cursor: 'pointer', opacity: selections.includes(null) ? 0.3 : 1,
              border: 'none'
            }}
          >EXECUTE_SYNTHESIS</button>
        </div>
      ) : (
        <div style={{ minHeight: '100vh', background: '#000', color: '#0F0', padding: '40px', fontFamily: '"Space Mono", monospace', fontSize: '13px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <p>>>> INITIALIZING PROTOCOL V7.0...</p>
            <p>>>> ASSET FILENAMES EXTRACTED...</p>
            <div style={{ border: '1px solid #0F0', padding: '30px', margin: '20px 0', color: '#0F0', lineHeight: '1.6' }}>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontFamily: 'inherit' }}>{finalProtocol}</pre>
            </div>
            <p>>>> SENDING TO GENERATIVE ENGINE...</p>
            <p>>>> WAITING FOR MARK SYNTHESIS...</p>
            <button 
              onClick={() => setIsGenerating(false)} 
              style={{ marginTop: '40px', background: '#0F0', color: '#000', border: 'none', padding: '15px 30px', fontFamily: '"Bebas Neue", sans-serif', fontSize: '1.5rem', cursor: 'pointer' }}
            >RETURN_TO_SELECTOR</button>
          </div>
        </div>
      )}

      {activeSlot !== null && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 100, overflowY: 'auto' }}>
          <div style={{ position: 'sticky', top: 0, background: '#FF0000', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#FFF', fontFamily: '"Space Mono", monospace' }}>LOADING_ASSET_FOR_SLOT_0{activeSlot + 1}</span>
            <button onClick={() => setActiveSlot(null)} style={{ background: '#000', color: '#FFF', border: 'none', padding: '10px 20px', fontFamily: '"Bebas Neue", sans-serif', cursor: 'pointer' }}>BACK</button>
          </div>
          {countries.map(c => (
            <button key={c.code} onClick={() => { const s = [...selections]; s[activeSlot] = c; setSelections(s); setActiveSlot(null); }} style={{ width: '100%', padding: '30px 40px', background: c.color, border: 'none', borderBottom: '1px solid rgba(0,0,0,0.1)', textAlign: 'left', cursor: 'pointer' }}>
              <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '4rem', color: getTextColor(c.color) }}>{c.name}</span>
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
