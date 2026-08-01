import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Waves, CloudRain, Radio, Keyboard, Cpu, Building2, Volume2 } from 'lucide-react';
import { useAmbientAudio, AmbientSoundType } from '../../hooks/useAmbientAudio';

export const AmbientSoundGenerator: React.FC = () => {
  const { activeSounds, toggleSound, volume, setVolume } = useAmbientAudio();

  const sounds: { id: AmbientSoundType; label: string; icon: any; color: string }[] = [
    { id: 'rain', label: 'CYBER RAIN', icon: CloudRain, color: '#00F0FF' },
    { id: 'synth', label: 'SYNTH HUM', icon: Waves, color: '#FF007F' },
    { id: 'cockpit', label: 'COCKPIT NOISE', icon: Radio, color: '#FF6B00' },
    { id: 'keyboard', label: 'MECH KEYBOARD', icon: Keyboard, color: '#00FF66' },
    { id: 'computer', label: 'CYBER MAINFRAME', icon: Cpu, color: '#38BDF8' },
    { id: 'city', label: 'CYBERPUNK CITY', icon: Building2, color: '#A855F7' }
  ];

  return (
    <GlassCard>
      <WidgetHeader icon={Waves} prefix="AMBIENT SYNTH" title="PROCEDURAL SOUND GENERATOR" badge="6 SYNTH ENGINE NODES" />

      <div className="flex flex-col justify-between h-full space-y-2">
        <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-[140px]">
          {sounds.map((s) => {
            const isActive = activeSounds[s.id];
            const Icon = s.icon;

            return (
              <button
                key={s.id}
                onClick={() => toggleSound(s.id)}
                className={`p-2 rounded-lg border text-left flex flex-col justify-between transition-all duration-300 ${
                  isActive
                    ? 'bg-[#1A1A24] border-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                    : 'bg-[#1A1A24]/40 border-[#2A2A36] hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon size={14} style={{ color: isActive ? s.color : '#8E8EA0' }} />
                  <span className={`font-mono text-[8px] font-bold px-1.5 py-0.2 rounded border ${isActive ? 'bg-cyan-950 text-[#00F0FF] border-[#00F0FF]/40' : 'text-slate-500 border-[#2A2A36]'}`}>
                    {isActive ? 'ON' : 'OFF'}
                  </span>
                </div>

                <div className="font-mono text-[10px] font-bold text-slate-200 mt-1.5 truncate">
                  {s.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Master Ambient Volume */}
        <div className="bg-[#1A1A24]/60 border border-[#2A2A36] rounded-lg p-2 flex items-center space-x-2">
          <Volume2 size={14} className="text-cyan-400 shrink-0" />
          <span className="font-mono text-[10px] text-slate-400 shrink-0">AMBIENT GAIN:</span>
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full accent-[#00F0FF] h-1 bg-[#121218] rounded cursor-pointer"
          />
          <span className="font-mono text-[10px] text-cyan-400 font-bold w-7 text-right">{volume}%</span>
        </div>
      </div>
    </GlassCard>
  );
};
