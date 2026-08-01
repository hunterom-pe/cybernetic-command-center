import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Plane, Compass, Cloud, ShieldAlert } from 'lucide-react';

interface AirportInfo {
  code: string;
  name: string;
  city: string;
  status: 'ON TIME' | 'MINOR DELAYS' | 'WEATHER HOLD';
  tempF: number;
  delayIndex: string;
}

const AIRPORTS: AirportInfo[] = [
  { code: 'PHX', name: 'Sky Harbor Intl', city: 'Phoenix, AZ', status: 'ON TIME', tempF: 104, delayIndex: '0.2 MIN' },
  { code: 'JFK', name: 'John F. Kennedy Intl', city: 'New York, NY', status: 'ON TIME', tempF: 82, delayIndex: '1.4 MIN' },
  { code: 'MAD', name: 'Adolfo Suárez Barajas', city: 'Madrid, Spain', status: 'MINOR DELAYS', tempF: 91, delayIndex: '8.2 MIN' }
];

export const AirspaceRadarWidget: React.FC = () => {
  return (
    <GlassCard>
      <WidgetHeader icon={Plane} prefix="AIRSPACE RADAR" title="GLOBAL AIRPORT & FLIGHT STATUS" badge="RADAR FEED" />

      <div className="grid grid-cols-3 gap-2.5 h-full items-center">
        {AIRPORTS.map((ap) => {
          const isDelayed = ap.status !== 'ON TIME';

          return (
            <div
              key={ap.code}
              className="bg-[#1A1A24]/60 border border-[#2A2A36] rounded-lg p-2.5 flex flex-col justify-between h-full hover:border-slate-500 transition-colors"
            >
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="font-bold text-[#00F0FF] tracking-wider">{ap.code} // {ap.city}</span>
                <span
                  className={`px-1.5 py-0.2 rounded font-bold ${
                    isDelayed
                      ? 'bg-amber-950/80 text-[#FF6B00] border border-amber-500/30'
                      : 'bg-emerald-950/80 text-[#00FF66] border border-emerald-500/30'
                  }`}
                >
                  {ap.status}
                </span>
              </div>

              <div className="my-1">
                <div className="font-sans text-xs font-bold text-slate-100 truncate">{ap.name}</div>
                <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                  TEMP: <span className="text-[#FF6B00] font-bold">{ap.tempF}°F</span>
                </div>
              </div>

              <div className="font-mono text-[9px] text-slate-400 border-t border-[#2A2A36]/60 pt-1.5 flex justify-between">
                <span>RUNWAY DELAY:</span>
                <span className={isDelayed ? 'text-[#FF6B00] font-bold' : 'text-[#00FF66] font-bold'}>
                  {ap.delayIndex}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};
