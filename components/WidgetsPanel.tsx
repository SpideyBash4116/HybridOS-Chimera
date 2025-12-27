
import React from 'react';
import { Sun, Cloud, TrendingUp, Calendar, ChevronRight } from 'lucide-react';

const WidgetsPanel: React.FC = () => {
  return (
    <div className="absolute top-8 bottom-14 left-0 w-[420px] glass-dark border-r border-white/10 shadow-2xl z-[9000] p-8 overflow-y-auto custom-scrollbar animate-in slide-in-from-left duration-500">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black tracking-tighter">Widgets</h2>
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">JD</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Weather */}
        <div className="col-span-2 bg-gradient-to-br from-blue-500/40 to-cyan-500/40 border border-white/10 rounded-[2rem] p-6">
           <div className="flex justify-between items-start">
             <div>
                <h3 className="text-sm font-bold opacity-60 uppercase tracking-widest">San Francisco</h3>
                <h2 className="text-5xl font-black tracking-tighter">72°</h2>
             </div>
             <Sun className="text-yellow-400 w-12 h-12 drop-shadow-lg" />
           </div>
           <div className="mt-6 flex justify-between items-end">
              <span className="text-xs font-medium">Clear Skies • H:74 L:61</span>
              <div className="flex gap-2 text-[10px] font-bold opacity-40">
                 <span>TUE</span>
                 <span>WED</span>
                 <span>THU</span>
              </div>
           </div>
        </div>

        {/* Stocks */}
        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-4">
           <div className="flex items-center justify-between">
              <TrendingUp size={18} className="text-green-400" />
              <span className="text-[10px] font-black text-green-400">+2.4%</span>
           </div>
           <div>
              <h4 className="text-xs font-bold opacity-40">AAPL</h4>
              <p className="text-xl font-black tabular-nums">$184.22</p>
           </div>
        </div>

        {/* News Snippet */}
        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-4">
           <Cloud size={18} className="text-blue-300" />
           <p className="text-[11px] font-bold leading-tight line-clamp-2">New HybridOS kernel update adds AI threading...</p>
        </div>

        {/* Calendar */}
        <div className="col-span-2 bg-white/5 border border-white/10 rounded-[2rem] p-6">
           <div className="flex items-center gap-3 mb-6">
              <Calendar size={18} className="text-rose-400" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40">Upcoming</h3>
           </div>
           <div className="space-y-4">
              <EventItem time="10:00 AM" label="AI Architecture Review" color="bg-blue-500" />
              <EventItem time="02:30 PM" label="Hybrid-Link Sync" color="bg-purple-500" />
           </div>
           <button className="w-full mt-6 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
              Full Calendar <ChevronRight size={12} />
           </button>
        </div>
      </div>
    </div>
  );
};

const EventItem: React.FC<{ time: string, label: string, color: string }> = ({ time, label, color }) => (
  <div className="flex items-center gap-4">
     <div className={`w-1 h-8 ${color} rounded-full`} />
     <div className="flex-1">
        <p className="text-xs font-bold">{label}</p>
        <p className="text-[10px] opacity-40 tabular-nums">{time}</p>
     </div>
  </div>
);

export default WidgetsPanel;
