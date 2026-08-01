import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Bot, Send, Sparkles, Cpu, Code2, ListChecks } from 'lucide-react';
import { useCyberSFX } from '../../hooks/useCyberSFX';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export const NeuralAIWidget: React.FC = () => {
  const { playChimeSFX, playClickSFX } = useCyberSFX();
  const [prompt, setPrompt] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'NEURAL MATRIX AI ACTIVE // I am your Command Center assistant. Ask me to summarize directives, generate code, or analyze telemetry.'
    }
  ]);

  const handleSendPrompt = (inputPrompt?: string) => {
    const query = (inputPrompt || prompt).trim();
    if (!query) return;

    playClickSFX();

    const userMsg: ChatMessage = { id: `usr-${Date.now()}`, sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setPrompt('');
    setIsThinking(true);

    setTimeout(() => {
      let aiResponse = 'NEURAL SYNC COMPLETE // System parameters operating within normal thresholds. All telemetry channels clear.';

      const lower = query.toLowerCase();
      if (lower.includes('directive') || lower.includes('task') || lower.includes('goal')) {
        aiResponse = 'DIRECTIVE ANALYSIS: Priority tasks queued in Current Week Directives. 2 high-priority items require focus.';
      } else if (lower.includes('code') || lower.includes('react') || lower.includes('ts')) {
        aiResponse = 'CODE REPL SNIPPET:\n```ts\nconst sysCheck = async () => {\n  const stats = await window.electronAPI.getSystemTelemetry();\n  return stats.cpuLoad < 80;\n};\n```';
      } else if (lower.includes('telemetry') || lower.includes('sys') || lower.includes('cpu')) {
        aiResponse = 'TELEMETRY SUMMARY: CPU load stable at ~18%, RAM allocation at 7.2GB / 16.0GB. Grid stability 100%.';
      } else if (lower.includes('stoic') || lower.includes('quote') || lower.includes('mind')) {
        aiResponse = 'STOIC REFLECTION: "You have power over your mind - not outside events. Realize this, and you will find strength." - Marcus Aurelius';
      }

      playChimeSFX();
      setMessages((prev) => [...prev, { id: `ai-${Date.now()}`, sender: 'ai', text: aiResponse }]);
      setIsThinking(false);
    }, 1000);
  };

  return (
    <GlassCard>
      <WidgetHeader icon={Bot} prefix="NEURAL AI" title="MATRIX AI ASSISTANT" badge="GEMINI CORE" badgeColor="magenta" />

      <div className="flex flex-col h-full justify-between space-y-2 overflow-hidden">
        {/* Quick Prompt Chips */}
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar font-mono text-[9px]">
          <button
            onClick={() => handleSendPrompt('Summarize Directives')}
            className="px-2 py-0.5 rounded bg-pink-950/60 border border-pink-500/40 text-[#FF007F] hover:bg-pink-900/80 shrink-0 font-bold flex items-center space-x-1"
          >
            <ListChecks size={10} />
            <span>SUMMARIZE DIRECTIVES</span>
          </button>

          <button
            onClick={() => handleSendPrompt('Generate Code Snippet')}
            className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-[#00F0FF] hover:bg-cyan-900/80 shrink-0 font-bold flex items-center space-x-1"
          >
            <Code2 size={10} />
            <span>CODE SNIPPET</span>
          </button>

          <button
            onClick={() => handleSendPrompt('Explain Telemetry')}
            className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-[#00FF66] hover:bg-emerald-900/80 shrink-0 font-bold flex items-center space-x-1"
          >
            <Cpu size={10} />
            <span>EXPLAIN TELEMETRY</span>
          </button>
        </div>

        {/* Chat Messages Log Stream */}
        <div className="bg-[#1A1A24]/60 border border-[#2A2A36] rounded-lg p-2.5 space-y-2 overflow-y-auto max-h-[140px]">
          {messages.map((m) => (
            <div key={m.id} className={`flex flex-col space-y-0.5 ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className="font-mono text-[8px] text-slate-500 uppercase">
                {m.sender === 'user' ? 'USER QUERY' : 'NEURAL AI'}
              </div>
              <div
                className={`p-2 rounded-lg text-xs leading-relaxed max-w-[85%] ${
                  m.sender === 'user'
                    ? 'bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-slate-100 font-sans'
                    : 'bg-[#121218] border border-[#2A2A36] text-slate-200 font-mono text-[11px]'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center space-x-2 font-mono text-[10px] text-[#FF007F] animate-pulse">
              <Sparkles size={12} className="animate-spin" />
              <span>NEURAL MATRIX COMPUTING RESPONSE...</span>
            </div>
          )}
        </div>

        {/* Prompt Input Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleSendPrompt(); }} className="flex items-center space-x-1.5 bg-[#1A1A24]/80 border border-[#2A2A36] rounded-lg p-1.5">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask Neural AI assistant anything..."
            className="w-full bg-transparent font-sans text-xs text-slate-100 placeholder-slate-500 focus:outline-none px-1"
          />
          <button type="submit" className="p-1.5 rounded bg-[#FF007F] text-white font-bold hover:scale-105 transition-transform">
            <Send size={13} />
          </button>
        </form>
      </div>
    </GlassCard>
  );
};
