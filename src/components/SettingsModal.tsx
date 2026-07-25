import React from 'react';
import { Settings, Volume2, VolumeX, Eye, Keyboard, Palette, Type, X, Play } from 'lucide-react';
import { UserSettings, AudioTheme, ThemeId, CaretStyle, FontFamily } from '../types';
import { THEMES } from '../lib/themes';
import { soundEngine } from '../lib/soundEngine';

interface SettingsModalProps {
  settings: UserSettings;
  onSave: (newSettings: UserSettings) => void;
  onClose: () => void;
}

const AUDIO_THEMES: Array<{ id: AudioTheme; name: string; desc: string }> = [
  { id: 'mechanical', name: 'Classic Mechanical', desc: 'Balanced Cherry MX switch tactile click' },
  { id: 'thock', name: 'Creamy Thock', desc: 'Satisfying deep creamy mechanical pop' },
  { id: 'clack', name: 'Sharp Clack', desc: 'High-frequency snap click' },
  { id: 'typewriter', name: 'Vintage Typewriter', desc: 'Metallic mechanical ping' },
  { id: 'bubble', name: 'Soft Bubble', desc: 'Soothing pop sound' },
  { id: 'silent', name: 'Silent', desc: 'Mute all keypress sounds' },
];

const CARET_STYLES: Array<{ id: CaretStyle; name: string }> = [
  { id: 'line', name: 'Vertical Line' },
  { id: 'block', name: 'Solid Block' },
  { id: 'underline', name: 'Underline' },
  { id: 'pulse', name: 'Pulsing Pulse' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSave, onClose }) => {
  const currentTheme = THEMES[settings.theme];

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    const updated = { ...settings, [key]: value };
    onSave(updated);
  };

  const previewSound = (theme: AudioTheme) => {
    soundEngine.playKeySound(theme, settings.soundVolume, false, false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn select-none">
      <div className={`relative w-full max-w-xl rounded-2xl border ${currentTheme.border} ${currentTheme.panelBg} p-6 sm:p-8 flex flex-col gap-6 shadow-2xl`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-100">Preferences & Settings</h3>
              <p className="text-xs text-slate-400">Customize visual theme, audio feedback, and layout</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex flex-col gap-6 max-h-[65vh] overflow-y-auto pr-1 text-slate-200">
          {/* Visual Theme Selection */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
              <Palette className="w-4 h-4 text-sky-400" />
              <span>Color Themes</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {Object.values(THEMES).map((t) => {
                const isSelected = settings.theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => updateSetting('theme', t.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500/15 border-sky-400 text-slate-100 ring-1 ring-sky-400'
                        : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{t.name}</span>
                    <span className={`w-3 h-3 rounded-full ${t.accentBg}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sound Theme Selection */}
          <div className="flex flex-col gap-3 border-t border-slate-800/80 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span>Audio Feedback</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Volume:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.soundVolume}
                  onChange={(e) => updateSetting('soundVolume', parseFloat(e.target.value))}
                  className="w-24 accent-sky-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {AUDIO_THEMES.map((at) => {
                const isSelected = settings.soundTheme === at.id;
                return (
                  <div
                    key={at.id}
                    onClick={() => {
                      updateSetting('soundTheme', at.id);
                      previewSound(at.id);
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-400 text-slate-100 ring-1 ring-emerald-400'
                        : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs text-slate-200">{at.name}</div>
                      <div className="text-[10px] text-slate-400">{at.desc}</div>
                    </div>
                    {at.id !== 'silent' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          previewSound(at.id);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Test Sound"
                      >
                        <Play className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Caret & Font Customization */}
          <div className="flex flex-col gap-3 border-t border-slate-800/80 pt-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
              <Type className="w-4 h-4 text-amber-400" />
              <span>Typography & Caret</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400">Caret Style:</label>
                <select
                  value={settings.caretStyle}
                  onChange={(e: any) => updateSetting('caretStyle', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                >
                  {CARET_STYLES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400">Font Family:</label>
                <select
                  value={settings.fontFamily}
                  onChange={(e: any) => updateSetting('fontFamily', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                >
                  <option value="mono">Clean Monospace</option>
                  <option value="sans">Modern Sans-Serif</option>
                  <option value="code">Code Pro Monospace</option>
                </select>
              </div>
            </div>
          </div>

          {/* Display & Layout Toggles */}
          <div className="flex flex-col gap-3 border-t border-slate-800/80 pt-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
              <Keyboard className="w-4 h-4 text-purple-400" />
              <span>Layout & Behavior Toggles</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800 cursor-pointer">
                <span>Show On-Screen Keyboard</span>
                <input
                  type="checkbox"
                  checked={settings.showKeyboard}
                  onChange={(e) => updateSetting('showKeyboard', e.target.checked)}
                  className="accent-sky-400 w-4 h-4 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800 cursor-pointer">
                <span>Show Finger Color Guide</span>
                <input
                  type="checkbox"
                  checked={settings.showFingerColors}
                  onChange={(e) => updateSetting('showFingerColors', e.target.checked)}
                  className="accent-sky-400 w-4 h-4 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800 cursor-pointer">
                <span>Show Key Heatmap Overlay</span>
                <input
                  type="checkbox"
                  checked={settings.showHeatmap}
                  onChange={(e) => updateSetting('showHeatmap', e.target.checked)}
                  className="accent-sky-400 w-4 h-4 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800 cursor-pointer">
                <span>Blind Mode (Hide Speed)</span>
                <input
                  type="checkbox"
                  checked={settings.blindMode}
                  onChange={(e) => updateSetting('blindMode', e.target.checked)}
                  className="accent-sky-400 w-4 h-4 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end border-t border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all shadow cursor-pointer"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
