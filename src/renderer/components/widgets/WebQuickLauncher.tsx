import React, { useState, useEffect } from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Bookmark, ExternalLink, Edit2, Plus, Trash2 } from 'lucide-react';
import { QuickLink } from '../../types/hud';

const INITIAL_LINKS: QuickLink[] = [
  { id: 'link-1', label: 'GITHUB', url: 'https://github.com' },
  { id: 'link-[#FF007F]', label: 'TRADINGVIEW', url: 'https://tradingview.com' },
  { id: 'link-3', label: 'AWS CONSOLE', url: 'https://aws.amazon.com' },
  { id: 'link-4', label: 'VITCH / YOUTUBE', url: 'https://youtube.com' },
  { id: 'link-5', label: 'NOTION STASH', url: 'https://notion.so' },
  { id: 'link-6', label: 'CHAT GPT / CLAUDE', url: 'https://chatgpt.com' }
];

export const WebQuickLauncher: React.FC = () => {
  const [links, setLinks] = useState<QuickLink[]>(() => {
    const saved = localStorage.getItem('hud_quick_links');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_LINKS;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    localStorage.setItem('hud_quick_links', JSON.stringify(links));
  }, [links]);

  const launchUrl = (url: string) => {
    if (window.electronAPI) {
      window.electronAPI.openExternalUrl(url);
    } else {
      window.open(url, '_blank');
    }
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim() || !newUrl.trim()) return;

    let formattedUrl = newUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    setLinks([...links, { id: `link-${Date.now()}`, label: newLabel.trim().toUpperCase(), url: formattedUrl }]);
    setNewLabel('');
    setNewUrl('');
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter((l) => l.id !== id));
  };

  return (
    <GlassCard>
      <WidgetHeader
        icon={Bookmark}
        prefix="LAUNCHPAD"
        title="TACTICAL WEB BOOKMARKS"
        badge={`${links.length} LINKS`}
        actions={
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#1A1A24] transition-colors"
          >
            <Edit2 size={12} />
          </button>
        }
      />

      <div className="flex flex-col h-full justify-between space-y-2">
        <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-[140px]">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => launchUrl(link.url)}
              className="p-2 rounded-lg bg-[#1A1A24]/60 border border-[#2A2A36] hover:border-[#00F0FF] hover:bg-[#1A1A24] text-left transition-all duration-200 group flex items-center justify-between"
            >
              <span className="font-mono text-[11px] font-bold text-slate-200 group-hover:text-[#00F0FF] truncate">
                {link.label}
              </span>
              <ExternalLink size={12} className="text-slate-500 group-hover:text-[#00F0FF] shrink-0" />
            </button>
          ))}
        </div>

        {/* Edit Links Modal */}
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#121218] border border-[#00F0FF]/40 rounded-xl p-4 w-96 space-y-3 shadow-2xl">
              <div className="font-mono text-xs font-bold text-[#00F0FF]">MANAGE QUICK LAUNCH LINKS</div>

              <form onSubmit={handleAddLink} className="space-y-2">
                <input
                  type="text"
                  placeholder="LINK LABEL (e.g. GITHUB)"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full bg-[#1A1A24] border border-[#2A2A36] rounded p-1.5 text-xs text-white focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="URL (e.g. https://github.com)"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full bg-[#1A1A24] border border-[#2A2A36] rounded p-1.5 text-xs text-white focus:outline-none"
                />
                <button type="submit" className="w-full py-1.5 bg-[#00F0FF] text-black font-bold text-xs rounded flex items-center justify-center space-x-1">
                  <Plus size={14} />
                  <span>ADD NEW LINK</span>
                </button>
              </form>

              <div className="max-h-40 overflow-y-auto space-y-1 pt-2 border-t border-[#2A2A36]">
                {links.map((link) => (
                  <div key={link.id} className="flex items-center justify-between p-1.5 rounded bg-[#1A1A24] text-xs">
                    <span className="font-mono text-slate-200">{link.label}</span>
                    <button onClick={() => handleDeleteLink(link.id)} className="text-slate-500 hover:text-rose-400">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              <button onClick={() => setIsEditing(false)} className="w-full py-1 text-xs text-slate-400 bg-[#1A1A24] rounded border border-[#2A2A36]">
                DONE
              </button>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
};
