import React, { useState, useEffect } from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Heart, CheckCircle2 } from 'lucide-react';

export const GratitudeJournal: React.FC = () => {
  const [gratitude, setGratitude] = useState<[string, string, string]>(() => {
    const saved = localStorage.getItem('hud_aquarius_gratitude');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      'Focus clarity and steady momentum on Command Center OS',
      'Peaceful morning ambient rainfall and clean workspace',
      'Unbroken focus on critical engineering directives'
    ];
  });

  const [savedStatus, setSavedStatus] = useState(false);

  useEffect(() => {
    localStorage.setItem('hud_aquarius_gratitude', JSON.stringify(gratitude));
    setSavedStatus(true);
    const timeout = setTimeout(() => setSavedStatus(false), 1500);
    return () => clearTimeout(timeout);
  }, [gratitude]);

  const updateLine = (index: number, val: string) => {
    const next = [...gratitude] as [string, string, string];
    next[index] = val;
    setGratitude(next);
  };

  return (
    <GlassCard>
      <WidgetHeader
        icon={Heart}
        prefix="GRATITUDE"
        title="DAILY REFLECTION LOG"
        badge={savedStatus ? 'SAVED' : '3 ENTRIES'}
        badgeColor="green"
      />

      <div className="flex flex-col justify-between h-full space-y-2 p-1">
        <div className="space-y-2">
          {([0, 1, 2] as const).map((idx) => (
            <div key={idx} className="bg-[#1A1A24]/60 border border-[#2A2A36] rounded-lg p-2 flex items-center space-x-2.5 hover:border-[#00FF66]/40 transition-colors">
              <span className="font-mono text-xs text-[#00FF66] font-extrabold shrink-0 w-4 text-right">0{idx + 1}.</span>
              <input
                type="text"
                value={gratitude[idx]}
                onChange={(e) => updateLine(idx, e.target.value)}
                placeholder={`Record gratitude entry #${idx + 1}...`}
                className="w-full bg-transparent font-sans text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 pt-1 border-t border-[#2A2A36]">
          <span className="flex items-center space-x-1">
            <CheckCircle2 size={11} className="text-[#00FF66]" />
            <span>AUTO SAVED TO LOCAL STORAGE</span>
          </span>
          <span>DAILY MINDSET STACK</span>
        </div>
      </div>
    </GlassCard>
  );
};
