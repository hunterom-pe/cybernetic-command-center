import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Terminal, Send, Trash2, ShieldAlert } from 'lucide-react';
import { useCyberSFX } from '../../hooks/useCyberSFX';

interface HistoryItem {
  id: string;
  command: string;
  output: string;
  isError: boolean;
  timestamp: string;
}

export const TerminalCLIWidget: React.FC = () => {
  const { playClickSFX } = useCyberSFX();
  const [commandInput, setCommandInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 'init-1',
      command: 'sys.status',
      output: 'COMMAND CENTER OS v1.0.0 READY // TERMINAL SHELL ACTIVE',
      isError: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const outputEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleRunCommand = async (e?: React.FormEvent, cmdToRun?: string) => {
    if (e) e.preventDefault();
    const cmd = (cmdToRun || commandInput).trim();
    if (!cmd) return;

    playClickSFX();

    if (cmd === 'clear') {
      setHistory([]);
      setCommandInput('');
      return;
    }

    if (cmd === 'help') {
      setHistory((prev) => [
        ...prev,
        {
          id: `cmd-${Date.now()}`,
          command: cmd,
          output: 'QUICK COMMANDS:\n- git status (View git repository status)\n- uptime (System uptime)\n- ping -c 3 1.1.1.1 (Test network latency)\n- df -h (View disk space)\n- whoami (View current user)\n- clear (Clear terminal screen)',
          isError: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setCommandInput('');
      return;
    }

    setCommandInput('');

    if (window.electronAPI) {
      try {
        const res = await window.electronAPI.executeShellCmd(cmd);
        const outputText = res.stdout || res.stderr || 'Executed with zero output';
        setHistory((prev) => [
          ...prev,
          {
            id: `cmd-${Date.now()}`,
            command: cmd,
            output: outputText.trim(),
            isError: res.exitCode !== 0,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } catch (err: any) {
        setHistory((prev) => [
          ...prev,
          {
            id: `cmd-${Date.now()}`,
            command: cmd,
            output: err.message || 'Execution error',
            isError: true,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } else {
      // Dev mode fallback
      setHistory((prev) => [
        ...prev,
        {
          id: `cmd-${Date.now()}`,
          command: cmd,
          output: `[DEV MOCK OUTPUT] Executed command: ${cmd}\nCommand center OS terminal IPC active.`,
          isError: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  return (
    <GlassCard>
      <WidgetHeader
        icon={Terminal}
        prefix="TERMINAL"
        title="MACOS SHELL CLI EXECUTOR"
        badge="ZSH // BASH"
        actions={
          <button
            onClick={() => setHistory([])}
            title="Clear Terminal Screen"
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#1A1A24] transition-colors"
          >
            <Trash2 size={12} />
          </button>
        }
      />

      <div className="flex flex-col h-full justify-between space-y-2 overflow-hidden">
        {/* Quick Shortcut Buttons */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar font-mono text-[9px]">
          {['git status', 'uptime', 'ping -c 3 1.1.1.1', 'df -h', 'whoami', 'help'].map((cmd) => (
            <button
              key={cmd}
              onClick={() => handleRunCommand(undefined, cmd)}
              className="px-2 py-0.5 rounded bg-[#1A1A24] border border-[#2A2A36] text-slate-300 hover:border-[#00F0FF] hover:text-[#00F0FF] shrink-0 transition-colors"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Terminal Output Log Stream */}
        <div className="bg-[#08080C]/90 border border-[#2A2A36] rounded-lg p-2.5 font-mono text-[10px] space-y-2 overflow-y-auto max-h-[140px] text-slate-200">
          {history.map((item) => (
            <div key={item.id} className="space-y-0.5">
              <div className="flex items-center space-x-1.5 text-cyan-400 font-bold">
                <span className="text-[#FF007F]">$</span>
                <span>{item.command}</span>
                <span className="text-[8px] text-slate-500 font-normal">[{item.timestamp}]</span>
              </div>
              <pre
                className={`whitespace-pre-wrap font-mono text-[10px] pl-3 leading-relaxed border-l ${
                  item.isError ? 'text-rose-400 border-rose-500/50' : 'text-emerald-400 border-emerald-500/30'
                }`}
              >
                {item.output}
              </pre>
            </div>
          ))}
          <div ref={outputEndRef} />
        </div>

        {/* Terminal Command Input Bar */}
        <form onSubmit={(e) => handleRunCommand(e)} className="flex items-center space-x-1.5 bg-[#1A1A24]/80 border border-[#2A2A36] rounded-lg p-1.5">
          <span className="font-mono text-xs text-[#00FF66] font-bold pl-1">&gt;</span>
          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            placeholder="Type shell command (e.g. git status, ping 1.1.1.1)..."
            className="w-full bg-transparent font-mono text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button type="submit" className="p-1 rounded bg-[#00F0FF] text-black font-bold hover:scale-105 transition-transform">
            <Send size={12} />
          </button>
        </form>
      </div>
    </GlassCard>
  );
};
