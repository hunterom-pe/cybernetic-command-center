import { execFile } from 'child_process';
import util from 'util';

const execFileAsync = util.promisify(execFile);

export interface SpotifyTrackState {
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

export async function fetchSpotifyState(): Promise<SpotifyTrackState> {
  const script = `
tell application "System Events"
  set isRunning to (name of processes) contains "Spotify"
end tell
if isRunning then
  tell application "Spotify"
    set pState to player state as string
    set tName to name of current track
    set tArtist to artist of current track
    set tAlbum to album of current track
    set tVol to sound volume as string
    set tDur to duration of current track as string
    set tPos to player position as string
    set tArt to ""
    try
      set tArt to artwork url of current track
    end try
    return pState & "|||" & tName & "|||" & tArtist & "|||" & tAlbum & "|||" & tArt & "|||" & tVol & "|||" & tDur & "|||" & tPos
  end tell
else
  return "NOT_RUNNING"
end if
  `;

  try {
    const { stdout } = await execFileAsync('osascript', ['-e', script]);
    const output = stdout.trim();

    if (output === 'NOT_RUNNING' || !output.includes('|||')) {
      return getFallbackSpotifyState(false);
    }

    const parts = output.split('|||');
    const isPlaying = parts[0] === 'playing';
    const trackName = parts[1] || 'No Active Track';
    const artistName = parts[2] || 'Unknown Artist';
    const albumName = parts[3] || 'Unknown Album';
    const rawArtwork = parts[4] || '';

    // Handle artwork URL (convert spotify:image: if necessary or fallback)
    let artworkUrl = rawArtwork;
    if (rawArtwork.startsWith('spotify:image:')) {
      const imgId = rawArtwork.replace('spotify:image:', '');
      artworkUrl = `https://i.scdn.co/image/${imgId}`;
    } else if (!rawArtwork || !rawArtwork.startsWith('http')) {
      artworkUrl = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop';
    }

    const volume = parseInt(parts[5], 10) || 80;
    const durationMs = parseInt(parts[6], 10) || 210000;
    const positionMs = Math.round((parseFloat(parts[7]) || 0) * 1000);

    return {
      isRunning: true,
      isPlaying,
      trackName,
      artistName,
      albumName,
      artworkUrl,
      volume,
      durationMs,
      positionMs
    };
  } catch (err) {
    return getFallbackSpotifyState(false);
  }
}

export async function controlSpotify(action: 'playpause' | 'next' | 'previous' | 'volume', value?: number): Promise<boolean> {
  let script = '';
  if (action === 'playpause') {
    script = `tell application "Spotify" to playpause`;
  } else if (action === 'next') {
    script = `tell application "Spotify" to next track`;
  } else if (action === 'previous') {
    script = `tell application "Spotify" to previous track`;
  } else if (action === 'volume' && value !== undefined) {
    script = `tell application "Spotify" to set sound volume to ${Math.min(100, Math.max(0, value))}`;
  }

  try {
    await execFileAsync('osascript', ['-e', script]);
    return true;
  } catch (err) {
    return false;
  }
}

function getFallbackSpotifyState(simulatedPlaying = false): SpotifyTrackState {
  return {
    isRunning: false,
    isPlaying: simulatedPlaying,
    trackName: 'No Track Playing',
    artistName: 'Launch Spotify Desktop App',
    albumName: 'Spotify Telemetry Offline',
    artworkUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400&auto=format&fit=crop',
    volume: 80,
    durationMs: 204000,
    positionMs: 0
  };
}
