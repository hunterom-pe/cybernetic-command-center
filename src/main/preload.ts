import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getSystemTelemetry: () => ipcRenderer.invoke('get-system-telemetry'),
  getSpotifyState: () => ipcRenderer.invoke('get-spotify-state'),
  controlSpotify: (action: 'playpause' | 'next' | 'previous' | 'volume', value?: number) =>
    ipcRenderer.invoke('control-spotify', action, value),
  getCalendarEvents: () => ipcRenderer.invoke('get-calendar-events'),
  requestCalendarPermission: () => ipcRenderer.invoke('request-calendar-permission'),
  openCalendarSettings: () => ipcRenderer.invoke('open-calendar-settings'),
  setAlwaysOnTop: (flag: boolean) => ipcRenderer.invoke('set-always-on-top', flag),
  toggleFullscreen: () => ipcRenderer.invoke('toggle-fullscreen'),
  openExternalUrl: (url: string) => ipcRenderer.invoke('open-external-url', url),
  readClipboard: () => ipcRenderer.invoke('read-clipboard'),
  writeClipboard: (text: string) => ipcRenderer.invoke('write-clipboard', text),
  executeShellCmd: (command: string) => ipcRenderer.invoke('execute-shell-cmd', command)
});
