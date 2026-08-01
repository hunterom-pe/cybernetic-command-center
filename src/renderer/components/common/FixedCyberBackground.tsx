import React from 'react';

export const FixedCyberBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Base Deep Obsidian Background */}
      <div className="absolute inset-0 bg-[#08080C]" />

      {/* Static Cyberpunk 24px Grid Overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 240, 255, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 240, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Perspective 3D Neon Horizon Glow */}
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-[#00F0FF]/10 via-[#FF007F]/5 to-transparent filter blur-3xl opacity-60" />

      {/* CRT Scanline Texture Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
          backgroundSize: '100% 4px'
        }}
      />

      {/* Vignette Edge Shading */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(8,8,12,0.75)_100%)]" />

      {/* Four Viewport Reticle Corner Brackets */}
      <div className="absolute top-3 left-3 font-mono text-[9px] text-[#00F0FF]/40 tracking-widest uppercase">
        + SYS.NEXUS // 01
      </div>
      <div className="absolute top-3 right-3 font-mono text-[9px] text-[#00F0FF]/40 tracking-widest uppercase text-right">
        [ GRID.LOCK // OK ]
      </div>
      <div className="absolute bottom-3 left-3 font-mono text-[9px] text-[#FF007F]/40 tracking-widest uppercase">
        LAT.33.4484 // LON.-112.0740
      </div>
      <div className="absolute bottom-3 right-3 font-mono text-[9px] text-[#00FF66]/40 tracking-widest uppercase text-right">
        NEXUS_OS_CORE_V1.0
      </div>
    </div>
  );
};
