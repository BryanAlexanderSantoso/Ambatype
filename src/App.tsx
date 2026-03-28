import { useState, useEffect, useCallback } from 'react';
import { 
  Keyboard, 
  Crown, 
  Settings, 
  Globe, 
  User,
  Sparkles,
  Palette,
  ExternalLink,
  Moon,
  Sun
} from 'lucide-react';
import { motion } from 'framer-motion';

import StatsBar from './components/StatsBar';
import TypingArea from './components/TypingArea';
import LanguageSelector from './components/LanguageSelector';
import ResultModal from './components/ResultModal';
import type { Language, Mode, TimeOption, TestResult, TestStats } from './types';
import { generateWords } from './utils/wordGenerator';

const DEFAULT_LANGUAGE: Language = { id: 'en', name: 'English', type: 'World' };

function App() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [testMode, setTestMode] = useState<Mode>('time');
  const [timeOption, setTimeOption] = useState<TimeOption>(30);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isTestActive, setIsTestActive] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [words, setWords] = useState<string[]>([]);
  
  const [currentWpm, setCurrentWpm] = useState(0);
  const [currentAcc, setCurrentAcc] = useState(100);
  
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const initializeTest = useCallback(() => {
    const newWords = generateWords(currentLanguage.id, 200);
    setWords(newWords);
    setTimeLeft(testMode === 'time' ? timeOption : 0);
    setIsTestActive(false);
    setIsResultOpen(false);
    setCurrentWpm(0);
    setCurrentAcc(100);
  }, [currentLanguage, timeOption, testMode]);

  useEffect(() => {
    initializeTest();
  }, [initializeTest]);

  const handleStart = () => setIsTestActive(true);

  const handleTestComplete = (stats: TestStats) => {
    setIsTestActive(false);
    const result: TestResult = {
      ...stats,
      duration: testMode === 'time' ? timeOption : timeOption,
      timestamp: new Date().toISOString()
    };
    setTestResult(result);
    setIsResultOpen(true);
  };

  const handleModeChange = (mode: Mode) => {
    setTestMode(mode);
    initializeTest();
  };

  const handleTimeChange = (time: TimeOption) => {
    setTimeOption(time);
    setTimeLeft(time);
    initializeTest();
  };

  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
       if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
         e.preventDefault();
         setIsSelectorOpen(prev => !prev);
       }
       if (e.key === 'Escape' && !isSelectorOpen && !isResultOpen) {
         initializeTest();
       }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [initializeTest, isSelectorOpen, isResultOpen]);

  return (
    <div className="flex bg-[var(--color-claude-bg)] min-h-[100svh] text-[var(--color-claude-text)] transition-colors duration-300">
      
      {/* Sidebar (Claude-like) */}
      <aside className={`w-[260px] flex-col bg-[var(--color-claude-bg)] border-r border-[var(--color-claude-sub-alt)] hidden md:flex h-[100svh] sticky top-0 py-6 px-4 transition-transform duration-300 ${isTestActive ? '-translate-x-full absolute' : 'translate-x-0'}`}>
         <div className="flex items-center gap-2 mb-8 px-2 cursor-pointer" onClick={initializeTest}>
            <div className="bg-[var(--color-claude-surface)] border border-[var(--color-claude-border)] rounded-md p-1 pb-[3px] shadow-sm">
               <Sparkles className="w-5 h-5 text-[var(--color-claude-main)]" />
            </div>
            <span className="font-serif font-semibold text-lg tracking-tight pt-[2px]">Ambatype</span>
         </div>
         
         <div className="flex flex-col gap-1 mb-6">
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[var(--color-claude-sub-alt)]/50 text-sm font-medium hover:bg-[var(--color-claude-sub-alt)] transition-colors">
               <Keyboard className="w-[18px] h-[18px] opacity-70" />
               New Test
            </button>
            <button onClick={() => setIsSelectorOpen(true)} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--color-claude-sub-alt)]/50 text-sm font-medium transition-colors">
               <Globe className="w-[18px] h-[18px] opacity-70" />
               Language: <span className="text-[var(--color-claude-sub)]">{currentLanguage.name}</span>
            </button>
         </div>
         
         <div className="flex flex-col gap-1 mt-auto">
            <h3 className="px-3 text-xs font-semibold text-[var(--color-claude-sub)] tracking-wider mb-2">ACCOUNT</h3>
            <button className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--color-claude-sub)] hover:text-[var(--color-claude-text)] hover:bg-[var(--color-claude-sub-alt)]/50 rounded-lg transition-colors">
               <User className="w-[18px] h-[18px]" /> Profile
            </button>
            <button className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--color-claude-sub)] hover:text-[var(--color-claude-text)] hover:bg-[var(--color-claude-sub-alt)]/50 rounded-lg transition-colors">
               <Crown className="w-[18px] h-[18px]" /> Leaderboard
            </button>
            <button onClick={() => setIsDark(!isDark)} className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--color-claude-sub)] hover:text-[var(--color-claude-text)] hover:bg-[var(--color-claude-sub-alt)]/50 rounded-lg transition-colors">
               {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />} 
               {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--color-claude-sub)] hover:text-[var(--color-claude-text)] hover:bg-[var(--color-claude-sub-alt)]/50 rounded-lg transition-colors">
               <Settings className="w-[18px] h-[18px]" /> Settings
            </button>
         </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center pt-[12svh] px-4 md:px-12 w-full max-w-[900px] mx-auto relative bg-[var(--color-claude-bg)]">
        
        {/* Welcome Text (if not active, like Claude's opening) */}
        {!isTestActive && (
          <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="flex flex-col items-center mb-10 w-full"
          >
             <div className="w-14 h-14 bg-[var(--color-claude-surface)] border border-[var(--color-claude-border)] shadow-sm rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-[var(--color-claude-main)]" />
             </div>
             <h2 className="text-3xl font-serif text-[var(--color-claude-text)] tracking-tight mb-2">Good afternoon.</h2>
             <p className="text-[var(--color-claude-sub)] font-medium text-lg">Type accurately to measure your capabilities.</p>
          </motion.div>
        )}

        {/* Input/App Area (styled like Claude's chat input) */}
        <motion.div
           initial={{ opacity: 0, y: 15 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.3, delay: 0.1 }}
           className={`w-full bg-[var(--color-claude-surface)] border border-[var(--color-claude-border)] shadow-sm rounded-2xl p-6 md:p-8 flex flex-col ${isTestActive ? 'shadow-md border-[var(--color-claude-main)]/30 scale-[1.02] mt-[-10svh]' : ''} transition-all duration-300`}
        >
          <StatsBar 
            wpm={currentWpm}
            accuracy={currentAcc}
            timeLeft={timeLeft}
            mode={testMode}
            onReset={initializeTest}
            onTimeChange={handleTimeChange}
            onModeChange={handleModeChange}
            currentTime={timeOption}
            isActive={isTestActive}
          />

          <TypingArea 
            words={words}
            isActive={isTestActive}
            onStart={handleStart}
            onTestComplete={handleTestComplete}
            onStatsUpdate={(stats) => {
              if (stats.wpm !== undefined) setCurrentWpm(stats.wpm);
              if (stats.accuracy !== undefined) setCurrentAcc(stats.accuracy);
            }}
            timeLeft={timeLeft}
            onTimeUpdate={setTimeLeft}
            testMode={testMode}
          />
        </motion.div>
        
        {/* Claude's bottom disclaimer style */}
        <div className={`mt-8 text-xs text-[var(--color-claude-sub)] text-center pb-8 flex items-center gap-3 justify-center transition-opacity duration-300 ${isTestActive ? 'opacity-0' : 'opacity-100'}`}>
            <span>Ambatype is an advanced typing simulation tool. Performance may vary.</span>
            <span className="w-1 h-1 rounded-full bg-[var(--color-claude-sub-alt)]" />
            <button className="flex items-center gap-1 hover:text-[var(--color-claude-text)] underline underline-offset-2"><Palette className="w-3 h-3" /> claude ai style</button>
            <span className="w-1 h-1 rounded-full bg-[var(--color-claude-sub-alt)]" />
            <button className="flex items-center gap-1 hover:text-[var(--color-claude-text)] underline underline-offset-2"><ExternalLink className="w-3 h-3" /> v26.12.0</button>
        </div>

      </main>

      {/* Modals */}
      <LanguageSelector 
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        currentLanguage={currentLanguage}
        onSelect={(lang) => {
          setCurrentLanguage(lang);
          initializeTest();
        }}
      />

      <ResultModal 
        isOpen={isResultOpen}
        onClose={() => setIsResultOpen(false)}
        result={testResult}
        onReset={initializeTest}
      />
    </div>
  );
}

export default App;
