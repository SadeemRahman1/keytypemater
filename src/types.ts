export type TestMode = 'keybr' | 'words' | 'time' | 'quote' | 'aidrill' | 'custom';

export type WordCountOption = 10 | 25 | 50 | 100;
export type TimeLimitOption = 30 | 60 | 120 | 300 | 600;
export type QuoteCategory = 'all' | 'short' | 'medium' | 'code' | 'tech' | 'literature';

export type ThemeId = 'slate' | 'cyberpunk' | 'paper' | 'nordic' | 'emerald' | 'sunset';
export type AudioTheme = 'mechanical' | 'thock' | 'clack' | 'typewriter' | 'bubble' | 'silent';
export type CaretStyle = 'line' | 'block' | 'underline' | 'pulse';
export type FontFamily = 'mono' | 'sans' | 'code';

export interface KeyStat {
  key: string;
  totalTyped: number;
  errors: number;
  totalLatencyMs: number;
  unlocked: boolean;
  confidence: number; // 0 - 100%
}

export interface TestResult {
  id: string;
  timestamp: number;
  mode: TestMode;
  modeDetail: string; // e.g. "25 words", "60s", "Keybr (E, T, A)", "AI Drill"
  wpm: number;
  rawWpm: number;
  accuracy: number;
  cpm: number;
  timeSeconds: number;
  errors: number;
  totalChars: number;
  wpmHistory: Array<{ time: number; wpm: number; rawWpm: number; errors: number }>;
}

export type DifficultyMode = 'normal' | 'expert' | 'master';
export type StopOnErrorMode = 'off' | 'letter' | 'word';
export type ConfidenceMode = 'off' | 'on' | 'max';

export interface UserSettings {
  theme: ThemeId;
  soundTheme: AudioTheme;
  soundVolume: number; // 0.0 to 1.0
  caretStyle: CaretStyle;
  fontFamily: FontFamily;
  showKeyboard: boolean;
  showFingerColors: boolean;
  showHeatmap: boolean;
  smoothCaret: boolean;
  blindMode: boolean;
  quickRestartHotkey: boolean;
  keybrUnlockedLetters: string[];
  difficulty: DifficultyMode;
  stopOnError: StopOnErrorMode;
  confidenceMode: ConfidenceMode;
  minSpeed: number; // 0 for off, or threshold WPM
  minAccuracy: number; // 0 for off, or threshold %
  quickEnd: boolean;
  freedomMode: boolean;
  strictSpace: boolean;
  liveStats: boolean;
  language: string;
  showKeybrProgressWidget: boolean;
  keybrTargetWpm: number;
  activeLayout?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export type FingerType =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'thumb'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky';

export interface KeyLayoutInfo {
  key: string;
  displayLabel?: string;
  width?: string; // e.g., 'col-span-1', 'col-span-2'
  finger: FingerType;
  row: number;
}
