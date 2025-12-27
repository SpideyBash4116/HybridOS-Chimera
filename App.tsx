
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Terminal as TerminalIcon, 
  Folder, 
  File,
  Globe, 
  Settings as SettingsIcon, 
  FileText, 
  Sparkles,
  Maximize2,
  Minus,
  X,
  Command,
  Wifi,
  Volume2,
  Battery,
  Search,
  LayoutGrid,
  Info,
  LogOut,
  RefreshCw,
  Power,
  Bluetooth,
  Moon,
  Gamepad2,
  Music,
  Activity,
  Calculator as CalcIcon,
  Lock,
  ArrowRight,
  ChevronRight,
  Bell,
  ShoppingBag,
  Layers,
  Youtube,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  MessageSquare,
  Music2
} from 'lucide-react';
import { AppID, WindowState, VFSNode, AccentColor } from './types';
import { APPS, INITIAL_VFS, APP_MENUS } from './constants';
import Terminal from './components/Terminal';
import FileManager from './components/FileManager';
import Browser from './components/Browser';
import NovaAI from './components/NovaAI';
import Notepad from './components/Notepad';
import Settings from './components/Settings';
import AtlasReign from './components/AtlasReign';
import MusicPlayer from './components/MusicPlayer';
import SystemMonitor from './components/SystemMonitor';
import Calculator from './components/Calculator';
import ControlCenter from './components/ControlCenter';
import WidgetsPanel from './components/WidgetsPanel';
import SearchOverlay from './components/SearchOverlay';
import MissionControl from './components/MissionControl';
import AppStore from './components/AppStore';
import SocialApp from './components/SocialApp';

const App: React.FC = () => {
  const [booting, setBooting] = useState(true);
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<AppID | null>(null);
  const [vfs, setVfs] = useState<Record<string, VFSNode>>(INITIAL_VFS);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // UI Overlays
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isWidgetsOpen, setIsWidgetsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMissionControlOpen, setIsMissionControlOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<{ id: number, text: string }[]>([]);

  // Notepad specific content (bridged from FileManager)
  const [tempFileContent, setTempFileContent] = useState<string | null>(null);

  // Appearance
  const [accentColor, setAccentColor] = useState<AccentColor>('blue');
  const [wallpaper, setWallpaper] = useState('https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&q=80&w=2070');
  const [settingsTab, setSettingsTab] = useState<'Accounts' | 'Personalization' | 'Network' | 'Notifications' | 'Privacy' | 'System'>('Personalization');

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 2500);
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Global Keyboard Shortcuts
    const handleKeys = (e: KeyboardEvent) => {
       if ((e.ctrlKey || e.metaKey) && e.code === 'Space') {
          e.preventDefault();
          setIsSearchOpen(prev => !prev);
       }
       if (e.ctrlKey && e.code === 'ArrowUp') {
          e.preventDefault();
          setIsMissionControlOpen(true);
       }
       if (e.code === 'Escape') {
          setIsSearchOpen(false);
          setIsStartMenuOpen(false);
          setIsControlCenterOpen(false);
          setIsMissionControlOpen(false);
          setActiveMenu(null);
       }
    };
    window.addEventListener('keydown', handleKeys);
    return () => { 
      clearTimeout(timer); 
      clearInterval(clock);
      window.removeEventListener('keydown', handleKeys);
    };
  }, []);

  const addNotification = (text: string) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, text }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const handleUnlock = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (password === 'admin' || password === '') {
      setIsLocked(false);
      setPassword('');
      addNotification("Welcome back, John. System ready.");
    } else {
      setAuthError(true);
      setTimeout(() => setAuthError(false), 500);
    }
  };

  const launchApp = useCallback((id: AppID, tab?: any, fileContent?: string) => {
    setIsStartMenuOpen(false);
    setIsSearchOpen(false);
    setIsMissionControlOpen(false);
    setActiveMenu(null);
    if (tab && id === 'settings') setSettingsTab(tab);
    if (fileContent && id === 'notepad') setTempFileContent(fileContent);
    
    const existing = windows.find(w => w.id === id);
    if (existing) {
      setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: false, zIndex: Math.max(...prev.map(win => win.zIndex), 0) + 1 } : w));
      setActiveWindowId(id);
      return;
    }

    const appInfo = APPS.find(a => a.id === id);
    const socialApps: AppID[] = ['youtube', 'tiktok', 'instagram', 'facebook', 'reddit', 'x', 'linkedin'];
    
    const newWindow: WindowState = {
      id,
      title: appInfo?.name || 'New Window',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: Math.max(...windows.map(w => w.zIndex), 0) + 1,
      x: 60 + (windows.length * 30),
      y: 60 + (windows.length * 30),
      width: id === 'calculator' ? 320 : id === 'tiktok' ? 400 : socialApps.includes(id) ? 1000 : 850,
      height: id === 'calculator' ? 480 : id === 'tiktok' ? 700 : 580,
    };
    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(id);
  }, [windows]);

  const closeWindow = (id: AppID) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) {
        const remaining = windows.filter(w => w.id !== id);
        setActiveWindowId(remaining.length > 0 ? remaining[remaining.length - 1].id : null);
    }
  };

  const minimizeWindow = (id: AppID) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    setActiveWindowId(null);
  };

  const toggleMaximize = (id: AppID) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
  };

  const focusWindow = (id: AppID) => {
    setWindows(prev => {
      const maxZ = Math.max(...prev.map(w => w.zIndex), 0);
      return prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w);
    });
    setActiveWindowId(id);
  };

  const activeApp = APPS.find(a => a.id === activeWindowId);
  const currentMenus = activeApp ? APP_MENUS[activeApp.id] : APP_MENUS['finder'];

  const accentClass = {
    blue: 'bg-blue-600 ring-blue-500 text-blue-400',
    purple: 'bg-purple-600 ring-purple-500 text-purple-400',
    rose: 'bg-rose-600 ring-rose-500 text-rose-400',
    emerald: 'bg-emerald-600 ring-emerald-500 text-emerald-400',
    amber: 'bg-amber-600 ring-amber-500 text-amber-400'
  }[accentColor];

  const socialApps: AppID[] = ['youtube', 'tiktok', 'instagram', 'facebook', 'reddit', 'x', 'linkedin'];

  if (booting) {
    return (
      <div className="h-screen w-screen bg-black flex flex-col items-center justify-center text-white font-mono">
        <div className="w-16 h-16 mb-8 relative">
            <Command className="w-full h-full text-blue-500 animate-pulse" />
        </div>
        <div className="flex flex-col items-start gap-1 text-[10px] opacity-40 uppercase tracking-widest">
            <div className="flex gap-4"><span>[ OK ]</span> <span>Initializing Chimera Kernel 6.5.0</span></div>
            <div className="flex gap-4"><span>[ OK ]</span> <span>Loading macOS Glass UI modules</span></div>
            <div className="flex gap-4"><span>[ OK ]</span> <span>Mapping Windows Taskbar services</span></div>
            <div className="flex gap-4"><span>[ OK ]</span> <span>Starting Gemini AI Nova core</span></div>
        </div>
        <div className="mt-12 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 animate-[loading_2s_ease-in-out_infinite]" style={{ width: '40%' }}></div>
        </div>
        <style>{`@keyframes loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(250%); } }`}</style>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div 
        className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-between p-12 text-white relative animate-in fade-in duration-700"
        style={{ backgroundImage: `url(${wallpaper})` }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[40px]" />
        
        <div className="z-10 w-full flex justify-end gap-4 opacity-80">
          <Wifi size={18} />
          <Volume2 size={18} />
          <Battery size={18} />
        </div>

        <div className="z-10 text-center space-y-2 mt-12 select-none">
          <h1 className="text-8xl font-thin tracking-tighter tabular-nums drop-shadow-2xl">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
          </h1>
          <p className="text-xl font-medium opacity-80 drop-shadow-lg">
            {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className={`z-10 flex flex-col items-center gap-6 mb-24 transition-transform duration-300 ${authError ? 'animate-[shake_0.4s_ease-in-out]' : ''}`}>
          <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black border-4 border-white/20 shadow-2xl overflow-hidden group ${accentClass.split(' ')[0]}`}>
            JD
          </div>
          <h2 className="text-xl font-bold tracking-tight">John Doe</h2>
          
          <form onSubmit={handleUnlock} className="relative group">
            <input 
              autoFocus
              type="password"
              placeholder="Enter Password"
              className="bg-white/10 border border-white/20 rounded-full py-2.5 px-6 pr-12 text-sm w-64 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/40"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <ArrowRight size={16} />
            </button>
          </form>
        </div>

        <div className="z-10 flex gap-12 text-xs font-bold uppercase tracking-widest opacity-60">
           <button className="flex flex-col items-center gap-2 hover:opacity-100 transition-opacity"><RefreshCw size={20}/><span>Restart</span></button>
           <button className="flex flex-col items-center gap-2 hover:opacity-100 transition-opacity"><Power size={20}/><span>Shut Down</span></button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="h-screen w-screen overflow-hidden bg-cover bg-center relative flex flex-col transition-all duration-700 animate-in fade-in zoom-in-95"
      style={{ backgroundImage: `url(${wallpaper})` }}
      onClick={() => {
          setIsStartMenuOpen(false);
          setActiveMenu(null);
          setIsControlCenterOpen(false);
          setIsWidgetsOpen(false);
      }}
    >
      {isSearchOpen && <SearchOverlay onClose={() => setIsSearchOpen(false)} onLaunch={launchApp} />}
      {isMissionControlOpen && <MissionControl windows={windows} onFocus={focusWindow} onClose={() => setIsMissionControlOpen(false)} />}
      {isControlCenterOpen && <ControlCenter onClose={() => setIsControlCenterOpen(false)} />}
      {isWidgetsOpen && <WidgetsPanel />}

      <div className="absolute top-12 right-6 w-80 flex flex-col gap-3 z-[11000] pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className="pointer-events-auto glass-dark border border-white/20 rounded-2xl p-4 shadow-xl animate-in slide-in-from-right-10 duration-500">
             <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accentClass.split(' ')[0]}`}>
                   <Sparkles size={16} />
                </div>
                <div className="flex-1">
                   <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">System Notification</h4>
                   <p className="text-xs font-medium">{n.text}</p>
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="h-8 glass-dark flex items-center justify-between px-2 text-[13px] font-medium z-[9999] border-b border-white/5">
        <div className="flex items-center">
          <div className="relative">
            <div 
                className={`px-3 h-8 flex items-center cursor-default rounded transition-colors ${activeMenu === 'system' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'system' ? null : 'system'); }}
            >
                <Command className="w-3.5 h-3.5 text-white" />
            </div>
            {activeMenu === 'system' && (
                <div className="absolute top-8 left-0 w-56 glass-dark border border-white/10 rounded-lg py-1 shadow-2xl animate-in fade-in zoom-in-95 duration-100">
                    <button className="w-full px-4 py-1 flex items-center justify-between hover:bg-blue-600 text-left" onClick={() => launchApp('settings', 'System')}>
                        <span>About This HybridOS</span>
                        <Info size={14} className="opacity-40" />
                    </button>
                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                    <button className="w-full px-4 py-1 hover:bg-blue-600 text-left" onClick={() => launchApp('settings', 'Personalization')}>System Settings...</button>
                    <button className="w-full px-4 py-1 hover:bg-blue-600 text-left" onClick={() => launchApp('store')}>App Store...</button>
                    <div className="h-[1px] bg-white/10 my-1 mx-1" />
                    <button className="w-full px-4 py-1 hover:bg-blue-600 text-left flex items-center justify-between" onClick={() => setIsLocked(true)}>
                        <span>Lock Screen</span>
                        <span className="text-[10px] opacity-40">⌃⌘L</span>
                    </button>
                    <button className="w-full px-4 py-1 hover:bg-blue-600 text-left flex items-center justify-between">
                        <span>Restart...</span>
                        <RefreshCw size={12} className="opacity-40" />
                    </button>
                    <button className="w-full px-4 py-1 hover:bg-blue-600 text-left flex items-center justify-between">
                        <span>Shut Down...</span>
                        <Power size={12} className="opacity-40" />
                    </button>
                </div>
            )}
          </div>

          <span className="px-3 h-8 flex items-center font-bold cursor-default hover:bg-white/10 rounded whitespace-nowrap">
            {activeApp ? activeApp.name : 'Finder'}
          </span>
          
          <div className="hidden lg:flex overflow-x-auto no-scrollbar">
            {currentMenus.map(menu => (
                <div key={menu} className="relative">
                    <div 
                        className={`px-3 h-8 flex items-center cursor-default rounded transition-colors ${activeMenu === menu ? 'bg-white/20' : 'hover:bg-white/10'} whitespace-nowrap`}
                        onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === menu ? null : menu); }}
                    >
                        {menu}
                    </div>
                </div>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <div className="relative">
              <div 
                className={`flex items-center gap-2.5 px-3 h-8 rounded transition-colors ${isControlCenterOpen ? 'bg-white/20' : 'hover:bg-white/10'} cursor-default`}
                onClick={(e) => { e.stopPropagation(); setIsControlCenterOpen(!isControlCenterOpen); }}
              >
                <Wifi className="w-3.5 h-3.5" />
                <Volume2 className="w-3.5 h-3.5" />
                <Battery className="w-3.5 h-3.5" />
              </div>
          </div>
          
          <div className="flex items-center gap-2 px-3 h-8 hover:bg-white/10 rounded cursor-default transition-colors">
            <span className="tabular-nums font-semibold text-[11px]">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative p-8 flex flex-col items-start gap-8" onClick={() => { setActiveMenu(null); setIsControlCenterOpen(false); }}>
        <div className="grid grid-cols-1 gap-6 w-24">
            <DesktopIcon icon={<Gamepad2 className="w-10 h-10 text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.4)]" />} label="Atlas Reign" onClick={() => launchApp('game')} />
            <DesktopIcon icon={<Folder className="w-10 h-10 text-yellow-400" />} label="Documents" onClick={() => launchApp('files')} />
            <DesktopIcon icon={<Music className="w-10 h-10 text-purple-400" />} label="Music" onClick={() => launchApp('music')} />
            <DesktopIcon icon={<TerminalIcon className="w-10 h-10 text-gray-300" />} label="Terminal" onClick={() => launchApp('terminal')} />
        </div>

        {windows.map(win => (
          <Window 
            key={win.id} 
            window={win} 
            active={activeWindowId === win.id}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onMaximize={() => toggleMaximize(win.id)}
            onFocus={() => focusWindow(win.id)}
            accentColor={accentColor}
          >
            {win.id === 'terminal' && <Terminal vfs={vfs} setVfs={setVfs} />}
            {win.id === 'files' && <FileManager vfs={vfs} onOpenFile={launchApp} />}
            {win.id === 'browser' && <Browser />}
            {win.id === 'ai' && <NovaAI />}
            {win.id === 'notepad' && <Notepad initialContent={tempFileContent} />}
            {win.id === 'settings' && <Settings setWallpaper={setWallpaper} activeTab={settingsTab} setActiveTab={setSettingsTab} accentColor={accentColor} setAccentColor={setAccentColor} />}
            {win.id === 'game' && <AtlasReign />}
            {win.id === 'music' && <MusicPlayer />}
            {win.id === 'monitor' && <SystemMonitor />}
            {win.id === 'calculator' && <Calculator />}
            {win.id === 'store' && <AppStore />}
            {socialApps.includes(win.id) && <SocialApp type={win.id} />}
          </Window>
        ))}
      </div>

      {isStartMenuOpen && (
        <div 
          className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[620px] h-[720px] glass-dark rounded-3xl shadow-2xl border border-white/20 overflow-hidden z-[10000] animate-in fade-in slide-in-from-bottom-8 duration-300"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-10 h-full flex flex-col">
            <div className="relative mb-8" onClick={() => setIsSearchOpen(true)}>
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                <input readOnly placeholder="Search apps and simulated social feeds" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-14 text-sm cursor-pointer outline-none transition-all" />
            </div>

            <div className="flex-1 grid grid-cols-12 gap-8 overflow-hidden">
                <div className="col-span-8 overflow-y-auto custom-scrollbar pr-4 space-y-10">
                    <AppSection title="Work & Productivity" color={accentClass.split(' ')[2]} apps={APPS.filter(a => a.category === 'productivity')} onLaunch={launchApp} />
                    <AppSection title="Social & Entertainment" color="text-purple-400" apps={APPS.filter(a => a.category === 'entertainment' || a.category === 'games')} onLaunch={launchApp} isGame={true} />
                    <AppSection title="System Tools" color="text-gray-400" apps={APPS.filter(a => a.category === 'system')} onLaunch={launchApp} />
                </div>
                <div className="col-span-4 space-y-8 bg-white/5 p-6 rounded-[2rem] border border-white/5">
                   <h4 className="text-[10px] font-black uppercase tracking-widest opacity-20">Recent Files</h4>
                   <div className="space-y-4">
                      <RecentItem label="welcome.txt" sub="Documents" />
                      <RecentItem label="Atlas Reign" sub="Games" />
                      <RecentItem label="Hybrid Beats" sub="Music" />
                   </div>
                </div>
            </div>

            <div className="mt-auto bg-white/5 -mx-10 -mb-10 p-8 flex items-center justify-between border-t border-white/5">
                <div className="flex items-center gap-4 px-3 py-2 hover:bg-white/5 rounded-2xl cursor-pointer transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black border border-white/20 shadow-lg ${accentClass.split(' ')[0]}`}>JD</div>
                    <div className="flex flex-col"><span className="text-sm font-bold">John Doe</span><span className="text-[10px] opacity-40 uppercase font-black tracking-widest">Admin</span></div>
                </div>
                <div className="flex gap-2">
                    <button className="p-3 hover:bg-white/10 rounded-xl transition-colors" onClick={() => launchApp('settings')}><SettingsIcon size={18} className="opacity-60" /></button>
                    <button className="p-3 hover:bg-white/10 rounded-xl transition-colors" onClick={() => setIsLocked(true)} title="Lock"><Lock size={18} className="opacity-60" /></button>
                    <button className="p-3 hover:bg-white/10 rounded-xl transition-colors"><Power size={18} className="opacity-60 text-red-400" /></button>
                </div>
            </div>
          </div>
        </div>
      )}

      <div className="h-14 glass-dark flex items-center justify-center px-4 z-[9999] border-t border-white/10 backdrop-blur-3xl">
        <div className="flex items-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); setIsWidgetsOpen(!isWidgetsOpen); }} className={`p-2.5 rounded-lg transition-all ${isWidgetsOpen ? 'bg-white/20' : 'hover:bg-white/10'}`}>
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </button>
          <div className="w-[1px] h-6 bg-white/10 mx-2" />
          <button onClick={(e) => { e.stopPropagation(); setIsStartMenuOpen(!isStartMenuOpen); }} className={`p-2.5 rounded-lg transition-all ${isStartMenuOpen ? 'bg-white/20 scale-90' : 'hover:bg-white/10 hover:scale-110'}`}>
            <LayoutGrid className={`w-6 h-6 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] ${accentClass.split(' ')[2]}`} />
          </button>
          
          <div className="flex items-center gap-1.5 ml-2">
            {APPS.filter(a => a.id === 'browser' || a.id === 'ai' || a.id === 'files' || socialApps.includes(a.id)).slice(0, 10).map(app => {
                const isRunning = windows.some(w => w.id === app.id);
                const isActive = activeWindowId === app.id;
                return (
                <button 
                    key={app.id}
                    onClick={() => launchApp(app.id)}
                    className={`relative p-2 rounded-lg transition-all group hover:bg-white/10 ${isActive ? 'bg-white/15' : ''} ${isRunning ? '' : 'opacity-40 hover:opacity-100'}`}
                >
                    <div className="w-8 h-8 flex items-center justify-center transition-transform group-active:scale-90 group-hover:-translate-y-1">
                      {app.id === 'browser' && <Globe className="w-6 h-6 text-blue-400" />}
                      {app.id === 'ai' && <Sparkles className="w-6 h-6 text-purple-400" />}
                      {app.id === 'files' && <Folder className="w-6 h-6 text-yellow-400" />}
                      {app.id === 'youtube' && <Youtube className="w-6 h-6 text-red-600" />}
                      {app.id === 'tiktok' && <Music2 className="w-6 h-6 text-cyan-400" />}
                      {app.id === 'instagram' && <Instagram className="w-6 h-6 text-pink-500" />}
                      {app.id === 'facebook' && <Facebook className="w-6 h-6 text-blue-600" />}
                      {app.id === 'x' && <Twitter className="w-6 h-6 text-white" />}
                      {app.id === 'linkedin' && <Linkedin className="w-6 h-6 text-blue-500" />}
                      {app.id === 'reddit' && <MessageSquare className="w-6 h-6 text-orange-500" />}
                    </div>
                    {isRunning && <div className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-1 rounded-full transition-all shadow-[0_0_8px_rgba(96,165,250,0.8)] ${accentClass.split(' ')[0]} ${isActive ? 'w-4' : 'w-1'}`} />}
                </button>
                )
            })}
          </div>
          <div className="w-[1px] h-6 bg-white/10 mx-2 ml-2" />
          <button onClick={(e) => { e.stopPropagation(); setIsMissionControlOpen(true); }} className="p-2.5 rounded-lg transition-all hover:bg-white/10"><Layers className="w-5 h-5 opacity-60" /></button>
          <button onClick={(e) => { e.stopPropagation(); setIsSearchOpen(true); }} className="p-2.5 rounded-lg transition-all hover:bg-white/10"><Search className="w-5 h-5 opacity-60" /></button>
        </div>
      </div>
    </div>
  );
};

// Fixed: Correctly using File icon from lucide-react to avoid collision with browser File type
const RecentItem = ({ label, sub }: { label: string, sub: string }) => (
  <div className="flex items-center gap-3 group cursor-pointer">
     <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
        <File size={14} className="opacity-40" />
     </div>
     <div>
        <p className="text-[11px] font-bold group-hover:text-blue-400 transition-colors">{label}</p>
        <p className="text-[9px] opacity-40 uppercase font-black">{sub}</p>
     </div>
  </div>
);

const AppSection: React.FC<{ title: string, color: string, apps: any[], onLaunch: (id: AppID) => void, isGame?: boolean }> = ({ title, color, apps, onLaunch, isGame }) => (
    <div>
        <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-6 px-2 ${color}`}>{title}</h3>
        <div className="grid grid-cols-5 gap-4">
            {apps.map(app => (
                <AppIcon key={app.id} app={app} onClick={() => onLaunch(app.id)} isGame={isGame} />
            ))}
        </div>
    </div>
);

const AppIcon: React.FC<{ app: any, onClick: () => void, isGame?: boolean }> = ({ app, onClick, isGame }) => (
    <button onClick={onClick} className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-white/10 transition-all hover:-translate-y-1 active:scale-95 group">
        <div className={`w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center shadow-lg transition-all ${isGame ? 'group-hover:shadow-red-500/20' : 'group-hover:shadow-blue-500/20'}`}>
            {app.id === 'terminal' && <TerminalIcon className="w-8 h-8 text-gray-300" />}
            {app.id === 'files' && <Folder className="w-8 h-8 text-yellow-400" />}
            {app.id === 'browser' && <Globe className="w-8 h-8 text-blue-400" />}
            {app.id === 'ai' && <Sparkles className="w-8 h-8 text-purple-400" />}
            {app.id === 'notepad' && <FileText className="w-8 h-8 text-green-400" />}
            {app.id === 'settings' && <SettingsIcon className="w-8 h-8 text-gray-400" />}
            {app.id === 'game' && <Gamepad2 className="w-8 h-8 text-red-400" />}
            {app.id === 'music' && <Music className="w-8 h-8 text-purple-400" />}
            {app.id === 'monitor' && <Activity className="w-8 h-8 text-blue-400" />}
            {app.id === 'calculator' && <CalcIcon className="w-8 h-8 text-orange-400" />}
            {app.id === 'store' && <ShoppingBag className="w-8 h-8 text-pink-400" />}
            {app.id === 'youtube' && <Youtube className="w-8 h-8 text-red-600" />}
            {app.id === 'tiktok' && <Music2 className="w-8 h-8 text-cyan-400" />}
            {app.id === 'instagram' && <Instagram className="w-8 h-8 text-pink-500" />}
            {app.id === 'facebook' && <Facebook className="w-8 h-8 text-blue-600" />}
            {app.id === 'x' && <Twitter className="w-8 h-8 text-white" />}
            {app.id === 'linkedin' && <Linkedin className="w-8 h-8 text-blue-500" />}
            {app.id === 'reddit' && <MessageSquare className="w-8 h-8 text-orange-500" />}
        </div>
        <span className="text-[11px] font-bold opacity-60 group-hover:opacity-100 transition-opacity tracking-tight truncate w-full">{app.name}</span>
    </button>
);

const DesktopIcon: React.FC<{ icon: React.ReactNode, label: string, onClick: () => void }> = ({ icon, label, onClick }) => (
    <div className="flex flex-col items-center gap-2 w-24 p-2 rounded-xl hover:bg-white/10 group cursor-default transition-all select-none" onDoubleClick={onClick}>
        <div className="group-active:scale-90 transition-transform">{icon}</div>
        <span className="text-[11px] font-bold text-white drop-shadow-md text-center group-hover:drop-shadow-none transition-all">{label}</span>
    </div>
);

interface WindowProps {
  window: WindowState;
  active: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  children: React.ReactNode;
  accentColor: AccentColor;
}

const Window: React.FC<WindowProps> = ({ window, active, onClose, onMinimize, onMaximize, onFocus, children, accentColor }) => {
  const [pos, setPos] = useState({ x: window.x, y: window.y });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    onFocus();
    if (window.isMaximized) return;
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPos({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
    };
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (window.isMinimized) return null;

  const style: React.CSSProperties = window.isMaximized 
    ? { top: '2rem', left: 0, right: 0, bottom: '3.5rem', width: '100%', height: 'calc(100% - 5.5rem)', zIndex: window.zIndex }
    : { top: pos.y, left: pos.x, width: window.width, height: window.height, zIndex: window.zIndex };

  const ringClass = { blue: 'ring-blue-500/30', purple: 'ring-purple-500/30', rose: 'ring-rose-500/30', emerald: 'ring-emerald-500/30', amber: 'ring-amber-500/30' }[accentColor];

  return (
    <div className={`absolute flex flex-col glass-dark rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ${active ? `ring-2 ${ringClass} shadow-white/5 scale-[1.002]` : 'opacity-90 shadow-black/40 scale-100'}`} style={style} onMouseDown={onFocus}>
      <div className="h-11 bg-black/40 flex items-center justify-between px-4 cursor-default border-b border-white/10" onMouseDown={handleMouseDown}>
        <div className="flex items-center gap-2 w-24">
          <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors flex items-center justify-center group"><X className="w-2 h-2 text-red-900 opacity-0 group-hover:opacity-100" /></button>
          <button onClick={onMinimize} className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors flex items-center justify-center group"><Minus className="w-2 h-2 text-yellow-900 opacity-0 group-hover:opacity-100" /></button>
          <button onClick={onMaximize} className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors flex items-center justify-center group"><Maximize2 className="w-2 h-2 text-green-900 opacity-0 group-hover:opacity-100" /></button>
        </div>
        <div className="flex-1 text-center"><span className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em] truncate px-2">{window.title}</span></div>
        <div className="w-24"></div>
      </div>
      <div className="flex-1 relative overflow-hidden bg-black/30">{children}</div>
    </div>
  );
};

export default App;
