
import React from 'react';
import { Wifi, Bluetooth, Moon, Sun, Volume2, Maximize2, Zap, Radio, Laptop } from 'lucide-react';

interface ControlCenterProps {
  onClose: () => void;
}

const ControlCenter: React.FC<ControlCenterProps> = ({ onClose }) => {
  return (
    <div 
      className="absolute top-10 right-2 w-80 glass-dark border border-white/10 rounded-3xl p-4 shadow-2xl z-[10001] animate-in fade-in zoom-in-95 duration-200"
      onClick={e => e.stopPropagation()}
    >
      <div className="grid grid-cols-2 gap-3 mb-4">
        <ControlTile icon={<Wifi size={18} />} label="Wi-Fi" sub="Chimera_Net" active />
        <ControlTile icon={<Bluetooth size={18} />} label="Bluetooth" sub="On" active />
        <ControlTile icon={<Radio size={18} />} label="AirDrop" sub="Contacts Only" />
        <ControlTile icon={<Moon size={18} />} label="Focus" sub="Do Not Disturb" />
      </div>

      <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-4 mb-3">
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-40">
            <span>Display</span>
            <span>85%</span>
          </div>
          <div className="flex items-center gap-3">
            <Sun size={14} className="opacity-40" />
            <div className="flex-1 h-6 bg-white/10 rounded-lg relative overflow-hidden group">
               <div className="absolute inset-y-0 left-0 w-[85%] bg-white/40 group-hover:bg-white/60 transition-colors" />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-40">
            <span>Sound</span>
            <span>60%</span>
          </div>
          <div className="flex items-center gap-3">
            <Volume2 size={14} className="opacity-40" />
            <div className="flex-1 h-6 bg-white/10 rounded-lg relative overflow-hidden group">
               <div className="absolute inset-y-0 left-0 w-[60%] bg-blue-500/60 group-hover:bg-blue-500 transition-colors" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
         <SmallTile icon={<Laptop size={14} />} label="Mirror" />
         <SmallTile icon={<Zap size={14} />} label="Battery" />
         <SmallTile icon={<Maximize2 size={14} />} label="Stage" />
      </div>
    </div>
  );
};

const ControlTile: React.FC<{ icon: React.ReactNode, label: string, sub: string, active?: boolean }> = ({ icon, label, sub, active }) => (
  <div className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${active ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'}`}>
    <div className={`p-2 rounded-lg ${active ? 'bg-white/20' : 'bg-white/10'}`}>
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-[11px] font-bold">{label}</span>
      <span className="text-[9px] opacity-60 font-medium truncate w-20">{sub}</span>
    </div>
  </div>
);

const SmallTile: React.FC<{ icon: React.ReactNode, label: string }> = ({ icon, label }) => (
  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer flex flex-col items-center gap-1.5">
     {icon}
     <span className="text-[9px] font-bold opacity-60 uppercase tracking-tighter">{label}</span>
  </div>
);

export default ControlCenter;
