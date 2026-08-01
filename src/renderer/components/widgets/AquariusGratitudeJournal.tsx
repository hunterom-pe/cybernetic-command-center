import React, { useState, useEffect } from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Sparkles, Heart } from 'lucide-react';

export const AquariusGratitudeJournal: React.FC = () => {
  const [gratitude, setGratitude] = useState<[string, string, string]>(() => {
    const saved = localStorage.getItem('hud_aquarius_gratitude');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      'Focus clarity & progress on Command Center OS',
      'Peaceful morning ambient rainfall',
      'Unbroken momentum on critical directives'
    ];
  });

  useEffect(() => {
    localStorage.setItem('hud_aquarius_gratitude', JSON.stringify(gratitude));
  }, [gratitude]);

  const updateLine = (index: number, val: string) => {
    const next = [...gratitude] as [string, string, string];
    next[index] = val;
    setGratitude(next);
  };

  return (
    <GlassCard>
      <WidgetHeader icon={Sparkles} prefix="ASTROLOGY" title="AQUARIUS & GRATITUDE LOG" badge="ZODIAC // ♒" badgeColor="magenta" />

      <div className="grid grid-cols-12 gap-3 h-full overflow-hidden">
        {/* Left: Aquarius Horoscope Readout */}
        <div className="col-span-5 bg-[#1A1A24]/60 border border-[#2A2A36] rounded-lg p-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-1 font-mono text-[10px] font-bold text-[#FF007F]">
              <Sparkles size={11} />
              <span>AQUARIUS // ♒</span>
            </div>
            <div className="font-sans text-[11px] text-slate-300 mt-1 leading-snug">
              Today brings synthetic harmony between analytical foresight and creative energy. Trust intuitive leaps.
            </div>
          </div>
          <div className="font-mono text-[9px] text-slate-500 border-t border-[#2A2A36] pt-1">
            LUCKY ELEMENT: <span className="text-[#00F0FF]">CYAN FREQUENCY</span>
          </div>
        </div>

        {/* Right: 3-Line Gratitude Journal */}
        <div className="col-span-7 flex flex-col justify-between space-y-1">
          <div className="font-mono text-[10px] font-bold text-[#00FF66] uppercase flex items-center space-x-1">
            <Heart size={11} className="text-[#00FF66]" />
            <span>DAILY GRATITUDE LOG</span>
          </div>

          <div className="space-y-1">
            {([0, 1, 2] as const).map((idx) => (
              <div key={idx} className="flex items-center space-x-1.5">
                <span className="font-mono text-[10px] text-cyan-400 font-bold shrink-0">{idx + 1}.</span>
                <input
                  type="text"
                  value={gratitude[idx]}
                  onChange={(e) => updateLine(idx, e.target.value)}
                  placeholder={`Gratitude item #${idx + 1}...`}
                  className="w-full bg-[#1A1A24]/60 border border-[#2A2A36] rounded px-2 py-1 font-sans text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00FF66]/50"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
