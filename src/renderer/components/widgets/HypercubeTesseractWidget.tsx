import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Box, Layers } from 'lucide-react';
import { useCyberSFX } from '../../hooks/useCyberSFX';

type PolytopeShape = 'tesseract' | 'octahedron' | 'icosahedron';

export const HypercubeTesseractWidget: React.FC = () => {
  const { playClickSFX } = useCyberSFX();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [shape, setShape] = useState<PolytopeShape>('tesseract');

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
        // Inner and Outer Cubes
        const outerSize = 38;
        const innerSize = 18;

        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        // Outer Cube Vertices
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

        // Inner Cube Vertices
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

          return {
            x: cx + rx,
            y: cy + ry
          };
        };

        const projOuter = outerNodes.map(project);
        const projInner = innerNodes.map(project);

        const cubeEdges = [
          [0, 1], [1, 2], [2, 3], [3, 0],
          [4, 5], [5, 6], [6, 7], [7, 4],
          [0, 4], [1, 5], [2, 6], [3, 7]
        ];

        // Draw Outer Cube
        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 1.5;
        cubeEdges.forEach(([p1, p2]) => {
          ctx.beginPath();
          ctx.moveTo(projOuter[p1].x, projOuter[p1].y);
          ctx.lineTo(projOuter[p2].x, projOuter[p2].y);
          ctx.stroke();
        });

        // Draw Inner Cube
        ctx.strokeStyle = '#FF007F';
        ctx.lineWidth = 1.5;
        cubeEdges.forEach(([p1, p2]) => {
          ctx.beginPath();
          ctx.moveTo(projInner[p1].x, projInner[p1].y);
          ctx.lineTo(projInner[p2].x, projInner[p2].y);
          ctx.stroke();
        });

        // Draw Hypercube Connecting Rays
        ctx.strokeStyle = 'rgba(0, 255, 102, 0.6)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 8; i++) {
          ctx.beginPath();
          ctx.moveTo(projOuter[i].x, projOuter[i].y);
          ctx.lineTo(projInner[i].x, projInner[i].y);
          ctx.stroke();
        }
      } else {
        // Octahedron
        const r = 36;
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
          let rz = p.x * sin + p.z * cos;
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
        prefix="QUANTUM GEOMETRY"
        title="4D HYPERCUBE TESSERACT ENGINE"
        badge="GEOMETRY OK"
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

      <div className="grid grid-cols-12 gap-3 h-full items-center">
        {/* Left: Tesseract Canvas */}
        <div className="col-span-6 bg-[#121218] border border-[#FF007F]/30 rounded-xl p-2 flex items-center justify-center h-full">
          <canvas ref={canvasRef} width={140} height={110} className="w-full h-full object-contain" />
        </div>

        {/* Right: Sub-Space Dimension Details */}
        <div className="col-span-6 flex flex-col justify-between h-full space-y-1 py-0.5 font-mono text-[10px]">
          <div className="bg-[#1A1A24]/70 border border-[#2A2A36] rounded-lg p-2 space-y-1">
            <div className="text-[#FF007F] font-bold flex justify-between">
              <span>DIMENSION</span>
              <span>4D MATRIX</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>VERTICES:</span>
              <span className="font-bold text-white">16 NODES</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>EDGES:</span>
              <span className="font-bold text-white">32 LINES</span>
            </div>
          </div>

          <div className="bg-[#1A1A24]/70 border border-[#2A2A36] rounded-lg p-2 font-mono text-[9px] text-slate-400">
            SUB-SPACE TESSERACT PROJECTION: STABLE
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
