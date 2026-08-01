import React, { useState, useEffect } from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Layers, Plus, FileText, CheckCircle2 } from 'lucide-react';

export const NextWeekStaging: React.FC = () => {
  const [stagingTasks, setStagingTasks] = useState<string[]>(() => {
    const saved = localStorage.getItem('hud_next_week_staging');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      'Prepare Q4 Cyberpunk Architecture roadmap deck',
      'Audit Web Audio Ambient synth frequency response',
      'Integrate Apple Calendar EventKit OAuth token fallback'
    ];
  });

  const [scratchpad, setScratchpad] = useState<string>(() => {
    return localStorage.getItem('hud_next_week_scratchpad') || '// STAGING SCRATCHPAD:\n- Key milestones for upcoming sprint\n- Review crypto portfolio rebalance numbers';
  });

  const [newTaskInput, setNewTaskInput] = useState('');

  useEffect(() => {
    localStorage.setItem('hud_next_week_staging', JSON.stringify(stagingTasks));
  }, [stagingTasks]);

  useEffect(() => {
    localStorage.setItem('hud_next_week_scratchpad', scratchpad);
  }, [scratchpad]);

  const addStagingTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    setStagingTasks([...stagingTasks, newTaskInput.trim()]);
    setNewTaskInput('');
  };

  const removeStagingTask = (index: number) => {
    setStagingTasks(stagingTasks.filter((_, i) => i !== index));
  };

  return (
    <GlassCard>
      <WidgetHeader icon={Layers} prefix="STAGING" title="NEXT WEEK PREPARATION" badge="UPCOMING SPRINT" badgeColor="orange" />

      <div className="grid grid-cols-2 gap-2.5 h-full overflow-hidden">
        {/* Left: Staging Task Checklist */}
        <div className="flex flex-col h-full space-y-1.5 overflow-hidden">
          <form onSubmit={addStagingTask} className="flex items-center space-x-1">
            <input
              type="text"
              value={newTaskInput}
              onChange={(e) => setNewTaskInput(e.target.value)}
              placeholder="Stage next week goal..."
              className="w-full bg-[#1A1A24]/60 border border-[#2A2A36] rounded p-1.5 text-[11px] text-slate-100 placeholder-slate-500 font-sans focus:outline-none"
            />
            <button type="submit" className="p-1.5 bg-[#FF6B00] text-black font-bold rounded hover:scale-105 transition-transform">
              <Plus size={13} />
            </button>
          </form>

          <div className="overflow-y-auto pr-1 space-y-1 max-h-[140px]">
            {stagingTasks.map((t, idx) => (
              <div
                key={idx}
                className="p-1.5 rounded bg-[#1A1A24]/50 border border-[#2A2A36] flex items-center justify-between text-[11px] text-slate-300 hover:border-[#FF6B00]/40 transition-colors group"
              >
                <span className="truncate pr-1">• {t}</span>
                <button onClick={() => removeStagingTask(idx)} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400">
                  <CheckCircle2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Scratchpad Notepad */}
        <div className="flex flex-col h-full space-y-1">
          <div className="font-mono text-[9px] text-slate-400 font-bold uppercase flex items-center space-x-1">
            <FileText size={10} className="text-[#FF6B00]" />
            <span>SPRINT SCRATCHPAD</span>
          </div>
          <textarea
            value={scratchpad}
            onChange={(e) => setScratchpad(e.target.value)}
            className="w-full h-full bg-[#1A1A24]/60 border border-[#2A2A36] rounded p-2 font-mono text-[10px] text-slate-300 focus:outline-none focus:border-[#FF6B00]/50 resize-none"
          />
        </div>
      </div>
    </GlassCard>
  );
};
