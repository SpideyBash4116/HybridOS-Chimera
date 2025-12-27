
import React, { useState, useEffect } from 'react';
import { Search, Sparkles, File, Globe, Command, ArrowRight } from 'lucide-react';
import { globalSearch } from '../services/geminiService';

interface SearchOverlayProps {
  onClose: () => void;
  onLaunch: (id: any) => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ onClose, onLaunch }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim()) {
        setLoading(true);
        const res = await globalSearch(query);
        setResults(res);
        setLoading(false);
      } else {
        setResults([]);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[11000] flex items-start justify-center pt-[20vh] animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="w-[600px] glass-dark border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-6 py-5 border-b border-white/10 gap-4">
          <Search className="text-blue-400" size={24} />
          <input 
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-xl font-medium placeholder:text-white/20"
            placeholder="Spotlight Search"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <div className="px-2 py-1 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest opacity-40">ESC</div>
        </div>

        {query.trim() === '' ? (
          <div className="p-12 text-center space-y-2 opacity-20">
             <Command size={48} className="mx-auto mb-4" />
             <p className="text-sm font-bold">Search for apps, files, or ask AI</p>
             <p className="text-[10px] uppercase tracking-widest">Hybrid Search Engine v2.0</p>
          </div>
        ) : (
          <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center p-8 gap-3 text-white/40">
                <Sparkles size={18} className="animate-pulse" />
                <span className="text-sm font-medium italic">Scanning core modules...</span>
              </div>
            ) : (
              <div className="space-y-2">
                {results.map((res, i) => (
                  <div 
                    key={i} 
                    className="group p-4 rounded-2xl hover:bg-blue-600 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20">
                          {res.type === 'app' ? <Command size={18} /> : res.type === 'web' ? <Globe size={18} /> : <File size={18} />}
                       </div>
                       <div>
                          <p className="text-sm font-bold">{res.title}</p>
                          <p className="text-[10px] opacity-60 font-medium group-hover:opacity-80">{res.description}</p>
                       </div>
                    </div>
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-40 transition-opacity" />
                  </div>
                ))}
                {results.length === 0 && (
                   <div className="p-8 text-center text-white/40 text-sm">No results found on this kernel</div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="bg-black/40 px-6 py-3 flex items-center justify-between border-t border-white/5">
           <div className="flex gap-4">
              <div className="flex items-center gap-1.5 opacity-40"><div className="px-1.5 py-0.5 bg-white/10 rounded text-[9px] font-black">↑↓</div> <span className="text-[9px] uppercase font-bold tracking-tighter">Navigate</span></div>
              <div className="flex items-center gap-1.5 opacity-40"><div className="px-1.5 py-0.5 bg-white/10 rounded text-[9px] font-black">↵</div> <span className="text-[9px] uppercase font-bold tracking-tighter">Open</span></div>
           </div>
           <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest">
              <Sparkles size={12} />
              AI Powered
           </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
