import type { Mode, TimeOption } from '../types';
import { RefreshCw, Menu, FileText, Mountain, MonitorPlay } from 'lucide-react';

interface StatsBarProps {
  wpm: number;
  accuracy: number;
  timeLeft: number;
  mode: Mode;
  onReset: () => void;
  onTimeChange: (time: TimeOption) => void;
  onModeChange: (mode: Mode) => void;
  currentTime: TimeOption;
  isActive: boolean;
}

export default function StatsBar({
  wpm,
  accuracy,
  timeLeft,
  mode,
  onReset,
  onTimeChange,
  onModeChange,
  currentTime,
  isActive
}: StatsBarProps) {
  
  return (
    <div className={`flex flex-wrap items-center justify-between gap-4 p-4 border-b border-[var(--color-claude-border)] bg-[var(--color-claude-bg)] rounded-xl mb-6 shadow-sm transition-opacity duration-300 w-full ${isActive ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
      
      {/* Live Stats side */}
      <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto justify-center md:justify-start">
        <div className="flex flex-col">
          <span className="text-[10px] text-[var(--color-claude-sub)] font-semibold uppercase tracking-wider mb-0.5">Speed</span>
          <span className="text-xl md:text-2xl font-bold tracking-tight text-[var(--color-claude-text)] leading-none">{Math.round(wpm)}<span className="text-sm font-normal text-[var(--color-claude-sub)] ml-0.5">WPM</span></span>
        </div>
        <div className="w-px h-8 bg-[var(--color-claude-border)]" />
        <div className="flex flex-col">
           <span className="text-[10px] text-[var(--color-claude-sub)] font-semibold uppercase tracking-wider mb-0.5">Accuracy</span>
           <span className="text-xl md:text-2xl font-bold tracking-tight text-[var(--color-claude-text)] leading-none">{Math.round(accuracy)}<span className="text-sm font-normal text-[var(--color-claude-sub)] ml-0.5">%</span></span>
        </div>
        <div className="w-px h-8 bg-[var(--color-claude-border)]" />
        <div className="flex flex-col">
           <span className="text-[10px] text-[var(--color-claude-sub)] font-semibold uppercase tracking-wider mb-0.5">Time</span>
           <span className="text-xl md:text-2xl font-bold tracking-tight text-[var(--color-claude-text)] leading-none">{timeLeft}<span className="text-sm font-normal text-[var(--color-claude-sub)] ml-0.5">s</span></span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 w-full xl:w-auto">
        {/* Mode Selector */}
        <div className="flex items-center bg-[var(--color-claude-bg)] border border-[var(--color-claude-border)] shadow-sm rounded-lg p-1">
          {(['time', 'words', 'quote', 'zen'] as Mode[]).map((m) => {
             let Icon = MonitorPlay;
             if (m === 'words') Icon = Menu;
             if (m === 'quote') Icon = FileText;
             if (m === 'zen') Icon = Mountain;

             return (
               <button
                 key={m}
                 onClick={() => onModeChange(m)}
                 className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                   mode === m 
                     ? 'bg-[var(--color-claude-surface)] text-[var(--color-claude-main)] shadow-sm border border-[var(--color-claude-border)]' 
                     : 'text-[var(--color-claude-sub)] hover:text-[var(--color-claude-text)] border border-transparent'
                 }`}
               >
                 <Icon className="w-3.5 h-3.5" /> <span className="capitalize">{m}</span>
               </button>
             );
          })}
        </div>

        {/* Time Selector */}
        {mode === 'time' && (
          <div className="flex items-center bg-[var(--color-claude-bg)] border border-[var(--color-claude-border)] shadow-sm rounded-lg p-1">
            {([15, 30, 60, 120] as TimeOption[]).map((t) => (
              <button
                key={t}
                onClick={() => onTimeChange(t)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  currentTime === t 
                     ? 'bg-[var(--color-claude-surface)] text-[var(--color-claude-main)] shadow-sm border border-[var(--color-claude-border)]' 
                     : 'text-[var(--color-claude-sub)] hover:text-[var(--color-claude-text)] border border-transparent'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={onReset}
          className="p-2 border border-[var(--color-claude-border)] shadow-sm rounded-lg text-[var(--color-claude-sub)] hover:text-[var(--color-claude-text)] bg-[var(--color-claude-surface)] hover:bg-[var(--color-claude-bg)] transition-all group"
          title="Restart Test"
        >
          <RefreshCw className="w-4 h-4 group-hover:-rotate-90 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
}
