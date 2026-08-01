import React, { useState, useEffect } from 'react';
import RGL, { WidthProvider, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { ThemeProvider, useTheme } from './context/ThemeContext';
import { HeaderBanner } from './components/common/HeaderBanner';
import { SettingsModal } from './components/common/SettingsModal';
import { CommandBar } from './components/common/CommandBar';
import { FixedCyberBackground } from './components/common/FixedCyberBackground';
import { MatrixDigitalRain } from './components/common/MatrixDigitalRain';
import { CyberScreensaver } from './components/common/CyberScreensaver';
import { QuickLink, DirectiveItem } from './types/hud';

// All 27 Functional Widgets
import { DualMissionClocks } from './components/widgets/DualMissionClocks';
import { SystemPerformanceHUD } from './components/widgets/SystemPerformanceHUD';
import { MarketWatchHUD } from './components/widgets/MarketWatchHUD';
import { CryptoTelemetryWatch } from './components/widgets/CryptoTelemetryWatch';
import { PhoenixWeatherStation } from './components/widgets/PhoenixWeatherStation';
import { SpotifyNowPlaying } from './components/widgets/SpotifyNowPlaying';
import { AmbientSoundGenerator } from './components/widgets/AmbientSoundGenerator';
import { AppleCalendarFeed } from './components/widgets/AppleCalendarFeed';
import { CurrentWeekDirectives } from './components/widgets/CurrentWeekDirectives';
import { NextWeekStaging } from './components/widgets/NextWeekStaging';
import { PomodoroSprintHUD } from './components/widgets/PomodoroSprintHUD';
import { MilestoneCountdown } from './components/widgets/MilestoneCountdown';
import { WebQuickLauncher } from './components/widgets/WebQuickLauncher';
import { QuickClipboardStash } from './components/widgets/QuickClipboardStash';
import { HabitStreakTracker } from './components/widgets/HabitStreakTracker';
import { DailyStoicBriefing } from './components/widgets/DailyStoicBriefing';
import { AquariusHoroscope } from './components/widgets/AquariusHoroscope';
import { GratitudeJournal } from './components/widgets/GratitudeJournal';
import { GitHubTelemetryWidget } from './components/widgets/GitHubTelemetryWidget';

import { SysProcessesWidget } from './components/widgets/SysProcessesWidget';
import { NetworkSpeedWidget } from './components/widgets/NetworkSpeedWidget';
import { TechNewsRSSWidget } from './components/widgets/TechNewsRSSWidget';
import { AirspaceRadarWidget } from './components/widgets/AirspaceRadarWidget';
import { TerminalCLIWidget } from './components/widgets/TerminalCLIWidget';
import { NeuralAIWidget } from './components/widgets/NeuralAIWidget';
import { VoightKampffWidget } from './components/widgets/VoightKampffWidget';
import { XenomorphTrackerWidget } from './components/widgets/XenomorphTrackerWidget';

const ReactGridLayout = WidthProvider(RGL);

// Custom Requested Layout:
// Row 0: All System Processes & Telemetry (sys_perf, sys_processes, clocks)
// Row 2: Weather, Spotify, Calendar
// Rows 4+: Organized Tactical Groups
const DEFAULT_LAYOUT: Layout[] = [
  // ROW 0: ALL SYSTEM PROCESSES & TELEMETRY AT TOP
  { i: 'sys_perf', x: 0, y: 0, w: 4, h: 2, minW: 3, minH: 2 },
  { i: 'sys_processes', x: 4, y: 0, w: 4, h: 2, minW: 3, minH: 2 },
  { i: 'clocks', x: 8, y: 0, w: 4, h: 2, minW: 3, minH: 2 },

  // ROW 2: WEATHER, SPOTIFY & CALENDAR
  { i: 'weather', x: 0, y: 2, w: 4, h: 2, minW: 3, minH: 2 },
  { i: 'spotify', x: 4, y: 2, w: 4, h: 2, minW: 3, minH: 2 },
  { i: 'calendar', x: 8, y: 2, w: 4, h: 2, minW: 3, minH: 2 },

  // ROW 4: MARKETS, CRYPTO & NETWORK TELEMETRY
  { i: 'markets', x: 0, y: 4, w: 4, h: 2, minW: 3, minH: 2 },
  { i: 'crypto', x: 4, y: 4, w: 4, h: 2, minW: 3, minH: 2 },
  { i: 'network_speed', x: 8, y: 4, w: 4, h: 2, minW: 3, minH: 2 },

  // ROW 6: GITHUB & CYBER NEWS RSS FEED
  { i: 'github', x: 0, y: 6, w: 6, h: 2, minW: 4, minH: 2 },
  { i: 'tech_news', x: 6, y: 6, w: 6, h: 2, minW: 4, minH: 2 },

  // ROW 8: TERMINAL CLI, NEURAL AI & AIRSPACE RADAR
  { i: 'terminal', x: 0, y: 8, w: 6, h: 2, minW: 4, minH: 2 },
  { i: 'neural_ai', x: 6, y: 8, w: 6, h: 2, minW: 4, minH: 2 },
  { i: 'airspace_radar', x: 0, y: 10, w: 12, h: 2, minW: 6, minH: 2 },

  // ROW 12: XENOMORPH TRACKER, VOIGHT-KAMPFF & POMODORO
  { i: 'xenomorph_tracker', x: 0, y: 12, w: 4, h: 2, minW: 3, minH: 2 },
  { i: 'voight_kampff', x: 4, y: 12, w: 4, h: 2, minW: 3, minH: 2 },
  { i: 'pomodoro', x: 8, y: 12, w: 4, h: 2, minW: 3, minH: 2 },

  // ROW 14: DIRECTIVES, STAGING & AMBIENT AUDIO
  { i: 'directives', x: 0, y: 14, w: 4, h: 2, minW: 3, minH: 2 },
  { i: 'staging', x: 4, y: 14, w: 4, h: 2, minW: 3, minH: 2 },
  { i: 'ambient', x: 8, y: 14, w: 4, h: 2, minW: 3, minH: 2 },

  // ROWS 16+: PRODUCTIVITY, MINDSET & GRATITUDE
  { i: 'milestone', x: 0, y: 16, w: 4, h: 2, minW: 3, minH: 2 },
  { i: 'launcher', x: 4, y: 16, w: 4, h: 2, minW: 3, minH: 2 },
  { i: 'clipboard', x: 8, y: 16, w: 4, h: 2, minW: 3, minH: 2 },
  { i: 'habits', x: 0, y: 18, w: 4, h: 2, minW: 3, minH: 2 },
  { i: 'stoic', x: 4, y: 18, w: 4, h: 2, minW: 3, minH: 2 },
  { i: 'horoscope', x: 8, y: 18, w: 4, h: 2, minW: 3, minH: 2 },
  { i: 'gratitude', x: 0, y: 20, w: 12, h: 2, minW: 4, minH: 2 }
];

const MainContent: React.FC = () => {
  const { settings } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);
  const [isScreensaverActive, setIsScreensaverActive] = useState(false);

  // Auto-Idle Detection (3 Minutes Inactivity)
  useEffect(() => {
    let idleTimer: any;

    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        setIsScreensaverActive(true);
      }, 180000); // 3 minutes
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      resetIdleTimer();
      // Hotkey: Cmd + Shift + S or Ctrl + Shift + S
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setIsScreensaverActive((prev) => !prev);
      }
    };

    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', resetIdleTimer);

    resetIdleTimer();

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', resetIdleTimer);
    };
  }, []);

  const [layout, setLayout] = useState<Layout[]>(() => {
    const saved = localStorage.getItem('hud_grid_layout_v6');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_LAYOUT;
  });

  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [tasks, setTasks] = useState<DirectiveItem[]>([]);

  useEffect(() => {
    localStorage.setItem('hud_grid_layout_v6', JSON.stringify(layout));
  }, [layout]);

  const handleResetLayout = () => {
    setLayout(DEFAULT_LAYOUT);
    localStorage.removeItem('hud_grid_layout_v6');
  };

  const hiddenSet = new Set(settings.hiddenWidgets || []);

  const widgetMap: Record<string, React.ReactNode> = {
    sys_perf: <SystemPerformanceHUD />,
    sys_processes: <SysProcessesWidget />,
    clocks: <DualMissionClocks />,
    weather: <PhoenixWeatherStation />,
    spotify: <SpotifyNowPlaying />,
    calendar: <AppleCalendarFeed />,
    markets: <MarketWatchHUD />,
    crypto: <CryptoTelemetryWatch />,
    network_speed: <NetworkSpeedWidget />,
    github: <GitHubTelemetryWidget />,
    tech_news: <TechNewsRSSWidget />,
    terminal: <TerminalCLIWidget />,
    neural_ai: <NeuralAIWidget />,
    airspace_radar: <AirspaceRadarWidget />,
    xenomorph_tracker: <XenomorphTrackerWidget />,
    voight_kampff: <VoightKampffWidget />,
    pomodoro: <PomodoroSprintHUD />,
    directives: <CurrentWeekDirectives onTasksChange={(t) => setTasks(t)} />,
    staging: <NextWeekStaging />,
    ambient: <AmbientSoundGenerator />,
    milestone: <MilestoneCountdown />,
    launcher: <WebQuickLauncher />,
    clipboard: <QuickClipboardStash />,
    habits: <HabitStreakTracker />,
    stoic: <DailyStoicBriefing />,
    horoscope: <AquariusHoroscope />,
    gratitude: <GratitudeJournal />
  };

  const visibleLayout = layout.filter((item) => !hiddenSet.has(item.i));

  return (
    <div className="relative min-h-screen flex flex-col bg-[#08080C] text-slate-100 selection:bg-[#00F0FF]/30">
      {/* Fixed Static Cyberpunk Grid Background & Reticles */}
      <FixedCyberBackground />

      {/* Animated Matrix Digital Rain Canvas */}
      <MatrixDigitalRain />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Edge-to-Edge Panoramic City Header Banner */}
        <HeaderBanner
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenCommandBar={() => setIsCommandBarOpen(true)}
          onTriggerScreensaver={() => setIsScreensaverActive(true)}
        />

        {/* Fullscreen Ambient Cyberdeck Screensaver Overlay */}
        <CyberScreensaver
          isActive={isScreensaverActive}
          onWake={() => setIsScreensaverActive(false)}
        />

        {/* Main Draggable Widget Grid */}
        <main className="flex-1 p-4 sm:p-6 max-w-[1920px] w-full mx-auto">
          <ReactGridLayout
            className="layout"
            layout={visibleLayout}
            cols={12}
            rowHeight={105}
            margin={[16, 16]}
            draggableHandle=".drag-handle"
            onLayoutChange={(newLayout) => {
              if (!settings.isGridLocked) {
                setLayout((prev) => {
                  const map = new Map(prev.map((l) => [l.i, l]));
                  newLayout.forEach((l) => map.set(l.i, l));
                  return Array.from(map.values());
                });
              }
            }}
            isDraggable={!settings.isGridLocked}
            isResizable={!settings.isGridLocked}
          >
            {Object.entries(widgetMap).map(([id, node]) => {
              if (hiddenSet.has(id)) return null;
              return <div key={id}>{node}</div>;
            })}
          </ReactGridLayout>
        </main>

        {/* Settings Modal */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onResetLayout={handleResetLayout}
        />

        {/* Global Cmd + K Search Modal */}
        <CommandBar
          isOpen={isCommandBarOpen}
          onClose={() => setIsCommandBarOpen(false)}
          quickLinks={quickLinks}
          tasks={tasks}
        />
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <MainContent />
    </ThemeProvider>
  );
};

export default App;
