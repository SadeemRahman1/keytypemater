import React, { useState } from 'react';
import { KEYBR_LETTER_ORDER } from '../lib/wordGenerator';
import { KeyStat, UserSettings } from '../types';
import { THEMES } from '../lib/themes';
import { Lock, Unlock, Zap, ChevronRight, Settings2, RefreshCw, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface KeybrProgressWidgetProps {
  settings: UserSettings;
  keyStats: Record<string, KeyStat>;
  onUpdateUnlockedLetters: (newUnlocked: string[]) => void;
  onOpenSettings?: () => void;
}

export const KeybrProgressWidget: React.FC<KeybrProgressWidgetProps> = ({
  settings,
  keyStats,
  onUpdateUnlockedLetters,
  onOpenSettings,
}) => {
  const [showManager, setShowManager] = useState(false);
  const theme = THEMES[settings.theme];

  const unlockedSet = new Set(settings.keybrUnlockedLetters.map((l) => l.toLowerCase()));
  const totalUnlocked = unlockedSet.size;

  // Find next letter in KEYBR_LETTER_ORDER sequence that is not unlocked yet
  const nextKeyToUnlock = KEYBR_LETTER_ORDER.find((k) => !unlockedSet.has(k)) || null;

  // Target WPM threshold from settings
  const targetWpm = settings.keybrTargetWpm || 35;

  // Check status of each unlocked key against unlock threshold (speed >= targetWpm & totalTyped >= 20)
  const keyStatuses = settings.keybrUnlockedLetters.map((key) => {
    const stat = keyStats[key.toLowerCase()] || {
      key,
      totalTyped: 0,
      errors: 0,
      totalLatencyMs: 0,
      unlocked: true,
      confidence: 0,
    };
    const avgLatencyMs = stat.totalTyped > 0 ? stat.totalLatencyMs / stat.totalTyped : 0;
    const keyWpm = avgLatencyMs > 0 ? Math.round((60000 / avgLatencyMs) / 5) : 0;
    const accuracy = stat.totalTyped > 0 ? Math.max(0, (stat.totalTyped - stat.errors) / stat.totalTyped) : 0;
    const isMastered = stat.totalTyped >= 20 && keyWpm >= targetWpm && accuracy >= 0.88;

    return {
      key,
      stat,
      keyWpm,
      isMastered,
      confidence: stat.confidence,
      totalTyped: stat.totalTyped,
    };
  });

  const masteredCount = keyStatuses.filter((k) => k.isMastered).length;
  const isNextUnlockReady = totalUnlocked > 0 && masteredCount === totalUnlocked && nextKeyToUnlock !== null;
  const progressPercent = Math.round((masteredCount / Math.max(1, totalUnlocked)) * 100);

  // Handlers for quick presets
  const handleResetDefault = () => {
    onUpdateUnlockedLetters(['e', 't', 'a', 'o', 'i', 'n']);
  };

  const handleUnlockTop12 = () => {
    onUpdateUnlockedLetters(KEYBR_LETTER_ORDER.slice(0, 12));
  };

  const handleUnlockAll = () => {
    onUpdateUnlockedLetters([...KEYBR_LETTER_ORDER]);
  };

  const handleToggleKey = (key: string) => {
    if (unlockedSet.has(key)) {
      if (unlockedSet.size <= 1) return; // Keep at least 1 key
      const next = settings.keybrUnlockedLetters.filter((k) => k.toLowerCase() !== key.toLowerCase());
      onUpdateUnlockedLetters(next);
    } else {
      const next = [...settings.keybrUnlockedLetters, key];
      onUpdateUnlockedLetters(next);
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto my-3 p-4 rounded-2xl border ${theme.border} ${theme.panelBg} backdrop-blur-md shadow-lg transition-all animate-fadeIn`}>
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-slate-100">Keybr Procedural Progression</h4>
              <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono text-[11px] font-bold border border-amber-400/30">
                {totalUnlocked} / 26 Keys Unlocked
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Adapts word generator to target your weak keys until mastery
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setShowManager(!showManager)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              showManager
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>{showManager ? 'Hide Manager' : 'Manage Keys'}</span>
          </button>

          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors cursor-pointer"
              title="Open full settings"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Primary Unlock Progress Bar */}
      <div className="pt-3 pb-2 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span>Unlocked Set Mastery:</span>
            <span className="font-mono font-bold text-amber-400">{progressPercent}%</span>
            <span className="text-slate-500 text-[11px]">({masteredCount}/{totalUnlocked} keys ready)</span>
          </div>

          {nextKeyToUnlock && (
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <span className="text-slate-400">Next Unlock:</span>
              <span className={`px-2 py-0.5 rounded font-mono font-bold uppercase ${
                isNextUnlockReady
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 animate-pulse'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}>
                {nextKeyToUnlock}
              </span>
              {isNextUnlockReady ? (
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready!
                </span>
              ) : (
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Locked
                </span>
              )}
            </div>
          )}
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800/80 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isNextUnlockReady ? 'bg-gradient-to-r from-emerald-400 to-amber-400' : 'bg-amber-400'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Unlock Criterion Requirement Banner */}
        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/80 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              <strong>How next key unlocks:</strong> Complete typing sessions until all unlocked letters reach <span className="text-amber-300 font-bold">&ge; {targetWpm} WPM speed</span> and <span className="text-slate-200 font-semibold">&ge; 88% accuracy</span>.
            </span>
          </div>

          {isNextUnlockReady && (
            <span className="text-emerald-400 font-bold text-[10px] shrink-0">
              🎉 Next key will unlock on test completion!
            </span>
          )}
        </div>
      </div>

      {/* Unlocked Keys Pill Badges */}
      <div className="pt-2 flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] text-slate-500 font-medium mr-1">Active Set:</span>
        {KEYBR_LETTER_ORDER.map((letter) => {
          const isUnlocked = unlockedSet.has(letter);
          const stat = keyStats[letter];
          const confidence = stat ? stat.confidence : 0;
          const typed = stat ? stat.totalTyped : 0;
          const isMastered = typed >= 20 && confidence >= 70;
          const isNext = letter === nextKeyToUnlock;

          if (!isUnlocked && !isNext) return null;

          return (
            <button
              key={letter}
              onClick={() => handleToggleKey(letter)}
              title={
                isUnlocked
                  ? `${letter.toUpperCase()}: ${confidence}% Confidence (${typed}/20 typed). Click to remove.`
                  : `Next locked key: ${letter.toUpperCase()}. Click to manually unlock.`
              }
              className={`group relative flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                isUnlocked
                  ? isMastered
                    ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400'
                    : 'bg-slate-900 text-amber-300 border border-amber-500/30 hover:border-amber-400'
                  : 'bg-slate-950/40 text-slate-500 border border-dashed border-slate-800 hover:border-slate-600'
              }`}
            >
              <span className="uppercase">{letter}</span>
              {isUnlocked && (
                <span className={`text-[10px] ${isMastered ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {confidence}%
                </span>
              )}
              {!isUnlocked && isNext && (
                <Lock className="w-3 h-3 text-slate-600 group-hover:text-amber-400 transition-colors" />
              )}
            </button>
          );
        })}
      </div>

      {/* Expandable Keybr Letter Manager */}
      {showManager && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h5 className="font-bold text-xs text-slate-200">
              Keybr Letter Selection (Click any key to toggle on/off)
            </h5>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetDefault}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-800 transition-colors cursor-pointer"
              >
                Reset Initial 6 (e,t,a,o,i,n)
              </button>
              <button
                onClick={handleUnlockTop12}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 text-[11px] font-medium border border-slate-800 transition-colors cursor-pointer"
              >
                Unlock Top 12
              </button>
              <button
                onClick={handleUnlockAll}
                className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] transition-all shadow cursor-pointer"
              >
                Unlock All 26 Letters
              </button>
            </div>
          </div>

          {/* Grid of all 26 letters */}
          <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-13 gap-1.5">
            {KEYBR_LETTER_ORDER.map((letter, idx) => {
              const isUnlocked = unlockedSet.has(letter);
              const stat = keyStats[letter];
              const conf = stat ? stat.confidence : 0;

              return (
                <button
                  key={letter}
                  onClick={() => handleToggleKey(letter)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl font-mono transition-all cursor-pointer ${
                    isUnlocked
                      ? 'bg-amber-400/10 text-amber-300 border border-amber-400/40 shadow-sm hover:scale-105'
                      : 'bg-slate-900/60 text-slate-600 border border-slate-800/60 hover:text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-sm font-bold uppercase">{letter}</span>
                  <span className="text-[9px] text-slate-500 font-sans">#{idx + 1}</span>
                  {isUnlocked && (
                    <span className="text-[9px] text-amber-400 font-bold">{conf}%</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
