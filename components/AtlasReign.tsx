
import React, { useState, useEffect, useRef } from 'react';

const AtlasReign: React.FC = () => {
  const [country, setCountry] = useState({
    population: 2300,
    economy: 80,
    happiness: 70,
    military: 40,
    environment: 60,
    year: 1
  });

  const [activeLaws, setActiveLaws] = useState<any[]>([]);
  const [news, setNews] = useState<string[]>(["Welcome to Atlas Reign. Your nation awaits your command."]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const newsEndRef = useRef<HTMLDivElement>(null);

  const clamp = (v: number) => Math.max(0, Math.min(100, v));

  const addNews = (msg: string) => {
    setNews(prev => [...prev, `[Year ${country.year}] ${msg}`]);
  };

  useEffect(() => {
    newsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [news]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        ctx.fillStyle = `rgb(${200 - x * 10}, ${150 + y * 5}, 150)`;
        ctx.fillRect(x * 30, y * 30, 30, 30);
      }
    }
  }, [country.year]);

  const enactLaw = (type: string) => {
    let law: any = null;
    if (type === "environment") {
      law = { name: "Environmental Protection Act", duration: 5, environment: 3, economy: -2 };
      addNews("Environmental Protection Act passed.");
    } else if (type === "economy") {
      law = { name: "Tax Incentive Program", duration: 4, economy: 4, happiness: -1 };
      addNews("Tax Incentive Program passed.");
    } else if (type === "military") {
      law = { name: "Mandatory Military Service", duration: 6, military: 4, happiness: -3 };
      addNews("Mandatory Military Service enacted.");
    }

    if (law) {
      setActiveLaws(prev => [...prev, law]);
    }
  };

  const startFestival = (type: string) => {
    let msg = "";
    setCountry(prev => {
      const next = { ...prev };
      switch (type) {
        case "cultural":
          next.happiness += 10;
          next.economy -= 3;
          msg = "Cultural Festival celebrated! Happiness +10, Economy -3";
          break;
        case "music":
          next.happiness += 8;
          next.economy -= 2;
          next.environment -= 1;
          msg = "Music Festival celebrated! Happiness +8, Economy -2, Environment -1";
          break;
        case "eco":
          next.happiness += 5;
          next.economy -= 2;
          next.environment += 3;
          msg = "Eco Festival celebrated! Happiness +5, Economy -2, Environment +3";
          break;
      }
      next.economy = clamp(next.economy);
      next.happiness = clamp(next.happiness);
      next.environment = clamp(next.environment);
      return next;
    });
    addNews(msg);
  };

  const nextTurn = () => {
    setCountry(prev => {
      let nextEcon = prev.economy;
      let nextHappy = prev.happiness;
      let nextMil = prev.military;
      let nextEnv = prev.environment;

      activeLaws.forEach(l => {
        if (l.economy) nextEcon += l.economy;
        if (l.happiness) nextHappy += l.happiness;
        if (l.military) nextMil += l.military;
        if (l.environment) nextEnv += l.environment;
      });

      return {
        ...prev,
        population: prev.population + Math.floor(prev.population * 0.02),
        economy: clamp(nextEcon),
        happiness: clamp(nextHappy),
        military: clamp(nextMil),
        environment: clamp(nextEnv),
        year: prev.year + 1
      };
    });

    setActiveLaws(prev => prev.map(l => ({ ...l, duration: l.duration - 1 })).filter(l => l.duration > 0));
    addNews("A new year begins. The nation continues to evolve.");
  };

  return (
    <div className="h-full w-full bg-[#eef0f2] text-[#1a2b44] overflow-auto p-4 font-sans select-text">
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold text-center mb-6">Atlas Reign – Alpha ❄️🎄</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stats Panel */}
          <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Nation Stats</h2>
            <div className="mb-4 flex justify-between items-center">
              <label className="font-semibold">Population:</label>
              <span className="text-lg font-mono">{country.population}</span>
            </div>

            {[
              { label: 'Economy', val: country.economy, color: 'bg-green-500' },
              { label: 'Happiness', val: country.happiness, color: 'bg-yellow-500' },
              { label: 'Military', val: country.military, color: 'bg-red-500' },
              { label: 'Environment', val: country.environment, color: 'bg-blue-500' }
            ].map(stat => (
              <div key={stat.label} className="mb-4">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>{stat.label}</span>
                  <span>{stat.val}/100</span>
                </div>
                <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden relative group">
                  <div 
                    className={`${stat.color} h-full transition-all duration-500`} 
                    style={{ width: `${stat.val}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    {stat.val}% Efficiency
                  </span>
                </div>
              </div>
            ))}

            <button 
              onClick={nextTurn}
              className="w-full mt-4 bg-[#1a2b44] text-white py-3 rounded-lg font-bold hover:bg-black transition-colors"
            >
              Next Turn
            </button>
          </div>

          {/* Laws Panel */}
          <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Laws & Festivals</h2>
            <div className="grid grid-cols-1 gap-2 mb-6">
              <button onClick={() => enactLaw('environment')} className="text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium">Enact Environmental Act</button>
              <button onClick={() => enactLaw('economy')} className="text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium">Tax Incentive Program</button>
              <button onClick={() => enactLaw('military')} className="text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium">Mandatory Service</button>
              <div className="h-px bg-gray-200 my-2" />
              <div className="flex gap-2">
                <button onClick={() => startFestival('cultural')} className="flex-1 px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded text-xs font-bold">Cultural Fest</button>
                <button onClick={() => startFestival('music')} className="flex-1 px-3 py-2 bg-pink-100 hover:bg-pink-200 text-pink-700 rounded text-xs font-bold">Music Fest</button>
                <button onClick={() => startFestival('eco')} className="flex-1 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded text-xs font-bold">Eco Fest</button>
              </div>
            </div>

            <h3 className="text-sm font-bold opacity-50 uppercase tracking-wider mb-2">Active Laws</h3>
            <div className="h-32 overflow-y-auto bg-gray-50 rounded p-3 text-xs space-y-1">
              {activeLaws.length === 0 ? (
                <p className="text-gray-400 italic">No laws active</p>
              ) : (
                activeLaws.map((l, i) => (
                  <div key={i} className="flex justify-between border-b border-gray-100 py-1">
                    <span>{l.name}</span>
                    <span className="font-bold">{l.duration}y left</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* News Panel */}
          <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">National News</h2>
            <div className="h-48 overflow-y-auto bg-gray-900 text-green-400 p-4 rounded font-mono text-[11px] leading-relaxed">
              {news.map((n, i) => (
                <p key={i} className="mb-2">{n}</p>
              ))}
              <div ref={newsEndRef} />
            </div>
          </div>

          {/* Map Panel */}
          <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Country Map</h2>
            <div className="flex items-center justify-center bg-gray-100 rounded overflow-hidden">
              <canvas ref={canvasRef} width={300} height={300} className="w-full max-w-[300px] h-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtlasReign;
