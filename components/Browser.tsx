
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Home, Search, Shield, Globe, Lock, Loader2, Sparkles, ExternalLink } from 'lucide-react';
import { simulateWebpage } from '../services/geminiService';

const Browser: React.FC = () => {
  const [url, setUrl] = useState('https://chimera.os/welcome');
  const [inputUrl, setInputUrl] = useState('https://chimera.os/welcome');
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'welcome' | 'iframe' | 'nova-view'>('welcome');
  const [novaContent, setNovaContent] = useState<any>(null);

  const navigate = async (target: string) => {
    setIsLoading(true);
    let targetUrl = target.trim();
    
    // Auto-protocol
    if (!targetUrl.startsWith('http') && !targetUrl.includes('.os/')) {
      if (targetUrl.includes('.') && !targetUrl.includes(' ')) {
        targetUrl = `https://${targetUrl}`;
      } else {
        // Search mode
        await handleSearch(targetUrl);
        return;
      }
    }

    setInputUrl(targetUrl);
    
    // Determine if we can iframe it or use Nova-View
    // Most sites block iframes, so for a "real" feel we use AI simulation for common sites
    const blockedSites = ['google.com', 'youtube.com', 'facebook.com', 'twitter.com', 'github.com', 'reddit.com'];
    const isBlocked = blockedSites.some(site => targetUrl.toLowerCase().includes(site));

    if (targetUrl.includes('chimera.os/welcome')) {
      setViewMode('welcome');
    } else if (isBlocked) {
      await handleSearch(targetUrl);
    } else {
      setViewMode('iframe');
      setUrl(targetUrl);
    }
    setIsLoading(false);
  };

  const handleSearch = async (query: string) => {
    setViewMode('nova-view');
    const result = await simulateWebpage(query);
    setNovaContent(result);
    setIsLoading(false);
  };

  const handleGo = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(inputUrl);
  };

  return (
    <div className="flex flex-col h-full bg-white text-black overflow-hidden font-sans">
      {/* Browser Toolbar */}
      <div className="h-12 border-b border-gray-200 flex items-center px-4 gap-4 bg-gray-50/90 backdrop-blur-md shrink-0">
        <div className="flex gap-3 text-gray-500">
          <ArrowLeft size={16} className="cursor-pointer hover:text-black transition-colors" onClick={() => navigate('https://chimera.os/welcome')} />
          <ArrowRight size={16} className="cursor-pointer opacity-30" />
          <RotateCw size={16} className={`cursor-pointer hover:text-black transition-all ${isLoading ? 'animate-spin' : ''}`} onClick={() => navigate(url)} />
        </div>
        
        <form className="flex-1" onSubmit={handleGo}>
          <div className="relative flex items-center group">
            <div className="absolute left-3 flex items-center gap-2">
                {viewMode === 'nova-view' ? <Sparkles size={12} className="text-purple-600" /> : <Lock size={12} className="text-green-600" />}
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                    {viewMode === 'nova-view' ? 'AI-RENDER' : 'SECURE'}
                </span>
            </div>
            <input 
              className="w-full bg-gray-200/60 rounded-lg py-1.5 px-24 text-xs focus:bg-white focus:ring-2 focus:ring-blue-500/30 outline-none border border-transparent transition-all font-medium"
              value={inputUrl}
              onChange={e => setInputUrl(e.target.value)}
              placeholder="Search or enter website address"
            />
            {isLoading && <Loader2 size={14} className="absolute right-3 animate-spin text-blue-500" />}
          </div>
        </form>

        <div className="flex gap-4 text-gray-500">
             <Home size={16} className="cursor-pointer hover:text-black transition-colors" onClick={() => navigate('https://chimera.os/welcome')} />
             <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold shadow-md shadow-blue-500/20">JD</div>
        </div>
      </div>

      {/* Progress Bar */}
      {isLoading && (
        <div className="h-[2px] w-full bg-gray-100 overflow-hidden shrink-0">
          <div className="h-full bg-blue-500 animate-[loading_1.5s_infinite]" />
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 relative overflow-hidden bg-gray-100">
        {viewMode === 'welcome' && (
          <div className="h-full overflow-auto p-12 custom-scrollbar">
            <div className="max-w-4xl mx-auto space-y-12">
               <div className="bg-white rounded-3xl shadow-xl border border-gray-200/50 p-16 text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] mx-auto flex items-center justify-center text-white mb-8 shadow-2xl rotate-3">
                        <Globe size={48} />
                    </div>
                    <h1 className="text-5xl font-black mb-4 tracking-tight text-gray-900">EdgeSafari</h1>
                    <p className="text-gray-500 mb-12 text-xl max-w-lg mx-auto">The world's first AI-Hybrid browser. Type any URL or question to begin.</p>
                    
                    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                        <button onClick={() => navigate('wikipedia.org')} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all text-sm font-bold border border-gray-200/50">
                            <span>Wikipedia</span>
                            <ExternalLink size={14} className="opacity-40" />
                        </button>
                        <button onClick={() => navigate('google.com')} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all text-sm font-bold border border-gray-200/50">
                            <span>Search Google</span>
                            <Search size={14} className="opacity-40" />
                        </button>
                    </div>
               </div>
            </div>
          </div>
        )}

        {viewMode === 'iframe' && (
          <iframe 
            src={url} 
            className="w-full h-full border-none bg-white" 
            title="Browser Content"
            onLoad={() => setIsLoading(false)}
          />
        )}

        {viewMode === 'nova-view' && novaContent && (
          <div className="h-full overflow-auto bg-white animate-in fade-in duration-500">
            <div className="h-64 w-full relative overflow-hidden flex items-center justify-center" style={{ backgroundColor: novaContent.accentColor || '#3b82f6' }}>
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <div className="relative text-center text-white px-6">
                    <h1 className="text-4xl font-black mb-2 drop-shadow-lg">{novaContent.title}</h1>
                    <p className="opacity-90 font-medium max-w-xl mx-auto">{novaContent.description}</p>
                </div>
            </div>
            <div className="max-w-4xl mx-auto py-12 px-8 flex gap-12">
                <div className="flex-1 prose prose-sm max-w-none">
                    <div className="text-gray-800 space-y-6">
                        {novaContent.content.split('\n').map((line: string, i: number) => (
                            <p key={i} className={line.startsWith('#') ? 'text-2xl font-bold text-gray-900 mt-8' : ''}>
                                {line.replace(/^#+\s/, '')}
                            </p>
                        ))}
                    </div>
                </div>
                <div className="w-64 shrink-0 space-y-8">
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">On this page</h4>
                        <div className="space-y-3">
                            {novaContent.sidebar?.map((link: string, i: number) => (
                                <div key={i} className="text-xs font-bold text-blue-600 hover:underline cursor-pointer flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    {link}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100">
                        <div className="flex items-center gap-2 mb-2 text-purple-600">
                            <Sparkles size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Nova Insights</span>
                        </div>
                        <p className="text-[10px] text-purple-800 leading-relaxed opacity-80 font-medium">
                            This page was reconstructed by Chimera's AI engine to bypass frame-blocking security protocols.
                        </p>
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Browser;
