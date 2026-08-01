import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Coins, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useCryptoData } from '../../hooks/useCryptoData';

export const CryptoTelemetryWatch: React.FC = () => {
  const cryptos = useCryptoData(5000);

  return (
    <GlassCard>
      <WidgetHeader icon={Coins} prefix="CRYPTO" title="DECENTRALIZED TELEMETRY" badge="COINGECKO FEED" />

      <div className="grid grid-cols-3 gap-2.5 h-full items-center">
        {cryptos.map((coin) => {
          const isPos = coin.change24hPercent >= 0;

          return (
            <div
              key={coin.id}
              className="bg-[#1A1A24]/60 border border-[#2A2A36] rounded-lg p-2.5 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="font-bold text-[#00F0FF] tracking-wider">{coin.symbol} // {coin.name}</span>
                <div className={`flex items-center space-x-0.5 px-1.5 py-0.5 rounded font-bold ${isPos ? 'bg-emerald-950/80 text-[#00FF66] border border-emerald-500/30' : 'bg-rose-950/80 text-[#FF3B30] border border-rose-500/30'}`}>
                  {isPos ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  <span>{isPos ? '+' : ''}{coin.change24hPercent}%</span>
                </div>
              </div>

              <div className="font-mono text-lg font-extrabold text-slate-100 glow-cyan my-1">
                ${coin.priceUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>

              <div className="grid grid-cols-2 gap-1 font-mono text-[9px] text-slate-400 border-t border-[#2A2A36]/60 pt-1.5 mt-1">
                <div>
                  <span className="text-slate-500">24H HIGH:</span> <span className="text-slate-200 font-bold">${coin.high24h.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500">24H LOW:</span> <span className="text-slate-200 font-bold">${coin.low24h.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};
