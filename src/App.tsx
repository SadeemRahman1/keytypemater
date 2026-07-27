import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { TypingArea } from './components/TypingArea';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { AIDrillGenerator } from './components/AIDrillGenerator';
import { SettingsModal } from './components/SettingsModal';
import { AchievementsModal } from './components/AchievementsModal';
import { HistoryDashboard } from './components/HistoryDashboard';
import { LegalPagesModal, LegalTab } from './components/LegalPagesModal';
import { CommandLineModal } from './components/CommandLineModal';
import { KeybrProgressWidget } from './components/KeybrProgressWidget';
import { KeyboardLayoutsModal } from './components/KeyboardLayoutsModal';
import { TypingGamesModal } from './components/TypingGamesModal';
import { BlogModal } from './components/BlogModal';

import {
  TestMode,
  WordCountOption,
  TimeLimitOption,
  QuoteCategory,
  UserSettings,
  TestResult,
  KeyStat,
  Achievement,
} from './types';

import {
  loadSettings,
  saveSettings,
  loadTestResults,
  saveTestResult,
  loadKeyStats,
  updateKeyStatsFromSession,
  loadAchievements,
  checkAchievements,
} from './lib/storage';

import {
  generateKeybrWords,
  generateRandomWords,
  getRandomQuote,
} from './lib/wordGenerator';

import { THEMES } from './lib/themes';

export default function App() {
  // App state
  const [settings, setSettings] = useState<UserSettings>(() => loadSettings());
  const [results, setResults] = useState<TestResult[]>(() => loadTestResults());
  const [keyStats, setKeyStats] = useState<Record<string, KeyStat>>(() => loadKeyStats());
  const [achievements, setAchievements] = useState<Achievement[]>(() => loadAchievements());

  // Mode selections
  const [mode, setMode] = useState<TestMode>('keybr');
  const [wordCount, setWordCount] = useState<WordCountOption>(25);
  const [timeLimit, setTimeLimit] = useState<TimeLimitOption>(30);
  const [quoteCategory, setQuoteCategory] = useState<QuoteCategory>('all');
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);
  const [includePunctuation, setIncludePunctuation] = useState<boolean>(false);

  // Active typing passage
  const [currentText, setCurrentText] = useState<string>('');
  const [modeDetail, setModeDetail] = useState<string>('');
  const [nextChar, setNextChar] = useState<string | null>(null);

  // Completed session state
  const [lastResult, setLastResult] = useState<TestResult | null>(null);
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([]);
  const [showingResults, setShowingResults] = useState<boolean>(false);

  // Modals
  const [isAIDrillOpen, setIsAIDrillOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isLegalOpen, setIsLegalOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isLayoutsOpen, setIsLayoutsOpen] = useState<boolean>(false);
  const [isGamesOpen, setIsGamesOpen] = useState<boolean>(false);
  const [isBlogOpen, setIsBlogOpen] = useState<boolean>(false);
  const [legalTab, setLegalTab] = useState<LegalTab>('about');

  const openLegalModal = (tab: LegalTab = 'about') => {
    setLegalTab(tab);
    setIsLegalOpen(true);
  };

  // Global Monkeytype Command Line Hotkey (Ctrl+Shift+P or Esc)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'p') || (e.key === 'Escape' && !isSettingsOpen && !isAchievementsOpen && !isHistoryOpen && !isLegalOpen)) {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isSettingsOpen, isAchievementsOpen, isHistoryOpen, isLegalOpen]);

  // Regenerate new practice text passage based on active mode
  const prepareNewPassage = useCallback(() => {
    setShowingResults(false);
    setLastResult(null);
    setNewlyUnlocked([]);

    setSettings((currentSettings) => {
      switch (mode) {
        case 'keybr': {
          const text = generateKeybrWords(currentSettings.keybrUnlockedLetters, 25);
          setCurrentText(text);
          setModeDetail(`Keybr (${currentSettings.keybrUnlockedLetters.join(', ').toUpperCase()})`);
          break;
        }
        case 'words': {
          const text = generateRandomWords(wordCount, includeNumbers, includePunctuation);
          setCurrentText(text);
          setModeDetail(`${wordCount} Words`);
          break;
        }
        case 'time': {
          // Dynamically scale word pool so longer tests (3m, 5m, 10m, custom) never run out of words
          const wordsToGenerate = Math.max(300, Math.ceil((timeLimit / 60) * 160));
          const text = generateRandomWords(wordsToGenerate, includeNumbers, includePunctuation);
          setCurrentText(text);
          const formattedLabel = timeLimit >= 60 && timeLimit % 60 === 0 ? `${timeLimit / 60}m` : `${timeLimit}s`;
          setModeDetail(`${formattedLabel} Timed`);
          break;
        }
        case 'quote': {
          const { quote, author } = getRandomQuote(quoteCategory);
          setCurrentText(quote);
          setModeDetail(`Quote (${author})`);
          break;
        }
        default:
          break;
      }
      return currentSettings;
    });
  }, [mode, wordCount, timeLimit, quoteCategory, includeNumbers, includePunctuation]);

  // Initial passage generation on mount or mode change
  useEffect(() => {
    prepareNewPassage();
  }, [prepareNewPassage]);

  // Handle test completion
  const handleTestComplete = (
    result: TestResult,
    charStats: Array<{ char: string; timeMs: number; err: boolean }>
  ) => {
    // 1. Save test result
    const updatedResults = saveTestResult(result);
    setResults(updatedResults);

    // 2. Update key mechanics & keybr progression
    const { updatedStats, newlyUnlockedLetters } = updateKeyStatsFromSession(
      charStats,
      settings.keybrUnlockedLetters,
      settings.keybrTargetWpm || 35
    );
    setKeyStats(updatedStats);

    if (newlyUnlockedLetters.length > 0) {
      const newUnlockedList = Array.from(new Set([...settings.keybrUnlockedLetters, ...newlyUnlockedLetters]));
      const newSettings = { ...settings, keybrUnlockedLetters: newUnlockedList };
      setSettings(newSettings);
      saveSettings(newSettings);
      setNewlyUnlocked(newlyUnlockedLetters);
    }

    // 3. Check achievement unlocks
    const updatedAchievements = checkAchievements(
      result,
      updatedResults.length,
      settings.keybrUnlockedLetters.length
    );
    setAchievements(updatedAchievements);

    setLastResult(result);
    setShowingResults(true);
  };

  // Handle custom AI drill generated
  const handleAIDrillGenerated = (text: string, title: string) => {
    setMode('aidrill');
    setCurrentText(text);
    setModeDetail(title);
    setShowingResults(false);
    setLastResult(null);
  };

  const handleSaveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleUpdateUnlockedLetters = (newUnlocked: string[]) => {
    const updated = { ...settings, keybrUnlockedLetters: newUnlocked };
    setSettings(updated);
    saveSettings(updated);
    if (mode === 'keybr') {
      const text = generateKeybrWords(newUnlocked, 25);
      setCurrentText(text);
      setModeDetail(`Keybr (${newUnlocked.join(', ').toUpperCase()})`);
    }
  };

  const handleClearHistory = () => {
    localStorage.removeItem('keytype_test_results_v1');
    setResults([]);
  };

  const theme = THEMES[settings.theme];
  const unlockedAchievementsCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.textPrimary} flex flex-col justify-between font-sans transition-colors duration-300`}>
      {/* Top Header */}
      <Header
        mode={mode}
        wordCount={wordCount}
        timeLimit={timeLimit}
        quoteCategory={quoteCategory}
        includeNumbers={includeNumbers}
        includePunctuation={includePunctuation}
        settings={settings}
        unlockedCount={settings.keybrUnlockedLetters.length}
        unlockedAchievements={unlockedAchievementsCount}
        totalAchievements={achievements.length}
        onSelectMode={(newMode) => {
          setMode(newMode);
        }}
        onChangeWordCount={setWordCount}
        onChangeTimeLimit={setTimeLimit}
        onChangeQuoteCategory={setQuoteCategory}
        onToggleNumbers={() => setIncludeNumbers((prev) => !prev)}
        onTogglePunctuation={() => setIncludePunctuation((prev) => !prev)}
        onOpenAIDrill={() => setIsAIDrillOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenLayouts={() => setIsLayoutsOpen(true)}
        onOpenGames={() => setIsGamesOpen(true)}
        onOpenBlog={() => setIsBlogOpen(true)}
        onOpenLegal={() => openLegalModal('about')}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Practice Workspace */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 w-full max-w-5xl mx-auto my-auto gap-8">
        {showingResults && lastResult ? (
          <AnalyticsPanel
            result={lastResult}
            keyStats={keyStats}
            unlockedLetters={settings.keybrUnlockedLetters}
            newlyUnlocked={newlyUnlocked}
            settings={settings}
            onNextTest={prepareNewPassage}
          />
        ) : (
          <>
            {mode === 'keybr' && settings.showKeybrProgressWidget && (
              <KeybrProgressWidget
                settings={settings}
                keyStats={keyStats}
                onUpdateUnlockedLetters={handleUpdateUnlockedLetters}
                onOpenSettings={() => setIsSettingsOpen(true)}
              />
            )}

            <TypingArea
              textToType={currentText}
              mode={mode}
              modeDetail={modeDetail}
              timeLimit={mode === 'time' ? timeLimit : undefined}
              settings={settings}
              keyStats={keyStats}
              onTestComplete={handleTestComplete}
              onRestart={prepareNewPassage}
              onNextCharChange={setNextChar}
            />

            {settings.showKeyboard && (
              <VirtualKeyboard
                nextChar={nextChar}
                settings={settings}
                keyStats={keyStats}
                onUpdateSettings={handleSaveSettings}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 sm:py-6 px-3 sm:px-4 text-center text-xs text-slate-500 border-t border-slate-800/40 select-none space-y-2">
        <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap text-xs text-slate-400">
          <button
            onClick={() => openLegalModal('about')}
            className="hover:text-amber-400 transition-colors cursor-pointer py-1 px-1.5"
          >
            About Us
          </button>
          <span className="text-slate-700">•</span>
          <button
            onClick={() => setIsBlogOpen(true)}
            className="hover:text-sky-400 transition-colors cursor-pointer py-1 px-1.5 font-bold text-sky-400/90"
          >
            Blog & Guides
          </button>
          <span className="text-slate-700">•</span>
          <button
            onClick={() => openLegalModal('privacy')}
            className="hover:text-amber-400 transition-colors cursor-pointer py-1 px-1.5"
          >
            Privacy Policy
          </button>
          <span className="text-slate-700">•</span>
          <button
            onClick={() => openLegalModal('terms')}
            className="hover:text-amber-400 transition-colors cursor-pointer py-1 px-1.5"
          >
            Terms of Service
          </button>
          <span className="text-slate-700">•</span>
          <button
            onClick={() => openLegalModal('contact')}
            className="hover:text-amber-400 transition-colors cursor-pointer py-1 px-1.5"
          >
            Contact & Support
          </button>
        </div>

        <p className="flex items-center justify-center gap-1.5 flex-wrap text-[10px] sm:text-[11px] text-slate-600">
          <span>KeyType Master © 2026</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">Procedural Touch Typing & AI Mechanics Engine</span>
        </p>
      </footer>

      {/* Modals */}
      {isCommandPaletteOpen && (
        <CommandLineModal
          settings={settings}
          onUpdateSettings={handleSaveSettings}
          onSetMode={(m) => setMode(m)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenAchievements={() => setIsAchievementsOpen(true)}
          onOpenLayouts={() => setIsLayoutsOpen(true)}
          onOpenGames={() => setIsGamesOpen(true)}
          onOpenBlog={() => setIsBlogOpen(true)}
          onOpenLegal={(tab) => openLegalModal(tab)}
          onClose={() => setIsCommandPaletteOpen(false)}
        />
      )}

      {isLegalOpen && (
        <LegalPagesModal
          initialTab={legalTab}
          settings={settings}
          onClose={() => setIsLegalOpen(false)}
        />
      )}

      {isAIDrillOpen && (
        <AIDrillGenerator
          settings={settings}
          keyStats={keyStats}
          unlockedLetters={settings.keybrUnlockedLetters}
          onGenerated={handleAIDrillGenerated}
          onClose={() => setIsAIDrillOpen(false)}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          onSave={handleSaveSettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {isAchievementsOpen && (
        <AchievementsModal
          achievements={achievements}
          settings={settings}
          onClose={() => setIsAchievementsOpen(false)}
        />
      )}

      {isHistoryOpen && (
        <HistoryDashboard
          results={results}
          keyStats={keyStats}
          settings={settings}
          onClearHistory={handleClearHistory}
          onClose={() => setIsHistoryOpen(false)}
        />
      )}

      {isLayoutsOpen && (
        <KeyboardLayoutsModal
          isOpen={isLayoutsOpen}
          settings={settings}
          onSaveSettings={handleSaveSettings}
          onClose={() => setIsLayoutsOpen(false)}
        />
      )}

      {isGamesOpen && (
        <TypingGamesModal
          isOpen={isGamesOpen}
          settings={settings}
          onClose={() => setIsGamesOpen(false)}
        />
      )}

      {isBlogOpen && (
        <BlogModal
          isOpen={isBlogOpen}
          settings={settings}
          onClose={() => setIsBlogOpen(false)}
          onSelectPracticeMode={(m) => setMode(m)}
        />
      )}
    </div>
  );
}
