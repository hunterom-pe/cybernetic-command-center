import React, { useState, useEffect } from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Timer, Play, Pause, RotateCcw, Settings, Check } from 'lucide-react';

export const PomodoroSprintHUD: React.FC = () => {
  const [focusMinutes, setFocusMinutes] = useState<number>(() => {
    const saved = localStorage.getItem('hud_pomodoro_focus_mins');
    return saved ? parseInt(saved, 10) : 25;
  });

  const [breakMinutes, setBreakMinutes] = useState<number>(() => {
    const saved = localStorage.getItem('hud_pomodoro_break_mins');
    return saved ? parseInt(saved, 10) : 5;
  });

  const FOCUS_TIME = focusMinutes * 60;
  const BREAK_TIME = breakMinutes * 60;

  const [timeLeft, setTimeLeft] = useState<number>(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isBreak, setIsBreak] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [customFocusInput, setCustomFocusInput] = useState<string>(String(focusMinutes));
  const [customBreakInput, setCustomBreakInput] = useState<string>(String(breakMinutes));

  useEffect(() => {
    localStorage.setItem('hud_pomodoro_focus_mins', String(focusMinutes));
    localStorage.setItem('hud_pomodoro_break_mins', String(breakMinutes));
  }, [focusMinutes, breakMinutes]);

  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Toggle session
      const nextIsBreak = !isBreak;
      setIsBreak(nextIsBreak);
      const nextTime = nextIsBreak ? breakMinutes * 60 : focusMinutes * 60;
      setTimeLeft(nextTime);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, isBreak, focusMinutes, breakMinutes]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isBreak ? breakMinutes * 60 : focusMinutes * 60);
  };

  const changeFocusPreset = (mins: number) => {
    setFocusMinutes(mins);
    setCustomFocusInput(String(mins));
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(mins * 60);
  };

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const fMins = Math.max(1, Math.min(180, parseInt(customFocusInput, 10) || 25));
    const bMins = Math.max(1, Math.min(60, parseInt(customBreakInput, 10) || 5));

    setFocusMinutes(fMins);
    setBreakMinutes(bMins);
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(fMins * 60);
    setIsEditing(false);
  };

  const total = isBreak ? BREAK_TIME : FOCUS_TIME;
  const progress = total > 0 ? ((total - timeLeft) / total) * 100 : 0;
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeString = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const themeColor = isBreak ? '#FF6B00' : '#00FF66';

  return (
    <GlassCard>
      <WidgetHeader
        icon={Timer}
        prefix="POMODORO"
        title="FOCUS SPRINT ENGINE"
        badge={`${isBreak ? 'BREAK' : 'FOCUS'} ${isBreak ? breakMinutes : focusMinutes}M`}
        badgeColor={isBreak ? 'orange' : 'green'}
        actions={
          <button
            onClick={() => setIsEditing(true)}
            title="Custom Focus & Break Time Settings"
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#1A1A24] transition-colors"
          >
            <Settings size={12} />
          </button>
        }
      />

      <div className="flex items-center justify-around h-full py-0.5 space-x-1">
        {/* SVG Neon Ring */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="#2A2A36"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke={themeColor}
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000"
              style={{ filter: `drop-shadow(0 0 8px ${themeColor})` }}
            />
          </svg>

          {/* Time Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="font-mono text-sm sm:text-lg font-extrabold text-slate-100" style={{ textShadow: `0 0 10px ${themeColor}` }}>
              {timeString}
            </div>
            <div className="font-mono text-[7px] sm:text-[8px] uppercase tracking-wider text-slate-400">
              {isBreak ? 'REST' : 'FOCUS'}
            </div>
          </div>
        </div>

        {/* Controls & Quick Presets */}
        <div className="flex flex-col space-y-1.5 shrink-0">
          {/* Quick Preset Buttons */}
          <div className="flex items-center space-x-1 font-mono text-[8px] sm:text-[9px]">
            {[15, 25, 45, 60].map((preset) => (
              <button
                key={preset}
                onClick={() => changeFocusPreset(preset)}
                className={`px-1 py-0.5 rounded border transition-all ${
                  focusMinutes === preset && !isBreak
                    ? 'bg-emerald-950 text-[#00FF66] border-[#00FF66]/50 font-bold'
                    : 'bg-[#1A1A24] text-slate-400 border-[#2A2A36] hover:text-white'
                }`}
              >
                {preset}m
              </button>
            ))}
          </div>

          {/* Start/Pause and Reset Buttons */}
          <div className="flex items-center space-x-1">
            <button
              onClick={toggleTimer}
              className={`px-2 py-1 rounded-lg font-mono text-[10px] sm:text-xs font-bold flex items-center space-x-1 transition-all shadow-md ${
                isRunning
                  ? 'bg-amber-950 text-[#FF6B00] border border-[#FF6B00]'
                  : 'bg-emerald-950 text-[#00FF66] border border-[#00FF66]'
              }`}
            >
              {isRunning ? <Pause size={11} /> : <Play size={11} />}
              <span>{isRunning ? 'PAUSE' : 'START'}</span>
            </button>

            <button
              onClick={resetTimer}
              className="p-1 rounded-lg font-mono text-xs text-slate-400 bg-[#1A1A24] border border-[#2A2A36] hover:text-white transition-colors"
              title="Reset Timer"
            >
              <RotateCcw size={11} />
            </button>
          </div>
        </div>

        {/* Custom Duration Modal */}
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <form onSubmit={handleSaveCustom} className="bg-[#121218] border border-[#00FF66]/40 rounded-xl p-4 w-80 space-y-3 shadow-2xl">
              <div className="font-mono text-xs font-bold text-[#00FF66] uppercase">CUSTOM SPRINT TIMER SETTINGS</div>

              <div>
                <label className="font-mono text-[10px] text-slate-300 block mb-1">FOCUS TIME (MINUTES)</label>
                <input
                  type="number"
                  min={1}
                  max={180}
                  value={customFocusInput}
                  onChange={(e) => setCustomFocusInput(e.target.value)}
                  className="w-full bg-[#1A1A24] border border-[#2A2A36] rounded p-1.5 text-xs text-white focus:outline-none focus:border-[#00FF66]"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] text-slate-300 block mb-1">BREAK TIME (MINUTES)</label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={customBreakInput}
                  onChange={(e) => setCustomBreakInput(e.target.value)}
                  className="w-full bg-[#1A1A24] border border-[#2A2A36] rounded p-1.5 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-[#2A2A36]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 font-mono text-xs text-slate-400 bg-[#1A1A24] rounded border border-[#2A2A36]"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 font-mono text-xs font-bold text-black bg-[#00FF66] rounded flex items-center space-x-1"
                >
                  <Check size={13} />
                  <span>APPLY</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </GlassCard>
  );
};
