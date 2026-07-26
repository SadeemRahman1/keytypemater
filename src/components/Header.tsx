import React from 'react';
import { Keyboard, Sparkles, BarChart2, Trophy, Settings, Zap, Clock, Key, Quote, Shield, Command } from 'lucide-react';
import { TestMode, WordCountOption, TimeLimitOption, QuoteCategory, UserSettings } from '../types';
import { THEMES } from '../lib/themes';

interface HeaderProps {
  mode: TestMode;
  wordCount: WordCountOption;
  timeLimit: TimeLimitOption;
  quoteCategory: QuoteCategory;
  includeNumbers: boolean;
  includePunctuation: boolean;
  settings: UserSettings;
  unlockedCount: number;
  totalAchievements: number;
  unlockedAchievements: number;
  onSelectMode: (mode: TestMode) => void;
  onChangeWordCount: (count: WordCountOption) => void;
  onChangeTimeLimit: (time: TimeLimitOption) => void;
  onChangeQuoteCategory: (cat: QuoteCategory) => void;
  onToggleNumbers: () => void;
  onTogglePunctuation: () => void;
  onOpenAIDrill: () => void;
  onOpenHistory: () => void;
  onOpenAchievements: () => void;
  onOpenSettings: () => void;
  onOpenLayouts?: () => void;
  onOpenLegal?: () => void;
  onOpenCommandPalette?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  wordCount,
  timeLimit,
  quoteCategory,
  includeNumbers,
  includePunctuation,
  settings,
  unlockedCount,
  unlockedAchievements,
  totalAchievements,
  onSelectMode,
  onChangeWordCount,
  onChangeTimeLimit,
  onChangeQuoteCategory,
  onToggleNumbers,
  onTogglePunctuation,
  onOpenAIDrill,
  onOpenHistory,
  onOpenAchievements,
  onOpenSettings,
  onOpenLayouts,
  onOpenLegal,
  onOpenCommandPalette,
}) => {
  const theme = THEMES[settings.theme];

  const timeOptions: TimeLimitOption[] = [30, 60, 120, 300, 600];

  const getTimeDisplayLabel = (seconds: number) => {
    if (seconds >= 60 && seconds % 60 === 0) {
      return `${seconds / 60}m`;
    }
    return `${seconds}s`;
  };

  return (
    <header className="flex flex-col gap-3 sm:gap-4 w-full max-w-4xl mx-auto pt-2 sm:pt-4 px-2 sm:px-0 select-none">
      {/* Top Navbar */}
      <div className="flex items-center justify-between px-1 gap-2">
        {/* Branding */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 sm:p-2.5 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-slate-950 shadow-lg shadow-sky-500/20 shrink-0">
            <Keyboard className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-extrabold text-base sm:text-xl tracking-tight text-slate-100 flex items-center gap-1.5 sm:gap-2">
              KeyType <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 font-mono font-bold">MASTER</span>
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-400 hidden sm:block">Touch typing practice & key confidence analytics</p>
          </div>
        </div>

        {/* Action Icon Buttons */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all text-xs font-semibold cursor-pointer"
            title="Analytics & History"
          >
            <BarChart2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400" />
            <span className="hidden sm:inline">Stats</span>
          </button>

          <button
            onClick={onOpenAchievements}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all text-xs font-semibold cursor-pointer"
            title="Achievements"
          >
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <span className="hidden sm:inline">Badges</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
              {unlockedAchievements}
            </span>
          </button>

          {onOpenLayouts && (
            <button
              onClick={onOpenLayouts}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all text-xs font-semibold cursor-pointer"
              title="Keyboard Layouts & Efficiency Explorer"
            >
              <Keyboard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
              <span className="hidden sm:inline">Layouts</span>
            </button>
          )}

          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-400 transition-all cursor-pointer flex items-center gap-1.5"
              title="Command Line (Ctrl + Shift + P or Esc)"
            >
              <Command className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              <span className="hidden md:inline text-xs font-mono text-slate-400">Cmd</span>
            </button>
          )}

          <button
            onClick={onOpenSettings}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Preferences"
          >
            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
          </button>

          {onOpenLegal && (
            <button
              onClick={onOpenLegal}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-400 transition-all cursor-pointer"
              title="About Us, Privacy Policy & Compliance"
            >
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 hover:text-amber-400" />
            </button>
          )}
        </div>
      </div>

      {/* Mode Switcher Bar */}
      <div className={`p-1.5 sm:p-2 rounded-2xl border ${theme.border} ${theme.panelBg} flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-3 shadow-md`}>
        {/* Main Mode Tabs */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => onSelectMode('keybr')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              mode === 'keybr'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Keybr Procedural</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950/30">
              {unlockedCount}/26
            </span>
          </button>

          <button
            onClick={() => onSelectMode('words')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              mode === 'words'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Words</span>
          </button>

          <button
            onClick={() => onSelectMode('time')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              mode === 'time'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Timed</span>
          </button>

          <button
            onClick={() => onSelectMode('quote')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              mode === 'quote'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Quote className="w-3.5 h-3.5" />
            <span>Quotes</span>
          </button>

          <button
            onClick={onOpenAIDrill}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500/20 to-sky-500/20 hover:from-purple-500/30 hover:to-sky-500/30 text-sky-300 border border-sky-500/30 transition-all cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>AI Drill</span>
          </button>
        </div>

        {/* Sub-options for active mode */}
        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
          {mode === 'words' && (
            <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
              {([10, 25, 50, 100] as WordCountOption[]).map((count) => (
                <button
                  key={count}
                  onClick={() => onChangeWordCount(count)}
                  className={`px-2 py-1 rounded-lg text-[11px] transition-colors cursor-pointer ${
                    wordCount === count ? 'bg-slate-800 text-sky-400 font-bold' : 'hover:text-slate-200'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          )}

          {mode === 'time' && (
            <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
              {timeOptions.map((time) => (
                <button
                  key={time}
                  onClick={() => onChangeTimeLimit(time)}
                  className={`px-2 py-1 rounded-lg text-[11px] transition-colors cursor-pointer ${
                    timeLimit === time ? 'bg-slate-800 text-amber-400 font-bold shadow-sm' : 'hover:text-slate-200'
                  }`}
                >
                  {getTimeDisplayLabel(time)}
                </button>
              ))}
            </div>
          )}

          {mode === 'quote' && (
            <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
              {(['all', 'code', 'tech', 'literature'] as QuoteCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => onChangeQuoteCategory(cat)}
                  className={`px-2 py-1 rounded-lg text-[11px] capitalize transition-colors cursor-pointer ${
                    quoteCategory === cat ? 'bg-slate-800 text-purple-300 font-bold' : 'hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Modifiers for Words / Time Mode */}
          {(mode === 'words' || mode === 'time') && (
            <div className="flex items-center gap-1">
              <button
                onClick={onToggleNumbers}
                className={`px-2 py-1 rounded-lg border text-[11px] transition-all cursor-pointer ${
                  includeNumbers
                    ? 'bg-sky-500/20 border-sky-500/50 text-sky-300 font-bold'
                    : 'border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                123
              </button>
              <button
                onClick={onTogglePunctuation}
                className={`px-2 py-1 rounded-lg border text-[11px] transition-all cursor-pointer ${
                  includePunctuation
                    ? 'bg-sky-500/20 border-sky-500/50 text-sky-300 font-bold'
                    : 'border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                #!@
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
