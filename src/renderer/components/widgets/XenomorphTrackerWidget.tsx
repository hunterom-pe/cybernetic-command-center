import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Radio, AlertTriangle, ShieldAlert, Cpu, Volume2, VolumeX } from 'lucide-react';
import { useCyberSFX } from '../../hooks/useCyberSFX';

export const XenomorphTrackerWidget: React.FC = () => {
  const { playClickSFX, playToggleSFX } = useCyberSFX();
  const [distance, setDistance] = useState(14.8);
  const [isThreatActive, setIsThreatActive] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [viewTab, setViewTab] = useState<'tracker' | 'synth'>('tracker');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Acoustic Motion Tracker Beep Ping Sound
  const playTrackerPing = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // M314 Motion Tracker Signature High Beep (1850Hz)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1850, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.085);
    } catch (e) {}
  };

  // Distance Ticker Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDistance((prev) => {
        let next = prev - (0.4 + Math.random() * 0.8);
        if (next <= 1.8) {
          next = 18.2; // reset sweep
        }
        playTrackerPing();
        return parseFloat(next.toFixed(1));
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [soundEnabled]);

  // Radar Sweep Canvas Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let angle = 0;
    let animId: number;

    const drawRadar = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) / 2 - 4;

      ctx.clearRect(0, 0, w, h);

      // Outer Radar Circle
      ctx.strokeStyle = '#00FF66';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Inner Concentric Distance Rings
      [0.3, 0.6, 0.85].forEach((rRatio) => {
        ctx.strokeStyle = 'rgba(0, 255, 102, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * rRatio, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Crosshair Lines
      ctx.beginPath();
      ctx.moveTo(cx - radius, cy);
      ctx.lineTo(cx + radius, cy);
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(cx, cy + radius);
      ctx.stroke();

      // Sweep Line
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      const sweepGrad = ctx.createConicGradient(0, 0, 0);
      sweepGrad.addColorStop(0, 'rgba(0, 255, 102, 0.5)');
      sweepGrad.addColorStop(0.15, 'rgba(0, 255, 102, 0.05)');
      sweepGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = sweepGrad;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Xenomorph Blip (Red/Orange Glowing Contact)
      const blipDistanceRatio = distance / 20;
      const blipAngle = Math.PI * 0.25;
      const bx = cx + Math.cos(blipAngle) * (radius * blipDistanceRatio);
      const by = cy + Math.sin(blipAngle) * (radius * blipDistanceRatio);

      ctx.fillStyle = distance < 5 ? '#FF3300' : '#FF9900';
      ctx.beginPath();
      ctx.arc(bx, by, distance < 4 ? 6 : 4, 0, Math.PI * 2);
      ctx.fill();

      // Blip Pulse Glow
      ctx.strokeStyle = distance < 5 ? 'rgba(255, 51, 0, 0.6)' : 'rgba(255, 153, 0, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(bx, by, (Date.now() % 1000) / 70 + 4, 0, Math.PI * 2);
      ctx.stroke();

      angle += 0.04;
      animId = requestAnimationFrame(drawRadar);
    };

    drawRadar();
    return () => cancelAnimationFrame(animId);
  }, [distance]);

  return (
    <GlassCard>
      <WidgetHeader
        icon={Radio}
        prefix="WEYLAND-YUTANI"
        title="M314 MOTION TRACKER // XX121 RADAR"
        badge={distance < 5 ? 'DANGER: CLOSE' : 'CONTACT DETECTED'}
        badgeColor={distance < 5 ? 'orange' : 'magenta'}
        actions={
          <div className="flex items-center space-x-1">
            <button
              onClick={() => { playToggleSFX(); setViewTab((prev) => (prev === 'tracker' ? 'synth' : 'tracker')); }}
              className="px-2 py-0.5 rounded bg-[#1A1A24] border border-[#2A2A36] text-amber-400 hover:text-white font-mono text-[9px] font-bold uppercase transition-all"
            >
              {viewTab === 'tracker' ? 'DAVID 8 SYNTH' : 'RADAR'}
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-1 rounded transition-colors ${soundEnabled ? 'text-[#00FF66]' : 'text-slate-500'}`}
              title={soundEnabled ? 'Mute Motion Tracker Ping' : 'Enable Motion Tracker Ping Audio'}
            >
              {soundEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
            </button>
          </div>
        }
      />

      {viewTab === 'tracker' ? (
        <div className="grid grid-cols-12 gap-3 h-full items-center">
          {/* Left: Motion Tracker Radar Screen */}
          <div className="col-span-5 bg-[#121218] border border-[#00FF66]/40 rounded-lg p-2 flex flex-col items-center justify-around h-full">
            <canvas ref={canvasRef} width={100} height={100} className="w-20 h-20 sm:w-24 sm:h-24" />
            <div className="font-mono text-[9px] text-[#00FF66] font-bold">
              SIGNAL: M314 ACTIVE
            </div>
          </div>

          {/* Right: Proximity Distance & Telemetry */}
          <div className="col-span-7 flex flex-col justify-between h-full py-0.5">
            {/* Distance Box */}
            <div className="bg-[#1A1A24]/70 border border-[#2A2A36] rounded-lg p-2 space-y-1">
              <div className="font-mono text-[9px] text-slate-400 uppercase flex items-center justify-between">
                <span>TARGET PROXIMITY</span>
                <span className="text-[#FF3300] font-bold flex items-center space-x-1">
                  <AlertTriangle size={10} />
                  <span>ORGANISM XX121</span>
                </span>
              </div>

              <div className="flex items-baseline space-x-1">
                <span className={`font-mono text-3xl font-extrabold tracking-tight ${distance < 5 ? 'text-[#FF3300] animate-pulse' : 'text-[#FF9900]'}`}>
                  {distance.toFixed(1)}
                </span>
                <span className="font-mono text-xs text-slate-400">METERS</span>
              </div>
            </div>

            {/* MU/TH/UR Threat Status */}
            <div className="bg-[#1A1A24]/70 border border-[#2A2A36] rounded-lg p-2 font-mono text-[9px] space-y-1">
              <div className="text-amber-400 font-bold flex justify-between">
                <span>MU/TH/UR 6000 TELEMETRY</span>
                <span>ORDER 937</span>
              </div>
              <div className="text-slate-300">
                PRIORITY ONE: SECURE ORGANISM FOR ANALYSIS. CREW EXPENDABLE.
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Synthetic Human Diagnostic Tab (David 8 / Ash) */
        <div className="flex flex-col justify-between h-full bg-[#1A1A24]/60 border border-[#2A2A36] rounded-lg p-3 space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#2A2A36] pb-1">
            <span className="font-bold text-amber-400 flex items-center space-x-1">
              <Cpu size={14} />
              <span>SYNTHETIC HUMAN DIAGNOSTICS // DAVID 8</span>
            </span>
            <span className="text-[#00FF66] font-bold">HEALTH: 98.4%</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="bg-[#121218] p-2 rounded border border-[#2A2A36]">
              <span className="text-slate-400 block">OPTIC NEURAL BUS</span>
              <span className="text-slate-100 font-bold">ONLINE // 120 FPS</span>
            </div>
            <div className="bg-[#121218] p-2 rounded border border-[#2A2A36]">
              <span className="text-slate-400 block">WHITE FLUID PRESSURE</span>
              <span className="text-cyan-400 font-bold">120 PSI // NORMAL</span>
            </div>
            <div className="bg-[#121218] p-2 rounded border border-[#2A2A36]">
              <span className="text-slate-400 block">EMPATHY MATRIX</span>
              <span className="text-rose-400 font-bold">BYPASSED (ORDER 937)</span>
            </div>
            <div className="bg-[#121218] p-2 rounded border border-[#2A2A36]">
              <span className="text-slate-400 block">MOTIVE PROTOCOL</span>
              <span className="text-amber-400 font-bold">PERFECT ORGANISM</span>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
};
