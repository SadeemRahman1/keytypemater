import React, { useState } from 'react';
import { Sparkles, Code, BookOpen, Stethoscope, Briefcase, Zap, X, Check } from 'lucide-react';
import { UserSettings, KeyStat } from '../types';
import { THEMES } from '../lib/themes';
import { getOfflineAIDrill } from '../data/aiDrillsData';

interface AIDrillGeneratorProps {
  settings: UserSettings;
  keyStats: Record<string, KeyStat>;
  unlockedLetters: string[];
  onGenerated: (text: string, title: string) => void;
  onClose: () => void;
}

const TOPIC_PRESETS = [
  { id: 'code', name: 'JavaScript & React Code', icon: Code, description: 'Syntax, functions, arrow operators, brackets' },
  { id: 'tech', name: 'Cybersecurity & Cloud', icon: Zap, description: 'Technical terminology, networking, hashes' },
  { id: 'medical', name: 'Medical Terminology', icon: Stethoscope, description: 'Anatomy, Latin prefixes, complex spellings' },
  { id: 'business', name: 'Business & Finance', icon: Briefcase, description: 'Executive emails, financial vocabulary' },
  { id: 'literature', name: 'Classic Literature', icon: BookOpen, description: 'Rich prose, expressive punctuation' },
];

export const AIDrillGenerator: React.FC<AIDrillGeneratorProps> = ({
  keyStats,
  unlockedLetters,
  settings,
  onGenerated,
  onClose,
}) => {
  const theme = THEMES[settings.theme];

  // Identify weak keys (confidence < 70)
  const weakKeys = (Object.values(keyStats) as KeyStat[])
    .filter((k) => unlockedLetters.includes(k.key) && (k.confidence < 70 || k.totalTyped < 20))
    .map((k) => k.key.toUpperCase());

  const [selectedTopic, setSelectedTopic] = useState<string>('code');
  const [selectedKeys, setSelectedKeys] = useState<string[]>(weakKeys.slice(0, 4));
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [wordCount, setWordCount] = useState<number>(35);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleKeySelection = (key: string) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleGenerate = () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const drill = getOfflineAIDrill({
        targetKeys: selectedKeys,
        topic: selectedTopic,
        difficulty,
        wordCount,
      });

      if (drill && drill.text) {
        onGenerated(drill.text, drill.title);
        onClose();
      } else {
        setErrorMsg('Failed to generate drill. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg('Failed to generate drill locally.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className={`relative w-full max-w-xl rounded-2xl border ${theme.border} ${theme.panelBg} p-6 sm:p-8 flex flex-col gap-6 shadow-2xl`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-100">AI Drill Generator</h3>
              <p className="text-xs text-slate-400">Generate tailor-made practice passages using Gemini AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Controls */}
        <div className="flex flex-col gap-5 max-h-[60vh] overflow-y-auto pr-1">
          {/* Target Weak Keys */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Focus Letters / Weak Keys:
            </label>
            <p className="text-[11px] text-slate-400">
              Select keys to heavily incorporate into the generated passage.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'].map(
                (k) => {
                  const isSelected = selectedKeys.includes(k);
                  const isWeak = weakKeys.includes(k);

                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => toggleKeySelection(k)}
                      className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-500 border-sky-400 text-slate-950 shadow'
                          : isWeak
                          ? 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                          : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {k} {isWeak && <span className="text-[9px] text-rose-400">★</span>}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Topic Presets */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Subject & Genre:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TOPIC_PRESETS.map((t) => {
                const Icon = t.icon;
                const isSelected = selectedTopic === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTopic(t.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500/15 border-sky-400 text-slate-100 ring-1 ring-sky-400'
                        : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mt-0.5 ${isSelected ? 'text-sky-400' : 'text-slate-500'}`} />
                    <div>
                      <div className="font-semibold text-xs text-slate-200">{t.name}</div>
                      <div className="text-[10px] text-slate-400">{t.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Options: Word Count & Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Difficulty:</label>
              <select
                value={difficulty}
                onChange={(e: any) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="easy">Easy (Simple Words)</option>
                <option value="medium">Medium (Standard)</option>
                <option value="hard">Hard (Punctuation & Numbers)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Length:</label>
              <select
                value={wordCount}
                onChange={(e) => setWordCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value={20}>~20 Words (Short)</option>
                <option value={35}>~35 Words (Medium)</option>
                <option value={60}>~60 Words (Long)</option>
              </select>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-sky-500/20 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Generating with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate & Start Drill</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
