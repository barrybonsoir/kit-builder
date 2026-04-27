"use client";
import { useState, useEffect } from 'react';

const countries = [
  { name: "Argentina", code: "ARG", color: "#74ACDF" }, { name: "Australia", code: "AUS", color: "#FFCD00" },
  { name: "Brazil", code: "BRA", color: "#009739" }, { name: "Belgium", code: "BEL", color: "#EF3340" },
  { name: "Canada", code: "CAN", color: "#FF0000" }, { name: "Cameroon", code: "CMR", color: "#007A5E" },
  { name: "Chile", code: "CHI", color: "#0039A6" }, { name: "Colombia", code: "COL", color: "#FCD116" },
  { name: "Croatia", code: "CRO", color: "#FF0000" }, { name: "Denmark", code: "DEN", color: "#C60C30" },
  { name: "Ecuador", code: "ECU", color: "#FFDD00" }, { name: "England", code: "ENG", color: "#FFFFFF" },
  { name: "France", code: "FRA", color: "#002395" }, { name: "Germany", code: "GER", color: "#000000" },
  { name: "Ghana", code: "GHA", color: "#FCD116" }, { name: "Italy", code: "ITA", color: "#008C45" },
  { name: "Japan", code: "JPN", color: "#BC002D" }, { name: "Mexico", code: "MEX", color: "#006847" },
  { name: "Morocco", code: "MAR", color: "#C1272D" }, { name: "Netherlands", code: "NED", color: "#F36C21" },
  { name: "Nigeria", code: "NGA", color: "#008751" }, { name: "Portugal", code: "POR", color: "#FF0000" },
  { name: "Qatar", code: "QAT", color: "#8A1538" }, { name: "Saudi Arabia", code: "KSA", color: "#006C35" },
  { name: "Senegal", code: "SEN", color: "#FCD116" }, { name: "Serbia", code: "SRB", color: "#C6363C" },
  { name: "South Korea", code: "KOR", color: "#CD2E3A" }, { name: "Spain", code: "ESP", color: "#C60B1E" },
  { name: "Switzerland", code: "SUI", color: "#D52B1E" }, { name: "Tunisia", code: "TUN", color: "#E70013" },
  { name: "Uruguay", code: "URU", color: "#0038A8" }, { name: "USA", code: "USA", color: "#0A3161" },
  { name: "Wales", code: "WAL", color: "#D30731" }
];

const nationLabels = ["NATION ONE", "NATION TWO", "NATION THREE", "NATION FOUR"];

export default function Home() {
  const [activeSlot, setActiveSlot] = useState(null);
  const [selections, setSelections] = useState([null, null, null, null]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [uiHidden, setUiHidden] = useState(false);

  useEffect(() => {
    document.body.style.overflow = (activeSlot !== null || isGenerating) ? 'hidden' : 'unset';
  }, [activeSlot, isGenerating]);

  const selectCountry = (country) => {
    const newSels = [...selections];
    newSels[activeSlot] = country;
    setSelections(newSels);
    setActiveSlot(null);
  };

  const triggerSynthesis = () => {
    if (selections.includes(null)) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowResult(true);
    }, 3000);
  };

  const getTextColor = (hex) => {
    const light = ["#FFFFFF", "#FCD116", "#FFCD00", "#FFDD00", "#74ACDF"];
    return light.includes(hex?.toUpperCase()) ? "#000" : "#FFF";
  };

  return (
    <main style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', position: 'relative' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono&display=swap');
        
        main::before {
          content: "";
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none;
          opacity: 0.1;
          z-index: 1;
          background-image: linear-gradient(#FF0000 1px, transparent 1px), linear-gradient(90deg, #FF0000 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .nation-btn {
          border: none;
          padding: 20px;
          cursor: pointer;
          transition: 0.3s cubic-bezier(0.19, 1, 0.22, 1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          position: relative;
          z-index: 5;
        }

        .overlay {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background: #000;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .bar-container { width: 300px; height: 6px; background: #222; margin-top: 25px; overflow: hidden; }
        .bar-fill { height: 100%; background: #FF0000; animation: fill 3s forwards; }
        @keyframes fill { 0% { width: 0%; } 100% { width: 100%; } }

        .country-row {
          width: 100%;
          border: none;
          text-align: left;
          padding: 10px 30px;
          font-family: "Bebas Neue", sans-serif;
          font-size: 3.5rem;
          cursor: pointer;
        }
      `}</style>

      {!showResult ? (
        <>
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
                  style={{ backgroundColor: selections[i]?.color || "#000", color: getTextColor(selections[i]?.color || "#000") }}
                >
                  <span style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.65rem', position: 'absolute', top: '15px', opacity: 0.8 }}>{label}</span>
                  <h2 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: selections[i] ? '8rem' : '3rem', margin: 0 }}>
                    {selections[i] ? selections[i].code : "SELECT+"}
                  </h2>
                </button>
              ))}
            </div>

            <div style={{ marginTop: '60px', textAlign: 'center' }}>
              <button 
                onClick={triggerSynthesis}
                disabled={selections.includes(null)}
                style={{ 
                  backgroundColor: '#000', 
                  color: '#FFF', 
                  padding: '30px 0', 
                  width: '100%', 
                  maxWidth: '800px', 
                  fontSize: '2.5rem', 
                  fontFamily: '"Bebas Neue", sans-serif', 
                  border: 'none', 
                  cursor: selections.includes(null) ? 'not-allowed' : 'pointer',
                  opacity: selections.includes(null) ? 0.3 : 1,
                  boxShadow: '15px 15px 0px #FF0000',
                  letterSpacing: '0.1em'
                }}
              >
                GENERATE CREST
              </button>
            </div>
          </div>
        </>
      ) : (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', position: 'relative', zIndex: 10, padding: '40px' }}>
           
           {!uiHidden && <h1 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '3rem', marginBottom: '40px', borderBottom: '10px solid #FF0000' }}>CREST_SYNTHESIS_COMPLETE</h1>}
           
           <div style={{ display: 'flex', gap: '40px', alignItems: 'center', flexDirection: 'column' }}>
              
              {/* THE DYNAMIC SVG CREST */}
              <svg width="500" height="550" viewBox="0 0 500 550" style={{ filter: 'drop-shadow(3