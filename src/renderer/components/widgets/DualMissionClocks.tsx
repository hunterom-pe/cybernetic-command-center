import React, { useState, useEffect } from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Clock, Globe } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const DualMissionClocks: React.FC = () => {
  const { settings, colors } = useTheme();
  const [phxTime, setPhxTime] = useState<Date>(new Date());
  const [madridTime, setMadridTime] = useState<Date>(new Date());

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setPhxTime(now);

      // Calculate Madrid time (UTC+2 CEST approx +9 hours from Phoenix MST UTC-7)
      const madridOffsetMs = 2 * 60 * 60 * 1000;
      const utcMs = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
      const madrid = new Date(utcMs + madridOffsetMs);
      setMadridTime(madrid);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format specifically in 12-hour format with AM/PM for Phoenix Clock
  const format12HourTime = (date: Date) => {
    const hours = date.getHours();
    const mins = String(date.getMinutes()).padStart(2, '0');
    const secs = String(date.getSeconds()).padStart(2, '0');
    const h12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${String(h12).padStart(2, '0')}:${mins}:${secs} ${ampm}`;
  };

  const formatMadridTime = (date: Date) => {
    if (settings.use24HourClock) {
      const hours = String(date.getHours()).padStart(2, '0');
      const mins = String(date.getMinutes()).padStart(2, '0');
      const secs = String(date.getSeconds()).padStart(2, '0');
      return `${hours}:${mins}:${secs}`;
    }
    return format12HourTime(date);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    }).toUpperCase();
  };

  return (
    <GlassCard>
      <WidgetHeader icon={Clock} prefix="MISSION CLOCKS" title="GLOBAL TELEMETRY" badge="UTC-7 / UTC+2" />

      <div className="grid grid-cols-2 gap-3 h-full items-center">
        {/* Clock 1: Phoenix, AZ (12-hour format) */}
        <div className="bg-[#1A1A24]/60 border border-[#2A2A36] rounded-lg p-2.5 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
            <span className="font-bold text-[#00F0FF]">PHOENIX, AZ // MST</span>
            <span className="px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 font-bold">12HR LOCAL</span>
          </div>

          <div className="my-1.5">
            <div className="font-mono text-lg sm:text-xl font-extrabold tracking-wider text-slate-100 glow-cyan">
              {format12HourTime(phxTime)}
            </div>
            <div className="font-mono text-[10px] text-slate-400 mt-0.5">
              {formatDate(phxTime)}
            </div>
          </div>

          <div className="flex items-center space-x-1 font-mono text-[9px] text-slate-500">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-pulse" />
            <span>PRIMARY MISSION ANCHOR</span>
          </div>
        </div>

        {/* Clock 2: Madrid, Spain */}
        <div className="bg-[#1A1A24]/60 border border-[#2A2A36] rounded-lg p-2.5 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
            <span className="font-bold text-[#FF007F]">MADRID, SPAIN // CEST</span>
            <span className="px-1.5 py-0.2 rounded bg-pink-950/80 text-pink-400 border border-pink-500/30 font-bold">+9HRS</span>
          </div>

          <div className="my-1.5">
            <div className="font-mono text-lg sm:text-xl font-extrabold tracking-wider text-slate-100 glow-magenta">
              {formatMadridTime(madridTime)}
            </div>
            <div className="font-mono text-[10px] text-slate-400 mt-0.5">
              {formatDate(madridTime)}
            </div>
          </div>

          <div className="flex items-center space-x-1 font-mono text-[9px] text-slate-500">
            <Globe size={10} className="text-pink-400" />
            <span>EU OPERATIONS NODE</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
