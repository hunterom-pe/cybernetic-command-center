import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Cpu, HardDrive, BatteryCharging, Zap } from 'lucide-react';
import { useSystemTelemetry } from '../../hooks/useSystemTelemetry';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

export const SystemPerformanceHUD: React.FC = () => {
  const telemetry = useSystemTelemetry(2000);

  return (
    <GlassCard>
      <WidgetHeader icon={Cpu} prefix="SYS PERF" title="HARDWARE TELEMETRY" badge={`${telemetry.cpuCores} CORES`} />

      <div className="grid grid-cols-2 gap-3 h-full items-center">
        {/* CPU Gauge & Curve */}
        <div className="bg-[#1A1A24]/60 border border-[#2A2A36] rounded-lg p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
            <span className="flex items-center space-x-1">
              <Cpu size={12} className="text-[#00F0FF]" />
              <span>CPU LOAD</span>
            </span>
            <span className="font-bold text-[#00F0FF]">{telemetry.cpuLoad}%</span>
          </div>

          {/* Sparkline */}
          <div className="h-9 my-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetry.historyCpu}>
                <defs>
                  <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#00F0FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="cpu" stroke="#00F0FF" strokeWidth={1.5} fillOpacity={1} fill="url(#cpuGrad)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full bg-[#121218] rounded-full h-1.5 overflow-hidden border border-[#2A2A36]">
            <div className="bg-[#00F0FF] h-full transition-all duration-500" style={{ width: `${telemetry.cpuLoad}%` }} />
          </div>
        </div>

        {/* RAM Usage & Curve */}
        <div className="bg-[#1A1A24]/60 border border-[#2A2A36] rounded-lg p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
            <span className="flex items-center space-x-1">
              <Zap size={12} className="text-[#FF007F]" />
              <span>RAM USAGE</span>
            </span>
            <span className="font-bold text-[#FF007F]">
              {telemetry.ramUsedGB} / {telemetry.ramTotalGB} GB
            </span>
          </div>

          {/* Sparkline */}
          <div className="h-9 my-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetry.historyRam}>
                <defs>
                  <linearGradient id="ramGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF007F" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#FF007F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="ram" stroke="#FF007F" strokeWidth={1.5} fillOpacity={1} fill="url(#ramGrad)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full bg-[#121218] rounded-full h-1.5 overflow-hidden border border-[#2A2A36]">
            <div className="bg-[#FF007F] h-full transition-all duration-500" style={{ width: `${telemetry.ramUsagePercent}%` }} />
          </div>
        </div>

        {/* Storage Stats */}
        <div className="bg-[#1A1A24]/60 border border-[#2A2A36] rounded-lg p-2 flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-2">
            <HardDrive size={14} className="text-[#FF6B00]" />
            <div className="font-mono text-[10px]">
              <div className="text-slate-400">STORAGE</div>
              <div className="text-slate-200 font-bold">{telemetry.storageUsedGB} GB / {telemetry.storageTotalGB} GB</div>
            </div>
          </div>
          <div className="font-mono text-xs font-bold text-[#FF6B00]">{telemetry.storageUsedPercent}%</div>
        </div>

        {/* Battery Telemetry */}
        <div className="bg-[#1A1A24]/60 border border-[#2A2A36] rounded-lg p-2 flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-2">
            <BatteryCharging size={14} className="text-[#00FF66]" />
            <div className="font-mono text-[10px]">
              <div className="text-slate-400">BATTERY</div>
              <div className="text-slate-200 font-bold">{telemetry.isCharging ? 'CHARGING' : 'DISCHARGING'}</div>
            </div>
          </div>
          <div className="font-mono text-xs font-bold text-[#00FF66]">{telemetry.batteryPercent}%</div>
        </div>
      </div>
    </GlassCard>
  );
};
