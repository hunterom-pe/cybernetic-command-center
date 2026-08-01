import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Globe, Disc, Navigation } from 'lucide-react';
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
      { radius: 18, speed: 0.04, color: '#FFB700', name: 'Mercury' },
      { radius: 30, speed: 0.025, color: '#00F0FF', name: 'Venus' },
      { radius: 42, speed: 0.018, color: '#00FF66', name: 'Earth' },
      { radius: 54, speed: 0.012, color: '#FF3300', name: 'Mars' },
      { radius: 66, speed: 0.008, color: '#FF007F', name: 'Hadley Colony' }
    ];

    const drawOrbits = () => {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Central Sun Glow
      ctx.fillStyle = '#FF9900';
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fill();

      // Sun Halo Glow
      ctx.fillStyle = 'rgba(255, 153, 0, 0.2)';
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fill();

      // Draw Planetary Orbits & Planets
      orbits.forEach((orb, i) => {
        // Orbit Circle
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, orb.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Planet Position
        const px = cx + Math.cos(angles[i]) * orb.radius;
        const py = cy + Math.sin(angles[i]) * orb.radius;

        // Planet Body
        ctx.fillStyle = orb.color;
        ctx.beginPath();
        ctx.arc(px, py, i === 4 ? 3.5 : 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Update angle with speed multiplier
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
        title="SOLAR & OFF-WORLD COLONY ORBITAL MAP"
        badge="HADLEY'S HOPE ACTIVE"
        badgeColor="orange"
        actions={
          <button
            onClick={() => { playClickSFX(); setSpeedMultiplier((prev) => (prev === 1 ? 2 : prev === 2 ? 4 : 1)); }}
            className="px-2 py-0.5 rounded bg-[#1A1A24] border border-[#2A2A36] text-amber-400 hover:text-white font-mono text-[9px] font-bold uppercase transition-all"
          >
            {speedMultiplier}X SPEED
          </button>
        }
      />

      <div className="grid grid-cols-12 gap-3 h-full items-center">
        {/* Left: Orbital Canvas */}
        <div className="col-span-6 bg-[#121218] border border-amber-500/30 rounded-xl p-2 flex items-center justify-center h-full">
          <canvas ref={canvasRef} width={140} height={110} className="w-full h-full object-contain" />
        </div>

        {/* Right: Orbital Telemetry Details */}
        <div className="col-span-6 flex flex-col justify-between h-full space-y-1 py-0.5 font-mono text-[10px]">
          <div className="bg-[#1A1A24]/70 border border-[#2A2A36] rounded-lg p-2 space-y-1">
            <div className="text-amber-400 font-bold flex justify-between">
              <span>HADLEY'S HOPE</span>
              <span className="text-[#00FF66]">IN ORBIT</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>DISTANCE:</span>
              <span className="font-bold text-white">384,400 KM</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>GRAVITY:</span>
              <span className="font-bold text-white">1.0G (STABLE)</span>
            </div>
          </div>

          <div className="bg-[#1A1A24]/70 border border-[#2A2A36] rounded-lg p-2 space-y-1">
            <div className="text-[#00F0FF] font-bold flex justify-between">
              <span>SUB-SPACE BEACON</span>
              <span>39.4 GHZ</span>
            </div>
            <div className="text-slate-400 text-[9px] truncate">
              SIGNAL TELEMETRY: NOSTROMO PATROL LINK OK
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
