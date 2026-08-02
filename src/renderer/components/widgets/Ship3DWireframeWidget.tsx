import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Rocket } from 'lucide-react';

export const Ship3DWireframeWidget: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pitch, setPitch] = useState(12);
  const [roll, setRoll] = useState(-4);
  const [yaw, setYaw] = useState(45);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angleX = 0.2;
    let angleY = 0.4;
    let angleZ = 0;

    const nodes = [
      { x: 0, y: -35, z: 0 },
      { x: -20, y: -10, z: 10 },
      { x: 20, y: -10, z: 10 },
      { x: -28, y: 28, z: 14 },
      { x: 28, y: 28, z: 14 },
      { x: 0, y: 35, z: 8 },
      { x: 0, y: 35, z: -12 },
      { x: -16, y: 20, z: -8 },
      { x: 16, y: 20, z: -8 }
    ];

    const edges = [
      [0, 1], [0, 2], [1, 2],
      [1, 3], [2, 4], [3, 5], [4, 5],
      [3, 7], [4, 8], [7, 6], [8, 6],
      [5, 6], [0, 5], [1, 7], [2, 8]
    ];

    const project = (x: number, y: number, z: number) => {
      let radX = angleX;
      let radY = angleY;
      let radZ = angleZ;

      let y1 = y * Math.cos(radX) - z * Math.sin(radX);
      let z1 = y * Math.sin(radX) + z * Math.cos(radX);

      let x2 = x * Math.cos(radY) + z1 * Math.sin(radY);
      let z2 = -x * Math.sin(radY) + z1 * Math.cos(radY);

      let x3 = x2 * Math.cos(radZ) - y1 * Math.sin(radZ);
      let y3 = x2 * Math.sin(radZ) + y1 * Math.cos(radZ);

      const fov = 150;
      const scale = fov / (fov + z2);
      return {
        x: canvas.width / 2 + x3 * scale,
        y: canvas.height / 2 + y3 * scale
      };
    };

    const drawShip = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      angleY += 0.015;
      angleX += 0.008;

      setPitch(Math.round(Math.sin(angleX) * 25));
      setRoll(Math.round(Math.cos(angleZ) * 15));
      setYaw(Math.round((angleY * 180 / Math.PI) % 360));

      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 1.5;

      edges.forEach(([p1, p2]) => {
        const n1 = nodes[p1];
        const n2 = nodes[p2];
        const proj1 = project(n1.x, n1.y, n1.z);
        const proj2 = project(n2.x, n2.y, n2.z);

        ctx.beginPath();
        ctx.moveTo(proj1.x, proj1.y);
        ctx.lineTo(proj2.x, proj2.y);
        ctx.stroke();
      });

      nodes.forEach((n) => {
        const proj = project(n.x, n.y, n.z);
        ctx.fillStyle = '#FF007F';
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(drawShip);
    };

    drawShip();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <GlassCard>
      <WidgetHeader
        icon={Rocket}
        prefix="FLIGHT TELEMETRY"
        title="USCSS STARFREIGHTER 3D WIREFRAME"
        badge="VECTOR MESH: OK"
        badgeColor="cyan"
      />

      <div className="grid grid-cols-12 gap-2 h-full items-center overflow-hidden">
        {/* Left: 3D Wireframe Canvas */}
        <div className="col-span-5 bg-[#121218] border border-[#00F0FF]/30 rounded-lg p-1 flex items-center justify-center h-[90px]">
          <canvas ref={canvasRef} width={110} height={75} className="w-full h-full object-contain" />
        </div>

        {/* Right: Flight Vector Telemetry */}
        <div className="col-span-7 flex flex-col justify-between h-[90px] font-mono text-[9px]">
          <div className="bg-[#1A1A24]/70 border border-[#2A2A36] rounded-lg p-1.5 space-y-0.5">
            <div className="text-[#00F0FF] font-bold flex justify-between">
              <span>ORIENTATION</span>
              <span className="text-[#00FF66]">STABLE</span>
            </div>
            <div className="flex justify-between text-slate-300 text-[8px]">
              <span>PITCH:</span>
              <span className="font-bold text-white">{pitch > 0 ? `+${pitch}°` : `${pitch}°`}</span>
            </div>
            <div className="flex justify-between text-slate-300 text-[8px]">
              <span>ROLL:</span>
              <span className="font-bold text-white">{roll > 0 ? `+${roll}°` : `${roll}°`}</span>
            </div>
            <div className="flex justify-between text-slate-300 text-[8px]">
              <span>YAW:</span>
              <span className="font-bold text-white">{yaw}°</span>
            </div>
            <div className="text-[#00FF66] text-[7.5px] pt-0.5 border-t border-[#2A2A36] flex justify-between">
              <span>HULL INTEGRITY:</span>
              <span className="font-bold">99.4%</span>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
