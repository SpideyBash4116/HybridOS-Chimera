
import React, { useState, useRef, useEffect } from 'react';
import { TerminalLine, VFSNode } from '../types';
import { askGemini } from '../services/geminiService';

interface TerminalProps {
  vfs: Record<string, VFSNode>;
  setVfs: React.Dispatch<React.SetStateAction<Record<string, VFSNode>>>;
}

const Terminal: React.FC<TerminalProps> = ({ vfs, setVfs }) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { text: 'Chimera Kernel v6.5.0-hybrid (TTY1)', type: 'system' },
    { text: 'Welcome to the HybridOS Terminal. AI assistance active.', type: 'system' },
    { text: 'Type "help" for a list of supported commands.', type: 'system' },
    { text: 'Try: "ai explain quantum computing"', type: 'system' },
    { text: '', type: 'system' }
  ]);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState('/home/user');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines, isAiLoading]);

  const getDir = (path: string): VFSNode | null => {
    const parts = path === '/' ? [] : path.split('/').filter(Boolean);
    let current: VFSNode = vfs['/'];
    for (const part of parts) {
      if (current.children && current.children[part]) {
        current = current.children[part];
      } else {
        return null;
      }
    }
    return current;
  };

  const updateVFS = (path: string, newNode: VFSNode) => {
    setVfs(prev => {
        const next = JSON.parse(JSON.stringify(prev));
        const parts = path.split('/').filter(Boolean);
        let current = next['/'];
        for (const part of parts) {
            if (!current.children) current.children = {};
            if (!current.children[part]) {
                current.children[part] = { type: 'dir', name: part, children: {}, createdAt: Date.now() };
            }
            current = current.children[part];
        }
        if (!current.children) current.children = {};
        current.children[newNode.name] = newNode;
        return next;
    });
  };

  const handleCommand = async (cmd: string) => {
    const parts = cmd.trim().split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    setLines(prev => [...prev, { text: `user@chimera:${cwd}$ ${cmd}`, type: 'input' }]);

    if (command === 'ai' || command === 'ask') {
      const query = args.join(' ');
      if (!query) {
        setLines(prev => [...prev, { text: 'Usage: ai [your question]', type: 'error' }]);
        return;
      }
      setIsAiLoading(true);
      const response = await askGemini(query, `Terminal AI Integration at ${cwd}`);
      setLines(prev => [...prev, { text: response, type: 'output' }]);
      setIsAiLoading(false);
      return;
    }

    switch (command) {
      case 'help':
        setLines(prev => [...prev, { text: 'Core: ls, cd, pwd, clear, cat, mkdir, touch, rm, whoami, neofetch, date, echo\nAI: ai [query], ask [query]', type: 'output' }]);
        break;
      case 'clear':
        setLines([]);
        break;
      case 'whoami':
        setLines(prev => [...prev, { text: 'user', type: 'output' }]);
        break;
      case 'date':
        setLines(prev => [...prev, { text: new Date().toString(), type: 'output' }]);
        break;
      case 'pwd':
        setLines(prev => [...prev, { text: cwd, type: 'output' }]);
        break;
      case 'ls': {
        const node = getDir(cwd);
        if (node && node.children) {
          const contents = Object.keys(node.children).join('  ');
          setLines(prev => [...prev, { text: contents || '(empty directory)', type: 'output' }]);
        }
        break;
      }
      case 'mkdir': {
        const name = args[0];
        if (!name) {
            setLines(prev => [...prev, { text: 'mkdir: missing operand', type: 'error' }]);
        } else {
            updateVFS(cwd, { type: 'dir', name, children: {}, createdAt: Date.now() });
            setLines(prev => [...prev, { text: `Created directory: ${name}`, type: 'output' }]);
        }
        break;
      }
      case 'touch': {
        const name = args[0];
        if (!name) {
            setLines(prev => [...prev, { text: 'touch: missing file operand', type: 'error' }]);
        } else {
            updateVFS(cwd, { type: 'file', name, content: '', createdAt: Date.now() });
            setLines(prev => [...prev, { text: `Created file: ${name}`, type: 'output' }]);
        }
        break;
      }
      case 'cat': {
        const name = args[0];
        const dir = getDir(cwd);
        if (!name) {
            setLines(prev => [...prev, { text: 'cat: missing file operand', type: 'error' }]);
        } else if (dir?.children?.[name]) {
            const file = dir.children[name];
            setLines(prev => [...prev, { text: file.content || '(empty file)', type: 'output' }]);
        } else {
            setLines(prev => [...prev, { text: `cat: ${name}: No such file`, type: 'error' }]);
        }
        break;
      }
      case 'neofetch':
        setLines(prev => [...prev, { text: `
   .----.       OS: HybridOS Chimera x86_64
  /      \\      Kernel: 6.5.0-hybrid
 |  (o)(o) |    Uptime: ${Math.floor(performance.now() / 60000)} mins
  \\  __  /     Shell: bash 5.2.15
   '----'       UI: macOS-Glass v2.4
                Taskbar: Windows-11-Fluent
                CPU: Virtual Gemini Pro
                Memory: 16GB / 64GB
`, type: 'output' }]);
        break;
      case 'cd': {
        const target = args[0] || '/home/user';
        let newPath = cwd;
        if (target === '..') {
            const parts = cwd.split('/').filter(Boolean);
            parts.pop();
            newPath = '/' + parts.join('/');
        } else if (target === '/') {
            newPath = '/';
        } else if (target.startsWith('/')) {
            newPath = target;
        } else {
            newPath = cwd === '/' ? `/${target}` : `${cwd}/${target}`;
        }
        
        if (getDir(newPath)) {
            setCwd(newPath || '/');
        } else {
            setLines(prev => [...prev, { text: `cd: ${target}: No such directory`, type: 'error' }]);
        }
        break;
      }
      case 'echo':
        setLines(prev => [...prev, { text: args.join(' '), type: 'output' }]);
        break;
      case '':
        break;
      default:
        setLines(prev => [...prev, { text: `bash: ${command}: command not found`, type: 'error' }]);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isAiLoading) {
        handleCommand(input);
        setInput('');
    }
  };

  return (
    <div 
      className="flex flex-col h-full bg-black/95 text-blue-300 font-mono text-xs md:text-sm p-4 overflow-hidden shadow-inner"
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="flex-1 overflow-y-auto mb-2 space-y-1 custom-scrollbar selection:bg-blue-500/30">
        {lines.map((line, i) => (
          <div key={i} className={`whitespace-pre-wrap transition-opacity duration-200 ${
            line.type === 'error' ? 'text-red-400' : 
            line.type === 'system' ? 'text-blue-500/80' : 
            line.type === 'input' ? 'text-white font-bold' : 'text-green-400/90'
          }`}>
            {line.text}
          </div>
        ))}
        {isAiLoading && (
          <div className="flex items-center gap-2 text-purple-400 font-bold animate-pulse">
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" />
            Chimera AI is thinking...
          </div>
        )}
      </div>
      <form onSubmit={onSubmit} className="flex gap-2 items-center border-t border-white/5 pt-2">
        <span className="text-blue-500 font-bold shrink-0">user@chimera:{cwd}$</span>
        <input
          ref={inputRef}
          autoFocus
          disabled={isAiLoading}
          className="flex-1 bg-transparent border-none outline-none text-white p-0 selection:bg-blue-500/30 disabled:opacity-50"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </div>
  );
};

export default Terminal;
