import React, { useEffect, useState } from 'react';
import { FingerType, KeyStat } from '../types';
import { THEMES } from '../lib/themes';
import { UserSettings } from '../types';

interface VirtualKeyboardProps {
  nextChar: string | null;
  settings: UserSettings;
  keyStats: Record<string, KeyStat>;
}

interface KeyConfig {
  key: string;
  displayLabel?: string;
  finger: FingerType;
  width?: string;
}

const KEYBOARD_ROWS: KeyConfig[][] = [
  // Row 1
  [
    { key: '`', displayLabel: '`', finger: 'left-pinky' },
    { key: '1', finger: 'left-pinky' },
    { key: '2', finger: 'left-ring' },
    { key: '3', finger: 'left-middle' },
    { key: '4', finger: 'left-index' },
    { key: '5', finger: 'left-index' },
    { key: '6', finger: 'right-index' },
    { key: '7', finger: 'right-index' },
    { key: '8', finger: 'right-middle' },
    { key: '9', finger: 'right-ring' },
    { key: '0', finger: 'right-pinky' },
    { key: '-', finger: 'right-pinky' },
    { key: '=', finger: 'right-pinky' },
    { key: 'Backspace', displayLabel: '⌫', finger: 'right-pinky', width: 'w-12 sm:w-16' },
  ],
  // Row 2
  [
    { key: 'Tab', displayLabel: 'Tab', finger: 'left-pinky', width: 'w-10 sm:w-14' },
    { key: 'q', finger: 'left-pinky' },
    { key: 'w', finger: 'left-ring' },
    { key: 'e', finger: 'left-middle' },
    { key: 'r', finger: 'left-index' },
    { key: 't', finger: 'left-index' },
    { key: 'y', finger: 'right-index' },
    { key: 'u', finger: 'right-index' },
    { key: 'i', finger: 'right-middle' },
    { key: 'o', finger: 'right-ring' },
    { key: 'p', finger: 'right-pinky' },
    { key: '[', finger: 'right-pinky' },
    { key: ']', finger: 'right-pinky' },
    { key: '\\', finger: 'right-pinky' },
  ],
  // Row 3
  [
    { key: 'CapsLock', displayLabel: 'Caps', finger: 'left-pinky', width: 'w-12 sm:w-16' },
    { key: 'a', finger: 'left-pinky' },
    { key: 's', finger: 'left-ring' },
    { key: 'd', finger: 'left-middle' },
    { key: 'f', finger: 'left-index' },
    { key: 'g', finger: 'left-index' },
    { key: 'h', finger: 'right-index' },
    { key: 'j', finger: 'right-index' },
    { key: 'k', finger: 'right-middle' },
    { key: 'l', finger: 'right-ring' },
    { key: ';', finger: 'right-pinky' },
    { key: "'", finger: 'right-pinky' },
    { key: 'Enter', displayLabel: '↵', finger: 'right-pinky', width: 'w-14 sm:w-20' },
  ],
  // Row 4
  [
    { key: 'ShiftLeft', displayLabel: 'Shift', finger: 'left-pinky', width: 'w-14 sm:w-20' },
    { key: 'z', finger: 'left-pinky' },
    { key: 'x', finger: 'left-ring' },
    { key: 'c', finger: 'left-middle' },
    { key: 'v', finger: 'left-index' },
    { key: 'b', finger: 'left-index' },
    { key: 'n', finger: 'right-index' },
    { key: 'm', finger: 'right-index' },
    { key: ',', finger: 'right-middle' },
    { key: '.', finger: 'right-ring' },
    { key: '/', finger: 'right-pinky' },
    { key: 'ShiftRight', displayLabel: 'Shift', finger: 'right-pinky', width: 'w-14 sm:w-20' },
  ],
  // Row 5
  [
    { key: 'ControlLeft', displayLabel: 'Ctrl', finger: 'left-pinky', width: 'w-10 sm:w-12' },
    { key: 'AltLeft', displayLabel: 'Alt', finger: 'left-pinky', width: 'w-10 sm:w-12' },
    { key: ' ', displayLabel: 'Spacebar', finger: 'thumb', width: 'w-48 sm:w-72' },
    { key: 'AltRight', displayLabel: 'Alt', finger: 'right-pinky', width: 'w-10 sm:w-12' },
    { key: 'ControlRight', displayLabel: 'Ctrl', finger: 'right-pinky', width: 'w-10 sm:w-12' },
  ],
];

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

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ nextChar, settings, keyStats }) => {
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

  return (
    <div className={`hidden md:flex flex-col items-center gap-3 p-4 rounded-2xl border ${theme.border} ${theme.panelBg} transition-colors duration-200 select-none shadow-xl`}>
      {/* Keyboard Grid */}
      <div className="flex flex-col gap-1.5 sm:gap-2 w-full items-center overflow-x-auto py-1">
        {KEYBOARD_ROWS.map((row, rIdx) => (
          <div key={rIdx} className="flex gap-1 sm:gap-1.5 items-center justify-center">
            {row.map((item) => {
              const keyLower = item.key.toLowerCase();
              const isPressed = activeKeys.has(keyLower);
              const isNextTarget = targetBaseKey === keyLower;
              const isShiftHighlight = isShiftNeeded && (keyLower === 'shiftleft' || keyLower === 'shiftright');
              const isHomeKey = keyLower === 'f' || keyLower === 'j';

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
                  key={item.key}
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

                  {/* Tactile Home Row Marker for F and J */}
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
    </div>
  );
};

