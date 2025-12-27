
import React, { useState } from 'react';
import { 
  Palette, 
  Shield, 
  User, 
  Bell, 
  Network, 
  Laptop, 
  Wifi, 
  Bluetooth, 
   smartphone, 
  Lock, 
  Database, 
  Cpu, 
  HardDrive,
  CheckCircle2,
  RefreshCw,
  Camera,
  Mic,
  Monitor,
  Volume2,
  Moon,
  Code,
  Zap,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Plus,
  Edit2,
  Trash2,
  X,
  ChevronLeft
} from 'lucide-react';
import { AccentColor, UserAccount } from '../types';

interface SettingsProps {
  setWallpaper: (url: string) => void;
  activeTab: 'Accounts' | 'Personalization' | 'Network' | 'Notifications' | 'Privacy' | 'System';
  setActiveTab: (tab: any) => void;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  users: UserAccount[];
  setUsers: React.Dispatch<React.SetStateAction<UserAccount[]>>;
  currentUser: UserAccount;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserAccount>>;
}

const WALLPAPERS = [
  'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&q=80&w=2070',
  'https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80&w=2070',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2070',
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=2070',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2070',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=2070'
];

const ACCENTS: { id: AccentColor, color: string }[] = [
  { id: 'blue', color: 'bg-blue-500' },
  { id: 'purple', color: 'bg-purple-500' },
  { id: 'rose', color: 'bg-rose-500' },
  { id: 'emerald', color: 'bg-emerald-500' },
  { id: 'amber', color: 'bg-amber-500' }
];

const AVATAR_COLORS = [
  'bg-blue-600', 'bg-purple-600', 'bg-rose-600', 'bg-emerald-600', 'bg-amber-600', 'bg-slate-700', 'bg-indigo-600'
];

const Settings: React.FC<SettingsProps> = ({ 
  setWallpaper, 
  activeTab, 
  setActiveTab, 
  accentColor, 
  setAccentColor,
  users,
  setUsers,
  currentUser,
  setCurrentUser
}) => {
  const [updateState, setUpdateState] = useState<'idle' | 'checking' | 'available' | 'installing' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);

  // User Management State
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', avatarColor: 'bg-blue-600', initials: '' });

  const handleEditUser = (user: UserAccount) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, avatarColor: user.avatarColor, initials: user.initials });
  };

  const handleAddUser = () => {
    setIsAddingUser(true);
    setFormData({ name: '', email: '', avatarColor: 'bg-indigo-600', initials: '' });
  };

  const saveUser = () => {
    if (editingUser) {
      const updatedUsers = users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u);
      setUsers(updatedUsers);
      if (currentUser.id === editingUser.id) {
        setCurrentUser({ ...currentUser, ...formData });
      }
      setEditingUser(null);
    } else if (isAddingUser) {
      const newUser: UserAccount = {
        id: `u${Date.now()}`,
        ...formData,
        isAdmin: false
      };
      setUsers([...users, newUser]);
      setIsAddingUser(false);
    }
  };

  const deleteUser = (id: string) => {
    if (id === currentUser.id) return; // Cannot delete self
    setUsers(users.filter(u => u.id !== id));
  };

  const checkUpdates = () => {
    setUpdateState('checking');
    setTimeout(() => {
      setUpdateState('available');
    }, 2500);
  };

  const startInstall = () => {
    setUpdateState('installing');
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 8;
      if (p >= 100) {
        setProgress(100);
        setUpdateState('completed');
        clearInterval(interval);
      } else {
        setProgress(p);
      }
    }, 200);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Accounts':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 pb-20">
            {/* User Editor Overlay */}
            {(editingUser || isAddingUser) ? (
              <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-4 mb-8">
                  <button onClick={() => { setEditingUser(null); setIsAddingUser(false); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ChevronLeft size={24} />
                  </button>
                  <h3 className="text-2xl font-black text-gray-900">{editingUser ? 'Edit Profile' : 'Add New Account'}</h3>
                </div>

                <div className="space-y-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl font-black text-white shadow-xl ${formData.avatarColor}`}>
                      {formData.initials || '?'}
                    </div>
                    <div className="flex gap-2">
                      {AVATAR_COLORS.map(color => (
                        <button 
                          key={color}
                          onClick={() => setFormData(prev => ({ ...prev, avatarColor: color }))}
                          className={`w-8 h-8 rounded-full ${color} border-2 ${formData.avatarColor === color ? 'border-blue-500 scale-110' : 'border-transparent opacity-60'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Full Name</label>
                      <input 
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        value={formData.name}
                        onChange={e => {
                          const val = e.target.value;
                          const initials = val.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                          setFormData(prev => ({ ...prev, name: val, initials }));
                        }}
                        placeholder="e.g. Jane Smith"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Hybrid Email</label>
                      <input 
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        value={formData.email}
                        onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="jane@chimera.os"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button onClick={saveUser} className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
                      Save Account
                    </button>
                    <button onClick={() => { setEditingUser(null); setIsAddingUser(false); }} className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-6 p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black text-white shadow-xl transition-all hover:scale-105 cursor-pointer ${currentUser.avatarColor}`}>
                    {currentUser.initials}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">{currentUser.name}</h3>
                    <p className="text-sm text-gray-400 font-medium">{currentUser.isAdmin ? 'System Administrator' : 'Standard User'} • {currentUser.email}</p>
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => handleEditUser(currentUser)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold transition-all flex items-center gap-2">
                        <Edit2 size={12} /> Edit Profile
                      </button>
                      <button className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-xs font-bold transition-all">
                        Security Settings
                      </button>
                    </div>
                  </div>
                </div>
                
                <section className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Other Accounts</h4>
                    <button onClick={handleAddUser} className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
                      <Plus size={12} /> Add User
                    </button>
                  </div>
                  <div className="grid gap-3">
                    {users.filter(u => u.id !== currentUser.id).map(user => (
                      <div key={user.id} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-50 shadow-sm group hover:border-blue-500/20 transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black text-white ${user.avatarColor}`}>
                            {user.initials}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{user.name}</p>
                            <p className="text-[10px] text-gray-400 font-medium">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => handleEditUser(user)} className="p-2 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                              <Edit2 size={14} />
                           </button>
                           <button onClick={() => deleteUser(user.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                              <Trash2 size={14} />
                           </button>
                        </div>
                      </div>
                    ))}
                    {users.length === 1 && (
                      <div className="p-10 text-center border-2 border-dashed border-gray-100 rounded-3xl opacity-40">
                         <p className="text-xs font-bold">No secondary accounts on this kernel.</p>
                      </div>
                    )}
                  </div>
                </section>
              </>
            )}
          </div>
        );

      case 'Personalization':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-300">
            <section className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Global Accent</h4>
              <div className="flex gap-6 p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                {ACCENTS.map(acc => (
                  <button 
                    key={acc.id}
                    onClick={() => setAccentColor(acc.id)}
                    className={`w-12 h-12 rounded-full ${acc.color} transition-all relative ${accentColor === acc.id ? 'scale-110 ring-4 ring-offset-4 ring-blue-500/20' : 'hover:scale-105 opacity-60'}`}
                  >
                    {accentColor === acc.id && <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-black">✓</div>}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Dynamic Wallpapers</h4>
              <div className="grid grid-cols-3 gap-6">
                {WALLPAPERS.map((wp, i) => (
                  <button 
                    key={i} 
                    onClick={() => setWallpaper(wp)}
                    className="aspect-video rounded-2xl overflow-hidden border-4 border-transparent hover:border-blue-500 transition-all shadow-lg group relative"
                  >
                    <img src={wp} alt="wallpaper" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </section>
          </div>
        );

      case 'System':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300 pb-20">
             <div className="p-10 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-gray-800 to-black text-white flex items-center justify-center mb-6 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Zap size={48} className="text-blue-400 drop-shadow-lg z-10" />
                </div>
                <h3 className="text-3xl font-black tracking-tight text-gray-900">Chimera HybridOS</h3>
                <p className="text-sm text-gray-400 font-bold mt-1">v6.5.0-LTS • Build 2025-A</p>
                <div className="mt-10 flex gap-4">
                   <div className="px-5 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Hybrid Architecture</div>
                   <div className="px-5 py-2 bg-purple-50 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest">AI Core Active</div>
                </div>
             </div>

             <section className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Software Update</h4>
                <div className="p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                   {updateState === 'idle' && (
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="font-bold text-gray-900">Your system is up to date.</p>
                           <p className="text-xs text-gray-400 mt-1">Last checked: Today at 10:42 AM</p>
                        </div>
                        <button onClick={checkUpdates} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-black uppercase tracking-widest transition-all">Check Now</button>
                     </div>
                   )}
                   {updateState === 'checking' && (
                     <div className="flex items-center gap-4 text-blue-600">
                        <Loader2 className="animate-spin" size={20} />
                        <p className="text-sm font-bold">Connecting to Chimera cloud servers...</p>
                     </div>
                   )}
                   {updateState === 'available' && (
                     <div className="animate-in slide-in-from-top-4">
                        <div className="flex items-start gap-4 mb-6">
                           <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                              <ShieldAlert size={20} />
                           </div>
                           <div>
                              <p className="font-bold text-gray-900 text-lg">HybridOS 6.5.1 Hotfix</p>
                              <p className="text-xs text-gray-400 mt-1 leading-relaxed">This update fixes critical kernel bugs in the AI threading module and enhances glass transparency rendering for older GPU units.</p>
                           </div>
                        </div>
                        <button onClick={startInstall} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-600/20">Download and Install (1.4 GB)</button>
                     </div>
                   )}
                   {updateState === 'installing' && (
                     <div className="space-y-6 animate-in fade-in">
                        <div className="flex justify-between items-end">
                           <p className="text-sm font-bold text-gray-900">Installing Hybrid Core Components...</p>
                           <p className="text-xs font-black text-blue-600 tabular-nums">{Math.floor(progress)}%</p>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-600 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest animate-pulse">DO NOT SHUT DOWN THE KERNEL</p>
                     </div>
                   )}
                   {updateState === 'completed' && (
                     <div className="flex flex-col items-center text-center p-4 animate-in zoom-in-95">
                        <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
                           <CheckCircle2 size={32} />
                        </div>
                        <p className="font-bold text-gray-900 text-xl">Installation Complete</p>
                        <p className="text-sm text-gray-400 mt-2 mb-6">Restart your system to apply the new kernel optimizations.</p>
                        <button onClick={() => setUpdateState('idle')} className="px-10 py-3 bg-gray-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-black transition-all">Restart Interface</button>
                     </div>
                   )}
                </div>
             </section>

             <div className="grid grid-cols-2 gap-6">
                <InfoCard icon={<Cpu size={20} />} label="Processor" value="Hybrid Core i9 vGen" color="bg-purple-50 text-purple-600" />
                <InfoCard icon={<Database size={20} />} label="Memory" value="16GB Unified LPDDR5" color="bg-blue-50 text-blue-600" />
                <InfoCard icon={<HardDrive size={20} />} label="Storage" value="512GB NVMe SSD" color="bg-orange-50 text-orange-600" />
                <InfoCard icon={<Monitor size={20} />} label="Graphics" value="ChimeraRTX v2.4" color="bg-emerald-50 text-emerald-600" />
             </div>
          </div>
        );

      default:
        return <div className="p-12 text-center text-gray-400 italic font-bold opacity-30">Module scheduled for build v6.6.0</div>;
    }
  };

  return (
    <div className="flex h-full bg-gray-50 text-gray-900 overflow-hidden font-sans select-none">
      <div className="w-64 border-r border-gray-200 bg-white/80 backdrop-blur-xl p-8 space-y-2 shrink-0">
        <h2 className="text-xs font-black text-gray-300 uppercase tracking-[0.3em] mb-8 px-4">Preference</h2>
        <NavItem icon={<User size={18} />} label="Accounts" active={activeTab === 'Accounts'} onClick={() => setActiveTab('Accounts')} />
        <NavItem icon={<Palette size={18} />} label="Personalization" active={activeTab === 'Personalization'} onClick={() => setActiveTab('Personalization')} />
        <NavItem icon={<Network size={18} />} label="Network" active={activeTab === 'Network'} onClick={() => setActiveTab('Network')} />
        <NavItem icon={<Bell size={18} />} label="Notifications" active={activeTab === 'Notifications'} onClick={() => setActiveTab('Notifications')} />
        <NavItem icon={<Shield size={18} />} label="Privacy" active={activeTab === 'Privacy'} onClick={() => setActiveTab('Privacy')} />
        <NavItem icon={<Laptop size={18} />} label="System" active={activeTab === 'System'} onClick={() => setActiveTab('System')} />
      </div>
      <div className="flex-1 overflow-y-auto p-16 custom-scrollbar bg-white/50">
        <div className="max-w-4xl mx-auto">
          <header className="mb-14">
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter">{activeTab}</h2>
            <p className="text-gray-400 mt-2 font-bold text-lg opacity-80 tracking-tight">System configuration and preferences.</p>
          </header>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const SettingsTile = ({ icon, title, sub, status }: any) => (
  <div className="flex items-center justify-between p-6 bg-white rounded-[1.5rem] border border-gray-50 shadow-sm group hover:border-blue-500/20 transition-all cursor-default">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-gray-900">{title}</p>
        <p className="text-[11px] text-gray-400 font-medium">{sub}</p>
      </div>
    </div>
    <span className="text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-50 px-3 py-1 rounded-full">{status}</span>
  </div>
);

const InfoCard = ({ icon, label, value, color }: any) => (
  <div className="p-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 hover:scale-[1.02] transition-transform cursor-default">
     <div className={`p-4 rounded-2xl ${color} shadow-sm`}>{icon}</div>
     <div><p className="text-[10px] text-gray-300 font-black uppercase tracking-widest">{label}</p><p className="text-sm font-black text-gray-900 mt-0.5">{value}</p></div>
  </div>
);

const NavItem: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-black transition-all ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-900'}`}
  >
    <span className={active ? 'text-white' : 'opacity-60'}>{icon}</span>
    {label}
  </button>
);

export default Settings;
