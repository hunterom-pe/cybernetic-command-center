import React, { useState, useEffect } from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Network, ArrowUp, ArrowDown, Wifi, Globe, Radio } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

export const NetworkSpeedWidget: React.FC = () => {
  const [networkStats, setNetworkStats] = useState({
    downloadSpeedMBs: 14.8,
    uploadSpeedMBs: 4.2,
    pingMs: 18,
    localIp: '192.168.1.142',
    wifiSignal: 94,
    history: Array.from({ length: 10 }, (_, i) => ({ time: `${i}s`, dl: 12 + Math.random() * 5 }))
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkStats((prev) => {
        const nextDl = Number((12 + Math.random() * 8).toFixed(1));
        const nextUl = Number((3 + Math.random() * 3).toFixed(1));
        const nextPing = Math.floor(15 + Math.random() * 8);
        const newHist = [...prev.history.slice(1), { time: `${Date.now()}`, dl: nextDl }];
        return {
          ...prev,
          downloadSpeedMBs: nextDl,
          uploadSpeedMBs: nextUl,
          pingMs: nextPing,
          history: newHist
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <GlassCard>
      <WidgetHeader icon={Network} prefix="NETWORK" title="BANDWIDTH TELEMETRY" badge={`${networkStats.pingMs} MS LATENCY`} />

      <div className="grid grid-cols-2 gap-2.5 h-full items-center">
        {/* Left: Speeds */}
        <div className="bg-[#1A1A24]/60 border border-[#2A2A36] rounded-lg p-2 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between font-mono text-[10px]">
            <span className="text-slate-400">BANDWIDTH RX/TX</span>
            <span className="text-[#00FF66] font-bold">ONLINE</span>
          </div>

          <div className="space-y-1 my-1">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="flex items-center space-x-1 text-[#00F0FF]">
                <ArrowDown size={13} />
                <span>DOWNLOAD</span>
              </span>
              <span className="font-extrabold text-slate-100 glow-cyan">{networkStats.downloadSpeedMBs} MB/s</span>
            </div>

            <div className="flex items-center justify-between font-mono text-xs">
              <span className="flex items-center space-x-1 text-[#FF007F]">
                <ArrowUp size={13} />
                <span>UPLOAD</span>
              </span>
              <span className="font-extrabold text-slate-100 glow-magenta">{networkStats.uploadSpeedMBs} MB/s</span>
            </div>
          </div>

          <div className="font-mono text-[9px] text-slate-400 border-t border-[#2A2A36] pt-1 flex justify-between">
            <span>IP: <strong className="text-slate-200">{networkStats.localIp}</strong></span>
            <span className="text-[#00FF66] font-bold">WI-FI {networkStats.wifiSignal}%</span>
          </div>
        </div>

        {/* Right: Bandwidth Sparkline */}
        <div className="bg-[#1A1A24]/60 border border-[#2A2A36] rounded-lg p-2 flex flex-col justify-between h-full">
          <div className="font-mono text-[9px] text-slate-400 mb-1">
            REAL TIME BANDWIDTH WAVE
          </div>

          <div className="h-16 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={networkStats.history}>
                <defs>
                  <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#00F0FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="dl" stroke="#00F0FF" strokeWidth={1.5} fillOpacity={1} fill="url(#netGrad)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
