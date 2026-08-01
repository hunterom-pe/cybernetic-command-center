import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useMarketData } from '../../hooks/useMarketData';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

export const MarketWatchHUD: React.FC = () => {
  const stocks = useMarketData(4000);

  return (
    <GlassCard>
      <WidgetHeader icon={TrendingUp} prefix="MARKETS" title="GLOBAL INDICES & EQUITIES" badge="REAL-TIME FEED" />

      <div className="grid grid-cols-5 gap-2 h-full items-center">
        {stocks.map((stock) => {
          const isPositive = stock.change >= 0;
          const strokeColor = isPositive ? '#00FF66' : '#FF3B30';
          const sparkData = stock.sparkline.map((v, i) => ({ val: v, idx: i }));

          return (
            <div
              key={stock.symbol}
              className="bg-[#1A1A24]/60 border border-[#2A2A36] rounded-lg p-2 flex flex-col justify-between hover:border-slate-600 transition-colors"
            >
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="font-bold text-slate-200">{stock.symbol}</span>
                <span className={`px-1 py-0.2 rounded font-bold ${isPositive ? 'bg-emerald-950/80 text-[#00FF66] border border-emerald-500/30' : 'bg-rose-950/80 text-[#FF3B30] border border-rose-500/30'}`}>
                  {isPositive ? '+' : ''}{stock.changePercent}%
                </span>
              </div>

              <div className="font-mono text-sm font-extrabold text-slate-100 my-1">
                ${stock.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>

              <div className="h-6 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparkData}>
                    <Line type="monotone" dataKey="val" stroke={strokeColor} strokeWidth={1.5} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="font-mono text-[9px] text-slate-400 flex items-center justify-between">
                <span>{isPositive ? 'GAIN' : 'DIP'}</span>
                <span className={isPositive ? 'text-[#00FF66]' : 'text-[#FF3B30]'}>
                  {isPositive ? '+' : ''}${stock.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};
