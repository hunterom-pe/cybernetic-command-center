import React, { useState, useEffect } from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { CheckSquare, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { DirectiveItem } from '../../types/hud';

const INITIAL_TASKS: DirectiveItem[] = [
  { id: 'task-1', title: 'Deploy Quantum Core v2.4 build to staging', completed: true, priority: 'high', createdAt: new Date().toISOString() },
  { id: 'task-2', title: 'Refactor macOS IPC AppleScript latency hooks', completed: false, priority: 'high', createdAt: new Date().toISOString() },
  { id: 'task-3', title: 'Review Phoenix weather telemetry API cache policy', completed: false, priority: 'medium', createdAt: new Date().toISOString() },
  { id: 'task-4', title: 'Finalize Cyberpunk HUD design token system', completed: true, priority: 'low', createdAt: new Date().toISOString() }
];

export const CurrentWeekDirectives: React.FC<{ onTasksChange?: (tasks: DirectiveItem[]) => void }> = ({ onTasksChange }) => {
  const [directives, setDirectives] = useState<DirectiveItem[]>(() => {
    const saved = localStorage.getItem('hud_current_directives');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_TASKS;
  });

  const [inputTitle, setInputTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    localStorage.setItem('hud_current_directives', JSON.stringify(directives));
    if (onTasksChange) onTasksChange(directives);
  }, [directives, onTasksChange]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTitle.trim()) return;

    const newTask: DirectiveItem = {
      id: `dir-${Date.now()}`,
      title: inputTitle.trim(),
      completed: false,
      priority,
      createdAt: new Date().toISOString()
    };

    setDirectives([newTask, ...directives]);
    setInputTitle('');
  };

  const toggleTask = (id: string) => {
    setDirectives(directives.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: string) => {
    setDirectives(directives.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setDirectives(directives.filter((t) => !t.completed));
  };

  const completedCount = directives.filter((t) => t.completed).length;

  return (
    <GlassCard>
      <WidgetHeader
        icon={CheckSquare}
        prefix="DIRECTIVES"
        title="CURRENT WEEK GOALS"
        badge={`${completedCount}/${directives.length} DONE`}
        badgeColor="green"
        actions={
          completedCount > 0 && (
            <button
              onClick={clearCompleted}
              className="text-[10px] font-mono text-slate-400 hover:text-[#FF3B30] transition-colors uppercase font-bold"
            >
              CLEAR COMPLETED
            </button>
          )
        }
      />

      <div className="flex flex-col h-full space-y-2 overflow-hidden">
        {/* Inline Task Input Form */}
        <form onSubmit={addTask} className="flex items-center space-x-1.5 bg-[#1A1A24]/70 border border-[#2A2A36] rounded-lg p-1.5">
          <input
            type="text"
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
            placeholder="Add new weekly directive..."
            className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 font-sans focus:outline-none px-1"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            className="bg-[#121218] border border-[#2A2A36] text-[10px] font-mono text-slate-300 rounded px-1.5 py-0.5 focus:outline-none"
          >
            <option value="low">LOW</option>
            <option value="medium">MED</option>
            <option value="high">HIGH</option>
          </select>
          <button
            type="submit"
            className="p-1 rounded bg-[#00FF66] text-black font-bold hover:scale-105 transition-all"
          >
            <Plus size={14} strokeWidth={2} />
          </button>
        </form>

        {/* Task Checklist */}
        <div className="overflow-y-auto pr-1 space-y-1.5 max-h-[160px]">
          {directives.map((t) => (
            <div
              key={t.id}
              className={`p-2 rounded-lg border flex items-center justify-between transition-all group ${
                t.completed
                  ? 'bg-[#121218]/40 border-[#2A2A36]/60 opacity-60'
                  : 'bg-[#1A1A24]/60 border-[#2A2A36] hover:border-[#00FF66]/40'
              }`}
            >
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <button onClick={() => toggleTask(t.id)} className="shrink-0 text-slate-400 hover:text-[#00FF66]">
                  {t.completed ? (
                    <CheckCircle2 size={16} className="text-[#00FF66]" />
                  ) : (
                    <div className="w-4 h-4 rounded border border-[#2A2A36] hover:border-[#00FF66]" />
                  )}
                </button>
                <span className={`text-xs font-medium truncate ${t.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                  {t.title}
                </span>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span
                  className={`font-mono text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                    t.priority === 'high'
                      ? 'bg-rose-950/80 text-[#FF3B30] border border-rose-500/30'
                      : t.priority === 'medium'
                      ? 'bg-amber-950/80 text-[#FF6B00] border border-amber-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {t.priority}
                </span>
                <button
                  onClick={() => deleteTask(t.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-[#FF3B30] transition-opacity"
                >
                  <Trash2 size={13} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};
