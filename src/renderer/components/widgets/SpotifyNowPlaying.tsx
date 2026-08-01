import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Music, Play, Pause, SkipBack, SkipForward, Volume2, Activity, Disc, Zap } from 'lucide-react';
import { useSpotifyPlayback } from '../../hooks/useSpotifyPlayback';
import { useTheme } from '../../context/ThemeContext';
import { useCyberSFX } from '../../hooks/useCyberSFX';

type VisualizerMode = 'bars' | 'circular' | 'matrix';

export const SpotifyNowPlaying: React.FC = () => {
  const { playback, togglePlayPause, nextTrack, previousTrack } = useSpotifyPlayback(2000);
  const { colors } = useTheme();
  const { playClickSFX, playToggleSFX } = useCyberSFX();
  const [visMode, setVisMode] = useState<VisualizerMode>('bars');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animated Visualizer Canvas Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const drawVisualizer = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      if (visMode === 'bars') {
        // Mode 1: 32-Band Cyber Spectrum Analyzer
        const numBars = 32;
        const barWidth = (w - (numBars - 1) * 3) / numBars;

        for (let i = 0; i < numBars; i++) {
          // Dynamic frequency height simulation based on playback position & index
          const base = Math.sin(phase + i * 0.25) * 0.4 + 0.5;
          const noise = Math.random() * 0.25;
          const value = playback.isPlaying ? Math.min(1, Math.max(0.1, base + noise)) : 0.08;

          const barHeight = value * (h - 10);
          const x = i * (barWidth + 3);
          const y = h - barHeight;

          // Gradient: Primary Color -> Secondary Color
          const grad = ctx.createLinearGradient(0, h, 0, 0);
          grad.addColorStop(0, colors.primary);
          grad.addColorStop(0.6, '#FF007F');
          grad.addColorStop(1, '#FF6B00');

          ctx.fillStyle = grad;
          ctx.fillRect(x, y, barWidth, barHeight);

          // Top Peak Cap Dot
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(x, Math.max(0, y - 3), barWidth, 2);
        }
      } else if (visMode === 'circular') {
        // Mode 2: Circular Oscilloscope / Vector Scope
        const cx = w / 2;
        const cy = h / 2;
        const radius = Math.min(w, h) / 2 - 12;

        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = 2;
        ctx.beginPath();

        const points = 48;
        for (let i = 0; i <= points; i++) {
          const angle = (i / points) * Math.PI * 2;
          const wave = playback.isPlaying ? Math.sin(phase * 2 + i * 0.5) * 12 : 2;
          const r = radius + wave;
          const px = cx + Math.cos(angle) * r;
          const py = cy + Math.sin(angle) * r;

          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

        // Inner Pulsing Core
        ctx.fillStyle = playback.isPlaying ? '#FF007F' : '#2A2A36';
        ctx.beginPath();
        ctx.arc(cx, cy, Math.abs(Math.sin(phase) * 10) + 8, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Mode 3: 3D Peak Wave Matrix
        const cols = 20;
        const rows = 10;
        const cellW = w / cols;
        const cellH = h / rows;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const val = Math.sin(phase + c * 0.3 + r * 0.4);
            const intensity = playback.isPlaying ? (val + 1) / 2 : 0.1;

            ctx.fillStyle = intensity > 0.65 ? colors.primary : intensity > 0.35 ? '#FF007F' : 'rgba(26, 26, 36, 0.6)';
            ctx.fillRect(c * cellW + 1, r * cellH + 1, cellW - 2, cellH - 2);
          }
        }
      }

      phase += playback.isPlaying ? 0.08 : 0.02;
      animId = requestAnimationFrame(drawVisualizer);
    };

    drawVisualizer();
    return () => cancelAnimationFrame(animId);
  }, [visMode, playback.isPlaying, colors.primary]);

  return (
    <GlassCard>
      <WidgetHeader
        icon={Music}
        prefix="AUDIO SPECTRUM"
        title="CYBERPUNK AUDIO VISUALIZER // LOGIC"
        badge={playback.isPlaying ? 'LIVE AUDIO' : 'PAUSED'}
        badgeColor={playback.isPlaying ? 'cyan' : 'magenta'}
        actions={
          <div className="flex items-center space-x-1">
            <button
              onClick={() => {
                playToggleSFX();
                setVisMode((prev) => (prev === 'bars' ? 'circular' : prev === 'circular' ? 'matrix' : 'bars'));
              }}
              className="px-2 py-0.5 rounded bg-[#1A1A24] border border-[#2A2A36] text-[#00F0FF] hover:border-[#00F0FF] font-mono text-[9px] font-bold uppercase transition-all"
              title="Toggle Visualizer Mode"
            >
              {visMode.toUpperCase()} MODE
            </button>
          </div>
        }
      />

      <div className="flex flex-col justify-between h-full space-y-2">
        {/* Main Visualizer Canvas & VU Meters */}
        <div className="grid grid-cols-12 gap-2 bg-[#121218] border border-[#2A2A36] rounded-xl p-2 h-28 items-center relative overflow-hidden">
          {/* Left Channel VU Meter */}
          <div className="col-span-1 flex flex-col justify-between h-full items-center py-1">
            <span className="font-mono text-[8px] text-slate-400">L</span>
            <div className="w-2 flex-1 bg-[#1A1A24] rounded-full overflow-hidden flex flex-col-reverse p-0.5">
              <div
                className="w-full bg-gradient-to-t from-[#00F0FF] via-[#FF007F] to-[#FF6B00] rounded-full transition-all duration-150"
                style={{ height: playback.isPlaying ? `${Math.floor(60 + Math.random() * 35)}%` : '10%' }}
              />
            </div>
            <span className="font-mono text-[7px] text-emerald-400 font-bold">dB</span>
          </div>

          {/* Center Canvas Audio Visualizer */}
          <div className="col-span-10 h-full flex items-center justify-center relative">
            <canvas ref={canvasRef} width={280} height={90} className="w-full h-full object-contain" />
          </div>

          {/* Right Channel VU Meter */}
          <div className="col-span-1 flex flex-col justify-between h-full items-center py-1">
            <span className="font-mono text-[8px] text-slate-400">R</span>
            <div className="w-2 flex-1 bg-[#1A1A24] rounded-full overflow-hidden flex flex-col-reverse p-0.5">
              <div
                className="w-full bg-gradient-to-t from-[#00F0FF] via-[#FF007F] to-[#FF6B00] rounded-full transition-all duration-150"
                style={{ height: playback.isPlaying ? `${Math.floor(60 + Math.random() * 35)}%` : '10%' }}
              />
            </div>
            <span className="font-mono text-[7px] text-emerald-400 font-bold">dB</span>
          </div>
        </div>

        {/* Bottom Playback Control Sub-Bar */}
        <div className="bg-[#1A1A24]/60 border border-[#2A2A36] rounded-xl p-2 flex items-center justify-between font-mono text-xs">
          {/* Active Track Title & Artist Info */}
          <div className="flex items-center space-x-2.5 truncate max-w-[60%]">
            <img
              src={playback.artworkUrl}
              alt="Album Cover"
              className="w-8 h-8 rounded border border-[#00F0FF]/30 object-cover shrink-0"
            />
            <div className="truncate">
              <div className="font-bold text-slate-100 truncate text-[11px]">
                {playback.trackName}
              </div>
              <div className="text-slate-400 truncate text-[9px]">
                {playback.artistName}
              </div>
            </div>
          </div>

          {/* Playback Transport Controls */}
          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              onClick={() => { playClickSFX(); previousTrack(); }}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#2A2A36]"
              title="Previous Track"
            >
              <SkipBack size={13} />
            </button>

            <button
              onClick={() => { playClickSFX(); togglePlayPause(); }}
              className="p-1.5 rounded-full bg-[#00F0FF] text-black hover:scale-110 transition-transform font-bold"
              title={playback.isPlaying ? 'Pause' : 'Play'}
            >
              {playback.isPlaying ? <Pause size={13} /> : <Play size={13} />}
            </button>

            <button
              onClick={() => { playClickSFX(); nextTrack(); }}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#2A2A36]"
              title="Next Track"
            >
              <SkipForward size={13} />
            </button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
