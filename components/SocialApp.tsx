
import React, { useState, useEffect } from 'react';
import { 
  Youtube, 
  Instagram, 
  Facebook, 
  Twitter, 
  MessageSquare, 
  Linkedin, 
  Video, 
  Play, 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  Search, 
  Home, 
  User, 
  Briefcase,
  Bell,
  PlusSquare,
  Flame,
  Music2,
  Bookmark,
  Globe,
  TrendingUp
} from 'lucide-react';
import { AppID } from '../types';
import { askGemini } from '../services/geminiService';

interface SocialAppProps {
  type: AppID;
}

const SocialApp: React.FC<SocialAppProps> = ({ type }) => {
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const prompt = `Generate 5 simulated ${type} posts/videos. Return a JSON array of objects with keys: { "id": "string", "author": "string", "authorHandle": "string", "text": "string", "stats": { "likes": "string", "comments": "string" }, "timestamp": "string" }`;
      try {
        const res = await askGemini(prompt, `Social Media Simulator for ${type}`);
        const cleanJson = res.replace(/```json|```/g, '');
        setContent(JSON.parse(cleanJson));
      } catch (e) {
        setContent([]);
      }
      setLoading(false);
    };
    fetchContent();
  }, [type]);

  const renderHeader = () => {
    const icons: Record<string, any> = {
      youtube: { icon: <Youtube className="text-red-600" />, label: 'YouTube', color: 'bg-black' },
      tiktok: { icon: <Music2 className="text-cyan-400" />, label: 'TikTok', color: 'bg-black' },
      instagram: { icon: <Instagram className="text-pink-500" />, label: 'Instagram', color: 'bg-[#121212]' },
      facebook: { icon: <Facebook className="text-blue-600" />, label: 'Facebook', color: 'bg-[#1877F2]/10' },
      reddit: { icon: <MessageSquare className="text-orange-500" />, label: 'Reddit', color: 'bg-[#1a1a1b]' },
      x: { icon: <Twitter className="text-white" />, label: 'X', color: 'bg-black' },
      linkedin: { icon: <Linkedin className="text-blue-500" />, label: 'LinkedIn', color: 'bg-white' },
    };

    const config = icons[type] || { icon: <Globe />, label: 'Social', color: 'bg-white' };

    return (
      <div className={`h-14 flex items-center justify-between px-6 border-b border-white/10 sticky top-0 z-10 backdrop-blur-xl ${config.color === 'bg-white' ? 'text-black border-gray-200' : 'text-white'}`}>
        <div className="flex items-center gap-3">
          {config.icon}
          <span className="font-black tracking-tighter text-lg">{config.label}</span>
        </div>
        <div className="flex-1 max-w-md mx-8 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" />
          <input 
            className={`w-full text-xs py-2 px-10 rounded-full border focus:outline-none transition-all ${config.color === 'bg-white' ? 'bg-gray-100 border-gray-200 focus:bg-white' : 'bg-white/5 border-white/10 focus:bg-white/10'}`} 
            placeholder={`Search ${config.label}`}
          />
        </div>
        <div className="flex items-center gap-6 opacity-60">
           <Bell size={18} />
           <User size={18} />
        </div>
      </div>
    );
  };

  const renderFeed = () => {
    if (loading) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-20 gap-4 opacity-40">
           <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
           <p className="text-xs font-black uppercase tracking-widest">Streaming from Hybrid Core...</p>
        </div>
      );
    }

    if (type === 'youtube') {
      return (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#0f0f0f] h-full overflow-y-auto">
          <div className="lg:col-span-8 space-y-4">
            <div className="aspect-video bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
               <Play size={64} fill="white" className="z-10 text-white drop-shadow-2xl group-hover:scale-110 transition-transform" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Exploring the HybridOS Chimera Kernel</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">C</div>
                   <div><p className="font-bold text-sm">ChimeraDev</p><p className="text-[10px] opacity-40">1.2M subscribers</p></div>
                   <button className="ml-4 px-4 py-2 bg-white text-black text-xs font-bold rounded-full">Subscribe</button>
                </div>
                <div className="flex gap-2">
                   <button className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-xs font-bold"><Heart size={14} /> 42K</button>
                   <button className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-xs font-bold"><Share2 size={14} /> Share</button>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-4 space-y-4">
            {content.map((post) => (
              <div key={post.id} className="flex gap-3 group cursor-pointer">
                 <div className="w-40 aspect-video bg-white/5 rounded-lg shrink-0 overflow-hidden relative border border-white/5">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                 </div>
                 <div className="flex-1">
                    <p className="text-xs font-bold line-clamp-2">{post.text}</p>
                    <p className="text-[10px] opacity-40 mt-1">{post.author}</p>
                    <p className="text-[10px] opacity-40">{post.stats.likes} views • {post.timestamp}</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (type === 'tiktok') {
      return (
        <div className="h-full bg-black flex justify-center overflow-hidden">
          <div className="h-full aspect-[9/16] bg-[#121212] relative flex flex-col items-center justify-center group">
             <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
             <Play size={48} className="text-white opacity-40 group-hover:opacity-100 transition-opacity" />
             
             <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6 text-white z-10">
                <div className="flex flex-col items-center gap-1">
                   <div className="w-12 h-12 rounded-full border-2 border-white bg-blue-500 overflow-hidden" />
                   <PlusSquare size={16} className="text-rose-500 -mt-2 bg-white rounded-full" />
                </div>
                <div className="flex flex-col items-center gap-1">
                   <Heart size={32} fill="white" className="text-white" />
                   <span className="text-xs font-bold">1.2M</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                   <MessageCircle size={32} fill="white" />
                   <span className="text-xs font-bold">4.2K</span>
                </div>
                <Bookmark size={32} fill="white" />
                <Share2 size={32} fill="white" />
             </div>

             <div className="absolute left-4 bottom-8 right-16 text-white z-10 space-y-2">
                <p className="font-bold">@chimera_os</p>
                <p className="text-sm line-clamp-2">Finally got the macOS menu working on top of the Windows taskbar! #hybrid #coding #chimera</p>
                <div className="flex items-center gap-2">
                   <Music2 size={14} />
                   <p className="text-xs marquee">Original Sound - HybridOS Beats</p>
                </div>
             </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`p-8 h-full overflow-y-auto ${type === 'linkedin' ? 'bg-[#f4f2ee]' : type === 'reddit' ? 'bg-[#030303]' : 'bg-[#121212]'}`}>
        <div className="max-w-xl mx-auto space-y-4 pb-20">
          {content.map((post) => (
            <div 
              key={post.id} 
              className={`rounded-2xl border transition-all ${
                type === 'linkedin' 
                ? 'bg-white border-gray-200 text-black p-5' 
                : type === 'reddit' 
                ? 'bg-[#1a1a1b] border-[#343536] text-white p-4 hover:border-white/20' 
                : 'bg-white/5 border-white/10 text-white p-5'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black ${type === 'linkedin' ? 'bg-blue-600 text-white' : 'bg-gradient-to-br from-purple-500 to-pink-500'}`}>
                      {post.author[0]}
                   </div>
                   <div>
                      <p className="text-sm font-bold">{post.author}</p>
                      <p className={`text-[10px] opacity-40 ${type === 'linkedin' ? 'text-gray-500' : ''}`}>{post.authorHandle} • {post.timestamp}</p>
                   </div>
                </div>
                <MoreHorizontal size={18} className="opacity-40" />
              </div>
              
              <div className="space-y-4">
                 <p className={`text-sm leading-relaxed ${type === 'linkedin' ? 'text-gray-800' : 'text-gray-200'}`}>{post.text}</p>
                 {Math.random() > 0.4 && (
                   <div className="aspect-video bg-white/5 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center opacity-40">
                      <Image size={48} />
                   </div>
                 )}
              </div>

              <div className={`mt-6 pt-4 border-t flex items-center justify-between ${type === 'linkedin' ? 'border-gray-100 text-gray-500' : 'border-white/5 text-white/40'}`}>
                 <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 hover:opacity-100 transition-opacity">
                       <Heart size={18} className={type === 'instagram' ? 'hover:text-rose-500' : ''} />
                       <span className="text-xs font-bold">{post.stats.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:opacity-100 transition-opacity">
                       <MessageCircle size={18} />
                       <span className="text-xs font-bold">{post.stats.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:opacity-100 transition-opacity">
                       <Share2 size={18} />
                    </button>
                 </div>
                 {type === 'reddit' && (
                    <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-lg">
                       <TrendingUp size={12} className="text-orange-500" />
                       <span className="text-[10px] font-bold text-orange-500">Trending</span>
                    </div>
                 )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col font-sans select-text overflow-hidden">
      {renderHeader()}
      <div className="flex-1 relative overflow-hidden">
         {renderFeed()}
      </div>
      
      {/* Platform Navigation */}
      <div className={`h-14 border-t px-8 flex items-center justify-around shrink-0 z-10 backdrop-blur-md ${type === 'linkedin' ? 'bg-white border-gray-200 text-gray-500' : 'bg-black/80 border-white/10 text-white/60'}`}>
         <button className="flex flex-col items-center gap-1 text-blue-500"><Home size={20}/><span className="text-[9px] font-bold uppercase tracking-widest">Home</span></button>
         <button className="flex flex-col items-center gap-1 hover:text-white"><Search size={20}/><span className="text-[9px] font-bold uppercase tracking-widest">Explore</span></button>
         <button className="flex flex-col items-center gap-1 hover:text-white"><Video size={20}/><span className="text-[9px] font-bold uppercase tracking-widest">Media</span></button>
         {type === 'linkedin' && <button className="flex flex-col items-center gap-1 hover:text-blue-500"><Briefcase size={20}/><span className="text-[9px] font-bold uppercase tracking-widest">Jobs</span></button>}
         <button className="flex flex-col items-center gap-1 hover:text-white"><User size={20}/><span className="text-[9px] font-bold uppercase tracking-widest">Profile</span></button>
      </div>

      <style>{`
        .marquee {
          white-space: nowrap;
          animation: marquee 10s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

const Image = ({ size }: { size: number }) => (
   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
     <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
   </svg>
);

export default SocialApp;
