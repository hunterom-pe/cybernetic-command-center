import React, { createContext, useContext, useState, useEffect } from 'react';
import { ColorTheme, BannerImage, AppSettings, WeatherCity } from '../types/hud';

interface ThemeContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    border: string;
    glow: string;
  };
  exportConfig: () => void;
  importConfig: (jsonStr: string) => boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  colorTheme: 'neon',
  bannerImage: 'rainy-alley',
  isAlwaysOnTop: false,
  isFullScreen: false,
  use24HourClock: false,
  isGridLocked: false,
  sfxEnabled: true,
  matrixRainEnabled: true,
  weatherCity: 'phoenix',
  hiddenWidgets: []
};

const THEME_PALETTES: Record<ColorTheme, ThemeContextType['colors']> = {
  neon: {
    primary: '#00F0FF',
    secondary: '#FF007F',
    accent: '#FF6B00',
    border: '#00F0FF',
    glow: 'rgba(0, 240, 255, 0.4)'
  },
  ember: {
    primary: '#FF6B00',
    secondary: '#FF0055',
    accent: '#FFB700',
    border: '#FF6B00',
    glow: 'rgba(255, 107, 0, 0.4)'
  },
  matrix: {
    primary: '#00FF66',
    secondary: '#00F0FF',
    accent: '#0099FF',
    border: '#00FF66',
    glow: 'rgba(0, 255, 102, 0.4)'
  },
  amber: {
    primary: '#FFB000',
    secondary: '#FF7700',
    accent: '#FFD700',
    border: '#FFB000',
    glow: 'rgba(255, 176, 0, 0.4)'
  },
  chiba: {
    primary: '#00F0FF',
    secondary: '#808A87',
    accent: '#38BDF8',
    border: '#00F0FF',
    glow: 'rgba(0, 240, 255, 0.35)'
  },
  'voight-kampff': {
    primary: '#FF9900',
    secondary: '#FF0055',
    accent: '#00E5FF',
    border: '#FF9900',
    glow: 'rgba(255, 153, 0, 0.45)'
  },
  'weyland-yutani': {
    primary: '#FFB700',
    secondary: '#00FF66',
    accent: '#FF3300',
    border: '#FFB700',
    glow: 'rgba(255, 183, 0, 0.45)'
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('hud_app_settings');
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {}
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('hud_app_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const exportConfig = () => {
    const configData = {
      settings,
      layout: localStorage.getItem('hud_grid_layout_v5') ? JSON.parse(localStorage.getItem('hud_grid_layout_v5')!) : null,
      tasks: localStorage.getItem('hud_directive_tasks') ? JSON.parse(localStorage.getItem('hud_directive_tasks')!) : null,
      habits: localStorage.getItem('hud_habit_streaks') ? JSON.parse(localStorage.getItem('hud_habit_streaks')!) : null,
      quickLinks: localStorage.getItem('hud_web_quick_links') ? JSON.parse(localStorage.getItem('hud_web_quick_links')!) : null,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-os-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importConfig = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.settings) {
        setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
      }
      if (data.layout) {
        localStorage.setItem('hud_grid_layout_v5', JSON.stringify(data.layout));
      }
      if (data.tasks) {
        localStorage.setItem('hud_directive_tasks', JSON.stringify(data.tasks));
      }
      if (data.habits) {
        localStorage.setItem('hud_habit_streaks', JSON.stringify(data.habits));
      }
      if (data.quickLinks) {
        localStorage.setItem('hud_web_quick_links', JSON.stringify(data.quickLinks));
      }
      window.location.reload();
      return true;
    } catch (e) {
      return false;
    }
  };

  const colors = THEME_PALETTES[settings.colorTheme] || THEME_PALETTES.neon;

  return (
    <ThemeContext.Provider value={{ settings, updateSettings, colors, exportConfig, importConfig }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
