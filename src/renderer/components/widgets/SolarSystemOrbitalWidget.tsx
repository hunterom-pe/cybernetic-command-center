import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Globe } from 'lucide-react';
import { useCyberSFX } from '../../hooks/useCyberSFX';

export const SolarSystemOrbitalWidget: React.FC = () => {
  const { playClickSFX } = useCyberSFX();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angles = [0, 0, 0, 0, 0];

    const orbits = [
      { radius: 12, speed: 0.04, color: '#FFB700' },
      { radius: 20, speed: 0.025, color: '#00F0FF' },
      { radius: 28, speed: 0.018, color: '#00FF66' },
      { radius: 36, speed: 0.012, color: '#FF3300' },
      { radius: 44, speed: 0.008, color: '#FF007F' }
    ];

    const drawOrbits = () => {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#FF9900';
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();

      orbits.forEach((orb, i) => {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, orb.radius, 0, Math.PI * 2);
        ctx.stroke();

        const px = cx + Math.cos(angles[i]) * orb.radius;
        const py = cy + Math.sin(angles[i]) * orb.radius;

        ctx.fillStyle = orb.color;
        ctx.beginPath();
        ctx.arc(px, py, i === 4 ? 3 : 2, 0, Math.PI * 2);
        ctx.fill();

        angles[i] += orb.speed * speedMultiplier;
      });

      animId = requestAnimationFrame(drawOrbits);
    };

    drawOrbits();
    return () => cancelAnimationFrame(animId);
  }, [speedMultiplier]);

  return (
    <GlassCard>
      <WidgetHeader
        icon={Globe}
        prefix="SYSTEM MAP"
        title="SOLAR & COLONY ORBITAL MAP"
        badge="HADLEY: ACTIVE"
        badgeColor="orange"
        actions={
          <button
            onClick={() => { playClickSFX(); setSpeedMultiplier((prev) => (prev === 1 ? 2 : prev === 2 ? 4 : 1)); }}
            className="px-2 py-0.5 rounded bg-[#1A1A24] border border-[#2A2A36] text-amber-400 hover:text-white font-mono text-[9px] font-bold uppercase transition-all"
          >
            {speedMultiplier}X
          </button>
        }
      />

      <div className="grid grid-cols-12 gap-2 h-full items-center overflow-hidden">
        {/* Left: Orbital Canvas */}
        <div className="col-span-5 bg-[#121218] border border-amber-500/30 rounded-lg p-1 flex items-center justify-center h-[90px]">
          <canvas ref={canvasRef} width={110} height={75} className="w-full h-full object-contain" />
        </div>

        {/* Right: Orbital Telemetry Details */}
        <div className="col-span-7 flex flex-col justify-between h-[90px] font-mono text-[9px]">
          <div className="bg-[#1A1A24]/70 border border-[#2A2A36] rounded-lg p-1.5 space-y-0.5">
            <div className="text-amber-400 font-bold flex justify-between">
              <span>HADLEY'S HOPE</span>
              <span className="text-[#00FF66]">ORBIT OK</span>
            </div>
            <div className="flex justify-between text-slate-300 text-[8px]">
              <span>DISTANCE:</span>
              <span className="font-bold text-white">384.4K KM</span>
            </div>
            <div className="flex justify-between text-slate-300 text-[8px]">
              <span>GRAVITY:</span>
              <span className="font-bold text-white">1.0G</span>
            </div>
            <div className="text-slate-400 text-[7.5px] pt-0.5 border-t border-[#2A2A36] truncate">
              BEACON LINK: 39.4 GHZ ACTIVE
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
