import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Scatter,
} from 'recharts';
import {
  ChevronRight,
  RotateCcw,
  AlertTriangle,
  BarChart2,
  Image as ImageIcon,
  Rewind,
  Unlock,
  Key,
  Check,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TestResult, KeyStat, UserSettings } from '../types';
import { THEMES } from '../lib/themes';
import { KEYBR_LETTER_ORDER } from '../lib/wordGenerator';

interface AnalyticsPanelProps {
  result: TestResult;
  keyStats: Record<string, KeyStat>;
  unlockedLetters: string[];
  newlyUnlocked: string[];
  settings: UserSettings;
  onNextTest: () => void;
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  result,
  keyStats,
  unlockedLetters,
  newlyUnlocked,
  settings,
  onNextTest,
}) => {
  const theme = THEMES[settings.theme];
  const [showKeybrMastery, setShowKeybrMastery] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    // Trigger confetti on good accuracy (>95%) or high speed (>60 WPM) or new key unlock!
    if (result.accuracy >= 95 || result.wpm >= 60 || newlyUnlocked.length > 0) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [result, newlyUnlocked]);

  // Character breakdown calculation (Monkeytype format: correct / incorrect / extra / missed)
  const incorrectChars = result.errors;
  const correctChars = Math.max(0, result.totalChars - incorrectChars);

  // Consistency calculation (% stability across seconds)
  const wpms = result.wpmHistory ? result.wpmHistory.map((h) => h.wpm) : [result.wpm];
  let consistency = 85;
  if (wpms.length > 1) {
    const avg = wpms.reduce((a, b) => a + b, 0) / wpms.length;
    const variance = wpms.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / wpms.length;
    const stdDev = Math.sqrt(variance);
    consistency = Math.max(0, Math.min(100, Math.round(100 - (stdDev / (avg || 1)) * 40)));
  }

  const handleCopyResult = () => {
    const summary = `KeyType Result: ${result.wpm} WPM | ${result.accuracy}% Acc | ${result.modeDetail} | ${result.timeSeconds}s`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const unlockedSet = new Set(unlockedLetters);

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto select-none animate-fadeIn font-mono">
      {/* Newly Unlocked Key Notification Banner */}
      {newlyUnlocked.length > 0 && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-500/20 via-sky-500/20 to-indigo-500/20 border border-emerald-500/40 text-emerald-300 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/30 text-emerald-200">
              <Unlock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">New Letter Mastered & Unlocked!</h4>
              <p className="text-xs text-emerald-200/90 font-sans">
                Congratulations! You unlocked:{' '}
                <span className="font-mono font-bold uppercase text-amber-300 text-sm ml-1">
                  {newlyUnlocked.join(', ')}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onNextTest}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow"
          >
            <span>Practice New Key</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Monkeytype Primary Results Row (Giant Left Stats + Main Chart) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Side: Giant WPM & Accuracy */}
        <div className="md:col-span-3 flex flex-col justify-center gap-4">
          <div>
            <span className="text-xs text-slate-500 block mb-0.5 tracking-wider font-sans">wpm</span>
            <div className="text-6xl sm:text-7xl font-extrabold text-amber-400 tracking-tight leading-none">
              {result.wpm}
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-500 block mb-0.5 tracking-wider font-sans">acc</span>
            <div className="text-5xl sm:text-6xl font-extrabold text-amber-400 tracking-tight leading-none">
              {result.accuracy}%
            </div>
          </div>
        </div>

        {/* Right Side: Speed Graph */}
        <div className="md:col-span-9 h-64 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 relative">
          <div className="flex items-center justify-between px-2 mb-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-sans">
              Words per Minute
            </span>
            <div className="flex items-center gap-4 text-[10px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-1 rounded-full bg-amber-400" />
                <span>wpm</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 rounded bg-slate-500" />
                <span>raw</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>errors</span>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height="88%">
            <LineChart
              data={result.wpmHistory}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} unit="s" />
              <YAxis yAxisId="left" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="wpm"
                stroke="#fbbf24"
                strokeWidth={3}
                dot={{ r: 2.5, fill: '#fbbf24' }}
                activeDot={{ r: 5 }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="rawWpm"
                stroke="#64748b"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                dot={false}
              />
              <Scatter
                yAxisId="right"
                dataKey="errors"
                fill="#f43f5e"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monkeytype Bottom Secondary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 text-left border-t border-b border-slate-800/80 py-4">
        <div>
          <span className="text-[11px] text-slate-500 block font-sans">test type</span>
          <span className="text-sm font-bold text-amber-400 capitalize block truncate">
            {result.modeDetail}
          </span>
        </div>

        <div>
          <span className="text-[11px] text-slate-500 block font-sans">other</span>
          <span className="text-sm font-bold text-amber-400 block truncate">
            {result.accuracy === 100 ? '100% perfect' : result.accuracy < 90 ? 'invalid (accuracy)' : 'normal'}
          </span>
        </div>

        <div>
          <span className="text-[11px] text-slate-500 block font-sans">raw</span>
          <span className="text-lg font-extrabold text-amber-400 block">{result.rawWpm}</span>
        </div>

        <div>
          <span className="text-[11px] text-slate-500 block font-sans">characters</span>
          <span className="text-lg font-extrabold text-amber-400 block">
            {correctChars}/{incorrectChars}/0/0
          </span>
        </div>

        <div>
          <span className="text-[11px] text-slate-500 block font-sans">consistency</span>
          <span className="text-lg font-extrabold text-amber-400 block">{consistency}%</span>
        </div>

        <div>
          <span className="text-[11px] text-slate-500 block font-sans">time</span>
          <span className="text-lg font-extrabold text-amber-400 block">{result.timeSeconds}s</span>
        </div>
      </div>

      {/* Optional Keybr Mastery Section */}
      {showKeybrMastery && (
        <div className={`p-4 rounded-xl border ${theme.border} ${theme.panelBg} flex flex-col gap-3 transition-all animate-fadeIn`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-xs text-slate-200">Keybr Letter Mastery</span>
            </div>
            <span className="text-xs text-slate-400">
              {unlockedLetters.length} / {KEYBR_LETTER_ORDER.length} Unlocked
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {KEYBR_LETTER_ORDER.map((letter) => {
              const isUnlocked = unlockedSet.has(letter);
              const kStat = keyStats[letter];
              const conf = kStat ? kStat.confidence : 0;

              return (
                <div
                  key={letter}
                  className={`flex flex-col items-center justify-center w-8 h-10 rounded border text-xs font-mono font-bold ${
                    isUnlocked
                      ? conf >= 80
                        ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
                        : conf >= 50
                        ? 'bg-sky-500/20 border-sky-500/60 text-sky-300'
                        : 'bg-slate-800 border-slate-700 text-slate-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-600 opacity-50'
                  }`}
                >
                  <span>{letter.toUpperCase()}</span>
                  {isUnlocked && <span className="text-[8px] font-normal">{conf}%</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Monkeytype Iconic Action Toolbar (Bottom Navigation Row) */}
      <div className="flex items-center justify-center gap-6 pt-2 text-slate-400">
        <button
          onClick={onNextTest}
          className="p-3 rounded-xl hover:bg-slate-800/80 hover:text-amber-400 transition-all cursor-pointer text-slate-400"
          title="Next Test"
        >
          <ChevronRight className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          onClick={onNextTest}
          className="p-3 rounded-xl hover:bg-slate-800/80 hover:text-amber-400 transition-all cursor-pointer text-slate-400"
          title="Restart Test"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={onNextTest}
          className="p-3 rounded-xl hover:bg-slate-800/80 hover:text-amber-400 transition-all cursor-pointer text-slate-400"
          title="Practice Missed Words"
        >
          <AlertTriangle className="w-5 h-5" />
        </button>

        <button
          onClick={() => setShowKeybrMastery((prev) => !prev)}
          className={`p-3 rounded-xl hover:bg-slate-800/80 transition-all cursor-pointer ${
            showKeybrMastery ? 'text-amber-400 bg-slate-800' : 'text-slate-400'
          }`}
          title="Toggle Letter Mastery Details"
        >
          <BarChart2 className="w-5 h-5" />
        </button>

        <button
          onClick={handleCopyResult}
          className="p-3 rounded-xl hover:bg-slate-800/80 hover:text-amber-400 transition-all cursor-pointer text-slate-400 relative"
          title="Copy Summary Result"
        >
          {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};
