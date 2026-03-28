import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  ChevronRight,
  RotateCcw,
  Sparkles,
  ClipboardList,
  Target,
  Clock
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { TestResult } from '../types';

interface ResultModalProps {
  result: TestResult | null;
  isOpen: boolean;
  onReset: () => void;
  onClose: () => void;
}

export default function ResultModal({
  result,
  isOpen,
  onReset,
  onClose
}: ResultModalProps) {
  if (!result) return null;

  const chartData = (result.wpmHistory || []).map((wpm, index) => ({
    time: index + 1,
    wpm: wpm
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-[60] flex justify-center pt-[5vh] md:pt-[10vh] font-sans pb-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[var(--color-claude-bg)]/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 15 }}
            className="w-full max-w-[850px] bg-[var(--color-claude-surface)] border border-[var(--color-claude-border)] rounded-2xl z-10 flex flex-col pt-8 pb-6 shadow-xl h-fit max-h-[90vh] overflow-y-auto no-scrollbar"
          >
             <div className="px-8 pb-4 border-b border-[var(--color-claude-border)]/50 flex items-center gap-3">
                <div className="bg-[var(--color-claude-main)]/10 text-[var(--color-claude-main)] p-2 rounded-lg">
                   <Sparkles className="w-5 h-5" />
                </div>
                <h2 className="font-serif text-2xl font-semibold -mb-1">Your Results</h2>
             </div>

             <div className="px-8 py-8 flex flex-col md:flex-row gap-10">
                {/* Left Stats Grid */}
                <div className="w-full md:w-1/3 flex flex-col gap-6">
                   <div className="bg-[var(--color-claude-bg)] rounded-xl p-5 border border-[var(--color-claude-border)]/50">
                      <div className="flex items-center gap-2 mb-2">
                         <Zap className="w-4 h-4 text-[var(--color-claude-main)]" />
                         <span className="text-sm font-semibold text-[var(--color-claude-sub)] tracking-wide">SPEED</span>
                      </div>
                      <span className="text-6xl font-bold text-[var(--color-claude-text)] italic tracking-tighter">{Math.round(result.wpm)}<span className="text-xl font-normal not-italic text-[var(--color-claude-sub)] tracking-normal ml-1">WPM</span></span>
                   </div>

                   <div className="bg-[var(--color-claude-bg)] rounded-xl p-5 border border-[var(--color-claude-border)]/50">
                      <div className="flex items-center gap-2 mb-2">
                         <Target className="w-4 h-4 text-[var(--color-claude-main)]" />
                         <span className="text-sm font-semibold text-[var(--color-claude-sub)] tracking-wide">ACCURACY</span>
                      </div>
                      <span className="text-4xl font-bold text-[var(--color-claude-text)] tracking-tight">{Math.round(result.accuracy)}%</span>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[var(--color-claude-bg)] rounded-xl p-4 border border-[var(--color-claude-border)]/50">
                         <div className="flex items-center gap-1.5 mb-1.5 opacity-70">
                            <ClipboardList className="w-3.5 h-3.5 text-[var(--color-claude-sub)]" />
                            <span className="text-[11px] font-semibold text-[var(--color-claude-sub)]">RAW WPM</span>
                         </div>
                         <span className="text-xl font-bold text-[var(--color-claude-text)]">{Math.round(result.rawWpm)}</span>
                      </div>
                      <div className="bg-[var(--color-claude-bg)] rounded-xl p-4 border border-[var(--color-claude-border)]/50">
                         <div className="flex items-center gap-1.5 mb-1.5 opacity-70">
                            <Clock className="w-3.5 h-3.5 text-[var(--color-claude-sub)]" />
                            <span className="text-[11px] font-semibold text-[var(--color-claude-sub)]">TIME</span>
                         </div>
                         <span className="text-xl font-bold text-[var(--color-claude-text)]">{result.duration}s</span>
                      </div>
                   </div>

                   <div className="flex gap-4 text-sm font-medium mt-2 p-4 bg-[var(--color-claude-error-bg)]/30 rounded-xl">
                      <div className="flex flex-col">
                         <span className="text-[var(--color-claude-sub)] text-xs mb-1">Errors</span>
                         <span className="font-bold text-[var(--color-claude-error)]">{result.incorrectChars}</span>
                      </div>
                      <div className="w-px h-8 bg-[var(--color-claude-border)]" />
                      <div className="flex flex-col">
                         <span className="text-[var(--color-claude-sub)] text-xs mb-1">Correct</span>
                         <span className="font-bold text-[var(--color-claude-text)]">{result.correctChars}</span>
                      </div>
                   </div>
                </div>

                {/* Right Chart */}
                <div className="w-full md:w-2/3 flex flex-col h-full min-h-[300px] border border-[var(--color-claude-border)]/50 rounded-xl p-6 bg-[var(--color-claude-bg)]/50">
                   <h3 className="text-sm font-semibold text-[var(--color-claude-text)] mb-6 font-serif">Performance over time</h3>
                   <div className="w-full mt-4 h-[250px] relative -ml-4">
                     <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                         <defs>
                           <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#da7756" stopOpacity={0.2}/>
                             <stop offset="95%" stopColor="#da7756" stopOpacity={0}/>
                           </linearGradient>
                         </defs>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-claude-border, #dcd8d2)" />
                         <XAxis 
                            dataKey="time" 
                            stroke="var(--color-claude-sub, #6f6b65)" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false}
                         />
                         <YAxis 
                            stroke="var(--color-claude-sub, #6f6b65)" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false}
                            domain={[0, 'auto']}
                          />
                         <Tooltip 
                           contentStyle={{ 
                             backgroundColor: 'var(--color-claude-surface, #ffffff)', 
                             borderColor: 'var(--color-claude-border, #dcd8d2)', 
                             borderRadius: '8px',
                             fontSize: '12px',
                             color: 'var(--color-claude-text, #191919)',
                             boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                           }}
                           itemStyle={{ color: 'var(--color-claude-main, #da7756)', fontWeight: 600 }}
                           cursor={{ stroke: 'var(--color-claude-main, #da7756)', strokeWidth: 1, strokeDasharray: '3 3' }}
                         />
                         <Area 
                            type="monotone" 
                            dataKey="wpm" 
                            stroke="var(--color-claude-main, #da7756)" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorWpm)" 
                            isAnimationActive={true}
                            animationDuration={600}
                          />
                       </AreaChart>
                     </ResponsiveContainer>
                   </div>
                </div>
             </div>
             
             <div className="mt-2 px-8 py-4 border-t border-[var(--color-claude-border)]/50 bg-[var(--color-claude-surface)] rounded-b-2xl flex items-center justify-end gap-3">
                <button 
                  onClick={() => { onReset(); onClose(); }} 
                  className="px-4 py-2 text-sm font-medium text-[var(--color-claude-sub)] hover:text-[var(--color-claude-text)] hover:bg-[var(--color-claude-sub-alt)]/50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4"/> Try Again
                </button>
                <button 
                  onClick={onClose} 
                  className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-claude-main)] hover:bg-[var(--color-claude-main-hover)] rounded-lg transition-colors shadow-sm flex items-center gap-2"
                >
                  Next Test <ChevronRight className="w-4 h-4"/>
                </button>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
