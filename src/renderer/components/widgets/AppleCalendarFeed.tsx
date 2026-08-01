import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Calendar, MapPin, RefreshCw, ShieldCheck, ExternalLink } from 'lucide-react';
import { useAppleCalendar } from '../../hooks/useAppleCalendar';

export const AppleCalendarFeed: React.FC = () => {
  const { events, loading, refresh } = useAppleCalendar();

  const todayEvents = events.filter((e) => e.isToday);
  const tomorrowEvents = events.filter((e) => !e.isToday);

  const handleConnectCalendar = async () => {
    if (window.electronAPI) {
      await window.electronAPI.requestCalendarPermission();
      await window.electronAPI.openCalendarSettings();
    }
  };

  return (
    <GlassCard>
      <WidgetHeader
        icon={Calendar}
        prefix="CALENDAR"
        title="EVENTKIT AGENDA // macOS"
        badge={`${events.length} EVENTS`}
        badgeColor="magenta"
        actions={
          <div className="flex items-center space-x-1">
            <button
              onClick={handleConnectCalendar}
              title="Connect Apple Calendar / Open macOS Privacy Settings"
              className="px-2 py-0.5 rounded bg-pink-950/80 border border-[#FF007F]/40 text-[#FF007F] hover:bg-pink-900/80 font-mono text-[9px] font-bold uppercase transition-all flex items-center space-x-1"
            >
              <ShieldCheck size={10} />
              <span>CONNECT</span>
            </button>
            <button
              onClick={refresh}
              title="Refresh Apple Calendar Events"
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#1A1A24] transition-colors"
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        }
      />

      <div className="flex flex-col h-full overflow-hidden space-y-2">
        <div className="overflow-y-auto pr-1 space-y-2 max-h-[160px]">
          {/* Today Section */}
          <div>
            <div className="font-mono text-[10px] font-bold text-[#00F0FF] uppercase tracking-wider mb-1 flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
                <span>TODAY'S DIRECTIVES</span>
              </span>
              <button
                onClick={handleConnectCalendar}
                className="text-[9px] text-[#FF007F] font-mono hover:underline flex items-center space-x-0.5"
              >
                <span>GRANT PERMISSION</span>
                <ExternalLink size={9} />
              </button>
            </div>
            {todayEvents.length === 0 ? (
              <div className="font-mono text-[11px] text-slate-500 italic p-1.5 bg-[#1A1A24]/30 rounded flex justify-between items-center">
                <span>No events scheduled for today.</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                {todayEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-2 rounded-lg bg-[#1A1A24]/60 border border-[#2A2A36] hover:border-[#00F0FF]/40 transition-colors flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="font-sans text-xs font-semibold text-slate-100">{evt.title}</div>
                      {evt.location && (
                        <div className="font-mono text-[10px] text-slate-400 flex items-center space-x-1">
                          <MapPin size={10} className="text-slate-500" />
                          <span>{evt.location}</span>
                        </div>
                      )}
                    </div>
                    <div className="font-mono text-xs font-bold text-[#00F0FF] px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 shrink-0">
                      {evt.timeString}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tomorrow Section */}
          {tomorrowEvents.length > 0 && (
            <div className="pt-1">
              <div className="font-mono text-[10px] font-bold text-[#FF007F] uppercase tracking-wider mb-1 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF007F]" />
                <span>TOMORROW'S STAGING</span>
              </div>
              <div className="space-y-1.5">
                {tomorrowEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-2 rounded-lg bg-[#1A1A24]/60 border border-[#2A2A36] hover:border-[#FF007F]/40 transition-colors flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="font-sans text-xs font-semibold text-slate-200">{evt.title}</div>
                    </div>
                    <div className="font-mono text-xs font-bold text-[#FF007F] px-2 py-0.5 rounded bg-pink-950/60 border border-pink-500/30 shrink-0">
                      {evt.timeString}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};
