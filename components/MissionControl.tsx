
import React from 'react';
import { WindowState, AppID } from '../types';
import { X } from 'lucide-react';

interface MissionControlProps {
  windows: WindowState[];
  onFocus: (id: AppID) => void;
  onClose: () => void;
}

const MissionControl: React.FC<MissionControlProps> = ({ windows, onFocus, onClose }) => {
  return (
    <div 
      className="fixed inset-0 z-[12000] bg-black/60 backdrop-blur-2xl animate-in fade-in duration-300 flex flex-col items-center p-20"
      onClick={onClose}
    >
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-black tracking-tighter text-white/90 drop-shadow-lg">Mission Control</h2>
        <p className="text-white/40 text-sm font-medium uppercase tracking-[0.3em] mt-2">Active Workspaces</p>
      </div>

      <div className="flex-1 w-full max-w-7xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 items-center justify-items-center overflow-y-auto no-scrollbar py-10">
        {windows.map(win => (
          <div 
            key={win.id}
            className="group relative w-full aspect-video glass-dark border border-white/10 rounded-2xl shadow-2xl cursor-pointer hover:scale-110 hover:ring-4 hover:ring-blue-500/50 transition-all duration-300 flex flex-col overflow-hidden"
            onClick={(e) => { e.stopPropagation(); onFocus(win.id); onClose(); }}
          >
            <div className="h-8 bg-black/40 border-b border-white/5 flex items-center px-4 justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{win.title}</span>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors">
               <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center opacity-40 group-hover:opacity-100 group-hover:scale-125 transition-all">
                  <span className="text-xl">🪟</span>
               </div>
            </div>
            <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
        {windows.length === 0 && (
          <div className="col-span-full text-center py-20 opacity-20">
             <h3 className="text-2xl font-bold">No windows open</h3>
          </div>
        )}
      </div>

      <button 
        className="mt-12 w-14 h-14 rounded-full glass-dark border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all group"
        onClick={onClose}
      >
        <X size={24} className="group-hover:rotate-90 transition-transform" />
      </button>
    </div>
  );
};

export default MissionControl;
