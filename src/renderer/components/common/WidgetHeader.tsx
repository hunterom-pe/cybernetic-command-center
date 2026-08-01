import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface WidgetHeaderProps {
  icon: LucideIcon;
  prefix: string;
  title: string;
  badge?: string;
  badgeColor?: 'cyan' | 'magenta' | 'orange' | 'green' | 'red';
  actions?: React.ReactNode;
}

export const WidgetHeader: React.FC<WidgetHeaderProps> = ({
  icon: Icon,
  prefix,
  title,
  badge,
  badgeColor = 'cyan',
  actions
}) => {
  const { colors } = useTheme();

  const getBadgeStyle = () => {
    switch (badgeColor) {
      case 'magenta':
        return 'bg-pink-950/60 text-[#FF007F] border-[#FF007F]/40';
      case 'orange':
        return 'bg-amber-950/60 text-[#FF6B00] border-[#FF6B00]/40';
      case 'green':
        return 'bg-emerald-950/60 text-[#00FF66] border-[#00FF66]/40';
      case 'red':
        return 'bg-rose-950/60 text-[#FF3B30] border-[#FF3B30]/40';
      default:
        return 'bg-cyan-950/60 text-[#00F0FF] border-[#00F0FF]/40';
    }
  };

  return (
    <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#2A2A36]/80 drag-handle cursor-move select-none">
      <div className="flex items-center space-x-2 overflow-hidden">
        <Icon
          size={16}
          strokeWidth={1.5}
          className="shrink-0 transition-all duration-300"
          style={{ color: colors.primary, filter: `drop-shadow(0 0 6px ${colors.primary})` }}
        />
        <div className="flex items-center space-x-1.5 font-mono text-xs tracking-wider truncate">
          <span className="font-bold uppercase" style={{ color: colors.primary }}>
            {prefix} //
          </span>
          <span className="text-slate-300 font-semibold">{title}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 shrink-0">
        {badge && (
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border uppercase tracking-wider ${getBadgeStyle()}`}>
            {badge}
          </span>
        )}
        {actions}
      </div>
    </div>
  );
};
