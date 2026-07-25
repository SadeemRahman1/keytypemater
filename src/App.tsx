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
  const [legalTab, setLegalTab] = useState<LegalTab>('about');

  const openLegalModal = (tab: LegalTab = 'about') => {
    setLegalTab(tab);
    setIsLegalOpen(true);
  };

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
          // Generate longer paragraph for timed mode (~300 words for smooth multi-line scrolling)
          const text = generateRandomWords(300, includeNumbers, includePunctuation);
          setCurrentText(text);
          setModeDetail(`${timeLimit}s Timed`);
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
      settings.keybrUnlockedLetters
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
        onOpenLegal={() => openLegalModal('about')}
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
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 text-center text-xs text-slate-500 border-t border-slate-800/40 select-none space-y-2">
        <div className="flex items-center justify-center gap-4 flex-wrap text-slate-400">
          <button
            onClick={() => openLegalModal('about')}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            About Us
          </button>
          <span>•</span>
          <button
            onClick={() => openLegalModal('privacy')}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <span>•</span>
          <button
            onClick={() => openLegalModal('terms')}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            Terms of Service
          </button>
          <span>•</span>
          <button
            onClick={() => openLegalModal('contact')}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            Contact & Support
          </button>
        </div>

        <p className="flex items-center justify-center gap-1 text-[11px] text-slate-600">
          <span>KeyType Master © 2026</span>
          <span>•</span>
          <span>Procedural Touch Typing & AI Mechanics Engine</span>
        </p>
      </footer>

      {/* Modals */}
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
    </div>
  );
}
