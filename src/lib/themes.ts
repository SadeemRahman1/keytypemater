import { ThemeId } from '../types';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  bg: string;
  panelBg: string;
  cardBg: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentBg: string;
  correctText: string;
  errorText: string;
  errorBg: string;
  keyBg: string;
  keyActiveBg: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  slate: {
    id: 'slate',
    name: 'Slate Dark',
    bg: 'bg-slate-950',
    panelBg: 'bg-slate-900/80 backdrop-blur',
    cardBg: 'bg-slate-900/50',
    border: 'border-slate-800',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400',
    textMuted: 'text-slate-600',
    accent: 'text-sky-400',
    accentBg: 'bg-sky-500',
    correctText: 'text-sky-300',
    errorText: 'text-rose-400',
    errorBg: 'bg-rose-950/60',
    keyBg: 'bg-slate-800/80 text-slate-300 border-slate-700/60',
    keyActiveBg: 'bg-sky-500 text-slate-950 border-sky-400 shadow-md shadow-sky-500/30',
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Tokyo Night',
    bg: 'bg-[#1a1b26]',
    panelBg: 'bg-[#24283b]/90 backdrop-blur',
    cardBg: 'bg-[#1f2335]',
    border: 'border-[#414868]',
    textPrimary: 'text-[#c0caf5]',
    textSecondary: 'text-[#a9b1d6]',
    textMuted: 'text-[#565f89]',
    accent: 'text-[#7aa2f7]',
    accentBg: 'bg-[#7aa2f7]',
    correctText: 'text-[#9ece6a]',
    errorText: 'text-[#f7768e]',
    errorBg: 'bg-[#f7768e]/20',
    keyBg: 'bg-[#24283b] text-[#c0caf5] border-[#414868]',
    keyActiveBg: 'bg-[#7aa2f7] text-[#1a1b26] border-[#7aa2f7] shadow-lg shadow-[#7aa2f7]/30',
  },
  paper: {
    id: 'paper',
    name: 'Retro Paper',
    bg: 'bg-[#f6f2e9]',
    panelBg: 'bg-[#ede6d8]',
    cardBg: 'bg-[#f0e9dc]',
    border: 'border-[#d8ceba]',
    textPrimary: 'text-[#2c2825]',
    textSecondary: 'text-[#6e675f]',
    textMuted: 'text-[#a39a8e]',
    accent: 'text-[#b45309]',
    accentBg: 'bg-[#b45309]',
    correctText: 'text-[#15803d]',
    errorText: 'text-[#b91c1c]',
    errorBg: 'bg-[#fca5a5]/30',
    keyBg: 'bg-[#e4dcce] text-[#2c2825] border-[#cbbfae]',
    keyActiveBg: 'bg-[#b45309] text-white border-[#92400e]',
  },
  nordic: {
    id: 'nordic',
    name: 'Nordic Light',
    bg: 'bg-slate-50',
    panelBg: 'bg-white border-slate-200 shadow-sm',
    cardBg: 'bg-slate-100/70',
    border: 'border-slate-200',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    textMuted: 'text-slate-400',
    accent: 'text-blue-600',
    accentBg: 'bg-blue-600',
    correctText: 'text-emerald-600',
    errorText: 'text-red-600',
    errorBg: 'bg-red-100',
    keyBg: 'bg-slate-200/80 text-slate-700 border-slate-300',
    keyActiveBg: 'bg-blue-600 text-white border-blue-700 shadow-md shadow-blue-500/20',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Synth',
    bg: 'bg-zinc-950',
    panelBg: 'bg-emerald-950/40 backdrop-blur',
    cardBg: 'bg-emerald-950/20',
    border: 'border-emerald-900/60',
    textPrimary: 'text-emerald-100',
    textSecondary: 'text-emerald-400/80',
    textMuted: 'text-emerald-700',
    accent: 'text-emerald-400',
    accentBg: 'bg-emerald-500',
    correctText: 'text-emerald-300',
    errorText: 'text-red-400',
    errorBg: 'bg-red-950/80',
    keyBg: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/80',
    keyActiveBg: 'bg-emerald-400 text-zinc-950 border-emerald-300 shadow-lg shadow-emerald-500/30',
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Glow',
    bg: 'bg-stone-950',
    panelBg: 'bg-stone-900/80 backdrop-blur',
    cardBg: 'bg-stone-900/50',
    border: 'border-stone-800',
    textPrimary: 'text-amber-100',
    textSecondary: 'text-stone-400',
    textMuted: 'text-stone-600',
    accent: 'text-orange-400',
    accentBg: 'bg-orange-500',
    correctText: 'text-amber-300',
    errorText: 'text-rose-400',
    errorBg: 'bg-rose-950/70',
    keyBg: 'bg-stone-800 text-amber-200 border-stone-700',
    keyActiveBg: 'bg-orange-500 text-stone-950 border-orange-400 shadow-md shadow-orange-500/30',
  },
};
