import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Compass, Disc, ShieldCheck } from 'lucide-react';

export const HoloGyroscopeWidget: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle1 = 0;
    let angle2 = 0;
    let angle3 = 0;

    const drawGyro = () => {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Outer Ring 1
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle1);
      ctx.scale(1, 0.4);
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 42, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Middle Ring 2
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle2);
      ctx.scale(0.5, 1);
      ctx.strokeStyle = '#FF007F';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 32, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Inner Ring 3
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle3);
      ctx.scale(1, 0.7);
      ctx.strokeStyle = '#00FF66';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Central Gyro Core Node
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();

      angle1 += 0.02;
      angle2 -= 0.03;
      angle3 += 0.04;

      animId = requestAnimationFrame(drawGyro);
    };

    drawGyro();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <GlassCard>
      <WidgetHeader
        icon={Compass}
        prefix="STABILITY CONTROL"
        title="3D HOLOGRAPHIC GYROSCOPE GIMBAL"
        badge="GIMBAL LOCK: CLEAR"
        badgeColor="green"
      />

      <div className="grid grid-cols-12 gap-3 h-full items-center">
        {/* Left: 3D Holographic Gyro Canvas */}
        <div className="col-span-6 bg-[#121218] border border-[#00F0FF]/30 rounded-xl p-2 flex items-center justify-center h-full">
          <canvas ref={canvasRef} width={140} height={110} className="w-full h-full object-contain" />
        </div>

        {/* Right: Artificial Gravity Telemetry */}
        <div className="col-span-6 flex flex-col justify-between h-full space-y-1 py-0.5 font-mono text-[10px]">
          <div className="bg-[#1A1A24]/70 border border-[#2A2A36] rounded-lg p-2 space-y-1">
            <div className="text-[#00FF66] font-bold flex justify-between">
              <span>ARTIFICIAL GRAVITY</span>
              <span>1.00G</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>RING 1 (XY):</span>
              <span className="font-bold text-[#00F0FF]">ACTIVE</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>RING 2 (YZ):</span>
              <span className="font-bold text-[#FF007F]">ACTIVE</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>RING 3 (XZ):</span>
              <span className="font-bold text-[#00FF66]">ACTIVE</span>
            </div>
          </div>

          <div className="bg-[#1A1A24]/70 border border-[#2A2A36] rounded-lg p-2 font-mono text-[9px] text-slate-400">
            SHIP INERTIAL GUIDANCE ENGINE: NOMINAL
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
