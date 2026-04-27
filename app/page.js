"use client";
import { useState, useEffect } from 'react';

const countries = [
  { name: "Argentina", code: "ARG", color: "#74ACDF", emblem: "sun" },
  { name: "Brazil", code: "BRA", color: "#009739", emblem: "diamond" },
  { name: "Croatia", code: "CRO", color: "#FF0000", emblem: "checkers" },
  { name: "Germany", code: "GER", color: "#000000", emblem: "eagle" },
  { name: "USA", code: "USA", color: "#0A3161", emblem: "stars" },
  { name: "Japan", code: "JPN", color: "#BC002D", emblem: "circle" },
  { name: "England", code: "ENG", color: "#FFFFFF", emblem: "lion" },
  { name: "Mexico", code: "MEX", color: "#006847", emblem: "eagle-snake" },
  { name: "Netherlands", code: "NED", color: "#F36C21", emblem: "lion-rampant" },
  { name: "Italy", code: "ITA", color: "#008C45", emblem: "star-shield" },
  { name: "France", code: "FRA", color: "#002395", emblem: "rooster" },
  { name: "Spain", code: "ESP", color: "#C60B1E", emblem: "castle" }
];

const nationLabels = ["NATION ONE", "NATION TWO", "NATION THREE", "NATION FOUR"];

export default function Home() {
  const [activeSlot, setActiveSlot] = useState(null);
  const [selections, setSelections] = useState([null, null, null, null]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const selectCountry = (country) => {
    const newSels = [...selections];
    newSels[activeSlot] = country;
    setSelections(newSels);
    setActiveSlot(null);
  };

  const getTextColor = (hex) => {
    const light = ["#FFFFFF", "#FCD116", "#FFCD00", "#74ACDF", "#F36C21", "#F4F1EA"];
    return light.includes(hex?.toUpperCase()) ? "#000" : "#FFF";
  };

  const RenderHeraldicCrest = () => {
    const s = selections;
    return (
      <svg width="500" height="600" viewBox="0 0 500 600" style={{ filter: 'drop-shadow(30px 30px 0px rgba(0,0,0,0.15))' }}>
        <defs>
          <clipPath id="shieldClip">
            <path d="M100,50 L400,50 L400,400 Q400,550 250,580 Q100,550 100,400 Z" />
          </clipPath>
        </defs>

        {/* LAYER 0: HERALDIC SUPPORTERS (NATION 4) */}
        <path d="M80,100 L50,200 L80,350 M420,100 L450,200 L420,350" fill="none" stroke={s[3].color} strokeWidth="40" strokeOpacity="0.3" />

        {/* LAYER 1: THE MAIN SHIELD (NATION 1) */}
        <path d="M100,50 L400,50 L400,400 Q400,550 250,580 Q100,550 100,400 Z" fill={s[0].color} stroke="#000" strokeWidth="12" />

        {/* LAYER 2: SHIELD DIVISIONS (NATION 2) */}
        <g clipPath="url(#shieldClip)" opacity="0.5">
          <rect x="250" y="50" width="150" height="550" fill={s[1].color} />
          <path d="M100,280 L400,280" stroke="#000" strokeWidth="8" />
        </g>

        {/* LAYER 3: CENTRAL EMBLEM (NATION 3) */}
        <g transform="translate(250, 250)">
          <circle r="90" fill="#000" />
          <circle r="82" fill={s[2].color} />
          <path d="M-40,-40 L40,40 M40,-40 L-40,40" stroke="#000" strokeWidth="15" />
          <rect x="-20" y="-20" width="40" height="40" fill="#000" />
        </g>

        {/* LAYER 4: TYPOGRAPHY */}
        <rect x="150" y="480" width="200" height="60" fill="#000" />
        <text x="250" y="525" style={{ fontFamily: 'Bebas Neue', fontSize: '48px', fill: '#FFF', textAnchor: 'middle', letterSpacing: '2px' }}>{s[0].code}</text>
        
        <path d="M100,50 L400,50" stroke="#000" strokeWidth="30" />
        <text x="250" y="38" style={{ fontFamily: 'Space Mono', fontSize: '11px', fill: '#FFF', textAnchor: 'middle', letterSpacing: '5px' }}>
          PRO_GEN // {s[1].code} // {s[2].code}
        </text>
      </svg>
    );
  };

  return (
    <main style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', position: 'relative' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono&display=swap');
        
        .country-row {
          width: 100%; border: none; text-align: left; padding: 20px 40px;
          font-family: "Bebas Neue", sans-serif; font-size: 4.5rem; cursor: pointer;
          border-bottom: 1px solid rgba(0,0,0,0.1);
        }
        
        .nation-btn {
          border: 4px solid #000; display: flex; flex-direction: column; 
          align-items: center; justify-content: center; min-height: 220px; cursor: pointer;
          transition: background 0.2s cubic-bezier(0.19, 1, 0.22, 1);
        }
      `}</style>

      {!showResult ? (
        <>
          {/* LOCKED HEADER & BRANDING */}
          <header style={{ textAlign: 'center', padding: '60px 20px 40px 20px', borderBottom: '20px solid #FF0000', position: 'relative', zIndex: 10, backgroundColor: '#FFF' }}>
            <img src="/logo-red.png" alt="Fair Weather Fandom" style={{ width: '100%', maxWidth: '700px', marginBottom: '20px' }} />
            <div style={{ borderTop: '4px solid #000', borderBottom: '4px solid #000', padding: '15px 0', width: '100%', maxWidth: '700px', margin: '0 auto' }}>
              <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.9rem', margin: 0, letterSpacing: '0.05em' }}>
                FOR THE UNDECIDED. SELECT FOUR NATIONS TO SYNTHESIZE A DYNAMIC CREST.
              </p>
            </div>
          </header>

          <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 40px', position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
              {nationLabels.map((label, i) => (
                <button 
                  key={i} 
                  className="nation-btn" 
                  onClick={() => setActiveSlot(i)}
                  style={{ backgroundColor: selections[i]?.color || "#FFF" }}
                >
                  <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.65rem', marginBottom: '10px', color: selections[i] ? getTextColor(selections[i].color) : '#000' }}>{label}</span>
                  <h2 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: selections[i] ? '7rem' : '3rem', margin: 0, color: selections[i] ? getTextColor(selections[i].color) : '#000' }}>
                    {selections[i] ? selections[i].code : "SELECT+"}
                  </h2>
                </button>
              ))}
            </div>

            <div style={{ marginTop: '60px', textAlign: 'center' }}>
              <button 
                onClick={() => { setIsGenerating(true); setTimeout(() => { setIsGenerating(false); setShowResult(true); }, 3000); }}
                disabled={selections.includes(null)}
                style={{ 
                  backgroundColor: '#000',