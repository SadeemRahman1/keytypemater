import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw, Zap, Target, Clock, AlertCircle } from 'lucide-react';
import { UserSettings, TestResult, TestMode, KeyStat } from '../types';
import { THEMES } from '../lib/themes';
import { soundEngine } from '../lib/soundEngine';

interface TypingAreaProps {
  textToType: string;
  mode: TestMode;
  modeDetail: string;
  timeLimit?: number; // for time mode
  settings: UserSettings;
  keyStats: Record<string, KeyStat>;
  onTestComplete: (
    result: TestResult,
    charStats: Array<{ char: string; timeMs: number; err: boolean }>
  ) => void;
  onRestart: () => void;
  onNextCharChange?: (char: string | null) => void;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  textToType,
  mode,
  modeDetail,
  timeLimit,
  settings,
  onTestComplete,
  onRestart,
  onNextCharChange,
}) => {
  const theme = THEMES[settings.theme];

  // Typing state
  const [typed, setTyped] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [errorsCount, setErrorsCount] = useState<number>(0);
  const [wpmHistory, setWpmHistory] = useState<
    Array<{ time: number; wpm: number; rawWpm: number; errors: number }>
  >([]);

  // Latency & character analytics collection
  const lastKeyTimeRef = useRef<number | null>(null);
  const charStatsRef = useRef<Array<{ char: string; timeMs: number; err: boolean }>>([]);

  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<any>(null);

  // Refs to maintain latest state for uninterrupted interval timer execution
  const typedRef = useRef<string>('');
  typedRef.current = typed;

  const errorsCountRef = useRef<number>(0);
  errorsCountRef.current = errorsCount;

  const textToTypeRef = useRef<string>(textToType);
  textToTypeRef.current = textToType;

  const timeLimitRef = useRef<number | undefined>(timeLimit);
  timeLimitRef.current = timeLimit;

  const isCompletedRef = useRef<boolean>(false);
  isCompletedRef.current = isCompleted;

  const wpmHistoryRef = useRef<Array<{ time: number; wpm: number; rawWpm: number; errors: number }>>([]);
  wpmHistoryRef.current = wpmHistory;

  // Auto-scroll 5-line window as user types
  useEffect(() => {
    if (activeCharRef.current && textContainerRef.current) {
      const activeSpan = activeCharRef.current;
      const container = textContainerRef.current;

      const spanTop = activeSpan.offsetTop;
      const spanHeight = activeSpan.offsetHeight;
      const containerHeight = container.clientHeight;

      // Keep active line in view / centered in 5-line window
      const targetScrollTop = spanTop - containerHeight / 2 + spanHeight / 2;

      container.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: 'smooth',
      });
    }
  }, [typed, textToType]);

  // Focus input automatically
  useEffect(() => {
    hiddenInputRef.current?.focus();
  }, [textToType]);

  // Reset when textToType changes
  useEffect(() => {
    setTyped('');
    setStartTime(null);
    setElapsedSeconds(0);
    setIsCompleted(false);
    setErrorsCount(0);
    setWpmHistory([]);
    typedRef.current = '';
    errorsCountRef.current = 0;
    isCompletedRef.current = false;
    wpmHistoryRef.current = [];
    lastKeyTimeRef.current = null;
    charStatsRef.current = [];
    if (timerRef.current) clearInterval(timerRef.current);
    if (onNextCharChange) onNextCharChange(textToType.charAt(0) || null);
  }, [textToType]);

  // Handle hotkeys (Restart with Esc or Shift+Tab, Tab to skip to next word)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault(); // Prevent tab focus change

        if (e.shiftKey) {
          // Shift+Tab quick restarts
          onRestart();
          return;
        }

        // Tab alone skips to the start of the next word while typing!
        if (!isCompleted && textToType) {
          const currentLength = typed.length;
          let nextSpace = textToType.indexOf(' ', currentLength);
          let targetLength = 0;

          if (nextSpace === -1) {
            targetLength = textToType.length;
          } else {
            // Move cursor to right after the space (start of next word)
            targetLength = nextSpace + 1;
          }

          if (targetLength > currentLength) {
            const skippedCount = targetLength - currentLength;

            // Fill skipped positions with invalid character '\0' so typed[i] !== textToType[i]
            const skippedString = '\0'.repeat(skippedCount);
            const newTyped = typed + skippedString;

            // Increment error counter for skipped letters
            setErrorsCount((prev) => prev + skippedCount);

            // Record skipped characters as errors in charStats
            for (let i = currentLength; i < targetLength; i++) {
              charStatsRef.current.push({
                char: textToType[i],
                timeMs: 0,
                err: true,
              });
            }

            const now = Date.now();
            if (!startTime) {
              setStartTime(now);
              lastKeyTimeRef.current = now;
            }

            setTyped(newTyped);

            // Error audio feedback
            soundEngine.playKeySound(settings.soundTheme, settings.soundVolume, false, true);

            // Update next char
            const nextChar = newTyped.length < textToType.length ? textToType[newTyped.length] : null;
            if (onNextCharChange) onNextCharChange(nextChar);

            // Check completion
            if (newTyped.length >= textToType.length && mode !== 'time') {
              const finalSec = startTime ? Math.max(1, Math.floor((now - startTime) / 1000)) : 1;
              finishTest(newTyped, finalSec);
            }
          }
        }
      } else if (e.key === 'Escape') {
        if (settings.quickRestartHotkey) {
          e.preventDefault();
          onRestart();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [typed, textToType, startTime, isCompleted, mode, settings, onRestart, onNextCharChange]);

  const finishTest = (finalTyped: string, finalSeconds: number) => {
    if (isCompletedRef.current) return;
    setIsCompleted(true);
    isCompletedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);

    soundEngine.playCompletionChime(settings.soundVolume);

    let correctChars = 0;
    const currentTextToType = textToTypeRef.current;
    for (let i = 0; i < finalTyped.length; i++) {
      if (finalTyped[i] === currentTextToType[i]) correctChars++;
    }

    const durationMin = Math.max(0.1, finalSeconds / 60);
    const wpm = Math.round((correctChars / 5) / durationMin);
    const rawWpm = Math.round((finalTyped.length / 5) / durationMin);
    const accuracy = finalTyped.length > 0 ? Math.round((correctChars / finalTyped.length) * 100) : 100;
    const cpm = Math.round(correctChars / durationMin);

    const historySnapshots = wpmHistoryRef.current.length > 0
      ? wpmHistoryRef.current
      : [{ time: finalSeconds, wpm, rawWpm, errors: errorsCountRef.current }];

    const result: TestResult = {
      id: String(Date.now()),
      timestamp: Date.now(),
      mode,
      modeDetail,
      wpm,
      rawWpm,
      accuracy,
      cpm,
      timeSeconds: finalSeconds,
      errors: errorsCountRef.current,
      totalChars: finalTyped.length,
      wpmHistory: historySnapshots,
    };

    onTestComplete(result, charStatsRef.current);
  };

  const finishTestRef = useRef(finishTest);
  finishTestRef.current = finishTest;

  // Timer interval - stays continuously active without resetting on keystrokes
  useEffect(() => {
    if (startTime && !isCompleted) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const seconds = Math.max(1, Math.floor((now - startTime) / 1000));
        setElapsedSeconds(seconds);

        // Calculate current WPM snapshot for history chart using latest refs
        const currentTyped = typedRef.current;
        const currentTextToType = textToTypeRef.current;
        const currentErrorsCount = errorsCountRef.current;
        const currentTimeLimit = timeLimitRef.current;

        const totalTyped = currentTyped.length;
        let correctCount = 0;
        for (let i = 0; i < totalTyped; i++) {
          if (currentTyped[i] === currentTextToType[i]) correctCount++;
        }

        const currWpm = Math.round((correctCount / 5) / (seconds / 60));
        const currRawWpm = Math.round((totalTyped / 5) / (seconds / 60));

        const snapshot = {
          time: seconds,
          wpm: currWpm || 0,
          rawWpm: currRawWpm || 0,
          errors: currentErrorsCount,
        };

        setWpmHistory((prev) => [...prev, snapshot]);

        // Check time limit mode end condition
        if (currentTimeLimit && seconds >= currentTimeLimit) {
          finishTestRef.current(currentTyped, seconds);
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, isCompleted]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isCompleted) return;

    const val = e.target.value;
    const now = Date.now();

    // 1. Confidence Mode Enforcement
    const isBackspace = val.length < typed.length;
    if (isBackspace) {
      if (settings.confidenceMode === 'max') {
        // Max confidence mode: Backspace is completely disabled
        return;
      }
      if (settings.confidenceMode === 'on') {
        // Cannot backspace into previous word if space was typed
        const lastSpaceIndexInText = textToType.lastIndexOf(' ', typed.length - 1);
        if (val.length <= lastSpaceIndexInText && lastSpaceIndexInText !== -1) {
          return;
        }
      }
    }

    // Start timer on first keystroke
    if (!startTime && val.length > 0) {
      setStartTime(now);
      lastKeyTimeRef.current = now;
    }

    const lastCharTyped = val.slice(-1);
    const expectedChar = textToType[val.length - 1];
    const isError = !isBackspace && lastCharTyped !== expectedChar;

    // 2. Stop on Error Rules
    if (isError && settings.stopOnError === 'letter') {
      // Letter mode: Ignore incorrect keystrokes (do not append to typed)
      soundEngine.playKeySound(settings.soundTheme, settings.soundVolume, false, true);
      setErrorsCount((prev) => prev + 1);
      return;
    }

    if (!isBackspace && lastCharTyped === ' ' && settings.stopOnError === 'word') {
      // Word mode: Do not allow space to advance if current word has errors
      const wordStartIndex = textToType.lastIndexOf(' ', val.length - 2) + 1;
      const currentWordSlice = typed.slice(wordStartIndex);
      const expectedWordSlice = textToType.slice(wordStartIndex, val.length - 1);
      if (currentWordSlice !== expectedWordSlice) {
        soundEngine.playKeySound(settings.soundTheme, settings.soundVolume, true, true);
        setErrorsCount((prev) => prev + 1);
        return;
      }
    }

    // 3. Difficulty Rules (Master / Expert)
    if (isError && settings.difficulty === 'master') {
      // Master difficulty: Fails test on first incorrect keypress
      soundEngine.playKeySound(settings.soundTheme, settings.soundVolume, false, true);
      setErrorsCount((prev) => prev + 1);
      finishTest(typed + lastCharTyped, Math.max(1, Math.floor((now - (startTime || now)) / 1000)));
      return;
    }

    if (!isBackspace && lastCharTyped === ' ' && settings.difficulty === 'expert') {
      // Expert difficulty: Fails test if space submitted on an incorrect word
      const wordStartIndex = textToType.lastIndexOf(' ', val.length - 2) + 1;
      const currentWordSlice = typed.slice(wordStartIndex);
      const expectedWordSlice = textToType.slice(wordStartIndex, val.length - 1);
      if (currentWordSlice !== expectedWordSlice) {
        soundEngine.playKeySound(settings.soundTheme, settings.soundVolume, true, true);
        finishTest(typed + lastCharTyped, Math.max(1, Math.floor((now - (startTime || now)) / 1000)));
        return;
      }
    }

    // Play sound & record latency stats
    if (!isBackspace && lastCharTyped) {
      soundEngine.playKeySound(
        settings.soundTheme,
        settings.soundVolume,
        lastCharTyped === ' ',
        isError
      );

      const timeMs = lastKeyTimeRef.current ? now - lastKeyTimeRef.current : 150;
      lastKeyTimeRef.current = now;

      if (expectedChar) {
        charStatsRef.current.push({
          char: expectedChar,
          timeMs,
          err: isError,
        });
      }
    }

    if (isError) {
      setErrorsCount((prev) => prev + 1);
    }

    setTyped(val);

    // Update next char for Virtual Keyboard highlight
    const nextChar = val.length < textToType.length ? textToType[val.length] : null;
    if (onNextCharChange) onNextCharChange(nextChar);

    // Check completion condition for word / text based modes
    if (val.length >= textToType.length && mode !== 'time') {
      const finalSec = startTime ? Math.max(1, Math.floor((now - startTime) / 1000)) : 1;
      finishTest(val, finalSec);
    }
  };

  // Live Metric Calculations
  let correctCount = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === textToType[i]) correctCount++;
  }

  const liveDuration = elapsedSeconds > 0 ? elapsedSeconds / 60 : 1 / 60;
  const liveWpm = Math.round((correctCount / 5) / liveDuration);
  const liveAccuracy = typed.length > 0 ? Math.round((correctCount / typed.length) * 100) : 100;

  // Font family class
  const fontClass =
    settings.fontFamily === 'code'
      ? 'font-mono'
      : settings.fontFamily === 'sans'
      ? 'font-sans'
      : 'font-mono';

  // Caret Style Class
  const caretClass =
    settings.caretStyle === 'block'
      ? 'bg-sky-400 text-slate-950 px-0.5'
      : settings.caretStyle === 'underline'
      ? 'border-b-2 border-sky-400'
      : settings.caretStyle === 'pulse'
      ? 'w-0.5 h-7 bg-sky-400 animate-ping'
      : 'w-0.5 h-7 bg-sky-400 animate-pulse';

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto select-none">
      {/* Real-time Header Metrics Bar */}
      {!settings.blindMode && (
        <div className="flex items-center justify-between px-6 py-3 rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-sky-400" />
              <span className="text-slate-400">WPM:</span>
              <span className="font-bold font-mono text-lg text-slate-100">{liveWpm}</span>
            </div>

            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-400">Acc:</span>
              <span className="font-bold font-mono text-lg text-slate-100">{liveAccuracy}%</span>
            </div>

            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span className="text-slate-400">Errors:</span>
              <span className="font-bold font-mono text-lg text-rose-400">{errorsCount}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="font-bold font-mono text-lg text-amber-300">
              {timeLimit ? `${Math.max(0, timeLimit - elapsedSeconds)}s` : `${elapsedSeconds}s`}
            </span>
          </div>
        </div>
      )}

      {/* Main Interactive Typing Canvas Box (5-Line Window View) */}
      <div
        className={`relative p-6 sm:p-8 rounded-2xl border ${theme.border} ${theme.panelBg} flex flex-col justify-center cursor-text transition-all duration-200 shadow-xl overflow-hidden`}
        onClick={() => hiddenInputRef.current?.focus()}
      >
        {/* Subtle Gradient Fade Overlays for Top and Bottom Lines */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-slate-950/80 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-slate-950/80 to-transparent z-10" />

        {/* Hidden Input Layer for Focus & Native Keyboard Events */}
        <input
          ref={hiddenInputRef}
          type="text"
          value={typed}
          onChange={handleInputChange}
          disabled={isCompleted}
          className="absolute inset-0 opacity-0 cursor-default pointer-events-auto"
          autoFocus
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />

        {/* Text Display Canvas (Fixed ~5 lines height window with smooth auto-scroll) */}
        <div
          ref={textContainerRef}
          className={`h-[150px] sm:h-[180px] overflow-y-auto text-xl sm:text-2xl leading-relaxed tracking-wide ${fontClass} break-words whitespace-pre-wrap transition-all py-1 scrollbar-none`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {textToType.split('').map((char, index) => {
            const isTyped = index < typed.length;
            const isCurrent = index === typed.length;
            const userChar = typed[index];
            const isCorrect = isTyped && userChar === char;

            let charColor = 'text-slate-600/70'; // Pending char
            if (isTyped) {
              charColor = isCorrect ? 'text-sky-300 font-medium' : 'text-rose-400 bg-rose-950/60 rounded px-0.5 font-bold';
            }

            return (
              <span
                key={index}
                ref={isCurrent ? activeCharRef : null}
                className="relative inline-block"
              >
                {/* Caret Line Indicator */}
                {isCurrent && !isCompleted && (
                  <span className={`absolute -left-0.5 top-1 ${caretClass} z-10`} />
                )}
                <span className={charColor}>{char}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Control Actions & Hotkey Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-2">
        <div className="flex items-center gap-2">
          <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono text-[11px]">Tab</span>
          <span>skip word</span>
          <span>•</span>
          <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono text-[11px]">Esc / Shift+Tab</span>
          <span>restart</span>
        </div>

        <button
          onClick={onRestart}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs font-medium cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Restart Test</span>
        </button>
      </div>
    </div>
  );
};
