import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ShieldAlert, Clock, Calendar, Activity, Radio, Cpu, Volume2 } from 'lucide-react';
import { useCyberSFX } from '../../hooks/useCyberSFX';

interface CyberScreensaverProps {
  isActive: boolean;
  onWake: () => void;
}

export const CyberScreensaver: React.FC<CyberScreensaverProps> = ({ isActive, onWake }) => {
  const { colors } = useTheme();
  const { playClickSFX } = useCyberSFX();
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [tickerIndex, setTickerIndex] = useState(0);

  const diagnosticMessages = [
    'MU/TH/UR 6000 STANDBY PROTOCOL ACTIVE // ALL NODES OPERATIONAL',
    'USCSS NOSTROMO M314 MOTION TRACKER PATROL // NO IMMINENT ORGANISM THREAT',
    'TYRELL CORP ONO-SENDAI CYBERDECK // MEMORY: 64TB MATRIX RAM // CPU: 12%',
    'NEXUS OS MATRIX TELEMETRY // PRESS ANY KEY OR MOVE MOUSE TO RESUME INTERFACE'
  ];

  // Clock Ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Diagnostic Ticker Rotation
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % diagnosticMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isActive]);

  // Wake Listener on Mouse Movement or Keypress
  useEffect(() => {
    if (!isActive) return;

    const handleUserActivity = () => {
      onWake();
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
    };
  }, [isActive, onWake]);

  if (!isActive) return null;

  return (
    <div
      onClick={() => { playClickSFX(); onWake(); }}
      className="fixed inset-0 z-50 flex flex-col justify-between p-8 sm:p-12 bg-black/90 backdrop-blur-xl animate-fade-in select-none cursor-pointer overflow-hidden font-mono"
    >
      {/* Background Neon Glow Pulse */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.15)_0%,transparent_70%)] animate-pulse" />

      {/* Top Telemetry Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-[#2A2A36] pb-4">
        <div className="flex items-center space-x-3 text-xs font-bold" style={{ color: colors.primary }}>
          <span className="w-2.5 h-2.5 rounded-full bg-[#00FF66] animate-pulse" />
          <span>NEXUS OS // CYBERDECK STANDBY MODE</span>
        </div>

        <div className="font-mono text-xs text-slate-400 flex items-center space-x-2">
          <span>MU/TH/UR 6000 CORE: <strong className="text-[#00FF66]">IDLE</strong></span>
        </div>
      </div>

      {/* Center Gigantic Clock & Cyberpunk Telemetry Showcase */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-6 my-auto text-center">
        {/* Date Badge */}
        <div className="font-mono text-sm sm:text-base font-bold text-[#FF007F] bg-[#121218] border border-[#FF007F]/40 px-4 py-1.5 rounded-xl shadow-lg flex items-center space-x-2">
          <Calendar size={16} />
          <span>{dateStr}</span>
        </div>

        {/* Huge Digital Clock */}
        <div className="text-6xl sm:text-9xl font-extrabold tracking-tight font-sans text-white drop-shadow-[0_0_30px_rgba(0,240,255,0.5)] glitch-text">
          {timeStr}
        </div>

        {/* Ambient Prompt */}
        <div className="font-mono text-xs sm:text-sm text-slate-400 animate-pulse tracking-wider">
          [ MOVE MOUSE OR PRESS ANY KEY TO RESUME CYBERDECK ]
        </div>
      </div>

      {/* Bottom Diagnostic Rolling Ticker */}
      <div className="relative z-10 bg-[#121218]/90 border border-[#2A2A36] rounded-xl p-3 flex items-center justify-between text-xs text-amber-300">
        <div className="flex items-center space-x-2 truncate">
          <ShieldAlert size={14} className="text-amber-400 shrink-0" />
          <span className="truncate italic">{diagnosticMessages[tickerIndex]}</span>
        </div>
        <span className="text-slate-500 text-[10px] shrink-0 ml-4 font-bold">WAKE: MOUSE/KEY</span>
      </div>
    </div>
  );
};
