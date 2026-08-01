import { SystemTelemetryData } from '../main/services/systemStats';
import { SpotifyTrackState } from '../main/services/spotifyService';
import { CalendarEvent } from '../main/services/calendarService';

declare global {
  interface Window {
    electronAPI?: {
      getSystemTelemetry: () => Promise<SystemTelemetryData>;
      getSpotifyState: () => Promise<SpotifyTrackState>;
      controlSpotify: (action: 'playpause' | 'next' | 'previous' | 'volume', value?: number) => Promise<boolean>;
      getCalendarEvents: () => Promise<CalendarEvent[]>;
      requestCalendarPermission: () => Promise<boolean>;
      openCalendarSettings: () => Promise<boolean>;
      setAlwaysOnTop: (flag: boolean) => Promise<boolean>;
      toggleFullscreen: () => Promise<boolean>;
      openExternalUrl: (url: string) => Promise<boolean>;
      readClipboard: () => Promise<string>;
      writeClipboard: (text: string) => Promise<boolean>;
      executeShellCmd: (command: string) => Promise<{ stdout: string; stderr: string; exitCode: number }>;
    };
  }
}

export {};
