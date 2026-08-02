import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Compass, ShieldCheck } from 'lucide-react';

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
      ctx.arc(0, 0, 30, 0, Math.PI * 2);
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
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
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
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Central Gyro Core Node
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
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
        title="3D GYROSCOPE GIMBAL"
        badge="GIMBAL: OK"
        badgeColor="green"
      />

      <div className="grid grid-cols-12 gap-2 h-full items-center overflow-hidden">
        {/* Left: 3D Holographic Gyro Canvas */}
        <div className="col-span-5 bg-[#121218] border border-[#00F0FF]/30 rounded-lg p-1 flex items-center justify-center h-[90px]">
          <canvas ref={canvasRef} width={110} height={75} className="w-full h-full object-contain" />
        </div>

        {/* Right: Artificial Gravity Telemetry */}
        <div className="col-span-7 flex flex-col justify-between h-[90px] font-mono text-[9px]">
          <div className="bg-[#1A1A24]/70 border border-[#2A2A36] rounded-lg p-1.5 space-y-0.5">
            <div className="text-[#00FF66] font-bold flex justify-between">
              <span>ARTIFICIAL GRAVITY</span>
              <span>1.00G</span>
            </div>
            <div className="flex justify-between text-slate-300 text-[8px]">
              <span>RING 1 (XY):</span>
              <span className="font-bold text-[#00F0FF]">ACTIVE</span>
            </div>
            <div className="flex justify-between text-slate-300 text-[8px]">
              <span>RING 2 (YZ):</span>
              <span className="font-bold text-[#FF007F]">ACTIVE</span>
            </div>
            <div className="flex justify-between text-slate-300 text-[8px]">
              <span>RING 3 (XZ):</span>
              <span className="font-bold text-[#00FF66]">ACTIVE</span>
            </div>
            <div className="text-slate-400 text-[7.5px] pt-0.5 border-t border-[#2A2A36] truncate">
              INERTIAL ENGINE: NOMINAL
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
