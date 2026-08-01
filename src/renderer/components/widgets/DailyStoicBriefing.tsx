import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Quote, RefreshCw } from 'lucide-react';

interface StoicQuote {
  author: string;
  source: string;
  quote: string;
}

const STOIC_QUOTES: StoicQuote[] = [
  {
    author: 'MARCUS AURELIUS',
    source: 'Meditations, Book IV',
    quote: 'You have power over your mind - not outside events. Realize this, and you will find strength.'
  },
  {
    author: 'SENECA',
    source: 'Letters from a Stoic',
    quote: 'We suffer more often in imagination than in reality. True happiness is to enjoy the present without anxious dependence upon the future.'
  },
  {
    author: 'EPICTETUS',
    source: 'Enchiridion',
    quote: 'No man is free who is not master of himself. Wealth consists not in having great possessions, but in having few wants.'
  },
  {
    author: 'MARCUS AURELIUS',
    source: 'Meditations, Book V',
    quote: 'At dawn, when you have trouble getting out of bed, tell yourself: I have to go to work — as a human being.'
  },
  {
    author: 'SENECA',
    source: 'On the Shortness of Life',
    quote: 'Life is long if you know how to use it. It is not that we have a short time to live, but that we waste a lot of it.'
  }
];

export const DailyStoicBriefing: React.FC = () => {
  const [index, setIndex] = useState(0);

  const nextQuote = () => {
    setIndex((prev) => (prev + 1) % STOIC_QUOTES.length);
  };

  const current = STOIC_QUOTES[index];

  return (
    <GlassCard>
      <WidgetHeader
        icon={Quote}
        prefix="STOIC BRIEFING"
        title="PHILOSOPHICAL TELEMETRY"
        badge="DAILY WISDOM"
        actions={
          <button
            onClick={nextQuote}
            title="Refresh Quote"
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#1A1A24] transition-colors"
          >
            <RefreshCw size={12} />
          </button>
        }
      />

      <div className="flex flex-col justify-between h-full space-y-2 p-1">
        <blockquote className="font-sans italic text-xs text-slate-200 leading-relaxed border-l-2 border-[#00F0FF] pl-3 py-1">
          "{current.quote}"
        </blockquote>

        <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 pt-2 border-t border-[#2A2A36]">
          <span className="font-bold text-[#00F0FF]">// {current.author}</span>
          <span className="text-slate-500">{current.source}</span>
        </div>
      </div>
    </GlassCard>
  );
};
