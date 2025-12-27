
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, ListMusic, Heart } from 'lucide-react';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(225); // 3:45 in seconds
  const timerRef = useRef<number | null>(null);

  const playlist = [
    { title: "Midnight Pulse", artist: "Chimera Core", album: "Hybrid Dreams", color: "from-blue-600 to-purple-600" },
    { title: "Silicon Valley Echo", artist: "Nova AI", album: "Digital Horizons", color: "from-pink-600 to-rose-600" },
    { title: "Kernel Panic", artist: "The SysAdmins", album: "Root Access", color: "from-emerald-600 to-teal-600" }
  ];

  const track = playlist[currentTrack];

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentTime(prev => (prev < duration ? prev + 1 : 0));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, duration]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const p = x / rect.width;
    setCurrentTime(Math.floor(p * duration));
  };

  return (
    <div className="flex h-full bg-black/90 text-white font-sans overflow-hidden select-none">
      {/* Sidebar */}
      <div className="w-56 border-r border-white/5 p-8 bg-black/40 flex flex-col shrink-0">
        <h2 className="text-2xl font-black tracking-tighter mb-10 flex items-center gap-2">
           <ListMusic size={24} className="text-blue-500" />
           Music
        </h2>
        <nav className="space-y-8 flex-1">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest opacity-20 mb-4">Library</div>
            <div className="space-y-1">
              <button className="w-full text-left px-4 py-2 rounded-xl bg-white/10 text-xs font-black shadow-lg">Listen Now</button>
              <button className="w-full text-left px-4 py-2 rounded-xl hover:bg-white/5 text-xs font-bold opacity-40 hover:opacity-100 transition-all">Browse</button>
              <button className="w-full text-left px-4 py-2 rounded-xl hover:bg-white/5 text-xs font-bold opacity-40 hover:opacity-100 transition-all">Radio</button>
            </div>
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest opacity-20 mb-4">Playlists</div>
            <div className="space-y-1">
              <button className="w-full text-left px-4 py-2 rounded-xl hover:bg-white/5 text-xs font-bold opacity-40 hover:opacity-100 transition-all">Hybrid Beats</button>
              <button className="w-full text-left px-4 py-2 rounded-xl hover:bg-white/5 text-xs font-bold opacity-40 hover:opacity-100 transition-all">Code & Chill</button>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-b ${track.color} opacity-20 blur-[120px] pointer-events-none`} />
        
        <div className="flex-1 flex items-center justify-center p-12 overflow-y-auto no-scrollbar">
          <div className="flex flex-col items-center gap-10 z-10 w-full max-w-lg">
            <div className={`w-80 h-80 rounded-[2.5rem] bg-gradient-to-br ${track.color} shadow-2xl flex items-center justify-center relative group overflow-hidden`}>
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-100 transition-transform"
                >
                    {isPlaying ? <Pause size={36} /> : <Play size={36} fill="black" className="ml-1" />}
                 </button>
              </div>
              <div className={`w-24 h-24 rounded-full border-[6px] border-white/20 ${isPlaying ? 'animate-ping' : ''}`} style={{ animationDuration: '3s' }} />
              <img src="https://www.transparenttextures.com/patterns/carbon-fibre.png" className="absolute inset-0 opacity-10 pointer-events-none" />
            </div>
            
            <div className="text-center space-y-3">
              <h1 className="text-4xl font-black tracking-tighter drop-shadow-lg">{track.title}</h1>
              <p className="text-lg font-black opacity-60 uppercase tracking-[0.2em]">{track.artist} — {track.album}</p>
            </div>
          </div>
        </div>

        {/* Player Bar */}
        <div className="h-28 glass-dark border-t border-white/10 px-8 flex items-center justify-between z-20">
          <div className="flex items-center gap-6 w-1/4">
             <div className={`w-14 h-14 rounded-xl shadow-lg bg-gradient-to-br ${track.color} border border-white/10`} />
             <div className="overflow-hidden">
                <p className="text-sm font-black truncate">{track.title}</p>
                <p className="text-[10px] opacity-40 uppercase font-black truncate tracking-widest">{track.artist}</p>
             </div>
             <Heart size={16} className="ml-2 opacity-40 hover:opacity-100 hover:text-rose-500 cursor-pointer transition-all" />
          </div>

          <div className="flex flex-col items-center gap-3 w-2/4 max-w-2xl px-12">
            <div className="flex items-center gap-8">
              <Shuffle size={18} className="opacity-30 hover:opacity-100 cursor-pointer transition-opacity" />
              <SkipBack size={24} className="hover:scale-110 transition-transform cursor-pointer" onClick={() => { setCurrentTrack(prev => (prev === 0 ? playlist.length - 1 : prev - 1)); setCurrentTime(0); }} />
              <button onClick={() => setIsPlaying(!isPlaying)} className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
                {isPlaying ? <Pause size={24} /> : <Play size={24} fill="black" className="ml-1" />}
              </button>
              <SkipForward size={24} className="hover:scale-110 transition-transform cursor-pointer" onClick={() => { setCurrentTrack(prev => (prev + 1) % playlist.length); setCurrentTime(0); }} />
              <Repeat size={18} className="opacity-30 hover:opacity-100 cursor-pointer transition-opacity" />
            </div>
            <div className="w-full flex items-center gap-4">
              <span className="text-[10px] font-black opacity-30 tabular-nums w-10 text-right">{formatTime(currentTime)}</span>
              <div 
                className="flex-1 h-1.5 bg-white/10 rounded-full relative cursor-pointer group"
                onClick={handleProgressClick}
              >
                 <div 
                  className="absolute inset-y-0 left-0 bg-white rounded-full transition-all group-hover:bg-blue-400" 
                  style={{ width: `${(currentTime / duration) * 100}%` }} 
                />
                 <div 
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-black opacity-30 tabular-nums w-10">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-6 w-1/4">
             <ListMusic size={20} className="opacity-40 hover:opacity-100 cursor-pointer transition-all" />
             <div className="flex items-center gap-3">
                <Volume2 size={18} className="opacity-40" />
                <div className="w-24 h-1.5 bg-white/10 rounded-full relative cursor-pointer overflow-hidden">
                   <div className="absolute inset-y-0 left-0 w-3/4 bg-white/40 rounded-full" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
