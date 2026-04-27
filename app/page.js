"use client";
import { useState } from 'react';

const countries = [
  "Argentina", "Australia", "Brazil", "Belgium", "Canada", "Cameroon", "Chile", "Colombia", "Croatia", "Denmark", "Ecuador", "England", "France", "Germany", "Ghana", "Italy", "Japan", "Mexico", "Morocco", "Netherlands", "Nigeria", "Portugal", "Qatar", "Saudi Arabia", "Senegal", "Serbia", "South Korea", "Spain", "Switzerland", "Tunisia", "Uruguay", "USA", "Wales"
];

export default function Home() {
  const [showArt, setShowArt] = useState(false);

  return (
    <main style={{ 
      backgroundColor: '#FFFFFF', 
      color: '#000000', 
      minHeight: '100vh', 
      fontFamily: '"Inter", sans-serif',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;700;900&family=Space+Mono&display=swap');
        
        /* THE TACTICAL PROPAGANDA OVERLAY */
        main::before {
          content: "";
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none;
          opacity: 0.15;
          z-index: 1;
          background-image: 
            linear-gradient(#FF0000 1.5px, transparent 1.5px),
            linear-gradient(90deg, #FF0000 1.5px, transparent 1.5px),
            /* X and O Tactical Markings */
            url('data:image/svg+xml;utf8,<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg"><path d="M10 10 L30 30 M30 10 L10 30" stroke="black" stroke-width="1.5"/><circle cx="100" cy="40" r="15" fill="none" stroke="black" stroke-width="1.5"/><path d="M60 100 Q 90 70 130 110" stroke="rgba(255,0,0,0.5)" stroke-width="2" fill="none" stroke-dasharray="4"/></svg>');
          background-size: 60px 60px, 60px 60px, 250px 250px;
        }

        .grid-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr); /* FORCED SYMMETRY */
          gap: 60px 100px;
        }

        @media (max-width: 768px) {
          .grid-container {
            grid-template-columns: 1fr;
          }
        }

        input:focus {
          border-bottom: 6px solid #FF0000 !important;
          transition: 0.2s;
        }
      `}</style>

      {/* Top Status Bar */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', padding: '15px 20px', borderBottom: '2px solid #000', backgroundColor: '#FFF' }}>
        <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.65rem' }}>// ANALYSIS_MODE: ALPHA // NEUTRALITY_BUILD_v2.1</span>
        <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.65rem', color: '#FF0000', fontWeight: 'bold' }}>● STATUS: ACTIVE</span>
      </div>

      <header style={{ 
        textAlign: 'center', 
        padding: '80px 20px 60px 20px', 
        borderBottom: '20px solid #FF0000',
        position: 'relative',
        zIndex: 10,
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* LOGOTYPE PNG */}
        <img 
          src="/logo-red.png" 
          alt="Fair Weather Fandom" 
          style={{ 
            width: '100%', 
            maxWidth: '750px', 
            height: 'auto',
            marginBottom: '40px'
          }} 
        />
        
        {/* INSTRUCTIONAL COPY RESTORED */}
        <div