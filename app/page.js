"use client";
import { useState } from 'react';

const countries = [
  "Argentina", "Australia", "Brazil", "Belgium", "Canada", "Cameroon", "Chile", "Colombia", "Croatia", "Denmark", "Ecuador", "England", "France", "Germany", "Ghana", "Italy", "Japan", "Mexico", "Morocco", "Netherlands", "Nigeria", "Portugal", "Qatar", "Saudi Arabia", "Senegal", "Serbia", "South Korea", "Spain", "Switzerland", "Tunisia", "Uruguay", "USA", "Wales"
];

export default function Home() {
  const [showArt, setShowArt] = useState(false);

  return (
    <main style={{ 
      backgroundColor: '#AFB298', 
      color: '#000', 
      minHeight: '100vh', 
      fontFamily: '"Inter", sans-serif',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;700;900&family=Space+Mono&display=swap');
        
        /* Tactical Wallpaper Overlay */
        main::before {
          content: "";
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none;
          opacity: 0.1;
          z-index: 1;
          background-image: 
            linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px),
            url('data:image/svg+xml;utf8,<svg width="120" height="120" xmlns="http://www.w3.org/2000/svg"><path d="M10 10 L50 50 M50 10 L10 50" stroke="black" stroke-width="0.5" opacity="0.3"/><circle cx="80" cy="80" r="20" fill="none" stroke="black" stroke-width="0.5" opacity="0.3"/><path d="M60 20 Q 90 20 90 50" stroke="black" stroke-width="1" fill="none" opacity="0.3" marker-end="url(%23arrow)"/></svg>');
          background-size: 40px 40px, 40px 40px, 240px 240px;
        }

        input:focus {
          border-bottom: 4px solid #FF4500 !important;
          transition: 0.2s;
        }

        ::placeholder {
          color: rgba(0,0,0,0.3);
          font-family: "Space Mono", monospace;
          font-size: 0.8rem;
        }
      `}</style>

      {/* Top Metadata Bar */}
      <div style={{ position: 'relative', zIndex: 20, display: 'flex', justifyContent: 'space-between', padding: '15px 20px', fontFamily: '"Space Mono", monospace', fontSize: '0.65rem', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <div>SYSTEM_REF: T_FW_2026 // CHICAGO_UNIT</div>
        <div style={{ color: '#FF4500' }}>● STATUS: LIVE_SYNTHESIS</div>
      </div>

      <header style={{ 
        textAlign: 'center', 
        padding: '60px 20px 40px 20px', 
        borderBottom: '14px solid #000',
        position: 'relative',
        zIndex: 10,
        backgroundColor: 'rgba(175, 178, 152, 0.95)'
      }}>
        <h1 style={{ 
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: 'clamp(5rem, 26vw, 20rem)', 
          lineHeight: '0.72', 
          textTransform: 'uppercase',
          letterSpacing: '-0.07em', 
          margin: '0 auto',
          display: 'inline-block',
          textAlign