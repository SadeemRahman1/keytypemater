import React from 'react';
import { Trophy, Zap, Flame, Crown, Target, BookOpen, Rocket, Sparkles, X, CheckCircle2, Lock } from 'lucide-react';
import { Achievement, UserSettings } from '../types';
import { THEMES } from '../lib/themes';

interface AchievementsModalProps {
  achievements: Achievement[];
  settings: UserSettings;
  onClose: () => void;
}

const ICON_MAP: Record<string, any> = {
  Rocket,
  Zap,
  Flame,
  Crown,
  Target,
  BookOpen,
  Trophy,
  Sparkles,
};

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ achievements, settings, onClose }) => {
  const theme = THEMES[settings.theme];
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn select-none">
      <div className={`relative w-full max-w-2xl rounded-2xl border ${theme.border} ${theme.panelBg} p-6 sm:p-8 flex flex-col gap-6 shadow-2xl`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-100">Badges & Milestones</h3>
              <p className="text-xs text-slate-400">
                {unlockedCount} of {achievements.length} Achievements Unlocked
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-purple-500 to-sky-400 h-full transition-all duration-500"
            style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
          />
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {achievements.map((ach) => {
            const IconComponent = ICON_MAP[ach.icon] || Trophy;

            return (
              <div
                key={ach.id}
                className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all ${
                  ach.unlocked
                    ? 'bg-purple-950/20 border-purple-500/40 text-slate-100 shadow-md shadow-purple-500/10'
                    : 'bg-slate-900/40 border-slate-800/80 text-slate-500 opacity-60'
                }`}
              >
                <div
                  className={`p-2.5 rounded-xl ${
                    ach.unlocked
                      ? 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-400/50'
                      : 'bg-slate-800 text-slate-600'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>

                <div className="flex flex-col gap-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-200">{ach.title}</span>
                    {ach.unlocked ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">{ach.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
