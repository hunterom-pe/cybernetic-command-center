import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Cpu, Zap, Activity } from 'lucide-react';

export const QuantumParticleSwarmWidget: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const numParticles = 80;
    const particles: { x: number; y: number; vx: number; vy: number; radius: number; color: string }[] = [];

    const colors = ['#00F0FF', '#FF007F', '#00FF66', '#FFB700'];

    for (let i = 0; i < numParticles; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 45 + 10;
      particles.push({
        x: canvas.width / 2 + Math.cos(angle) * dist,
        y: canvas.height / 2 + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 1.8 + 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const drawParticles = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.fillStyle = 'rgba(18, 18, 24, 0.2)';
      ctx.fillRect(0, 0, w, h);

      // Central Singularity Glow
      ctx.fillStyle = '#00F0FF';
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();

      particles.forEach((p) => {
        // Gravitational attraction toward center
        const dx = cx - p.x;
        const dy = cy - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        p.vx += (dx / dist) * 0.05;
        p.vy += (dy / dist) * 0.05;

        p.x += p.vx;
        p.y += p.vy;

        p.vx *= 0.98;
        p.vy *= 0.98;

        // Render Particle
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(drawParticles);
    };

    drawParticles();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <GlassCard>
      <WidgetHeader
        icon={Zap}
        prefix="QUANTUM FIELD"
        title="SUB-SPACE PARTICLE SWARM ACCELERATOR"
        badge="SINGULARITY: STABLE"
        badgeColor="cyan"
      />

      <div className="grid grid-cols-12 gap-3 h-full items-center">
        {/* Left: Particle Canvas */}
        <div className="col-span-6 bg-[#121218] border border-cyan-500/30 rounded-xl p-2 flex items-center justify-center h-full">
          <canvas ref={canvasRef} width={140} height={110} className="w-full h-full object-contain" />
        </div>

        {/* Right: Particle Physics Telemetry */}
        <div className="col-span-6 flex flex-col justify-between h-full space-y-1 py-0.5 font-mono text-[10px]">
          <div className="bg-[#1A1A24]/70 border border-[#2A2A36] rounded-lg p-2 space-y-1">
            <div className="text-[#00F0FF] font-bold flex justify-between">
              <span>PARTICLE COUNT</span>
              <span>400 NODES</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>ACCELERATION:</span>
              <span className="font-bold text-white">0.98C</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>ENERGY FLUX:</span>
              <span className="font-bold text-[#00FF66]">1.21 GW</span>
            </div>
          </div>

          <div className="bg-[#1A1A24]/70 border border-[#2A2A36] rounded-lg p-2 font-mono text-[9px] text-slate-400">
            SUB-SPACE FIELD CONTAINMENT: 100%
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
