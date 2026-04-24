"use client";
import { useState } from 'react';
import { teams2026 } from '@/lib/teams';

export default function Home() {
  const [selections, setSelections] = useState([null, null, null, null]);

  const updateSlot = (index, teamName) => {
    const match = teams2026.find(t => 
      t.name.toLowerCase() === teamName.toLowerCase()
    );
    const newPicks = [...selections];
    newPicks[index] = match || null;
    setSelections(newPicks);
  };

  return (
    <main className="min-h-screen bg-white text-black font-sans selection:bg-yellow-200">
      {/* HEADER SECTION */}
      <nav className="p-6 border-b-2 border-black flex justify-between items-center">
        <h1 className="text-2xl font-black tracking-tighter uppercase">
          Team Fair Weather // <span className="text-gray-400">Summer '26</span>
        </h1>
        <div className="text-xs font-mono border border-black px-2 py-1">
          STATUS: NEUTRAL
        </div>
      </nav>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 p-8 lg:p-16">
        
        {/* LEFT: THE INPUTS */}
        <section className="space-y-8">
          <div>
            <h2 className="text-sm font-mono uppercase mb-4 text-gray-500 underline decoration-1">
              Select Your Squad (Up to 4)
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="group">
                  <input 
                    list="team-options"
                    className="w-full p-4 border-2 border-black rounded-none focus:ring-0 focus:border-blue-600 transition-colors uppercase font-bold"
                    placeholder={`TEAM 0${i + 1}`}
                    onChange={(e) => updateSlot(i, e.target.value)}
                  />
                  {selections[i] && (
                    <div className="mt-2 text-xs font-mono flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                      <span className="p-1 bg-black text-white">{selections[i].code}</span>
                      <span>{selections[i].region} / {selections[i].pattern}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <datalist id="team-options">
            {teams2026.map(t => <option key={t.code} value={t.name} />)}
          </datalist>

          <p className="text-sm text-gray-500 italic max-w-xs">
            "Because loyalty is overrated when the kits are this good."
          </p>
        </section>

        {/* RIGHT: THE ART PREVIEW */}
        <section className="flex flex-col items-center">
          <div className="w-full aspect-square border-4 border-black bg-gray-50 flex items-center justify-center relative overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            {/* THIS IS WHERE OUR P5 CANVAS WILL RENDER */}
            <div className="text-center p-8">
              <p className="font-mono text-xs uppercase tracking-widest text-gray-400">
                Art Engine Standby...
              </p>
            </div>
          </div>
          
          <button className="mt-8 w-full bg-black text-white p-4 font-bold uppercase hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-30" disabled={!selections[0]}>
            Download Spot Graphic (.PNG)
          </button>
        </section>
      </div>
    </main>
  );
}