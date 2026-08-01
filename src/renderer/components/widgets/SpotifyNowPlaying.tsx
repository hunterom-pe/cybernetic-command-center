import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Music, Play, Pause, SkipBack, SkipForward, Volume2, Mic, MicOff, Disc } from 'lucide-react';
import { useSpotifyPlayback } from '../../hooks/useSpotifyPlayback';
import { useTheme } from '../../context/ThemeContext';
import { useCyberSFX } from '../../hooks/useCyberSFX';

type VisualizerMode = 'bars' | 'circular' | 'matrix';

export const SpotifyNowPlaying: React.FC = () => {
  const { playback, togglePlayPause, nextTrack, previousTrack } = useSpotifyPlayback(2000);
  const { colors } = useTheme();
  const { playClickSFX, playToggleSFX } = useCyberSFX();
  const [visMode, setVisMode] = useState<VisualizerMode>('bars');
  const [isLiveMicSync, setIsLiveMicSync] = useState(false);
  const [leftVu, setLeftVu] = useState(10);
  const [rightVu, setRightVu] = useState(10);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Toggle Live System / Microphone Audio Sync
  const toggleLiveAudioSync = async () => {
    playToggleSFX();
    if (isLiveMicSync) {
      // Turn off mic stream
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
      setIsLiveMicSync(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;

        source.connect(analyser);

        audioCtxRef.current = ctx;
        analyserRef.current = analyser;
        mediaStreamRef.current = stream;
        setIsLiveMicSync(true);
      } catch (err) {
        console.error('System Audio Capture permission denied:', err);
      }
    }
  };

  // Cleanup audio stream on unmount
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Animated Visualizer Canvas Engine (Real FFT vs Synthesized Beat)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;
    const dataArray = new Uint8Array(32);

    const drawVisualizer = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Fetch Real Web Audio Analyser Frequency Data if active
      if (isLiveMicSync && analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate Left/Right VU Level Average
        let sumL = 0;
        let sumR = 0;
        for (let i = 0; i < 16; i++) sumL += dataArray[i];
        for (let i = 16; i < 32; i++) sumR += dataArray[i];

        setLeftVu(Math.min(100, Math.max(10, Math.floor((sumL / (16 * 255)) * 100))));
        setRightVu(Math.min(100, Math.max(10, Math.floor((sumR / (16 * 255)) * 100))));
      } else {
        setLeftVu(playback.isPlaying ? Math.floor(50 + Math.random() * 45) : 10);
        setRightVu(playback.isPlaying ? Math.floor(50 + Math.random() * 45) : 10);
      }

      if (visMode === 'bars') {
        const numBars = 32;
        const barWidth = (w - (numBars - 1) * 3) / numBars;

        for (let i = 0; i < numBars; i++) {
          let value = 0.08;

          if (isLiveMicSync && analyserRef.current) {
            value = Math.min(1, Math.max(0.08, dataArray[i] / 255));
          } else if (playback.isPlaying) {
            const base = Math.sin(phase + i * 0.25) * 0.4 + 0.5;
            const noise = Math.random() * 0.25;
            value = Math.min(1, Math.max(0.1, base + noise));
          }

          const barHeight = value * (h - 10);
          const x = i * (barWidth + 3);
          const y = h - barHeight;

          const grad = ctx.createLinearGradient(0, h, 0, 0);
          grad.addColorStop(0, colors.primary);
          grad.addColorStop(0.6, '#FF007F');
          grad.addColorStop(1, '#FF6B00');

          ctx.fillStyle = grad;
          ctx.fillRect(x, y, barWidth, barHeight);

          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(x, Math.max(0, y - 3), barWidth, 2);
        }
      } else if (visMode === 'circular') {
        const cx = w / 2;
        const cy = h / 2;
        const radius = Math.min(w, h) / 2 - 12;

        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = 2;
        ctx.beginPath();

        const points = 32;
        for (let i = 0; i <= points; i++) {
          const angle = (i / points) * Math.PI * 2;
          let wave = 2;

          if (isLiveMicSync && analyserRef.current) {
            wave = (dataArray[i % 32] / 255) * 20;
          } else if (playback.isPlaying) {
            wave = Math.sin(phase * 2 + i * 0.5) * 12;
          }

          const r = radius + wave;
          const px = cx + Math.cos(angle) * r;
          const py = cy + Math.sin(angle) * r;

          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = playback.isPlaying || isLiveMicSync ? '#FF007F' : '#2A2A36';
        ctx.beginPath();
        ctx.arc(cx, cy, Math.abs(Math.sin(phase) * 10) + 8, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const cols = 20;
        const rows = 10;
        const cellW = w / cols;
        const cellH = h / rows;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            let intensity = 0.1;
            if (isLiveMicSync && analyserRef.current) {
              const val = dataArray[(c + r) % 32] / 255;
              intensity = val;
            } else if (playback.isPlaying) {
              const val = Math.sin(phase + c * 0.3 + r * 0.4);
              intensity = (val + 1) / 2;
            }

            ctx.fillStyle = intensity > 0.65 ? colors.primary : intensity > 0.35 ? '#FF007F' : 'rgba(26, 26, 36, 0.6)';
            ctx.fillRect(c * cellW + 1, r * cellH + 1, cellW - 2, cellH - 2);
          }
        }
      }

      phase += playback.isPlaying || isLiveMicSync ? 0.08 : 0.02;
      animId = requestAnimationFrame(drawVisualizer);
    };

    drawVisualizer();
    return () => cancelAnimationFrame(animId);
  }, [visMode, playback.isPlaying, isLiveMicSync, colors.primary]);

  return (
    <GlassCard>
      <WidgetHeader
        icon={Music}
        prefix="AUDIO SPECTRUM"
        title="CYBERPUNK AUDIO VISUALIZER // LOGIC"
        badge={isLiveMicSync ? 'LIVE AUDIO SYNC ON' : playback.isPlaying ? 'PLAYING' : 'PAUSED'}
        badgeColor={isLiveMicSync ? 'green' : playback.isPlaying ? 'cyan' : 'magenta'}
        actions={
          <div className="flex items-center space-x-1">
            {/* Live Audio Sync Button */}
            <button
              onClick={toggleLiveAudioSync}
              className={`px-2 py-0.5 rounded border font-mono text-[9px] font-bold uppercase transition-all flex items-center space-x-1 ${
                isLiveMicSync
                  ? 'bg-emerald-950 border-[#00FF66] text-[#00FF66]'
                  : 'bg-[#1A1A24] border-[#2A2A36] text-slate-400 hover:text-white'
              }`}
              title={isLiveMicSync ? 'Disable Live System Audio Sync' : 'Sync Visualizer Live to Microphone / Speaker Audio'}
            >
              {isLiveMicSync ? <Mic size={10} /> : <MicOff size={10} />}
              <span>{isLiveMicSync ? 'LIVE SYNC' : 'SYNC MIC'}</span>
            </button>

            {/* Mode Switcher */}
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
                className="w-full bg-gradient-to-t from-[#00F0FF] via-[#FF007F] to-[#FF6B00] rounded-full transition-all duration-75"
                style={{ height: `${leftVu}%` }}
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
                className="w-full bg-gradient-to-t from-[#00F0FF] via-[#FF007F] to-[#FF6B00] rounded-full transition-all duration-75"
                style={{ height: `${rightVu}%` }}
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
              className="p-1 rounded text-[#00F0FF] hover:text-white hover:bg-[#2A2A36]"
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
