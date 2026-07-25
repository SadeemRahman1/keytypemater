import { UserSettings, TestResult, KeyStat, Achievement } from '../types';
import { KEYBR_LETTER_ORDER } from './wordGenerator';

const SETTINGS_KEY = 'keytype_user_settings_v1';
const RESULTS_KEY = 'keytype_test_results_v1';
const KEY_STATS_KEY = 'keytype_key_stats_v1';
const ACHIEVEMENTS_KEY = 'keytype_achievements_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'slate',
  soundTheme: 'mechanical',
  soundVolume: 0.5,
  caretStyle: 'line',
  fontFamily: 'mono',
  showKeyboard: true,
  showFingerColors: true,
  showHeatmap: false,
  smoothCaret: true,
  blindMode: false,
  quickRestartHotkey: true,
  keybrUnlockedLetters: ['e', 't', 'a', 'o', 'i', 'n'], // Initial 6 home-row letters unlocked
  difficulty: 'normal',
  stopOnError: 'off',
  confidenceMode: 'off',
  minSpeed: 0,
  minAccuracy: 0,
  quickEnd: true,
  freedomMode: false,
  strictSpace: false,
  liveStats: true,
  language: 'english',
  showKeybrProgressWidget: false,
  keybrTargetWpm: 35,
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_test', title: 'First Steps', description: 'Complete your first typing test', icon: 'Rocket', unlocked: false },
  { id: 'speed_30', title: 'Warming Up', description: 'Reach 30 WPM in any test mode', icon: 'Zap', unlocked: false },
  { id: 'speed_60', title: 'Touch Typer', description: 'Reach 60 WPM with high precision', icon: 'Flame', unlocked: false },
  { id: 'speed_90', title: 'Lightning Fingers', description: 'Reach 90 WPM speed threshold', icon: 'Zap', unlocked: false },
  { id: 'speed_120', title: 'Keyboard Wizard', description: 'Reach 120 WPM god speed', icon: 'Crown', unlocked: false },
  { id: 'accuracy_100', title: 'Sharpshooter', description: 'Complete a test with 100% accuracy (min 25 words)', icon: 'Target', unlocked: false },
  { id: 'keybr_unlock_12', title: 'Keybr Scholar', description: 'Unlock 12 letters in Keybr practice mode', icon: 'BookOpen', unlocked: false },
  { id: 'test_count_25', title: 'Dedicated Typer', description: 'Complete 25 typing sessions', icon: 'Trophy', unlocked: false },
  { id: 'ai_drill_master', title: 'AI Specialist', description: 'Generate and complete a custom AI practice drill', icon: 'Sparkles', unlocked: false },
];

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function loadTestResults(): TestResult[] {
  try {
    const raw = localStorage.getItem(RESULTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveTestResult(result: TestResult): TestResult[] {
  try {
    const existing = loadTestResults();
    const updated = [result, ...existing].slice(0, 100); // Keep last 100 tests
    localStorage.setItem(RESULTS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
}

export function loadKeyStats(): Record<string, KeyStat> {
  try {
    const raw = localStorage.getItem(KEY_STATS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    // Fallback
  }

  // Initialize initial default stats for a-z
  const stats: Record<string, KeyStat> = {};
  const initialUnlocked = new Set(['e', 't', 'a', 'o', 'i', 'n']);

  KEYBR_LETTER_ORDER.forEach((key) => {
    stats[key] = {
      key,
      totalTyped: 0,
      errors: 0,
      totalLatencyMs: 0,
      unlocked: initialUnlocked.has(key),
      confidence: initialUnlocked.has(key) ? 60 : 0,
    };
  });

  return stats;
}

export function updateKeyStatsFromSession(
  charStats: Array<{ char: string; timeMs: number; err: boolean }>,
  currentUnlocked: string[],
  targetWpm: number = 35
): { updatedStats: Record<string, KeyStat>; newlyUnlockedLetters: string[] } {
  const stats = loadKeyStats();
  const unlockedSet = new Set(currentUnlocked);

  charStats.forEach(({ char, timeMs, err }) => {
    const cleanKey = char.toLowerCase();
    if (KEYBR_LETTER_ORDER.includes(cleanKey)) {
      if (!stats[cleanKey]) {
        stats[cleanKey] = {
          key: cleanKey,
          totalTyped: 0,
          errors: 0,
          totalLatencyMs: 0,
          unlocked: unlockedSet.has(cleanKey),
          confidence: 0,
        };
      }

      const s = stats[cleanKey];
      s.totalTyped += 1;
      if (err) s.errors += 1;
      s.totalLatencyMs += timeMs;

      // Calculate confidence formula (accuracy % * speed factor)
      const accuracy = Math.max(0, (s.totalTyped - s.errors) / s.totalTyped);
      const avgLatency = s.totalLatencyMs / s.totalTyped; // ms per keystroke
      
      // Target speed ~ 200ms per key (30 WPM) -> 100ms per key (60 WPM)
      let speedFactor = 1;
      if (avgLatency <= 120) speedFactor = 1.0;
      else if (avgLatency <= 200) speedFactor = 0.85;
      else if (avgLatency <= 300) speedFactor = 0.7;
      else speedFactor = 0.5;

      s.confidence = Math.min(100, Math.round(accuracy * speedFactor * 100));
    }
  });

  // Check keybr progression unlock logic based on targetWpm speed threshold (official Keybr algorithm)
  const newlyUnlockedLetters: string[] = [];
  KEYBR_LETTER_ORDER.forEach((key) => {
    if (!unlockedSet.has(key)) {
      // Check if all previously unlocked letters meet the target WPM speed threshold and accuracy
      const allPrevMastered = Array.from(unlockedSet).every((prevKey) => {
        const pStat = stats[prevKey];
        if (!pStat || pStat.totalTyped < 20) return false;
        const avgLatencyMs = pStat.totalLatencyMs / pStat.totalTyped;
        const keyWpm = avgLatencyMs > 0 ? (60000 / avgLatencyMs) / 5 : 0;
        const accuracy = Math.max(0, (pStat.totalTyped - pStat.errors) / pStat.totalTyped);
        return keyWpm >= targetWpm && accuracy >= 0.88;
      });

      if (allPrevMastered && unlockedSet.size < KEYBR_LETTER_ORDER.length) {
        // Unlock next key in sequence!
        unlockedSet.add(key);
        newlyUnlockedLetters.push(key);
        if (stats[key]) {
          stats[key].unlocked = true;
          stats[key].confidence = 40;
        }
      }
    }
  });

  try {
    localStorage.setItem(KEY_STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save key stats:', e);
  }

  return { updatedStats: stats, newlyUnlockedLetters: Array.from(unlockedSet) };
}

export function loadAchievements(): Achievement[] {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (!raw) return INITIAL_ACHIEVEMENTS;

    const saved = JSON.parse(raw) as Achievement[];
    return INITIAL_ACHIEVEMENTS.map(initial => {
      const found = saved.find(s => s.id === initial.id);
      return found ? { ...initial, ...found } : initial;
    });
  } catch (e) {
    return INITIAL_ACHIEVEMENTS;
  }
}

export function checkAchievements(result: TestResult, totalTests: number, unlockedCount: number): Achievement[] {
  const current = loadAchievements();
  let updated = false;

  const next = current.map(a => {
    if (a.unlocked) return a;

    let unlock = false;
    if (a.id === 'first_test') unlock = true;
    if (a.id === 'speed_30' && result.wpm >= 30) unlock = true;
    if (a.id === 'speed_60' && result.wpm >= 60) unlock = true;
    if (a.id === 'speed_90' && result.wpm >= 90) unlock = true;
    if (a.id === 'speed_120' && result.wpm >= 120) unlock = true;
    if (a.id === 'accuracy_100' && result.accuracy === 100 && result.totalChars >= 80) unlock = true;
    if (a.id === 'keybr_unlock_12' && unlockedCount >= 12) unlock = true;
    if (a.id === 'test_count_25' && totalTests >= 25) unlock = true;
    if (a.id === 'ai_drill_master' && result.mode === 'aidrill') unlock = true;

    if (unlock) {
      updated = true;
      return { ...a, unlocked: true, unlockedAt: Date.now() };
    }
    return a;
  });

  if (updated) {
    try {
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(next));
    } catch (e) {
      console.error('Failed to save achievements:', e);
    }
  }

  return next;
}
