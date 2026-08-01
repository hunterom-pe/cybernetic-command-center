import React, { useState, useEffect } from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Activity, Dumbbell, Droplets, BookOpen, Check } from 'lucide-react';
import { HabitItem } from '../../types/hud';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const INITIAL_HABITS: HabitItem[] = [
  { id: 'hab-1', name: 'HYDRATION (3L)', history: [true, true, true, true, true, false, true] },
  { id: 'hab-2', name: 'WORKOUT (45M)', history: [true, false, true, true, true, true, false] },
  { id: 'hab-3', name: 'READING (30M)', history: [true, true, true, true, false, true, true] }
];

export const HabitStreakTracker: React.FC = () => {
  const [habits, setHabits] = useState<HabitItem[]>(() => {
    const saved = localStorage.getItem('hud_habit_streaks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_HABITS;
  });

  useEffect(() => {
    localStorage.setItem('hud_habit_streaks', JSON.stringify(habits));
  }, [habits]);

  const toggleDay = (habitId: string, dayIdx: number) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const newHist = [...h.history];
          newHist[dayIdx] = !newHist[dayIdx];
          return { ...h, history: newHist };
        }
        return h;
      })
    );
  };

  return (
    <GlassCard>
      <WidgetHeader icon={Activity} prefix="HABITS" title="WEEKLY FITNESS & STREAK MATRIX" badge="7-DAY TRACKER" />

      <div className="flex flex-col h-full justify-between space-y-2">
        <div className="space-y-2">
          {habits.map((habit) => {
            const completedDays = habit.history.filter(Boolean).length;

            return (
              <div key={habit.id} className="bg-[#1A1A24]/60 border border-[#2A2A36] rounded-lg p-2 space-y-1.5">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="font-bold text-slate-200">{habit.name}</span>
                  <span className="text-[#00FF66] font-bold">{completedDays}/7 DAYS</span>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {habit.history.map((active, dayIdx) => (
                    <button
                      key={dayIdx}
                      onClick={() => toggleDay(habit.id, dayIdx)}
                      className={`h-6 rounded border flex items-center justify-center font-mono text-[9px] font-bold transition-all ${
                        active
                          ? 'bg-emerald-950 text-[#00FF66] border-[#00FF66]/50 shadow-[0_0_6px_rgba(0,255,102,0.3)]'
                          : 'bg-[#121218] text-slate-600 border-[#2A2A36] hover:border-slate-500'
                      }`}
                    >
                      {active ? <Check size={11} strokeWidth={2.5} /> : DAYS[dayIdx]}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
};
