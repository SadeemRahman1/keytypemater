import React, { useState, useEffect, useRef } from 'react';
import { Search, Command, X, Palette, Volume2, Type, Eye, Shield, Trophy, Settings, BarChart2 } from 'lucide-react';
import { UserSettings, ThemeId, AudioTheme, TestMode } from '../types';
import { THEMES } from '../lib/themes';

interface CommandItem {
  id: string;
  category: 'theme' | 'audio' | 'mode' | 'setting' | 'navigation';
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
}

interface CommandLineModalProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onSetMode: (mode: TestMode) => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onOpenAchievements: () => void;
  onOpenLayouts?: () => void;
  onOpenGames?: () => void;
  onOpenLegal: (tab: 'about' | 'privacy' | 'terms' | 'contact') => void;
  onClose: () => void;
}

export const CommandLineModal: React.FC<CommandLineModalProps> = ({
  settings,
  onUpdateSettings,
  onSetMode,
  onOpenSettings,
  onOpenHistory,
  onOpenAchievements,
  onOpenLayouts,
  onOpenGames,
  onOpenLegal,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = THEMES[settings.theme];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const commands: CommandItem[] = [
    // Modes
    { id: 'mode-keybr', category: 'mode', title: 'Mode: Keybr Mechanics', subtitle: 'Procedural key unlocking', icon: <Command className="w-4 h-4 text-amber-400" />, action: () => { onSetMode('keybr'); onClose(); } },
    { id: 'mode-words', category: 'mode', title: 'Mode: Word Count', subtitle: 'Type fixed word sets', icon: <Command className="w-4 h-4 text-sky-400" />, action: () => { onSetMode('words'); onClose(); } },
    { id: 'mode-time-30', category: 'mode', title: 'Timed Test: 30 Seconds', subtitle: 'Short 30s speed test', icon: <Command className="w-4 h-4 text-emerald-400" />, action: () => { onSetMode('time'); onClose(); } },
    { id: 'mode-time-60', category: 'mode', title: 'Timed Test: 1 Minute (60s)', subtitle: 'Standard 1 minute test', icon: <Command className="w-4 h-4 text-emerald-400" />, action: () => { onSetMode('time'); onClose(); } },
    { id: 'mode-time-120', category: 'mode', title: 'Timed Test: 2 Minutes (120s)', subtitle: '2 minute speed test', icon: <Command className="w-4 h-4 text-emerald-400" />, action: () => { onSetMode('time'); onClose(); } },
    { id: 'mode-time-300', category: 'mode', title: 'Timed Test: 5 Minutes (300s)', subtitle: '5 minute stamina test', icon: <Command className="w-4 h-4 text-emerald-400" />, action: () => { onSetMode('time'); onClose(); } },
    { id: 'mode-time-600', category: 'mode', title: 'Timed Test: 10 Minutes (600s)', subtitle: 'Long 10 minute endurance test', icon: <Command className="w-4 h-4 text-emerald-400" />, action: () => { onSetMode('time'); onClose(); } },
    { id: 'mode-quote', category: 'mode', title: 'Mode: Famous Quotes', subtitle: 'Practice typing quotes', icon: <Command className="w-4 h-4 text-purple-400" />, action: () => { onSetMode('quote'); onClose(); } },

    // Themes
    ...Object.values(THEMES).map((t) => ({
      id: `theme-${t.id}`,
      category: 'theme' as const,
      title: `Theme: ${t.name}`,
      subtitle: 'Switch color theme',
      icon: <Palette className="w-4 h-4 text-sky-400" />,
      action: () => { onUpdateSettings({ ...settings, theme: t.id }); onClose(); },
    })),

    // Audio Themes
    { id: 'audio-thock', category: 'audio', title: 'Audio: Creamy Thock', subtitle: 'Mechanical switch pop sound', icon: <Volume2 className="w-4 h-4 text-emerald-400" />, action: () => { onUpdateSettings({ ...settings, soundTheme: 'thock' }); onClose(); } },
    { id: 'audio-mechanical', category: 'audio', title: 'Audio: Classic Mechanical', subtitle: 'Cherry MX switch click', icon: <Volume2 className="w-4 h-4 text-emerald-400" />, action: () => { onUpdateSettings({ ...settings, soundTheme: 'mechanical' }); onClose(); } },
    { id: 'audio-clack', category: 'audio', title: 'Audio: Sharp Clack', subtitle: 'High frequency click', icon: <Volume2 className="w-4 h-4 text-emerald-400" />, action: () => { onUpdateSettings({ ...settings, soundTheme: 'clack' }); onClose(); } },

    // Difficulty & Settings
    { id: 'diff-normal', category: 'setting', title: 'Difficulty: Normal', subtitle: 'Classic typing experience', icon: <Eye className="w-4 h-4 text-sky-400" />, action: () => { onUpdateSettings({ ...settings, difficulty: 'normal' }); onClose(); } },
    { id: 'diff-expert', category: 'setting', title: 'Difficulty: Expert', subtitle: 'Fail test on incorrect word', icon: <Eye className="w-4 h-4 text-amber-400" />, action: () => { onUpdateSettings({ ...settings, difficulty: 'expert' }); onClose(); } },
    { id: 'diff-master', category: 'setting', title: 'Difficulty: Master', subtitle: 'Fail test on 1 single wrong key', icon: <Eye className="w-4 h-4 text-rose-400" />, action: () => { onUpdateSettings({ ...settings, difficulty: 'master' }); onClose(); } },

    { id: 'toggle-blind', category: 'setting', title: `Blind Mode: ${settings.blindMode ? 'OFF' : 'ON'}`, subtitle: 'Hide speed & error highlights', icon: <Eye className="w-4 h-4 text-purple-400" />, action: () => { onUpdateSettings({ ...settings, blindMode: !settings.blindMode }); onClose(); } },
    { id: 'toggle-stats', category: 'setting', title: `Live WPM Stats: ${settings.liveStats ? 'OFF' : 'ON'}`, subtitle: 'Toggle real-time WPM header bar', icon: <Eye className="w-4 h-4 text-sky-400" />, action: () => { onUpdateSettings({ ...settings, liveStats: !settings.liveStats }); onClose(); } },
    { id: 'toggle-keybr-banner', category: 'setting', title: `Keybr Progress Banner: ${settings.showKeybrProgressWidget ? 'HIDE' : 'SHOW'}`, subtitle: 'Toggle procedural progress bar on main screen', icon: <Command className="w-4 h-4 text-amber-400" />, action: () => { onUpdateSettings({ ...settings, showKeybrProgressWidget: !settings.showKeybrProgressWidget }); onClose(); } },
    { id: 'keybr-target-35', category: 'setting', title: 'Keybr Target Speed: 35 WPM (Default)', subtitle: 'Unlock next letter above 35 WPM', icon: <Command className="w-4 h-4 text-amber-400" />, action: () => { onUpdateSettings({ ...settings, keybrTargetWpm: 35 }); onClose(); } },
    { id: 'keybr-target-50', category: 'setting', title: 'Keybr Target Speed: 50 WPM (Fast)', subtitle: 'Unlock next letter above 50 WPM', icon: <Command className="w-4 h-4 text-amber-400" />, action: () => { onUpdateSettings({ ...settings, keybrTargetWpm: 50 }); onClose(); } },

    // Navigations
    { id: 'nav-games', category: 'navigation', title: 'Open Typing Arcade Games', subtitle: 'Play Meteor Defense, Nitro Racer & Balloon Burst', icon: <Command className="w-4 h-4 text-amber-400" />, action: () => { if (onOpenGames) onOpenGames(); onClose(); } },
    { id: 'nav-layouts', category: 'navigation', title: 'Open Keyboard Layouts & Efficiency', subtitle: 'Analyze QWERTY, Dvorak, Colemak, Workman & custom layouts', icon: <Command className="w-4 h-4 text-purple-400" />, action: () => { if (onOpenLayouts) onOpenLayouts(); onClose(); } },
    { id: 'nav-settings', category: 'navigation', title: 'Open All Preferences', subtitle: 'Configure all typing options', icon: <Settings className="w-4 h-4 text-slate-400" />, action: () => { onOpenSettings(); onClose(); } },
    { id: 'nav-history', category: 'navigation', title: 'Open Performance History', subtitle: 'View past tests & graphs', icon: <BarChart2 className="w-4 h-4 text-slate-400" />, action: () => { onOpenHistory(); onClose(); } },
    { id: 'nav-achieve', category: 'navigation', title: 'Open Badges & Achievements', subtitle: 'Check unlocked trophies', icon: <Trophy className="w-4 h-4 text-amber-400" />, action: () => { onOpenAchievements(); onClose(); } },
    { id: 'nav-about', category: 'navigation', title: 'About Us', subtitle: 'AdSense compliance & info', icon: <Shield className="w-4 h-4 text-amber-400" />, action: () => { onOpenLegal('about'); onClose(); } },
    { id: 'nav-privacy', category: 'navigation', title: 'Privacy Policy', subtitle: 'AdSense & GDPR policy', icon: <Shield className="w-4 h-4 text-emerald-400" />, action: () => { onOpenLegal('privacy'); onClose(); } },
    { id: 'nav-terms', category: 'navigation', title: 'Terms of Service', subtitle: 'Terms & conditions', icon: <Shield className="w-4 h-4 text-sky-400" />, action: () => { onOpenLegal('terms'); onClose(); } },
  ];

  const filteredCommands = commands.filter((cmd) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return cmd.title.toLowerCase().includes(q) || (cmd.subtitle && cmd.subtitle.toLowerCase().includes(q));
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn select-none">
      <div className={`relative w-full max-w-xl rounded-2xl border ${theme.border} ${theme.panelBg} flex flex-col shadow-2xl overflow-hidden`}>
        {/* Search Bar Input */}
        <div className={`flex items-center gap-3 px-5 py-4 border-b ${theme.border}`}>
          <Search className="w-5 h-5 text-amber-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search settings (e.g. 'thock', 'theme', 'master')..."
            className="w-full bg-transparent border-none text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-medium"
          />
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-[50vh] overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">No matching commands found</div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  onClick={() => cmd.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 font-semibold shadow'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isSelected ? 'text-slate-950' : 'text-slate-400'}>{cmd.icon}</span>
                    <div>
                      <div className="font-bold">{cmd.title}</div>
                      {cmd.subtitle && (
                        <div className={`text-[10px] ${isSelected ? 'text-slate-800' : 'text-slate-500'}`}>
                          {cmd.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${isSelected ? 'bg-slate-900/20 text-slate-900' : 'bg-slate-800 text-slate-400'}`}>
                    Select
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Modal Footer Hotkeys */}
        <div className={`px-5 py-2.5 border-t ${theme.border} bg-slate-900/40 text-[10px] text-slate-500 flex items-center justify-between`}>
          <span>Use <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-slate-300">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-slate-300">↓</kbd> to navigate</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-slate-300">Enter</kbd> to select • <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-slate-300">Esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
};
