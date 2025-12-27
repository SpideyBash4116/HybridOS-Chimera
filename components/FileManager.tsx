
import React, { useState } from 'react';
import { Folder, File, ChevronRight, Home, Monitor, Clock, Download, Image as ImageIcon, Plus, Search } from 'lucide-react';
import { VFSNode, AppID } from '../types';

interface FileManagerProps {
  vfs: Record<string, VFSNode>;
  onOpenFile?: (app: AppID, content?: string) => void;
}

const FileManager: React.FC<FileManagerProps> = ({ vfs, onOpenFile }) => {
  const [currentPath, setCurrentPath] = useState('/home/user');
  
  const getDirContents = (path: string) => {
    const parts = path.split('/').filter(Boolean);
    let current: VFSNode | undefined = vfs['/'];
    
    for (const part of parts) {
      if (current && current.children && current.children[part]) {
        current = current.children[part];
      } else {
        return [];
      }
    }
    return current && current.children ? Object.values(current.children) : [];
  };

  const contents = getDirContents(currentPath);

  const navigateTo = (segments: string[]) => {
    const path = '/' + segments.filter(Boolean).join('/');
    setCurrentPath(path);
  };

  const handleNodeAction = (node: VFSNode) => {
    if (node.type === 'dir') {
      const prefix = currentPath === '/' ? '' : currentPath;
      setCurrentPath(`${prefix}/${node.name}`);
    } else {
      // Logic for opening files
      if (node.name.endsWith('.txt') || node.name.includes('welcome')) {
        onOpenFile?.('notepad', node.content);
      } else if (node.name.endsWith('.lnk')) {
        const appToExec = node.content?.split(':')[1] as AppID;
        if (appToExec) onOpenFile?.(appToExec);
      }
    }
  };

  return (
    <div className="flex h-full bg-white/5 backdrop-blur-md text-white select-none">
      {/* Sidebar */}
      <div className="w-52 border-r border-white/10 p-4 space-y-6 shrink-0 bg-black/10">
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-wider opacity-30 mb-4 px-2">Favorites</h4>
          <nav className="space-y-0.5">
            <NavItem icon={<Home size={14} />} label="Home" active={currentPath === '/home/user'} onClick={() => setCurrentPath('/home/user')} />
            <NavItem icon={<Monitor size={14} />} label="Desktop" active={currentPath === '/home/user/Desktop'} onClick={() => setCurrentPath('/home/user/Desktop')} />
            <NavItem icon={<Download size={14} />} label="Downloads" active={currentPath === '/home/user/Downloads'} onClick={() => setCurrentPath('/home/user/Downloads')} />
            <NavItem icon={<ImageIcon size={14} />} label="Pictures" active={currentPath === '/home/user/Pictures'} onClick={() => setCurrentPath('/home/user/Pictures')} />
          </nav>
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-wider opacity-30 mb-4 px-2">Locations</h4>
          <nav className="space-y-0.5">
            <NavItem icon={<ChevronRight size={14} />} label="Hybrid Drive" active={currentPath === '/'} onClick={() => setCurrentPath('/')} />
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navigation Bar */}
        <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-black/20">
          <div className="flex items-center gap-2 text-xs font-bold opacity-60">
            {currentPath.split('/').map((part, i, arr) => (
              <React.Fragment key={i}>
                <span 
                  className="hover:text-white cursor-pointer transition-colors" 
                  onClick={() => navigateTo(arr.slice(0, i + 1))}
                >
                  {part || 'Root'}
                </span>
                {i < arr.length - 1 && <ChevronRight size={12} className="opacity-40" />}
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center gap-4">
             <div className="relative group">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-40" />
                <input placeholder="Search Files" className="bg-white/5 border border-white/10 rounded-lg py-1.5 px-10 text-[11px] focus:outline-none focus:bg-white/10 transition-all w-48" />
             </div>
             <button className="p-2 hover:bg-white/10 rounded-lg transition-all" title="New File">
                <Plus size={16} />
             </button>
          </div>
        </div>

        {/* Grid View */}
        <div className="p-8 grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-10 auto-rows-max overflow-y-auto custom-scrollbar">
          {contents.map((node) => (
            <div 
              key={node.name}
              className="flex flex-col items-center gap-3 group cursor-pointer"
              onDoubleClick={() => handleNodeAction(node)}
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-2xl group-hover:bg-blue-500/10 group-hover:ring-1 group-hover:ring-blue-500/30 transition-all active:scale-95">
                {node.type === 'dir' ? (
                  <Folder size={44} className="text-yellow-400 fill-yellow-400/20 drop-shadow-md" />
                ) : (
                  <File size={40} className="text-gray-300 drop-shadow-md" />
                )}
              </div>
              <span className="text-[11px] font-bold text-center truncate w-full px-1 opacity-80 group-hover:opacity-100 transition-opacity">{node.name}</span>
            </div>
          ))}
          {contents.length === 0 && (
            <div className="col-span-full h-48 flex flex-col items-center justify-center opacity-20 italic text-sm gap-2">
              <Folder size={48} />
              This folder is empty
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-white/40 hover:bg-white/5 hover:text-white/60'}`}
  >
    <span className={active ? 'text-white' : 'opacity-60'}>{icon}</span>
    {label}
  </button>
);

export default FileManager;
