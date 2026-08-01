import React, { useState, useEffect } from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Clipboard, Copy, Check, RefreshCw } from 'lucide-react';

export const QuickClipboardStash: React.FC = () => {
  const [snippets, setSnippets] = useState<string[]>(() => {
    const saved = localStorage.getItem('hud_clipboard_stash');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      'ssh -i ~/.ssh/id_rsa root@192.168.1.100',
      'const HUD_TOKEN = "cy_live_9948182942"',
      'git commit -m "feat(telemetry): update system IPC listener"'
    ];
  });

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem('hud_clipboard_stash', JSON.stringify(snippets));
  }, [snippets]);

  useEffect(() => {
    // Poll system clipboard for new items
    const checkClipboard = async () => {
      if (window.electronAPI) {
        try {
          const text = await window.electronAPI.readClipboard();
          if (text && text.trim() && !snippets.includes(text.trim())) {
            setSnippets((prev) => [text.trim(), ...prev.slice(0, 2)]);
          }
        } catch (e) {}
      }
    };

    const interval = setInterval(checkClipboard, 2500);
    return () => clearInterval(interval);
  }, [snippets]);

  const handleCopyBack = async (text: string, index: number) => {
    if (window.electronAPI) {
      await window.electronAPI.writeClipboard(text);
    } else {
      navigator.clipboard.writeText(text);
    }
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <GlassCard>
      <WidgetHeader icon={Clipboard} prefix="CLIPBOARD" title="TEXT SNIPPET STASH" badge="AUTO SYNC" />

      <div className="flex flex-col h-full justify-between space-y-1.5">
        <div className="space-y-1.5 overflow-y-auto max-h-[140px]">
          {snippets.slice(0, 3).map((snippet, idx) => (
            <div
              key={idx}
              className="p-2 rounded-lg bg-[#1A1A24]/60 border border-[#2A2A36] flex items-center justify-between space-x-2 hover:border-[#00F0FF]/40 transition-colors"
            >
              <span className="font-mono text-[11px] text-slate-300 truncate max-w-[210px] select-all">
                {snippet}
              </span>

              <button
                onClick={() => handleCopyBack(snippet, idx)}
                className="p-1 rounded bg-[#121218] border border-[#2A2A36] text-slate-400 hover:text-[#00F0FF] hover:border-[#00F0FF] transition-all shrink-0"
              >
                {copiedIndex === idx ? <Check size={12} className="text-[#00FF66]" /> : <Copy size={12} />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};
