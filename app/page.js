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

  useEffect(() => {
    document.body.style.overflow = activeSlot !== null ? 'hidden' : 'unset';
  }, [activeSlot]);

  const selectCountry = (country) => {
    const newSels = [...selections];
    newSels[activeSlot] = country;
    setSelections(newSels);
    setActiveSlot(null);
  };

  // Helper for text contrast
  const getTextColor = (hex) => {
    const lightColors = ["#FFFFFF", "#FCD116", "#FFCD00", "#FFDD00"];
    return lightColors.includes(hex.toUpperCase()) ? "#000" : "#FFF";
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
          opacity: 0.15;
          z-index: 1;
          background-image: linear-gradient(#FF0000 1px, transparent 1px), linear-gradient(90deg, #FF0000 1px, transparent 1px);
          background-size: 80px 80px;
        }

        .nation-btn {
          border: none;
          padding: 20px;
          cursor: pointer;
          transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 220px;
          position: relative;
          z-index: 5;
          text-align: center;
        }

        .overlay {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background: #000;
          z-index: 1000;
          overflow-y: auto;
        }

        .country-row {
          width: 100%;
          padding: 30px 20px;
          cursor: pointer;
          font-family: 'B