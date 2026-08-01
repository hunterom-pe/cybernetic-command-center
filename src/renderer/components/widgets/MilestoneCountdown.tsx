import React, { useState, useEffect } from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Flag, Edit2, Calendar } from 'lucide-react';
import { MilestoneData } from '../../types/hud';

export const MilestoneCountdown: React.FC = () => {
  const [milestone, setMilestone] = useState<MilestoneData>(() => {
    const saved = localStorage.getItem('hud_milestone_data');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    // Default: Q4 Quantum Platform Launch in 90 days
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 90);
    return {
      title: 'QUANTUM OS v3.0 LAUNCH',
      targetDate: defaultDate.toISOString()
    };
  });

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(milestone.title);
  const [editDate, setEditDate] = useState(milestone.targetDate.split('T')[0]);

  useEffect(() => {
    localStorage.setItem('hud_milestone_data', JSON.stringify(milestone));

    const calculate = () => {
      const now = new Date().getTime();
      const target = new Date(milestone.targetDate).getTime();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, mins, secs });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [milestone]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMilestone({
      title: editTitle.toUpperCase(),
      targetDate: new Date(editDate).toISOString()
    });
    setIsEditing(false);
  };

  return (
    <GlassCard>
      <WidgetHeader
        icon={Flag}
        prefix="MILESTONE"
        title="TARGET COUNTDOWN"
        badge="CRITICAL PATH"
        badgeColor="orange"
        actions={
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#1A1A24] transition-colors"
          >
            <Edit2 size={12} />
          </button>
        }
      />

      <div className="flex flex-col justify-between h-full space-y-1">
        <div className="font-mono text-xs font-bold text-[#FF6B00] uppercase tracking-wider truncate">
          {milestone.title}
        </div>

        {/* Live Ticker Grid */}
        <div className="grid grid-cols-4 gap-1.5 text-center my-1">
          <div className="bg-[#1A1A24]/60 border border-[#2A2A36] rounded p-1.5">
            <div className="font-mono text-lg sm:text-xl font-extrabold text-slate-100 glow-orange">{timeLeft.days}</div>
            <div className="font-mono text-[8px] text-slate-400">DAYS</div>
          </div>
          <div className="bg-[#1A1A24]/60 border border-[#2A2A36] rounded p-1.5">
            <div className="font-mono text-lg sm:text-xl font-extrabold text-slate-100 glow-orange">{timeLeft.hours}</div>
            <div className="font-mono text-[8px] text-slate-400">HRS</div>
          </div>
          <div className="bg-[#1A1A24]/60 border border-[#2A2A36] rounded p-1.5">
            <div className="font-mono text-lg sm:text-xl font-extrabold text-slate-100 glow-orange">{timeLeft.mins}</div>
            <div className="font-mono text-[8px] text-slate-400">MINS</div>
          </div>
          <div className="bg-[#1A1A24]/60 border border-[#2A2A36] rounded p-1.5">
            <div className="font-mono text-lg sm:text-xl font-extrabold text-slate-100 glow-orange">{timeLeft.secs}</div>
            <div className="font-mono text-[8px] text-slate-400">SECS</div>
          </div>
        </div>

        {/* Edit Dialog Modal */}
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <form onSubmit={handleSave} className="bg-[#121218] border border-[#FF6B00]/40 rounded-xl p-4 w-80 space-y-3 shadow-2xl">
              <div className="font-mono text-xs font-bold text-[#FF6B00]">EDIT TARGET MILESTONE</div>
              <div>
                <label className="font-mono text-[10px] text-slate-400 block mb-1">MILESTONE TITLE</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-[#1A1A24] border border-[#2A2A36] rounded p-1.5 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] text-slate-400 block mb-1">TARGET DATE</label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full bg-[#1A1A24] border border-[#2A2A36] rounded p-1.5 text-xs text-white focus:outline-none"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsEditing(false)} className="px-3 py-1 text-xs text-slate-400">
                  CANCEL
                </button>
                <button type="submit" className="px-3 py-1 bg-[#FF6B00] text-black font-bold text-xs rounded">
                  SAVE
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </GlassCard>
  );
};
