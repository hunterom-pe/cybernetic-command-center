import { useState, useEffect } from 'react';

export interface SpotifyPlaybackState {
  isRunning: boolean;
  isPlaying: boolean;
  trackName: string;
  artistName: string;
  albumName: string;
  artworkUrl: string;
  volume: number;
  durationMs: number;
  positionMs: number;
}

export function useSpotifyPlayback(pollingMs: number = 3000) {
  const [playback, setPlayback] = useState<SpotifyPlaybackState>({
    isRunning: true,
    isPlaying: true,
    trackName: 'CYBERPUNK // Synthwave Odyssey',
    artistName: 'Kavinsky & Lazerhawk',
    albumName: 'Neon Nights 2077',
    artworkUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400&auto=format&fit=crop',
    volume: 75,
    durationMs: 220000,
    positionMs: 95000
  });

  useEffect(() => {
    let isMounted = true;

    const pollSpotify = async () => {
      if (window.electronAPI) {
        try {
          const state = await window.electronAPI.getSpotifyState();
          if (isMounted && state) {
            setPlayback(state);
          }
        } catch (e) {
          console.error('Spotify IPC error:', e);
        }
      } else {
        // Dev progress simulation
        if (isMounted) {
          setPlayback((prev) => {
            if (!prev.isPlaying) return prev;
            const nextPos = prev.positionMs + 3000;
            return {
              ...prev,
              positionMs: nextPos > prev.durationMs ? 0 : nextPos
            };
          });
        }
      }
    };

    pollSpotify();
    const interval = setInterval(pollSpotify, pollingMs);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [pollingMs]);

  const togglePlayPause = async () => {
    setPlayback((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
    if (window.electronAPI) {
      await window.electronAPI.controlSpotify('playpause');
    }
  };

  const nextTrack = async () => {
    if (window.electronAPI) {
      await window.electronAPI.controlSpotify('next');
    } else {
      setPlayback((prev) => ({
        ...prev,
        trackName: 'HYPER_DRIVE // Midnight Run',
        artistName: 'The Midnight',
        positionMs: 0
      }));
    }
  };

  const previousTrack = async () => {
    if (window.electronAPI) {
      await window.electronAPI.controlSpotify('previous');
    } else {
      setPlayback((prev) => ({
        ...prev,
        trackName: 'TECHNO_CORE // Reborn',
        artistName: 'Carpenter Brut',
        positionMs: 0
      }));
    }
  };

  const setVolume = async (val: number) => {
    setPlayback((prev) => ({ ...prev, volume: val }));
    if (window.electronAPI) {
      await window.electronAPI.controlSpotify('volume', val);
    }
  };

  return {
    playback,
    togglePlayPause,
    nextTrack,
    previousTrack,
    setVolume
  };
}
