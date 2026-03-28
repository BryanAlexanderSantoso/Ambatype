export type Language = { id: string; name: string; type: string };
export type Mode = 'words' | 'quote' | 'time' | 'zen' | 'custom';
export type TimeOption = 15 | 30 | 60 | 120;

export interface TestStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  extraChars: number;
  wpmHistory: number[];
}

export interface TestResult extends TestStats {
  duration: number;
  timestamp: string;
}
