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

export function useSpotifyPlayback(pollingMs: number = 2000) {
  const [playback, setPlayback] = useState<SpotifyPlaybackState>({
    isRunning: true,
    isPlaying: false,
    trackName: 'Connecting Spotify...',
    artistName: 'Launch Spotify macOS App',
    albumName: 'NEXUS OS Telemetry',
    artworkUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400&auto=format&fit=crop',
    volume: 80,
    durationMs: 200000,
    positionMs: 0
  });

  const pollSpotify = async () => {
    if (window.electronAPI) {
      try {
        const state = await window.electronAPI.getSpotifyState();
        if (state) {
          setPlayback(state);
        }
      } catch (e) {
        console.error('Spotify IPC error:', e);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    pollSpotify();
    const interval = setInterval(() => {
      if (isMounted) {
        pollSpotify();
      }
    }, pollingMs);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [pollingMs]);

  const togglePlayPause = async () => {
    if (window.electronAPI) {
      await window.electronAPI.controlSpotify('playpause');
      setTimeout(pollSpotify, 300);
    }
  };

  const nextTrack = async () => {
    if (window.electronAPI) {
      await window.electronAPI.controlSpotify('next');
      setTimeout(pollSpotify, 400);
    }
  };

  const previousTrack = async () => {
    if (window.electronAPI) {
      await window.electronAPI.controlSpotify('previous');
      setTimeout(pollSpotify, 400);
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
    setVolume,
    refresh: pollSpotify
  };
}
