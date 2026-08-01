import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Rocket, RotateCw, Shield, Compass } from 'lucide-react';
import { useCyberSFX } from '../../hooks/useCyberSFX';

export const Ship3DWireframeWidget: React.FC = () => {
  const { playClickSFX } = useCyberSFX();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pitch, setPitch] = useState(12);
  const [roll, setRoll] = useState(-4);
  const [yaw, setYaw] = useState(45);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angleX = 0.2;
    let angleY = 0.4;
    let angleZ = 0;

    // 3D Ship Mesh Vertices (USCSS Nostromo Shuttle Concept)
    const nodes = [
      { x: 0, y: -45, z: 0 },   // Nose Tip
      { x: -25, y: -15, z: 12 }, // Left Cockpit Wing
      { x: 25, y: -15, z: 12 },  // Right Cockpit Wing
      { x: -35, y: 35, z: 18 },  // Left Main Wing Tip
      { x: 35, y: 35, z: 18 },   // Right Main Wing Tip
      { x: 0, y: 45, z: 10 },    // Tail Engine Top
      { x: 0, y: 45, z: -15 },   // Tail Engine Bottom
      { x: -20, y: 25, z: -10 }, // Left Engine Intake
      { x: 20, y: 25, z: -10 }   // Right Engine Intake
    ];

    // Edges connecting vertices
    const edges = [
      [0, 1], [0, 2], [1, 2],
      [1, 3], [2, 4], [3, 5], [4, 5],
      [3, 7], [4, 8], [7, 6], [8, 6],
      [5, 6], [0, 5], [1, 7], [2, 8]
    ];

    const project = (x: number, y: number, z: number) => {
      // Rotation matrices around X, Y, Z
      let radX = angleX;
      let radY = angleY;
      let radZ = angleZ;

      // Rotate X
      let y1 = y * Math.cos(radX) - z * Math.sin(radX);
      let z1 = y * Math.sin(radX) + z * Math.cos(radX);

      // Rotate Y
      let x2 = x * Math.cos(radY) + z1 * Math.sin(radY);
      let z2 = -x * Math.sin(radY) + z1 * Math.cos(radY);

      // Rotate Z
      let x3 = x2 * Math.cos(radZ) - y1 * Math.sin(radZ);
      let y3 = x2 * Math.sin(radZ) + y1 * Math.cos(radZ);

      // Perspective projection
      const fov = 180;
      const scale = fov / (fov + z2);
      return {
        x: canvas.width / 2 + x3 * scale,
        y: canvas.height / 2 + y3 * scale
      };
    };

    const drawShip = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!isDraggingRef.current) {
        angleY += 0.015;
        angleX += 0.008;
      }

      setPitch(Math.round(Math.sin(angleX) * 25));
      setRoll(Math.round(Math.cos(angleZ) * 15));
      setYaw(Math.round((angleY * 180 / Math.PI) % 360));

      // Draw Grid Target Box
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

      // Draw 3D Edges
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

      // Draw Glowing Vertices
      nodes.forEach((n) => {
        const proj = project(n.x, n.y, n.z);
        ctx.fillStyle = '#FF007F';
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, 2.5, 0, Math.PI * 2);
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
        badge="VECTOR MESH ONLINE"
        badgeColor="cyan"
      />

      <div className="grid grid-cols-12 gap-3 h-full items-center">
        {/* Left: Interactive 3D Wireframe Canvas */}
        <div className="col-span-6 bg-[#121218] border border-[#00F0FF]/30 rounded-xl p-2 flex flex-col items-center justify-center h-full relative cursor-grab active:cursor-grabbing">
          <canvas ref={canvasRef} width={140} height={110} className="w-full h-full object-contain" />
          <div className="absolute bottom-1 right-2 font-mono text-[8px] text-slate-500">
            DRAG TO ROTATE
          </div>
        </div>

        {/* Right: Flight Vector Telemetry */}
        <div className="col-span-6 flex flex-col justify-between h-full space-y-1 py-0.5 font-mono text-[10px]">
          <div className="bg-[#1A1A24]/70 border border-[#2A2A36] rounded-lg p-2 space-y-1">
            <div className="text-[#00F0FF] font-bold flex justify-between">
              <span>ORIENTATION</span>
              <span className="text-[#00FF66]">STABLE</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>PITCH:</span>
              <span className="font-bold text-white">{pitch > 0 ? `+${pitch}°` : `${pitch}°`}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>ROLL:</span>
              <span className="font-bold text-white">{roll > 0 ? `+${roll}°` : `${roll}°`}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>YAW:</span>
              <span className="font-bold text-white">{yaw}°</span>
            </div>
          </div>

          <div className="bg-[#1A1A24]/70 border border-[#2A2A36] rounded-lg p-2 space-y-1">
            <div className="text-amber-400 font-bold flex justify-between">
              <span>HULL INTEGRITY</span>
              <span className="text-[#00FF66]">99.4%</span>
            </div>
            <div className="w-full bg-[#121218] h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[99.4%]" />
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
