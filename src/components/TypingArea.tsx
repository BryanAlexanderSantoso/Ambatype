import { useState, useEffect, useRef, useCallback } from 'react';
import type { TestStats, Mode } from '../types';

interface TypingAreaProps {
  words: string[];
  onTestComplete: (stats: TestStats) => void;
  onStatsUpdate?: (stats: Partial<TestStats>) => void;
  isActive: boolean;
  onStart: () => void;
  timeLeft: number;
  onTimeUpdate: (seconds: number) => void;
  testMode?: Mode;
}

export default function TypingArea({
  words,
  onTestComplete,
  onStatsUpdate,
  isActive,
  onStart,
  timeLeft,
  onTimeUpdate,
  testMode = 'time'
}: TypingAreaProps) {
  const [inputValue, setInputValue] = useState('');
  const [currWordIdx, setCurrWordIdx] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [extraChars, setExtraChars] = useState(0);
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const wordsRef = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const totalCharactersTyped = useRef(0);
  const startTime = useRef<number | null>(null);
  const timerId = useRef<any>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [isActive]);

  const calculateWPM = useCallback(() => {
    if (!startTime.current) return 0;
    const now = Date.now();
    const elapsedMinutes = (now - startTime.current) / 60000;
    if (elapsedMinutes === 0) return 0;
    const wpm = (totalCharactersTyped.current / 5) / elapsedMinutes;
    return Math.max(0, wpm);
  }, []);

  const calculateAccuracy = useCallback(() => {
    const total = correctChars + incorrectChars + extraChars;
    if (total === 0) return 100;
    return (correctChars / total) * 100;
  }, [correctChars, incorrectChars, extraChars]);

  const endTest = useCallback(() => {
    clearInterval(timerId.current);
    const wpm = calculateWPM();
    const accuracy = calculateAccuracy();
    
    onTestComplete({
      wpm,
      accuracy,
      correctChars,
      incorrectChars,
      extraChars,
      rawWpm: wpm, 
      wpmHistory: [...wpmHistory, wpm]
    });
  }, [calculateWPM, calculateAccuracy, correctChars, incorrectChars, extraChars, wpmHistory, onTestComplete]);

  useEffect(() => {
    if (isActive && testMode === 'time' && timeLeft > 0) {
      timerId.current = setInterval(() => {
        onTimeUpdate(timeLeft - 1);
        const currentWpm = calculateWPM();
        const currentAcc = calculateAccuracy();
        
        if (onStatsUpdate) {
          onStatsUpdate({ wpm: currentWpm, accuracy: currentAcc });
        }
        
        setWpmHistory(prev => [...prev, currentWpm]);
      }, 1000);
    } else if (testMode === 'time' && timeLeft === 0 && isActive) {
      endTest();
    }
    return () => clearInterval(timerId.current);
  }, [isActive, timeLeft, onTimeUpdate, calculateWPM, calculateAccuracy, endTest, onStatsUpdate, testMode]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isActive && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      onStart();
      startTime.current = Date.now();
    }

    if (e.key === ' ' && inputValue.trim() !== '') {
      e.preventDefault();
      setHistory(prev => [...prev, inputValue]);
      setInputValue('');
      setCurrWordIdx(prev => prev + 1);
      
      const currentWordEl = wordsRef.current[currWordIdx];
      const nextWordEl = wordsRef.current[currWordIdx + 1];
      
      if (currentWordEl && nextWordEl) {
        if (currentWordEl.offsetTop < nextWordEl.offsetTop) {
           const container = containerRef.current;
           if (container) {
               container.scrollBy({ top: 58, behavior: 'smooth' }); // Matches h-[50px] + gap-y-2 (8px)
           }
        }
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.endsWith(' ')) return;
    
    const currentWord = words[currWordIdx];
    
    if (value.length > inputValue.length) {
      totalCharactersTyped.current += 1;
      
      if (value.length <= currentWord.length) {
        if (value[value.length - 1] === currentWord[value.length - 1]) {
          setCorrectChars(prev => prev + 1);
        } else {
          setIncorrectChars(prev => prev + 1);
        }
      } else {
        setExtraChars(prev => prev + 1);
      }
    }
    
    setInputValue(value);
  };

  const getCharClass = (wordIdx: number, charIdx: number, char: string) => {
    if (wordIdx < currWordIdx) {
      const typedWord = history[wordIdx] || '';
      if (charIdx < typedWord.length) {
        return typedWord[charIdx] === char ? 'text-[var(--color-claude-text)] transition-colors' : 'text-[var(--color-claude-error)] underline underline-offset-4 decoration-[var(--color-claude-error-bg)] transition-colors';
      }
      return 'text-[var(--color-claude-sub-alt)] transition-colors';
    }

    if (wordIdx === currWordIdx) {
      if (charIdx < inputValue.length) {
        return inputValue[charIdx] === char 
          ? 'text-[var(--color-claude-text)] inline-block transition-colors' 
          : 'text-[var(--color-claude-error)] bg-[var(--color-claude-error-bg)] rounded-[2px] inline-block transition-colors';
      }
    }

    return 'text-[var(--color-claude-sub)] opacity-80 transition-colors';
  };

  return (
    <div 
      className="relative w-full mx-auto cursor-text text-3xl font-mono leading-[1.8em]"
      onClick={() => inputRef.current?.focus()}
    >
      <input
        ref={inputRef}
        type="text"
        className="absolute opacity-0 pointer-events-none"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        autoFocus
        tabIndex={0}
      />
      
      <div className="relative">
         <div 
           className="absolute flex flex-col items-center justify-center inset-0 pointer-events-none transition-all duration-300 z-10"
           style={{ opacity: isActive || inputValue ? 0 : 1, filter: isActive || inputValue ? 'blur(4px)' : 'none' }}
         >
         </div>

        <div className="h-[174px] overflow-hidden relative" ref={containerRef}>
          <div className="flex flex-wrap gap-x-[0.35em] gap-y-2 mx-2 transition-all filter drop-shadow-sm pb-10">
            {words.map((word, wIdx) => (
              <div 
                key={wIdx} 
                ref={el => { wordsRef.current[wIdx] = el; }}
                className="relative flex tracking-normal h-[50px] items-center"
              >
                {wIdx === currWordIdx && (
                  <div
                    className="absolute h-[65%] w-[2px] bg-[var(--color-claude-main)] cursor-blink z-0 rounded-full"
                    style={{ 
                      left: `${inputValue.length * 0.6}em`,
                      top: '17.5%',
                      transition: 'left 0.1s cubic-bezier(0.2, 0, 0, 1)'
                    }}
                  />
                )}
                
                {word.split('').map((char, cIdx) => (
                  <span 
                    key={cIdx} 
                    className={`transition-colors duration-100 z-10 font-[450] ${getCharClass(wIdx, cIdx, char)}`}
                  >
                    {char}
                  </span>
                ))}
                
                {wIdx === currWordIdx && inputValue.length > word.length && (
                  inputValue.substring(word.length).split('').map((char, ecIdx) => (
                    <span key={ecIdx} className="text-[var(--color-claude-error)] bg-[var(--color-claude-error-bg)] rounded-[2px] z-10 font-[450]">
                      {char}
                    </span>
                  ))
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}
