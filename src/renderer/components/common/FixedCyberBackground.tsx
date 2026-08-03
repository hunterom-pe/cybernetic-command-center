import React from 'react';
import cityBanner from '../../assets/city_banner.jpg';

export const FixedCyberBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Base Deep Obsidian Background */}
      <div className="absolute inset-0 bg-[#08080C]" />

      {/* Locked Fixed Cityscape Banner Image (Height 480px - 50% Taller) */}
      <div className="absolute top-0 left-0 right-0 h-[480px] overflow-hidden">
        <img
          src={cityBanner}
          alt="Cyberpunk City Skyline"
          className="w-full h-full object-cover object-center filter brightness-85 contrast-110 opacity-75"
        />

        {/* Vertical Fade Mask: City image fades seamlessly into deep black obsidian as you scroll down */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#08080C]/40 to-[#08080C]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08080C]/70 via-transparent to-[#08080C]/70" />
      </div>

      {/* Static Cyberpunk Grid Overlay */}
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
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-[#00F0FF]/15 via-[#FF007F]/5 to-transparent filter blur-3xl opacity-60" />

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
