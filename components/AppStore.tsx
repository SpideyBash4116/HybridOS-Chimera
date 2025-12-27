
import React, { useState } from 'react';
import { ShoppingBag, Star, Download, ShieldCheck, Zap, Sparkles, TrendingUp, Search } from 'lucide-react';

const AppStore: React.FC = () => {
  const [installing, setInstalling] = useState<string | null>(null);

  const featured = [
    { id: '1', name: 'Nova Pro', desc: 'Enhanced AI models for complex logic.', icon: <Sparkles />, color: 'from-purple-600 to-indigo-600' },
    { id: '2', name: 'Atlas RTX', desc: 'Next-gen rendering for your sim nations.', icon: <Zap />, color: 'from-orange-600 to-red-600' },
    { id: '3', name: 'Chimera Dev', desc: 'Advanced debugging and shell tools.', icon: <TrendingUp />, color: 'from-blue-600 to-cyan-600' }
  ];

  const handleInstall = (id: string) => {
    setInstalling(id);
    setTimeout(() => setInstalling(null), 3000);
  };

  return (
    <div className="h-full bg-[#0a0a0a] text-white font-sans overflow-auto custom-scrollbar">
      {/* Header */}
      <div className="p-10 bg-gradient-to-b from-white/5 to-transparent">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tighter">Chimera Central</h1>
            <p className="text-white/40 font-medium mt-1">Discover the power of HybridOS</p>
          </div>
          <div className="relative">
             <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" />
             <input placeholder="Apps, Extensions, Tools" className="bg-white/5 border border-white/10 rounded-full py-2.5 px-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 w-64" />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-10 pb-20 space-y-12">
        {/* Featured Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
              <Star size={20} className="text-yellow-400 fill-yellow-400" />
              Editors Choice
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map(app => (
              <div key={app.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.08] transition-all group relative overflow-hidden">
                <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${app.color} blur-3xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center mb-6 shadow-xl`}>
                  {/* Fixed TypeScript error by asserting to React.ReactElement<any> to allow the 'size' prop */}
                  {React.cloneElement(app.icon as React.ReactElement<any>, { size: 28 })}
                </div>
                <h3 className="text-lg font-bold">{app.name}</h3>
                <p className="text-xs text-white/40 mt-2 mb-8 leading-relaxed">{app.desc}</p>
                <button 
                  onClick={() => handleInstall(app.id)}
                  disabled={installing === app.id}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-white/10 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {installing === app.id ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>GET <Download size={14} /></>
                  )}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
           <CategoryCard label="Productivity" icon={<Zap />} />
           <CategoryCard label="Utilities" icon={<ShieldCheck />} />
           <CategoryCard label="Developer" icon={<Star />} />
           <CategoryCard label="Gaming" icon={<Star />} />
        </section>

        {/* System Extensions */}
        <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 flex items-center gap-12">
           <div className="w-32 h-32 rounded-3xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck size={64} className="text-blue-500" />
           </div>
           <div>
              <h2 className="text-2xl font-black mb-2 tracking-tight">System Shield Pro</h2>
              <p className="text-white/50 text-sm max-w-xl mb-6">Real-time kernel monitoring and automated firewall management for power users. Optimized for Chimera 6.5.0.</p>
              <button className="px-8 py-3 bg-white text-black text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white/80 transition-colors">Install Expansion</button>
           </div>
        </section>
      </div>
    </div>
  );
};

const CategoryCard = ({ label, icon }: { label: string, icon: any }) => (
  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer flex items-center gap-4 group">
     <div className="p-3 rounded-xl bg-white/5 group-hover:bg-blue-600/20 transition-colors">{icon}</div>
     <span className="text-sm font-bold opacity-60 group-hover:opacity-100">{label}</span>
  </div>
);

export default AppStore;
