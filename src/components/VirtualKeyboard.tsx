import React, { useEffect, useState } from 'react';
import { FingerType, KeyStat } from '../types';
import { THEMES } from '../lib/themes';
import { UserSettings } from '../types';
import { getLayoutById, KEYBOARD_LAYOUTS, KeyboardLayoutData } from '../lib/keyboardLayouts';
import { Keyboard, Info, Check, Hand, Sparkles } from 'lucide-react';

interface VirtualKeyboardProps {
  nextChar: string | null;
  settings: UserSettings;
  keyStats: Record<string, KeyStat>;
  onUpdateSettings?: (settings: UserSettings) => void;
}

interface KeyConfig {
  key: string;
  displayLabel?: string;
  finger: FingerType;
  width?: string;
}

function getFingerForCol(colIndex: number): FingerType {
  if (colIndex === 0) return 'left-pinky';
  if (colIndex === 1) return 'left-ring';
  if (colIndex === 2) return 'left-middle';
  if (colIndex === 3 || colIndex === 4) return 'left-index';
  if (colIndex === 5 || colIndex === 6) return 'right-index';
  if (colIndex === 7) return 'right-middle';
  if (colIndex === 8) return 'right-ring';
  return 'right-pinky';
}

function getKeyboardRowsForLayout(layout: KeyboardLayoutData): KeyConfig[][] {
  const row1Keys = layout.keyRows.row1 || ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='];
  const row2Keys = layout.keyRows.row2;
  const row3Keys = layout.keyRows.row3;
  const row4Keys = layout.keyRows.row4;

  const r1: KeyConfig[] = [
    ...row1Keys.map((k, i) => ({
      key: k,
      finger: (i <= 1 ? 'left-pinky' : i === 2 ? 'left-ring' : i === 3 ? 'left-middle' : i <= 5 ? 'left-index' : i <= 7 ? 'right-index' : i === 8 ? 'right-middle' : i === 9 ? 'right-ring' : 'right-pinky') as FingerType,
    })),
    { key: 'Backspace', displayLabel: '⌫', finger: 'right-pinky', width: 'w-12 sm:w-16' },
  ];

  const r2: KeyConfig[] = [
    { key: 'Tab', displayLabel: 'Tab', finger: 'left-pinky', width: 'w-10 sm:w-14' },
    ...row2Keys.map((k, i) => ({
      key: k,
      finger: getFingerForCol(i),
    })),
    ...(!row2Keys.includes('\\') && !row2Keys.includes(']') ? [{ key: '\\', finger: 'right-pinky' as FingerType }] : []),
  ];

  const r3: KeyConfig[] = [
    { key: 'CapsLock', displayLabel: 'Caps', finger: 'left-pinky', width: 'w-12 sm:w-16' },
    ...row3Keys.map((k, i) => ({
      key: k,
      finger: getFingerForCol(i),
    })),
    { key: 'Enter', displayLabel: '↵', finger: 'right-pinky', width: 'w-14 sm:w-20' },
  ];

  const r4: KeyConfig[] = [
    { key: 'ShiftLeft', displayLabel: 'Shift', finger: 'left-pinky', width: 'w-14 sm:w-20' },
    ...row4Keys.map((k, i) => ({
      key: k,
      finger: getFingerForCol(i),
    })),
    { key: 'ShiftRight', displayLabel: 'Shift', finger: 'right-pinky', width: 'w-14 sm:w-20' },
  ];

  const r5: KeyConfig[] = [
    { key: 'ControlLeft', displayLabel: 'Ctrl', finger: 'left-pinky', width: 'w-10 sm:w-12' },
    { key: 'AltLeft', displayLabel: 'Alt', finger: 'left-pinky', width: 'w-10 sm:w-12' },
    { key: ' ', displayLabel: 'Spacebar', finger: 'thumb', width: 'w-48 sm:w-72' },
    { key: 'AltRight', displayLabel: 'Alt', finger: 'right-pinky', width: 'w-10 sm:w-12' },
    { key: 'ControlRight', displayLabel: 'Ctrl', finger: 'right-pinky', width: 'w-10 sm:w-12' },
  ];

  return [r1, r2, r3, r4, r5];
}


interface FingerStyle {
  bg: string;
  border: string;
  text: string;
  badge: string;
  label: string;
}

const FINGER_STYLES: Record<FingerType, FingerStyle> = {
  'left-pinky': {
    bg: 'bg-emerald-950/80 hover:bg-emerald-900/90',
    border: 'border-emerald-700/60',
    text: 'text-emerald-200',
    badge: 'bg-emerald-600',
    label: 'L. Pinky',
  },
  'left-ring': {
    bg: 'bg-lime-950/80 hover:bg-lime-900/90',
    border: 'border-lime-700/60',
    text: 'text-lime-200',
    badge: 'bg-lime-600',
    label: 'L. Ring',
  },
  'left-middle': {
    bg: 'bg-amber-950/80 hover:bg-amber-900/90',
    border: 'border-amber-700/60',
    text: 'text-amber-200',
    badge: 'bg-amber-600',
    label: 'L. Middle',
  },
  'left-index': {
    bg: 'bg-teal-950/80 hover:bg-teal-900/90',
    border: 'border-teal-700/60',
    text: 'text-teal-200',
    badge: 'bg-teal-600',
    label: 'L. Index',
  },
  'right-index': {
    bg: 'bg-purple-950/80 hover:bg-purple-900/90',
    border: 'border-purple-700/60',
    text: 'text-purple-200',
    badge: 'bg-purple-600',
    label: 'R. Index',
  },
  'right-middle': {
    bg: 'bg-amber-950/80 hover:bg-amber-900/90',
    border: 'border-amber-700/60',
    text: 'text-amber-200',
    badge: 'bg-amber-600',
    label: 'R. Middle',
  },
  'right-ring': {
    bg: 'bg-lime-950/80 hover:bg-lime-900/90',
    border: 'border-lime-700/60',
    text: 'text-lime-200',
    badge: 'bg-lime-600',
    label: 'R. Ring',
  },
  'right-pinky': {
    bg: 'bg-emerald-950/80 hover:bg-emerald-900/90',
    border: 'border-emerald-700/60',
    text: 'text-emerald-200',
    badge: 'bg-emerald-600',
    label: 'R. Pinky',
  },
  'thumb': {
    bg: 'bg-rose-950/80 hover:bg-rose-900/90',
    border: 'border-rose-700/60',
    text: 'text-rose-200',
    badge: 'bg-rose-600',
    label: 'Thumbs',
  },
};

const SHIFT_SYMBOLS_MAP: Record<string, string> = {
  '!': '1',
  '@': '2',
  '#': '3',
  '$': '4',
  '%': '5',
  '^': '6',
  '&': '7',
  '*': '8',
  '(': '9',
  ')': '0',
  '_': '-',
  '+': '=',
  '{': '[',
  '}': ']',
  '|': '\\',
  ':': ';',
  '"': "'",
  '<': ',',
  '>': '.',
  '?': '/',
  '~': '`',
};

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ nextChar, settings, keyStats, onUpdateSettings }) => {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const theme = THEMES[settings.theme];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let key = e.key.toLowerCase();
      if (e.code === 'ShiftLeft') key = 'shiftleft';
      if (e.code === 'ShiftRight') key = 'shiftright';
      if (e.code === 'ControlLeft') key = 'controlleft';
      if (e.code === 'ControlRight') key = 'controlright';
      if (e.code === 'AltLeft') key = 'altleft';
      if (e.code === 'AltRight') key = 'altright';
      setActiveKeys((prev) => new Set(prev).add(key));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      let key = e.key.toLowerCase();
      if (e.code === 'ShiftLeft') key = 'shiftleft';
      if (e.code === 'ShiftRight') key = 'shiftright';
      if (e.code === 'ControlLeft') key = 'controlleft';
      if (e.code === 'ControlRight') key = 'controlright';
      if (e.code === 'AltLeft') key = 'altleft';
      if (e.code === 'AltRight') key = 'altright';
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Determine active layout and generate key rows
  const activeLayoutObj = getLayoutById(settings.activeLayout);
  const keyboardRows = getKeyboardRowsForLayout(activeLayoutObj);

  // Determine target key and shift requirement
  let targetBaseKey: string | null = null;
  let isShiftNeeded = false;

  if (nextChar) {
    if (nextChar === ' ') {
      targetBaseKey = ' ';
    } else if (SHIFT_SYMBOLS_MAP[nextChar]) {
      targetBaseKey = SHIFT_SYMBOLS_MAP[nextChar];
      isShiftNeeded = true;
    } else if (nextChar >= 'A' && nextChar <= 'Z') {
      targetBaseKey = nextChar.toLowerCase();
      isShiftNeeded = true;
    } else {
      targetBaseKey = nextChar.toLowerCase();
    }
  }

  const leftHomeKey = activeLayoutObj.homeRowKeys[3]?.toLowerCase();
  const rightHomeKey = activeLayoutObj.homeRowKeys[6]?.toLowerCase();

  return (
    <div className={`hidden md:flex flex-col items-center gap-3 p-4 rounded-2xl border ${theme.border} ${theme.panelBg} transition-colors duration-200 select-none shadow-xl`}>
      {/* Active Layout Header & Quick Selector */}
      <div className="flex flex-wrap items-center justify-between w-full px-2 text-xs border-b border-slate-800/60 pb-2.5 gap-2">
        <div className="flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-sky-400" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">Active Layout:</span>
          <select
            value={activeLayoutObj.id}
            onChange={(e) => {
              if (onUpdateSettings) {
                onUpdateSettings({ ...settings, activeLayout: e.target.value });
              }
            }}
            className="text-xs font-bold text-sky-400 bg-slate-900 border border-sky-500/30 rounded-lg px-2.5 py-1 focus:outline-none focus:border-sky-400 font-mono cursor-pointer hover:bg-slate-850"
          >
            {KEYBOARD_LAYOUTS.map((l) => (
              <option key={l.id} value={l.id} className="bg-slate-900 text-slate-200">
                {l.name} ({l.category.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
          <span title="Keystrokes landed on middle home row">Home Row: <strong className="text-emerald-400">{activeLayoutObj.stats.homeRowPct}%</strong></span>
          <span title="Overall ergonomic efficiency score">Efficiency: <strong className="text-sky-400">{activeLayoutObj.stats.score}/100</strong></span>
        </div>
      </div>

      {/* Keyboard Grid */}
      <div className="flex flex-col gap-1.5 sm:gap-2 w-full items-center overflow-x-auto py-1">
        {keyboardRows.map((row, rIdx) => (
          <div key={rIdx} className="flex gap-1 sm:gap-1.5 items-center justify-center">
            {row.map((item, itemIdx) => {
              const keyLower = item.key.toLowerCase();
              const isPressed = activeKeys.has(keyLower);
              const isNextTarget = targetBaseKey === keyLower;
              const isShiftHighlight = isShiftNeeded && (keyLower === 'shiftleft' || keyLower === 'shiftright');
              const isHomeKey = leftHomeKey === keyLower || rightHomeKey === keyLower;

              // Heatmap calculation
              const kStat = keyStats[keyLower];
              let heatmapClass = '';
              if (settings.showHeatmap && kStat && kStat.totalTyped > 5) {
                if (kStat.confidence >= 80) {
                  heatmapClass = 'bg-emerald-500/30 border-emerald-400 text-emerald-200';
                } else if (kStat.confidence >= 50) {
                  heatmapClass = 'bg-amber-500/30 border-amber-400 text-amber-200';
                } else {
                  heatmapClass = 'bg-rose-500/30 border-rose-400 text-rose-200';
                }
              }

              // Finger color styling (Keybr style background color)
              const fingerStyle = FINGER_STYLES[item.finger];
              const fingerClass = settings.showFingerColors && !heatmapClass
                ? `${fingerStyle.bg} ${fingerStyle.border} ${fingerStyle.text}`
                : `${theme.keyBg}`;

              const defaultWidth = 'w-8 h-8 sm:w-11 sm:h-11';
              const widthClass = item.width || defaultWidth;

              return (
                <div
                  key={`${item.key}-${itemIdx}`}
                  className={`
                    relative flex items-center justify-center rounded-lg text-xs sm:text-sm font-mono font-bold border transition-all duration-75
                    ${widthClass}
                    ${fingerClass}
                    ${isPressed ? 'bg-sky-400 text-slate-950 border-sky-300 scale-95 z-20 shadow-inner' : ''}
                    ${isNextTarget && !isPressed ? 'bg-amber-400 text-slate-950 border-amber-300 ring-4 ring-amber-400/80 scale-105 z-30 shadow-lg shadow-amber-400/50 animate-pulse' : ''}
                    ${isShiftHighlight && !isPressed ? 'ring-2 ring-purple-400 bg-purple-500 text-slate-950 font-bold z-20 animate-pulse' : ''}
                    ${heatmapClass}
                  `}
                >
                  <span>{item.displayLabel || item.key.toUpperCase()}</span>

                  {/* Tactile Home Row Marker for Resting Index Keys */}
                  {isHomeKey && (
                    <div className="absolute bottom-1 w-2 h-0.5 rounded-full bg-slate-300/80" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Finger Guide Legend */}
      {settings.showFingerColors && (
        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] pt-2 border-t border-slate-800/60 w-full max-w-2xl text-slate-300">
          <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Finger Guide:</span>
          {Object.entries(FINGER_STYLES).map(([key, style]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${style.badge}`} />
              <span className="font-medium text-slate-300">{style.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Dynamic Layout Guidelines & Hand Resting Guide */}
      <div className="w-full mt-1 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 flex flex-col sm:flex-row gap-3 items-stretch justify-between">
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="flex items-center gap-2 font-semibold text-amber-300 text-xs">
            <Hand className="w-3.5 h-3.5 text-amber-400" />
            <span>{activeLayoutObj.name} Guidelines:</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {activeLayoutObj.description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 items-center justify-end font-mono text-[11px] border-t sm:border-t-0 sm:border-l border-slate-800/80 pt-2 sm:pt-0 sm:pl-3">
          {/* Left Hand Keys */}
          <div className="flex flex-col items-center sm:items-start gap-1">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-sans font-bold">Left Hand Resting:</span>
            <div className="flex gap-1">
              {activeLayoutObj.homeRowKeys.slice(0, 4).map((k, i) => (
                <span
                  key={i}
                  className={`w-6 h-6 flex items-center justify-center rounded font-bold border ${
                    i === 3
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-1 ring-amber-400/50'
                      : 'bg-slate-800 text-slate-200 border-slate-700'
                  }`}
                  title={i === 3 ? 'Resting Index Finger (Tactile Bump)' : `Finger ${i + 1}`}
                >
                  {k.toUpperCase()}
                </span>
              ))}
            </div>
          </div>

          {/* Right Hand Keys */}
          <div className="flex flex-col items-center sm:items-start gap-1">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-sans font-bold">Right Hand Resting:</span>
            <div className="flex gap-1">
              {activeLayoutObj.homeRowKeys.slice(6, 10).map((k, i) => (
                <span
                  key={i}
                  className={`w-6 h-6 flex items-center justify-center rounded font-bold border ${
                    i === 0
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-1 ring-amber-400/50'
                      : 'bg-slate-800 text-slate-200 border-slate-700'
                  }`}
                  title={i === 0 ? 'Resting Index Finger (Tactile Bump)' : `Finger ${i + 1}`}
                >
                  {k.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

