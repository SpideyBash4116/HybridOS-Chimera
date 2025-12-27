
import React, { useState, useEffect } from 'react';

interface NotepadProps {
  initialContent?: string | null;
}

const Notepad: React.FC<NotepadProps> = ({ initialContent }) => {
  const [content, setContent] = useState('New text document...\n\nStart typing here.');

  useEffect(() => {
    if (initialContent !== null && initialContent !== undefined) {
      setContent(initialContent);
    }
  }, [initialContent]);

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white">
      <div className="flex items-center px-6 py-3 border-b border-white/5 gap-6 text-[11px] font-black uppercase tracking-widest opacity-40 bg-black/20">
        <span className="hover:text-blue-400 cursor-pointer transition-colors">File</span>
        <span className="hover:text-blue-400 cursor-pointer transition-colors">Edit</span>
        <span className="hover:text-blue-400 cursor-pointer transition-colors">Selection</span>
        <span className="hover:text-blue-400 cursor-pointer transition-colors">View</span>
        <span className="hover:text-blue-400 cursor-pointer transition-colors">Go</span>
      </div>
      <textarea 
        className="flex-1 bg-transparent p-10 text-sm font-mono text-gray-300 resize-none outline-none leading-relaxed selection:bg-blue-500/30"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        spellCheck={false}
      />
      <div className="h-8 bg-blue-600 flex items-center justify-between px-6 text-[10px] font-black uppercase tracking-widest shadow-lg">
        <div className="flex items-center gap-4">
           <span>Ready</span>
           <span className="opacity-60">Ln 1, Col 1</span>
        </div>
        <div className="flex gap-6">
          <span>UTF-8</span>
          <span>Markdown v2</span>
        </div>
      </div>
    </div>
  );
};

export default Notepad;
