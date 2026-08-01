import React, { useRef } from 'react';
import { X, RotateCcw, Download, Upload, Eye, EyeOff, Volume2, Sun, Shield, Binary } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { ColorTheme, WeatherCity } from '../../types/hud';
import { useCyberSFX } from '../../hooks/useCyberSFX';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetLayout: () => void;
}

const ALL_WIDGET_ROSTER: { id: string; name: string }[] = [
  { id: 'clocks', name: 'Dual Mission Clocks' },
  { id: 'sys_perf', name: 'System Performance HUD' },
  { id: 'sys_processes', name: 'Top macOS System Processes' },
  { id: 'markets', name: 'Market Watch HUD' },
  { id: 'crypto', name: 'Crypto Telemetry Watch' },
  { id: 'network_speed', name: 'Network Speed & Latency HUD' },
  { id: 'github', name: 'GitHub Repos Telemetry' },
  { id: 'tech_news', name: 'Cyber & Tech News RSS Feed' },
  { id: 'terminal', name: 'macOS Shell CLI Terminal Executor' },
  { id: 'neural_ai', name: 'Matrix Neural AI Assistant' },
  { id: 'airspace_radar', name: 'World Airspace & Flight Radar' },
  { id: 'calendar', name: 'Apple EventKit Calendar Agenda' },
  { id: 'voight_kampff', name: 'Tyrell Corp Voight-Kampff Test' },
  { id: 'directives', name: 'Current Week Priority Directives' },
  { id: 'weather', name: 'Weather Meteorology Station' },
  { id: 'pomodoro', name: 'Pomodoro Focus Sprint Engine' },
  { id: 'staging', name: 'Next Week Staging & Scratchpad' },
  { id: 'spotify', name: 'Spotify Now Playing' },
  { id: 'ambient', name: 'Procedural Ambient Sound Generator' },
  { id: 'milestone', name: 'Milestone Target Countdown' },
  { id: 'launcher', name: 'Tactical Web Quick Launcher' },
  { id: 'clipboard', name: 'Quick Clipboard Stash' },
  { id: 'habits', name: '7-Day Habit Streak Tracker' },
  { id: 'stoic', name: 'Daily Stoic Briefing' },
  { id: 'horoscope', name: 'Personalized Natal Horoscope' },
  { id: 'gratitude', name: 'Daily Gratitude Journal' }
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onResetLayout }) => {
  const { settings, updateSettings, exportConfig, importConfig } = useTheme();
  const { playClickSFX, playToggleSFX } = useCyberSFX();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const toggleWidgetVisibility = (widgetId: string) => {
    playToggleSFX();
    const currentHidden = settings.hiddenWidgets || [];
    const isHidden = currentHidden.includes(widgetId);
    const nextHidden = isHidden
      ? currentHidden.filter((id) => id !== widgetId)
      : [...currentHidden, widgetId];

    updateSettings({ hiddenWidgets: nextHidden });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          importConfig(content);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#121218] border border-[#00F0FF]/40 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#2A2A36] flex items-center justify-between bg-[#1A1A24]/60">
          <div className="font-mono text-sm font-bold text-[#00F0FF] flex items-center space-x-2 uppercase">
            <Shield size={16} />
            <span>NEXUS OS HUD CONTROL PANEL</span>
          </div>
          <button onClick={() => { playClickSFX(); onClose(); }} className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#2A2A36]">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 font-mono text-xs">
          {/* Section 1: Color Themes (5 Palettes) */}
          <div>
            <div className="text-slate-300 font-bold mb-2 uppercase text-[10px] tracking-wider text-[#00F0FF]">
              VISUAL COLOR THEMES & PALETTES
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'neon', name: 'NIGHT CITY NEON', color: 'border-[#00F0FF] text-[#00F0FF]' },
                { id: 'ember', name: 'EMBER CYBER', color: 'border-[#FF6B00] text-[#FF6B00]' },
                { id: 'matrix', name: 'MATRIX CORE', color: 'border-[#00FF66] text-[#00FF66]' },
                { id: 'amber', name: 'VT100 PHOSPHOR AMBER', color: 'border-[#FFB000] text-[#FFB000]' },
                { id: 'chiba', name: 'DEAD CHANNEL TV', color: 'border-[#00F0FF] text-[#38BDF8]' },
                { id: 'voight-kampff', name: 'VOIGHT-KAMPFF AMBER', color: 'border-[#FF9900] text-[#FF9900]' }
              ].map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => { playClickSFX(); updateSettings({ colorTheme: theme.id as ColorTheme }); }}
                  className={`p-2.5 rounded-xl border text-center font-bold transition-all text-[11px] ${
                    settings.colorTheme === theme.id
                      ? `${theme.color} bg-[#1A1A24] shadow-[0_0_15px_rgba(0,240,255,0.2)]`
                      : 'border-[#2A2A36] text-slate-400 hover:text-white'
                  }`}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Hacker VFX Toggles */}
          <div>
            <div className="text-slate-300 font-bold mb-2 uppercase text-[10px] tracking-wider text-[#00FF66] flex items-center space-x-1">
              <Binary size={12} />
              <span>CYBERPUNK MATRIX ANIMATION EFFECTS</span>
            </div>
            <div className="flex items-center space-x-3 bg-[#1A1A24]/60 border border-[#2A2A36] rounded-xl p-3">
              <button
                onClick={() => { playToggleSFX(); updateSettings({ matrixRainEnabled: !settings.matrixRainEnabled }); }}
                className={`px-3 py-1.5 rounded-lg font-bold border flex items-center space-x-2 transition-all ${
                  settings.matrixRainEnabled
                    ? 'bg-emerald-950/80 border-emerald-500/50 text-[#00FF66]'
                    : 'bg-[#121218] border-[#2A2A36] text-slate-500'
                }`}
              >
                <Binary size={14} />
                <span>MATRIX DIGITAL RAIN: {settings.matrixRainEnabled ? 'ACTIVE' : 'DISABLED'}</span>
              </button>
            </div>
          </div>

          {/* Section 3: Weather Station Location */}
          <div>
            <div className="text-slate-300 font-bold mb-2 uppercase text-[10px] tracking-wider text-[#FF6B00] flex items-center space-x-1">
              <Sun size={12} />
              <span>WEATHER METEOROLOGY LOCATION</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[
                { id: 'phoenix', label: 'PHOENIX' },
                { id: 'nyc', label: 'NEW YORK' },
                { id: 'madrid', label: 'MADRID' },
                { id: 'tokyo', label: 'TOKYO' },
                { id: 'london', label: 'LONDON' }
              ].map((city) => (
                <button
                  key={city.id}
                  onClick={() => { playClickSFX(); updateSettings({ weatherCity: city.id as WeatherCity }); }}
                  className={`p-2 rounded-lg border text-center font-bold transition-all ${
                    settings.weatherCity === city.id
                      ? 'bg-amber-950/80 border-[#FF6B00] text-[#FF6B00]'
                      : 'bg-[#1A1A24]/60 border-[#2A2A36] text-slate-400 hover:text-white'
                  }`}
                >
                  {city.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Widget Visibility Manager */}
          <div>
            <div className="text-slate-300 font-bold mb-2 uppercase text-[10px] tracking-wider text-[#FF007F] flex items-center justify-between">
              <span>WIDGET VISIBILITY MANAGER ({ALL_WIDGET_ROSTER.length - (settings.hiddenWidgets || []).length} / {ALL_WIDGET_ROSTER.length} ACTIVE)</span>
              <span className="text-slate-500 font-normal">CLICK TO TOGGLE SHOW/HIDE</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1 bg-[#1A1A24]/40 p-2.5 rounded-xl border border-[#2A2A36]">
              {ALL_WIDGET_ROSTER.map((w) => {
                const isHidden = (settings.hiddenWidgets || []).includes(w.id);
                return (
                  <button
                    key={w.id}
                    onClick={() => toggleWidgetVisibility(w.id)}
                    className={`p-2 rounded-lg border text-left flex items-center justify-between transition-all ${
                      isHidden
                        ? 'bg-[#121218] border-[#2A2A36] text-slate-500 opacity-60'
                        : 'bg-[#1A1A24] border-cyan-500/40 text-slate-100 font-semibold'
                    }`}
                  >
                    <span className="truncate pr-1 text-[11px]">{w.name}</span>
                    {isHidden ? <EyeOff size={13} className="text-slate-600 shrink-0" /> : <Eye size={13} className="text-[#00F0FF] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Data Import / Export Backup */}
          <div>
            <div className="text-slate-300 font-bold mb-2 uppercase text-[10px] tracking-wider text-[#00FF66]">
              LAYOUT & DASHBOARD DATA BACKUP
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={exportConfig}
                className="flex-1 p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-[#00FF66] font-bold hover:bg-emerald-900/80 transition-all flex items-center justify-center space-x-2"
              >
                <Download size={14} />
                <span>EXPORT DASHBOARD CONFIG (.JSON)</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-[#00F0FF] font-bold hover:bg-cyan-900/80 transition-all flex items-center justify-center space-x-2"
              >
                <Upload size={14} />
                <span>IMPORT DASHBOARD CONFIG</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#2A2A36] bg-[#1A1A24]/60 flex items-center justify-between font-mono text-xs">
          <button
            onClick={() => { playToggleSFX(); onResetLayout(); }}
            className="px-3 py-1.5 rounded-lg border border-rose-500/40 text-rose-400 hover:bg-rose-950/80 font-bold flex items-center space-x-1.5"
          >
            <RotateCcw size={13} />
            <span>RESET DEFAULT GRID</span>
          </button>

          <button
            onClick={() => { playClickSFX(); onClose(); }}
            className="px-4 py-1.5 rounded-lg bg-[#00F0FF] text-black font-extrabold hover:scale-105 transition-transform"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};
