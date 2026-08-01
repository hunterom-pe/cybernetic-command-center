import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Sun, Cloud, Wind, Droplets, Thermometer } from 'lucide-react';
import { useWeatherData } from '../../hooks/useWeatherData';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';

export const PhoenixWeatherStation: React.FC = () => {
  const weather = useWeatherData();

  return (
    <GlassCard>
      <WidgetHeader icon={Sun} prefix="WEATHER" title={`${weather.cityName.toUpperCase()} METEOROLOGY`} badge="TELEMETRY" />

      <div className="grid grid-cols-12 gap-3 h-full items-center">
        {/* Left: Temp & Current Stats */}
        <div className="col-span-5 bg-[#1A1A24]/60 border border-[#2A2A36] rounded-lg p-2.5 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
            <span className="truncate max-w-[110px] font-bold">{weather.cityName.toUpperCase()}</span>
            <span className="text-[#FF6B00] font-bold">{weather.condition}</span>
          </div>

          <div className="flex items-center space-x-3 my-1">
            <div className="font-mono text-3xl font-extrabold text-slate-100 glow-orange">
              {weather.temperatureF}°F
            </div>
            <div className="font-mono text-[10px] text-slate-400">
              <div>HI: <span className="text-[#FF6B00] font-bold">{weather.highF}°F</span></div>
              <div>LO: <span className="text-[#00F0FF] font-bold">{weather.lowF}°F</span></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px] border-t border-[#2A2A36]/60 pt-1.5">
            <div className="flex items-center space-x-1 text-slate-400">
              <Droplets size={12} className="text-[#00F0FF]" />
              <span>HUM: <strong className="text-slate-200">{weather.humidityPercent}%</strong></span>
            </div>
            <div className="flex items-center space-x-1 text-slate-400">
              <Wind size={12} className="text-[#00FF66]" />
              <span>WIND: <strong className="text-slate-200">{weather.windSpeedMph} MPH</strong></span>
            </div>
          </div>
        </div>

        {/* Right: 5-Day Temp Curve */}
        <div className="col-span-7 bg-[#1A1A24]/60 border border-[#2A2A36] rounded-lg p-2.5 flex flex-col justify-between h-full">
          <div className="font-mono text-[10px] text-slate-400 mb-1">
            5-DAY TELEMETRY TEMP CURVE (°F)
          </div>

          <div className="h-20 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weather.fiveDayForecast}>
                <defs>
                  <linearGradient id="weatherGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#FF6B00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#8E8EA0', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#121218', borderColor: '#2A2A36', borderRadius: '6px', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="high" stroke="#FF6B00" strokeWidth={2} fillOpacity={1} fill="url(#weatherGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
