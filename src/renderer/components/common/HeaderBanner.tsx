import React from 'react';
import { Settings, Command, Lock, Unlock, Volume2, VolumeX, Calendar, Binary, Eye } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useCyberSFX } from '../../hooks/useCyberSFX';

interface HeaderBannerProps {
  onOpenSettings: () => void;
  onOpenCommandBar: () => void;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({ onOpenSettings, onOpenCommandBar }) => {
  const { settings, updateSettings, colors } = useTheme();
  const { playToggleSFX } = useCyberSFX();

  const toggleGridLock = () => {
    playToggleSFX();
    updateSettings({ isGridLocked: !settings.isGridLocked });
  };

  const toggleSFX = () => {
    updateSettings({ sfxEnabled: !settings.sfxEnabled });
  };

  const toggleMatrixRain = () => {
    playToggleSFX();
    updateSettings({ matrixRainEnabled: !settings.matrixRainEnabled });
  };

  return (
    <header className="relative w-full h-[480px] select-none">
      {/* Header Content */}
      <div className="relative z-10 flex flex-col justify-between h-full p-4 sm:p-6 max-w-[1920px] mx-auto pb-10">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between">
          {/* App Badge, Date & Tyrell Replicant Telemetry */}
          <div className="flex items-center space-x-3">
            <div className="font-mono text-xs font-bold bg-[#121218]/90 border px-3 py-1 rounded shadow-lg flex items-center space-x-2 backdrop-blur-md" style={{ color: colors.primary, borderColor: `${colors.primary}60` }}>
              <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse" />
              <span>NEXUS OS v1.0</span>
            </div>

            {/* Live Today's Date Badge */}
            <div className="font-mono text-xs font-bold text-[#FF007F] bg-[#121218]/90 border border-[#FF007F]/40 px-3 py-1 rounded shadow-lg flex items-center space-x-1.5 backdrop-blur-md">
              <Calendar size={12} className="text-[#FF007F]" />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()}</span>
            </div>

            {/* Tyrell Corp Replicant Serial Registration Badge */}
            <div className="hidden lg:flex font-mono text-[10px] text-amber-400 font-bold bg-[#121218]/90 border border-[#FF9900]/40 px-2.5 py-1 rounded shadow-lg items-center space-x-1.5 backdrop-blur-md">
              <Eye size={12} className="text-[#FF9900]" />
              <span>TYRELL CORP // MODEL: NEXUS-6 // REPLICANT ID: N6MAA10816</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Matrix Rain Toggle Button */}
            <button
              onClick={toggleMatrixRain}
              className={`p-2 rounded-lg border transition-all backdrop-blur-md ${
                settings.matrixRainEnabled
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-[#00FF66]'
                  : 'bg-[#1A1A24]/80 border-[#2A2A36] text-slate-500'
              }`}
              title={settings.matrixRainEnabled ? 'Disable Matrix Rain Effect' : 'Enable Matrix Digital Rain Effect'}
            >
              <Binary size={15} />
            </button>

            {/* Grid Lock Toggle Button */}
            <button
              onClick={toggleGridLock}
              className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md backdrop-blur-md ${
                settings.isGridLocked
                  ? 'bg-rose-950/80 border-rose-500/50 text-rose-400'
                  : 'bg-emerald-950/80 border-emerald-500/50 text-[#00FF66]'
              }`}
              title={settings.isGridLocked ? 'Unlock Grid Layout' : 'Lock Grid Layout (Prevent Dragging)'}
            >
              {settings.isGridLocked ? <Lock size={13} /> : <Unlock size={13} />}
              <span>{settings.isGridLocked ? 'LOCKED' : 'UNLOCKED'}</span>
            </button>

            {/* SFX Enable Button */}
            <button
              onClick={toggleSFX}
              className={`p-2 rounded-lg border transition-all backdrop-blur-md ${
                settings.sfxEnabled
                  ? 'bg-cyan-950/80 border-cyan-500/40 text-[#00F0FF]'
                  : 'bg-[#1A1A24]/80 border-[#2A2A36] text-slate-500'
              }`}
              title={settings.sfxEnabled ? 'Mute Sound Effects' : 'Enable Cyber SFX Audio'}
            >
              {settings.sfxEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>

            {/* Cmd + K Command Palette Launcher */}
            <button
              onClick={onOpenCommandBar}
              className="px-3 py-1.5 rounded-lg bg-[#121218]/90 border border-[#00F0FF]/40 text-slate-200 hover:text-[#00F0FF] hover:border-[#00F0FF] font-mono text-xs font-bold transition-all shadow-lg flex items-center space-x-1.5 backdrop-blur-md"
            >
              <Command size={13} />
              <span>CMD + K</span>
            </button>

            {/* Settings Modal Launcher */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg bg-[#121218]/90 border border-[#2A2A36] text-slate-300 hover:text-white hover:border-slate-400 transition-all shadow-lg backdrop-blur-md"
              title="HUD Settings & Customization"
            >
              <Settings size={16} />
            </button>
          </div>
        </div>

        {/* Bottom Banner Title, Subtitle & Off-World Adverts Ticker */}
        <div className="space-y-2 mt-auto">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-sans text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] glitch-hover cursor-pointer">
            NEXUS <span style={{ color: colors.primary }}>OS</span>
          </h1>
          <p className="font-mono text-xs sm:text-sm text-slate-300 flex items-center space-x-2 drop-shadow-md">
            <span className="text-[#FF007F] font-bold">CYBERDECK MATRIX OPERATING SYSTEM</span>
            <span>•</span>
            <span>26 HUD TELEMETRY NODES ACTIVE</span>
          </p>

          {/* Off-World Colony Advertising Ticker Banner */}
          <div className="bg-[#121218]/90 border border-[#FF9900]/40 rounded-lg px-2.5 py-1 font-mono text-[10px] text-amber-300 backdrop-blur-md flex items-center space-x-2 overflow-hidden max-w-2xl">
            <span className="bg-[#FF9900] text-black font-extrabold px-1.5 py-0.2 rounded text-[8px] shrink-0 uppercase">OFF-WORLD ADVERTS</span>
            <div className="truncate italic">
              "A new life awaits you in the Off-World colonies! A chance to begin again in a golden land of opportunity..."
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
