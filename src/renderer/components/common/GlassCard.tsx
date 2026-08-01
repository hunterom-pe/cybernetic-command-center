import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', glow = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`relative h-full w-full rounded-xl bg-[#121218]/85 backdrop-blur-md border border-[#2A2A36] p-3.5 flex flex-col justify-between overflow-hidden shadow-lg transition-all duration-300 ${
        glow ? 'border-[#00F0FF]/40 shadow-[0_0_15px_rgba(0,240,255,0.15)]' : 'hover:border-[#2A2A36]/90'
      } ${className}`}
    >
      {/* Faint Cyber Accent Line top left */}
      <div className="absolute top-0 left-0 w-8 h-[2px] bg-[#00F0FF]/60" />
      <div className="absolute top-0 left-0 h-8 w-[2px] bg-[#00F0FF]/60" />

      {/* Faint Cyber Accent Line bottom right */}
      <div className="absolute bottom-0 right-0 w-6 h-[2px] bg-[#FF007F]/50" />
      <div className="absolute bottom-0 right-0 h-6 w-[2px] bg-[#FF007F]/50" />

      {children}
    </motion.div>
  );
};
