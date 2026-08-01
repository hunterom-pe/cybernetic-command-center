import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Sparkles, Compass, Moon, Sun, Shield } from 'lucide-react';

export const AquariusHoroscope: React.FC = () => {
  return (
    <GlassCard>
      <WidgetHeader
        icon={Sparkles}
        prefix="ASTROLOGY"
        title="NATAL CHART TELEMETRY // NYC 1989"
        badge="FEB 08 04:00 AM"
        badgeColor="magenta"
      />

      <div className="flex flex-col justify-between h-full space-y-2 p-1">
        {/* Natal Chart Triple Placement Header */}
        <div className="grid grid-cols-3 gap-1.5 text-center">
          <div className="bg-[#1A1A24]/70 border border-[#2A2A36] rounded p-1.5 flex flex-col items-center justify-between">
            <div className="flex items-center space-x-1 font-mono text-[9px] text-[#00F0FF] font-bold">
              <Sun size={10} />
              <span>SUN ♒</span>
            </div>
            <div className="font-mono text-[11px] font-extrabold text-slate-100 mt-0.5">AQUARIUS</div>
            <div className="font-mono text-[8px] text-slate-400">19° AIR</div>
          </div>

          <div className="bg-[#1A1A24]/70 border border-[#2A2A36] rounded p-1.5 flex flex-col items-center justify-between">
            <div className="flex items-center space-x-1 font-mono text-[9px] text-[#FF007F] font-bold">
              <Shield size={10} />
              <span>RISING ♑</span>
            </div>
            <div className="font-mono text-[11px] font-extrabold text-slate-100 mt-0.5">CAPRICORN</div>
            <div className="font-mono text-[8px] text-slate-400">ASC 22°</div>
          </div>

          <div className="bg-[#1A1A24]/70 border border-[#2A2A36] rounded p-1.5 flex flex-col items-center justify-between">
            <div className="flex items-center space-x-1 font-mono text-[9px] text-[#00FF66] font-bold">
              <Moon size={10} />
              <span>MOON ♓</span>
            </div>
            <div className="font-mono text-[11px] font-extrabold text-slate-100 mt-0.5">PISCES</div>
            <div className="font-mono text-[8px] text-slate-400">12° WATER</div>
          </div>
        </div>

        {/* Tailored Transit Forecast Readout */}
        <div className="bg-[#1A1A24]/60 border border-[#2A2A36] rounded-lg p-2.5 space-y-1">
          <div className="flex items-center justify-between font-mono text-[9px]">
            <span className="font-bold text-[#00F0FF]">PERSONAL NATAL TRANSIT READOUT</span>
            <span className="text-slate-400">NYC // 40.7128° N</span>
          </div>

          <p className="font-sans text-[11px] text-slate-200 leading-snug">
            Aquarius Sun paired with Capricorn Rising endows you with visionary genius backed by relentless tactical execution. Pisces Moon deepens intuitive pattern recognition.
          </p>
        </div>

        {/* Planetary Nodes */}
        <div className="grid grid-cols-2 gap-1.5 font-mono text-[9px]">
          <div className="bg-[#1A1A24]/40 border border-[#2A2A36] rounded p-1.5 flex items-center justify-between">
            <span className="text-slate-500">RULERS:</span>
            <span className="text-cyan-400 font-bold">URANUS & SATURN</span>
          </div>
          <div className="bg-[#1A1A24]/40 border border-[#2A2A36] rounded p-1.5 flex items-center justify-between">
            <span className="text-slate-500">ORIGIN:</span>
            <span className="text-pink-400 font-bold">NEW YORK CITY</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
