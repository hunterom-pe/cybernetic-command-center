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
import { QuickLink, DirectiveItem } from './types/hud';

// All 26 Functional Widgets
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

// Blade Runner Voight-Kampff Test Widget
import { VoightKampffWidget } from './components/widgets/VoightKampffWidget';

const ReactGridLayout = WidthProvider(RGL);

// Organized into 5 Tactical Zones with Varied Sizes
const DEFAULT_LAYOUT: Layout[] = [
  // ZONE 1: SYSTEM & NETWORK TELEMETRY (Row 0)
  { i: 'clocks', x: 0, y: 0, w: 4, h: 2, minW: 3, minH: 2 },
  { i: 'sys_perf', x: 4, y: 0, w: 4, h: 2, minW: 3, minH: 2 },
  { i: 'sys_processes', x: 8, y: 0, w: 4, h: 2, minW: 3, minH: 2 },

  // ZONE 2: MARKETS, TECH & NETWORK SPEED (Rows 2 & 4)
  { i: 'markets', x: 0, y: 2, w: 4, h: 2, minW: 3, minH: 2 },
  { i: 'crypto', x: 4, y: 2, w: 4, h: 2, minW: 3, minH: 2 },
  { i: 'network_speed', x: 8, y: 2, w: 4, h: 2, minW: 3, minH: 2 },
  { i: 'github', x: 0, y: 4, w: 6, h: 2, minW: 4, minH: 2 },
  { i: 'tech_news', x: 6, y: 4, w: 6, h: 2, minW: 4, minH: 2 },

  // ZONE 3: DEVELOPER & NEURAL AI ENGINE (Rows 6 & 8)
  { i: 'terminal', x: 0, y: 6, w: 6, h: 2, minW: 4, minH: 2 },
  { i: 'neural_ai', x: 6, y: 6, w: 6, h: 2, minW: 4, minH: 2 },
  { i: 'airspace_radar', x: 0, y: 8, w: 12, h: 2, minW: 6, minH: 2 },

  // ZONE 4: BLADE RUNNER, FOCUS SPRINTS & DIRECTIVES (Rows 10 & 12)
  { i: 'voight_kampff', x: 0, y: 10, w: 4, h: 2, minW: 3, minH: 2 },
  { i: 'calendar', x: 4, y: 10, w: 4, h: 2, minW: 3, minH: 2 },
  { i: 'directives', x: 8, y: 10, w: 4, h: 2, minW: 3, minH: 2 },
  { i: 'weather', x: 0, y: 12, w: 4, h: 2, minW: 3, minH: 2 },
  { i: 'pomodoro', x: 4, y: 12, w: 4, h: 2, minW: 3, minH: 2 },
  { i: 'staging', x: 8, y: 12, w: 4, h: 2, minW: 3, minH: 2 },

  // ZONE 5: AUDIO, PRODUCTIVITY & MINDSET (Rows 14, 16 & 18)
  { i: 'spotify', x: 0, y: 14, w: 6, h: 2, minW: 4, minH: 2 },
  { i: 'ambient', x: 6, y: 14, w: 6, h: 2, minW: 4, minH: 2 },
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

  const [layout, setLayout] = useState<Layout[]>(() => {
    const saved = localStorage.getItem('hud_grid_layout_v4');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_LAYOUT;
  });

  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [tasks, setTasks] = useState<DirectiveItem[]>([]);

  useEffect(() => {
    localStorage.setItem('hud_grid_layout_v4', JSON.stringify(layout));
  }, [layout]);

  const handleResetLayout = () => {
    setLayout(DEFAULT_LAYOUT);
    localStorage.removeItem('hud_grid_layout_v4');
  };

  const hiddenSet = new Set(settings.hiddenWidgets || []);

  const widgetMap: Record<string, React.ReactNode> = {
    clocks: <DualMissionClocks />,
    sys_perf: <SystemPerformanceHUD />,
    sys_processes: <SysProcessesWidget />,
    markets: <MarketWatchHUD />,
    crypto: <CryptoTelemetryWatch />,
    network_speed: <NetworkSpeedWidget />,
    github: <GitHubTelemetryWidget />,
    tech_news: <TechNewsRSSWidget />,
    terminal: <TerminalCLIWidget />,
    neural_ai: <NeuralAIWidget />,
    airspace_radar: <AirspaceRadarWidget />,
    voight_kampff: <VoightKampffWidget />,
    calendar: <AppleCalendarFeed />,
    directives: <CurrentWeekDirectives onTasksChange={(t) => setTasks(t)} />,
    weather: <PhoenixWeatherStation />,
    pomodoro: <PomodoroSprintHUD />,
    staging: <NextWeekStaging />,
    spotify: <SpotifyNowPlaying />,
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
