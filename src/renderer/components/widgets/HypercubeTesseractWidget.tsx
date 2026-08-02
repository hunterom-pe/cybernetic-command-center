import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Box } from 'lucide-react';
import { useCyberSFX } from '../../hooks/useCyberSFX';

export const HypercubeTesseractWidget: React.FC = () => {
  const { playClickSFX } = useCyberSFX();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [shape, setShape] = useState<'tesseract' | 'octahedron'>('tesseract');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const drawTesseract = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      if (shape === 'tesseract') {
        const outerSize = 28;
        const innerSize = 14;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const outerNodes = [
          { x: -outerSize, y: -outerSize, z: -outerSize },
          { x: outerSize, y: -outerSize, z: -outerSize },
          { x: outerSize, y: outerSize, z: -outerSize },
          { x: -outerSize, y: outerSize, z: -outerSize },
          { x: -outerSize, y: -outerSize, z: outerSize },
          { x: outerSize, y: -outerSize, z: outerSize },
          { x: outerSize, y: outerSize, z: outerSize },
          { x: -outerSize, y: outerSize, z: outerSize }
        ];

        const innerNodes = [
          { x: -innerSize, y: -innerSize, z: -innerSize },
          { x: innerSize, y: -innerSize, z: -innerSize },
          { x: innerSize, y: innerSize, z: -innerSize },
          { x: -innerSize, y: innerSize, z: -innerSize },
          { x: -innerSize, y: -innerSize, z: innerSize },
          { x: innerSize, y: -innerSize, z: innerSize },
          { x: innerSize, y: innerSize, z: innerSize },
          { x: -innerSize, y: innerSize, z: innerSize }
        ];

        const project = (n: { x: number; y: number; z: number }) => {
          let rx = n.x * cos - n.z * sin;
          let rz = n.x * sin + n.z * cos;
          let ry = n.y * cos - rz * sin;
          return { x: cx + rx, y: cy + ry };
        };

        const projOuter = outerNodes.map(project);
        const projInner = innerNodes.map(project);

        const cubeEdges = [
          [0, 1], [1, 2], [2, 3], [3, 0],
          [4, 5], [5, 6], [6, 7], [7, 4],
          [0, 4], [1, 5], [2, 6], [3, 7]
        ];

        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 1.5;
        cubeEdges.forEach(([p1, p2]) => {
          ctx.beginPath();
          ctx.moveTo(projOuter[p1].x, projOuter[p1].y);
          ctx.lineTo(projOuter[p2].x, projOuter[p2].y);
          ctx.stroke();
        });

        ctx.strokeStyle = '#FF007F';
        ctx.lineWidth = 1.5;
        cubeEdges.forEach(([p1, p2]) => {
          ctx.beginPath();
          ctx.moveTo(projInner[p1].x, projInner[p1].y);
          ctx.lineTo(projInner[p2].x, projInner[p2].y);
          ctx.stroke();
        });

        ctx.strokeStyle = 'rgba(0, 255, 102, 0.6)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 8; i++) {
          ctx.beginPath();
          ctx.moveTo(projOuter[i].x, projOuter[i].y);
          ctx.lineTo(projInner[i].x, projInner[i].y);
          ctx.stroke();
        }
      } else {
        const r = 26;
        const pts = [
          { x: 0, y: -r, z: 0 },
          { x: r, y: 0, z: 0 },
          { x: 0, y: r, z: 0 },
          { x: -r, y: 0, z: 0 },
          { x: 0, y: 0, z: r },
          { x: 0, y: 0, z: -r }
        ];

        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const proj = pts.map((p) => {
          let rx = p.x * cos - p.z * sin;
          return { x: cx + rx, y: cy + p.y };
        });

        ctx.strokeStyle = '#FF9900';
        ctx.lineWidth = 1.5;
        const edges = [[0,1],[1,2],[2,3],[3,0],[0,4],[1,4],[2,4],[3,4],[0,5],[1,5],[2,5],[3,5]];
        edges.forEach(([p1, p2]) => {
          ctx.beginPath();
          ctx.moveTo(proj[p1].x, proj[p1].y);
          ctx.lineTo(proj[p2].x, proj[p2].y);
          ctx.stroke();
        });
      }

      angle += 0.02;
      animId = requestAnimationFrame(drawTesseract);
    };

    drawTesseract();
    return () => cancelAnimationFrame(animId);
  }, [shape]);

  return (
    <GlassCard>
      <WidgetHeader
        icon={Box}
        prefix="QUANTUM MATRIX"
        title="4D TESSERACT ENGINE"
        badge="4D: STABLE"
        badgeColor="magenta"
        actions={
          <button
            onClick={() => { playClickSFX(); setShape((prev) => (prev === 'tesseract' ? 'octahedron' : 'tesseract')); }}
            className="px-2 py-0.5 rounded bg-[#1A1A24] border border-[#2A2A36] text-pink-400 hover:text-white font-mono text-[9px] font-bold uppercase transition-all"
          >
            {shape.toUpperCase()}
          </button>
        }
      />

      <div className="grid grid-cols-12 gap-2 h-full items-center overflow-hidden">
        {/* Left: Tesseract Canvas */}
        <div className="col-span-5 bg-[#121218] border border-[#FF007F]/30 rounded-lg p-1 flex items-center justify-center h-[90px]">
          <canvas ref={canvasRef} width={110} height={75} className="w-full h-full object-contain" />
        </div>

        {/* Right: Sub-Space Dimension Details */}
        <div className="col-span-7 flex flex-col justify-between h-[90px] font-mono text-[9px]">
          <div className="bg-[#1A1A24]/70 border border-[#2A2A36] rounded-lg p-1.5 space-y-0.5">
            <div className="text-[#FF007F] font-bold flex justify-between">
              <span>DIMENSION</span>
              <span>4D TESSERACT</span>
            </div>
            <div className="flex justify-between text-slate-300 text-[8px]">
              <span>VERTICES:</span>
              <span className="font-bold text-white">16 NODES</span>
            </div>
            <div className="flex justify-between text-slate-300 text-[8px]">
              <span>EDGES:</span>
              <span className="font-bold text-white">32 LINES</span>
            </div>
            <div className="text-slate-400 text-[7.5px] pt-0.5 border-t border-[#2A2A36] truncate">
              PROJECTION MATRIX: STABLE
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
