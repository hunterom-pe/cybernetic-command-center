import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Layers } from 'lucide-react';

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

      const rows = 10;
      const cols = 14;
      const cellW = w / cols;
      const cellH = h / rows;

      // Render 3D Wireframe Perspective Grid
      ctx.strokeStyle = 'rgba(0, 255, 102, 0.45)';
      ctx.lineWidth = 1;

      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          const height = Math.sin(r * 0.5 + c * 0.4 + scanLine) * 10;
          const px = c * cellW;
          const py = r * cellH - height + 12;

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
        prefix="SURFACE RADAR"
        title="3D TOPOGRAPHIC HEIGHTMAP"
        badge="LV-426 MAPPED"
        badgeColor="green"
      />

      <div className="grid grid-cols-12 gap-2 h-full items-center">
        {/* Left: 3D Heightmap Canvas */}
        <div className="col-span-5 bg-[#121218] border border-[#00FF66]/30 rounded-lg p-1 flex items-center justify-center h-full">
          <canvas ref={canvasRef} width={120} height={95} className="w-full h-full object-contain" />
        </div>

        {/* Right: Surface Elevation Telemetry */}
        <div className="col-span-7 flex flex-col justify-between h-full space-y-1 py-0.5 font-mono text-[9px]">
          <div className="bg-[#1A1A24]/70 border border-[#2A2A36] rounded-lg p-1.5 space-y-0.5">
            <div className="text-[#00FF66] font-bold flex justify-between">
              <span>LOCATION</span>
              <span>LV-426</span>
            </div>
            <div className="flex justify-between text-slate-300 text-[8px]">
              <span>ELEVATION:</span>
              <span className="font-bold text-white">4,200M</span>
            </div>
            <div className="flex justify-between text-slate-300 text-[8px]">
              <span>SCANNER:</span>
              <span className="font-bold text-[#FF007F]">SWEEPING</span>
            </div>
          </div>

          <div className="bg-[#1A1A24]/70 border border-[#2A2A36] rounded-lg p-1.5 font-mono text-[8px] text-slate-400 truncate">
            LANDING VECTOR: HADLEY VALLEY CLEAR
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
