import React, { useState, useEffect } from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Newspaper, ExternalLink, RefreshCw } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  timeAgo: string;
}

const INITIAL_NEWS: NewsItem[] = [
  { id: 'n1', title: 'Quantum Telemetry Processors Reach 1000-Qubit Threshold', source: 'Hacker News', url: 'https://news.ycombinator.com', timeAgo: '12m ago' },
  { id: 'n2', title: 'Open-Source AI Models Surpass Commercial Benchmarks in Autonomous Coding', source: 'Ars Technica', url: 'https://arstechnica.com', timeAgo: '35m ago' },
  { id: 'n3', title: 'Next-Gen Web Audio API Enables Hardware-Accelerated Spatial Synthesis', source: 'The Verge', url: 'https://theverge.com', timeAgo: '1h ago' },
  { id: 'n4', title: 'macOS Sonoma System Kernels Optimized for Low-Latency Real-Time Audio', source: 'TechCrunch', url: 'https://techcrunch.com', timeAgo: '2h ago' }
];

export const TechNewsRSSWidget: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);

  const openNewsUrl = (url: string) => {
    if (window.electronAPI) {
      window.electronAPI.openExternalUrl(url);
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <GlassCard>
      <WidgetHeader icon={Newspaper} prefix="CYBER NEWS" title="TECH & HACKER RSS FEED" badge="LIVE TICKER" />

      <div className="flex flex-col h-full justify-between space-y-1.5 p-1">
        <div className="space-y-1.5 overflow-y-auto max-h-[140px]">
          {news.map((item) => (
            <button
              key={item.id}
              onClick={() => openNewsUrl(item.url)}
              className="w-full p-2 rounded-lg bg-[#1A1A24]/60 border border-[#2A2A36] hover:border-[#00F0FF]/40 hover:bg-[#1A1A24] text-left transition-all group flex items-center justify-between"
            >
              <div className="space-y-0.5 truncate pr-2">
                <div className="font-sans text-xs font-semibold text-slate-100 group-hover:text-[#00F0FF] truncate">
                  {item.title}
                </div>
                <div className="font-mono text-[9px] text-slate-400 flex items-center space-x-2">
                  <span className="text-[#FF007F] font-bold">{item.source}</span>
                  <span>•</span>
                  <span>{item.timeAgo}</span>
                </div>
              </div>
              <ExternalLink size={12} className="text-slate-500 group-hover:text-[#00F0FF] shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};
