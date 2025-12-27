
import React, { useState, useEffect } from 'react';
import { Activity, Cpu, Database, Network, Zap } from 'lucide-react';

const SystemMonitor: React.FC = () => {
  const [stats, setStats] = useState({
    cpu: [20, 25, 45, 30, 22, 60, 45, 50, 48, 52],
    memory: 64,
    temp: 42,
    net: 124
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        cpu: [...prev.cpu.slice(1), Math.floor(Math.random() * 60) + 20],
        net: prev.net + Math.floor(Math.random() * 20) - 10,
        temp: 40 + Math.floor(Math.random() * 8)
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full bg-[#1e1e1e] p-8 text-white font-sans overflow-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black tracking-tighter">System Activity</h1>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40">
           <Zap size={12} className="text-yellow-400" />
           High Performance Mode
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <StatCard icon={<Cpu className="text-blue-400" />} label="CPU Usage" value={`${stats.cpu[stats.cpu.length - 1]}%`} />
         <StatCard icon={<Database className="text-purple-400" />} label="Memory" value={`${stats.memory}%`} />
         <StatCard icon={<Zap className="text-orange-400" />} label="Temp" value={`${stats.temp}°C`} />
         <StatCard icon={<Network className="text-green-400" />} label="Network" value={`${stats.net} Mbps`} />
      </div>

      <div className="space-y-6">
        <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40">CPU History (10s)</h3>
              <Activity size={16} className="text-blue-500 animate-pulse" />
           </div>
           <div className="h-48 flex items-end gap-1">
              {stats.cpu.map((val, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-blue-500/40 border-t-2 border-blue-400 transition-all duration-1000" 
                  style={{ height: `${val}%` }} 
                />
              ))}
           </div>
        </div>

        <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
           <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40 mb-6">Active Kernels</h3>
           <table className="w-full text-left text-xs">
              <thead className="opacity-20 uppercase tracking-widest text-[10px]">
                 <tr>
                    <th className="pb-4">Process</th>
                    <th className="pb-4">ID</th>
                    <th className="pb-4">Load</th>
                    <th className="pb-4">Status</th>
                 </tr>
              </thead>
              <tbody className="font-medium opacity-80">
                 <tr className="border-t border-white/5"><td className="py-3">Nova-Engine</td><td>8421</td><td>12.4%</td><td className="text-green-400">Stable</td></tr>
                 <tr className="border-t border-white/5"><td className="py-3">WindowServer</td><td>1024</td><td>4.2%</td><td className="text-green-400">Stable</td></tr>
                 <tr className="border-t border-white/5"><td className="py-3">Terminal-Bash</td><td>9120</td><td>0.1%</td><td className="text-green-400">Idle</td></tr>
                 <tr className="border-t border-white/5"><td className="py-3">Atlas-Logic</td><td>5512</td><td>8.9%</td><td className="text-yellow-400">Active</td></tr>
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
  <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col gap-2">
     <div className="flex items-center justify-between">
        {icon}
        <span className="text-lg font-black tracking-tight">{value}</span>
     </div>
     <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">{label}</span>
  </div>
);

export default SystemMonitor;
