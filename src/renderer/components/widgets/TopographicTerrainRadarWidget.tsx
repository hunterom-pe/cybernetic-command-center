import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Compass, Layers, Map } from 'lucide-react';

export const TopographicTerrainRadarWidget: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let scanLine = 0;

    const drawTerrain = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      const rows = 12;
      const cols = 16;
      const cellW = w / cols;
      const cellH = h / rows;

      // Render 3D Wireframe Perspective Grid
      ctx.strokeStyle = 'rgba(0, 255, 102, 0.4)';
      ctx.lineWidth = 1;

      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          // Dynamic heightmap peaks
          const height = Math.sin(r * 0.5 + c * 0.4 + scanLine) * 12;
          const px = c * cellW;
          const py = r * cellH - height + 15;

          if (c === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // Altitude Scanning Line
      const scanY = (scanLine * 15) % h;
      ctx.strokeStyle = '#FF007F';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(w, scanY);
      ctx.stroke();

      scanLine += 0.03;
      animId = requestAnimationFrame(drawTerrain);
    };

    drawTerrain();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <GlassCard>
      <WidgetHeader
        icon={Layers}
        prefix="TERRAIN SCAN"
        title="3D TOPOGRAPHIC SURFACE HEIGHTMAP RADAR"
        badge="LV-426 MAPPED"
        badgeColor="green"
      />

      <div className="grid grid-cols-12 gap-3 h-full items-center">
        {/* Left: 3D Heightmap Canvas */}
        <div className="col-span-6 bg-[#121218] border border-[#00FF66]/30 rounded-xl p-2 flex items-center justify-center h-full">
          <canvas ref={canvasRef} width={140} height={110} className="w-full h-full object-contain" />
        </div>

        {/* Right: Surface Elevation Telemetry */}
        <div className="col-span-6 flex flex-col justify-between h-full space-y-1 py-0.5 font-mono text-[10px]">
          <div className="bg-[#1A1A24]/70 border border-[#2A2A36] rounded-lg p-2 space-y-1">
            <div className="text-[#00FF66] font-bold flex justify-between">
              <span>LOCATION</span>
              <span>LV-426 VALLEY</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>PEAK ELEVATION:</span>
              <span className="font-bold text-white">4,200M</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>SCAN PLAN:</span>
              <span className="font-bold text-[#FF007F]">SWEEPING</span>
            </div>
          </div>

          <div className="bg-[#1A1A24]/70 border border-[#2A2A36] rounded-lg p-2 font-mono text-[9px] text-slate-400">
            LANDING ZONE VECTOR: HADLEY VALLEY CLEAR
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
