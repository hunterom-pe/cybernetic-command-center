import React, { useState, useEffect } from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Activity, Cpu, HardDrive, Shield } from 'lucide-react';

interface ProcessInfo {
  pid: number;
  name: string;
  cpuPercent: number;
  ramMB: number;
  user: string;
}

const INITIAL_PROCESSES: ProcessInfo[] = [
  { pid: 1402, name: 'WindowServer', cpuPercent: 8.4, ramMB: 482, user: 'root' },
  { pid: 8842, name: 'Command Center', cpuPercent: 4.2, ramMB: 312, user: 'hunter' },
  { pid: 3210, name: 'Spotify', cpuPercent: 2.1, ramMB: 245, user: 'hunter' },
  { pid: 5120, name: 'CoreAudio', cpuPercent: 1.5, ramMB: 98, user: '_coreaudiod' },
  { pid: 9140, name: 'Vite Dev Server', cpuPercent: 0.8, ramMB: 184, user: 'hunter' }
];

export const SysProcessesWidget: React.FC = () => {
  const [processes, setProcesses] = useState<ProcessInfo[]>(INITIAL_PROCESSES);

  useEffect(() => {
    // Simulate live process CPU fluctuation
    const interval = setInterval(() => {
      setProcesses((prev) =>
        prev.map((proc) => {
          const deltaCpu = (Math.random() - 0.48) * 2;
          const nextCpu = Math.max(0.2, Number((proc.cpuPercent + deltaCpu).toFixed(1)));
          return {
            ...proc,
            cpuPercent: nextCpu
          };
        }).sort((a, b) => b.cpuPercent - a.cpuPercent)
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <GlassCard>
      <WidgetHeader icon={Activity} prefix="SYS PROCESSES" title="TOP ACTIVE MACOS PROCESSES" badge="TOP 5 CPU" />

      <div className="flex flex-col justify-between h-full space-y-1.5 p-1">
        <div className="space-y-1 overflow-y-auto max-h-[140px]">
          {processes.map((proc) => (
            <div
              key={proc.pid}
              className="p-1.5 rounded-lg bg-[#1A1A24]/60 border border-[#2A2A36] flex items-center justify-between font-mono text-[10px] hover:border-[#00F0FF]/40 transition-colors"
            >
              <div className="flex items-center space-x-2 truncate">
                <span className="text-slate-500 font-bold w-10 shrink-0">PID {proc.pid}</span>
                <span className="font-sans font-semibold text-slate-100 truncate max-w-[120px]">{proc.name}</span>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <span className="text-slate-400">{proc.ramMB} MB</span>
                <span className="font-bold text-[#00F0FF] px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-500/30 w-12 text-right">
                  {proc.cpuPercent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};
