import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Music, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useSpotifyPlayback } from '../../hooks/useSpotifyPlayback';

export const SpotifyNowPlaying: React.FC = () => {
  const { playback, togglePlayPause, nextTrack, previousTrack, setVolume } = useSpotifyPlayback(3000);

  const progressPercent = Math.min(100, Math.max(0, (playback.positionMs / playback.durationMs) * 100));

  return (
    <GlassCard>
      <WidgetHeader icon={Music} prefix="SPOTIFY" title="NOW PLAYING // AUDIO" badge={playback.isPlaying ? 'PLAYING' : 'PAUSED'} badgeColor="magenta" />

      <div className="flex items-center space-x-3 h-full py-0.5">
        {/* Album Artwork */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-[#2A2A36] shrink-0 group">
          <img
            src={playback.artworkUrl}
            alt={playback.trackName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Animated 8-bar Equalizer Overlay */}
          {playback.isPlaying && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-end justify-center space-x-0.5 p-1.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-[#FF007F] rounded-t animate-equalizer"
                  style={{
                    animationDuration: `${0.4 + (i % 4) * 0.2}s`,
                    height: `${30 + (i * 12) % 60}%`
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Track Details & Controls */}
        <div className="flex-1 flex flex-col justify-between h-full py-0.5 min-w-0">
          <div>
            <div className="font-sans font-bold text-slate-100 text-xs sm:text-sm truncate leading-tight">
              {playback.trackName}
            </div>
            <div className="font-mono text-[11px] text-[#FF007F] font-semibold truncate">
              {playback.artistName}
            </div>
            <div className="font-mono text-[9px] text-slate-400 truncate">
              {playback.albumName}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#121218] rounded-full h-1 overflow-hidden border border-[#2A2A36] my-0.5">
            <div className="bg-[#FF007F] h-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>

          {/* Player Buttons & Volume */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <button
                onClick={previousTrack}
                className="p-1 rounded-lg bg-[#1A1A24] border border-[#2A2A36] text-slate-300 hover:text-white hover:border-[#FF007F]/50 transition-all"
                title="Previous Track"
              >
                <SkipBack size={12} strokeWidth={1.5} />
              </button>

              <button
                onClick={togglePlayPause}
                className="p-1.5 rounded-full bg-[#FF007F] text-white shadow-[0_0_10px_rgba(255,0,127,0.5)] hover:scale-105 transition-all"
                title={playback.isPlaying ? 'Pause' : 'Play'}
              >
                {playback.isPlaying ? <Pause size={12} strokeWidth={1.5} /> : <Play size={12} strokeWidth={1.5} className="ml-0.5" />}
              </button>

              <button
                onClick={nextTrack}
                className="p-1 rounded-lg bg-[#1A1A24] border border-[#2A2A36] text-slate-300 hover:text-white hover:border-[#FF007F]/50 transition-all"
                title="Next Track"
              >
                <SkipForward size={12} strokeWidth={1.5} />
              </button>
            </div>

            {/* Volume Slider */}
            <div className="flex items-center space-x-1 w-16 sm:w-20">
              <Volume2 size={11} className="text-slate-400 shrink-0" />
              <input
                type="range"
                min={0}
                max={100}
                value={playback.volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full accent-[#FF007F] h-1 bg-[#121218] rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
