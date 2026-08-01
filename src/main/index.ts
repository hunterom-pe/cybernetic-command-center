import { app, BrowserWindow, ipcMain, globalShortcut, shell, clipboard } from 'electron';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import util from 'util';
import { fetchSystemTelemetry } from './services/systemStats';
import { fetchSpotifyState, controlSpotify } from './services/spotifyService';
import { fetchAppleCalendarEvents, requestCalendarPermission, openCalendarPrivacySettings } from './services/calendarService';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 1024,
    minHeight: 768,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 16, y: 16 },
    backgroundColor: '#08080C',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false // allow external imagery/APIs smoothly
    }
  });

  const devUrl = process.env.VITE_DEV_SERVER_URL;
  const rendererHtmlPath = path.join(__dirname, '../dist-renderer/index.html');

  if (devUrl) {
    mainWindow.loadURL(devUrl).catch(() => {
      if (fs.existsSync(rendererHtmlPath)) {
        mainWindow?.loadFile(rendererHtmlPath);
      }
    });
  } else if (fs.existsSync(rendererHtmlPath)) {
    mainWindow.loadFile(rendererHtmlPath);
  } else {
    mainWindow.loadURL('http://localhost:5173').catch(() => {});
  }

  mainWindow.once('ready-to-show', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  // Register Global Hotkey (Cmd+Shift+D or Option+Space) to summon/hide dashboard window
  try {
    globalShortcut.register('CommandOrControl+Shift+D', () => {
      toggleWindowVisibility();
    });

    globalShortcut.register('Option+Space', () => {
      toggleWindowVisibility();
    });
  } catch (err) {
    console.error('Failed to register global hotkey:', err);
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
});

function toggleWindowVisibility() {
  if (!mainWindow) return;
  if (mainWindow.isVisible() && mainWindow.isFocused()) {
    mainWindow.hide();
  } else {
    mainWindow.show();
    mainWindow.focus();
  }
}

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Telemetry Handlers
ipcMain.handle('get-system-telemetry', async () => {
  return await fetchSystemTelemetry();
});

// IPC Spotify Handlers
ipcMain.handle('get-spotify-state', async () => {
  return await fetchSpotifyState();
});

ipcMain.handle('control-spotify', async (_, action: 'playpause' | 'next' | 'previous' | 'volume', value?: number) => {
  return await controlSpotify(action, value);
});

// IPC Calendar Handlers
ipcMain.handle('get-calendar-events', async () => {
  return await fetchAppleCalendarEvents();
});

ipcMain.handle('request-calendar-permission', async () => {
  return await requestCalendarPermission();
});

ipcMain.handle('open-calendar-settings', async () => {
  return await openCalendarPrivacySettings();
});

// Window Control Handlers
ipcMain.handle('set-always-on-top', (_, flag: boolean) => {
  if (mainWindow) {
    mainWindow.setAlwaysOnTop(flag, 'floating');
    return mainWindow.isAlwaysOnTop();
  }
  return false;
});

ipcMain.handle('toggle-fullscreen', () => {
  if (mainWindow) {
    const isFS = mainWindow.isFullScreen();
    mainWindow.setFullScreen(!isFS);
    return !isFS;
  }
  return false;
});

// Shell & Clipboard Handlers
ipcMain.handle('open-external-url', async (_, url: string) => {
  if (url) {
    await shell.openExternal(url);
    return true;
  }
  return false;
});

ipcMain.handle('read-clipboard', () => {
  return clipboard.readText();
});

ipcMain.handle('write-clipboard', (_, text: string) => {
  clipboard.writeText(text);
  return true;
});

// Shell CLI Handler
ipcMain.handle('execute-shell-cmd', async (_, command: string) => {
  if (!command || typeof command !== 'string') {
    return { stdout: '', stderr: 'Invalid command', exitCode: 1 };
  }
  try {
    const execAsync = util.promisify(exec);
    const { stdout, stderr } = await execAsync(command, { cwd: process.cwd(), timeout: 10000 });
    return { stdout, stderr, exitCode: 0 };
  } catch (err: any) {
    return { stdout: err.stdout || '', stderr: err.message || 'Command execution failed', exitCode: err.code || 1 };
  }
});
