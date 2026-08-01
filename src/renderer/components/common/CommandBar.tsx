import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, CheckSquare, Bookmark, X } from 'lucide-react';
import { QuickLink, DirectiveItem } from '../../types/hud';

interface CommandBarProps {
  isOpen: boolean;
  onClose: () => void;
  quickLinks: QuickLink[];
  tasks: DirectiveItem[];
}

export const CommandBar: React.FC<CommandBarProps> = ({ isOpen, onClose, quickLinks, tasks }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredLinks = quickLinks.filter((l) =>
    l.label.toLowerCase().includes(query.toLowerCase()) || l.url.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTasks = tasks.filter((t) => t.title.toLowerCase().includes(query.toLowerCase()));

  const handleLaunchUrl = (url: string) => {
    if (window.electronAPI) {
      window.electronAPI.openExternalUrl(url);
    } else {
      window.open(url, '_blank');
    }
    onClose();
  };

  const handleWebSearch = () => {
    if (!query.trim()) return;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    handleLaunchUrl(searchUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl rounded-xl bg-[#121218] border border-[#00F0FF]/40 shadow-[0_0_30px_rgba(0,240,255,0.2)] overflow-hidden space-y-3">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#2A2A36] space-x-3 bg-[#1A1A24]/60">
          <Search size={18} strokeWidth={1.5} className="text-[#00F0FF]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks, quick links, or type to search web..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-400 font-sans text-sm focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleWebSearch();
            }}
          />
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto px-3 pb-3 space-y-4">
          {/* Quick Links Section */}
          {filteredLinks.length > 0 && (
            <div>
              <div className="font-mono text-[10px] font-bold text-cyan-400 tracking-wider px-2 mb-1.5 uppercase">
                QUICK LAUNCHERS //
              </div>
              <div className="space-y-1">
                {filteredLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleLaunchUrl(link.url)}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-[#121218] hover:bg-[#1A1A24] border border-[#2A2A36] hover:border-[#00F0FF]/40 text-left transition-all group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Bookmark size={15} strokeWidth={1.5} className="text-pink-400 group-hover:scale-110 transition-transform" />
                      <span className="font-mono text-xs text-slate-200 font-medium">{link.label}</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400 truncate max-w-[200px]">{link.url}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tasks Section */}
          {filteredTasks.length > 0 && (
            <div>
              <div className="font-mono text-[10px] font-bold text-pink-400 tracking-wider px-2 mb-1.5 uppercase">
                DIRECTIVE TASKS //
              </div>
              <div className="space-y-1">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#121218] border border-[#2A2A36]"
                  >
                    <div className="flex items-center space-x-2.5">
                      <CheckSquare
                        size={15}
                        strokeWidth={1.5}
                        className={task.completed ? 'text-emerald-400' : 'text-slate-500'}
                      />
                      <span className={`text-xs ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {task.title}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded border border-[#2A2A36] text-slate-400">
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Web Search Fallback Prompt */}
          {query.trim() && (
            <div>
              <div className="font-mono text-[10px] font-bold text-amber-400 tracking-wider px-2 mb-1.5 uppercase">
                WEB LAUNCHER //
              </div>
              <button
                onClick={handleWebSearch}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-amber-950/40 border border-[#FF6B00]/40 hover:bg-amber-900/60 transition-all"
              >
                <span className="font-mono text-xs text-[#FF6B00]">
                  Search Google for: "<span className="text-white font-bold">{query}</span>"
                </span>
                <ExternalLink size={14} strokeWidth={1.5} className="text-[#FF6B00]" />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-[#2A2A36] bg-[#121218] font-mono text-[10px] text-slate-400">
          <span>Press ESC to close</span>
          <span>ENTER to search web</span>
        </div>
      </div>
    </div>
  );
};
