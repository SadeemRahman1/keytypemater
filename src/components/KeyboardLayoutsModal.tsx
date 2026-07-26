import React, { useState } from 'react';
import {
  X,
  Keyboard,
  Sliders,
  Check,
  Search,
  Sparkles,
  Layers,
  ArrowRightLeft,
  Plus,
  RotateCcw,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { KEYBOARD_LAYOUTS, KeyboardLayoutData } from '../lib/keyboardLayouts';
import { UserSettings } from '../types';

interface KeyboardLayoutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSaveSettings: (settings: UserSettings) => void;
}

export const KeyboardLayoutsModal: React.FC<KeyboardLayoutsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'explore' | 'compare' | 'custom'>('explore');

  // Active layout state in component
  const currentActiveLayoutId = settings.activeLayout || 'qwerty_us';

  // Compare mode state
  const [compareLayout1, setCompareLayout1] = useState<string>('qwerty_us');
  const [compareLayout2, setCompareLayout2] = useState<string>('colemak');

  // Custom Designer State
  const [customName, setCustomName] = useState('My Custom Ergonomic Layout');
  const [customRow2, setCustomRow2] = useState('q,w,f,p,g,j,l,u,y,;');
  const [customRow3, setCustomRow3] = useState('a,r,s,t,d,h,n,e,i,o');
  const [customRow4, setCustomRow4] = useState('z,x,c,v,b,k,m,.,,');
  const [savedCustomLayouts, setSavedCustomLayouts] = useState<KeyboardLayoutData[]>(() => {
    try {
      const stored = localStorage.getItem('keytype_custom_layouts_v1');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  if (!isOpen) return null;

  // Filter layouts
  const allLayouts = [...KEYBOARD_LAYOUTS, ...savedCustomLayouts];
  const filteredLayouts = allLayouts.filter((layout) => {
    const matchesSearch =
      layout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      layout.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      selectedCategory === 'all' || layout.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleApplyLayout = (layoutId: string) => {
    onSaveSettings({
      ...settings,
      activeLayout: layoutId,
    });
  };

  // Calculate live metrics for Custom Layout
  const calculateCustomStats = () => {
    const r2Keys = customRow2.split(',').map((s) => s.trim().toLowerCase());
    const r3Keys = customRow3.split(',').map((s) => s.trim().toLowerCase());
    const r4Keys = customRow4.split(',').map((s) => s.trim().toLowerCase());

    const letterFreq: Record<string, number> = {
      e: 12.7, t: 9.1, a: 8.2, o: 7.5, i: 7.0, n: 6.7, s: 6.3, h: 6.1,
      r: 6.0, d: 4.3, l: 4.0, c: 2.8, u: 2.8, m: 2.4, w: 2.4, f: 2.2,
      g: 2.0, y: 2.0, p: 1.9, b: 1.5, v: 1.0, k: 0.8, j: 0.2, x: 0.2,
      q: 0.1, z: 0.1,
    };

    let homePct = 0;
    let topPct = 0;
    let botPct = 0;

    r3Keys.forEach((k) => { homePct += letterFreq[k] || 1; });
    r2Keys.forEach((k) => { topPct += letterFreq[k] || 1; });
    r4Keys.forEach((k) => { botPct += letterFreq[k] || 1; });

    const total = homePct + topPct + botPct || 1;
    homePct = Math.round((homePct / total) * 100);
    topPct = Math.round((topPct / total) * 100);
    botPct = Math.round((botPct / total) * 100);

    return {
      homeRowPct: homePct,
      topRowPct: topPct,
      bottomRowPct: botPct,
      sameHandPct: 36,
      sameFingerPct: 10,
      score: Math.min(99, Math.max(40, homePct + 20)),
    };
  };

  const handleSaveCustomLayout = () => {
    const stats = calculateCustomStats();
    const newLayout: KeyboardLayoutData = {
      id: `custom_${Date.now()}`,
      name: customName || 'Custom Layout',
      category: 'custom',
      description: 'User created custom keyboard layout preset.',
      homeRowKeys: customRow3.split(',').map((s) => s.trim()),
      keyRows: {
        row2: customRow2.split(',').map((s) => s.trim()),
        row3: customRow3.split(',').map((s) => s.trim()),
        row4: customRow4.split(',').map((s) => s.trim()),
      },
      stats,
    };

    const updated = [newLayout, ...savedCustomLayouts];
    setSavedCustomLayouts(updated);
    try {
      localStorage.setItem('keytype_custom_layouts_v1', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    handleApplyLayout(newLayout.id);
    setActiveTab('explore');
  };

  const layoutObj1 = allLayouts.find((l) => l.id === compareLayout1) || KEYBOARD_LAYOUTS[0];
  const layoutObj2 = allLayouts.find((l) => l.id === compareLayout2) || KEYBOARD_LAYOUTS[5];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-800 bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Keyboard className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
                Keyboard Layouts
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400">
                  {allLayouts.length} Presets
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Explore, compare & analyze typing efficiency across ergonomic and standard keyboard layouts.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation & Explanatory Banner */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-900/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('explore')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'explore'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Explore Layouts</span>
            </button>

            <button
              onClick={() => setActiveTab('compare')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'compare'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Side-by-Side Compare</span>
            </button>

            <button
              onClick={() => setActiveTab('custom')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'custom'
                  ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20'
                  : 'bg-slate-900 text-purple-300 hover:text-white border border-purple-500/30'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Design Custom Layout</span>
            </button>
          </div>

          {activeTab === 'explore' && (
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-2xl px-3 py-1.5">
              <Search className="w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search layout (Colemak, Dvorak, Canary)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-xs text-slate-200 outline-none w-44 sm:w-60 placeholder-slate-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-slate-500 hover:text-slate-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Efficiency Legend Guidelines Box */}
        <div className="px-6 py-3 bg-slate-900/40 border-b border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center gap-x-6 gap-y-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="font-semibold text-slate-300">Efficiency Factors:</span>
          </div>
          <div>
            <span className="text-emerald-400 font-semibold">Home row:</span> More is better
          </div>
          <div>
            <span className="text-amber-400 font-semibold">Top row:</span> Less is better
          </div>
          <div>
            <span className="text-amber-400 font-semibold">Bottom row:</span> Less is better
          </div>
          <div>
            <span className="text-indigo-400 font-semibold">Same hand:</span> Less is better
          </div>
          <div>
            <span className="text-purple-400 font-semibold">Same finger (SFB):</span> Less is better
          </div>
        </div>

        {/* Scrollable Main Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: EXPLORE LAYOUTS */}
          {activeTab === 'explore' && (
            <>
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'all', label: 'All Layouts' },
                  { id: 'standard', label: 'Standard (QWERTY)' },
                  { id: 'dvorak', label: 'Dvorak Family' },
                  { id: 'colemak', label: 'Colemak Family' },
                  { id: 'ergonomic', label: 'Ergonomic / AI Optimized' },
                  { id: 'matrix', label: 'Matrix / Ortholinear' },
                  { id: 'regional', label: 'Regional Layouts' },
                  { id: 'custom', label: 'My Custom' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-slate-800 text-sky-400 border border-sky-500/30'
                        : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Layout Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {filteredLayouts.map((layout) => {
                  const isActive = currentActiveLayoutId === layout.id;

                  return (
                    <div
                      key={layout.id}
                      className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-4 ${
                        isActive
                          ? 'bg-slate-900/90 border-sky-500/60 shadow-lg shadow-sky-500/10'
                          : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      {/* Layout Header */}
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-bold text-slate-100">
                                {layout.name}
                              </h3>
                              {isActive && (
                                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Active
                                </span>
                              )}
                              {layout.isMatrix && (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                                  Matrix
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                              {layout.description}
                            </p>
                          </div>

                          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center shrink-0 min-w-[60px]">
                            <span className="block text-[10px] text-slate-500 uppercase font-mono font-bold">
                              Score
                            </span>
                            <span className="text-lg font-extrabold text-sky-400 font-mono">
                              {layout.stats.score}
                            </span>
                          </div>
                        </div>

                        {/* Metric Bars */}
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 text-[11px] font-mono">
                          <div>
                            <span className="text-slate-500 block text-[10px]">Home row</span>
                            <span className="font-bold text-emerald-400">{layout.stats.homeRowPct}%</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Top row</span>
                            <span className="font-bold text-slate-300">{layout.stats.topRowPct}%</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Bottom row</span>
                            <span className="font-bold text-slate-300">{layout.stats.bottomRowPct}%</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Same hand</span>
                            <span className="font-bold text-indigo-400">{layout.stats.sameHandPct}%</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Same finger</span>
                            <span className="font-bold text-purple-400">{layout.stats.sameFingerPct}%</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Style</span>
                            <span className="font-bold text-amber-400 capitalize">{layout.category}</span>
                          </div>
                        </div>

                        {/* Interactive Visual Mini Keyboard Diagram */}
                        <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800/80 overflow-x-auto select-none">
                          <div className="space-y-1 min-w-[280px]">
                            {/* Row 2 - Top */}
                            <div className="flex gap-1 justify-center">
                              {layout.keyRows.row2.map((k, i) => (
                                <span
                                  key={i}
                                  className="w-6 h-6 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono font-bold text-slate-400 flex items-center justify-center"
                                >
                                  {k.toUpperCase()}
                                </span>
                              ))}
                            </div>
                            {/* Row 3 - Home Row (Highlighted) */}
                            <div className="flex gap-1 justify-center">
                              {layout.keyRows.row3.map((k, i) => {
                                const isHomeKey = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', 'r', 't', 'n', 'e', 'i', 'o', 'h'].includes(k.toLowerCase());
                                return (
                                  <span
                                    key={i}
                                    className={`w-6 h-6 rounded border text-[10px] font-mono font-bold flex items-center justify-center ${
                                      isHomeKey
                                        ? 'bg-sky-500/20 border-sky-500/40 text-sky-300 shadow-sm'
                                        : 'bg-slate-900 border-slate-800 text-slate-300'
                                    }`}
                                  >
                                    {k.toUpperCase()}
                                  </span>
                                );
                              })}
                            </div>
                            {/* Row 4 - Bottom */}
                            <div className="flex gap-1 justify-center">
                              {layout.keyRows.row4.map((k, i) => (
                                <span
                                  key={i}
                                  className="w-6 h-6 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono font-bold text-slate-400 flex items-center justify-center"
                                >
                                  {k.toUpperCase()}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Apply Layout Action Button */}
                      <div className="pt-2">
                        {isActive ? (
                          <div className="w-full py-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 font-bold text-xs flex items-center justify-center gap-2">
                            <Check className="w-4 h-4" />
                            <span>Current Active Layout</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleApplyLayout(layout.id)}
                            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-slate-200 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 border border-slate-700 hover:border-sky-400 shadow-sm"
                          >
                            <span>Use This Layout</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* TAB 2: SIDE BY SIDE COMPARE */}
          {activeTab === 'compare' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Selector 1 */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    Layout #1
                  </label>
                  <select
                    value={compareLayout1}
                    onChange={(e) => setCompareLayout1(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 outline-none font-medium"
                  >
                    {allLayouts.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selector 2 */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    Layout #2
                  </label>
                  <select
                    value={compareLayout2}
                    onChange={(e) => setCompareLayout2(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 outline-none font-medium"
                  >
                    {allLayouts.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[layoutObj1, layoutObj2].map((layout, idx) => (
                  <div
                    key={layout.id + idx}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-slate-100">{layout.name}</h3>
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-400">
                        Score: {layout.stats.score}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400">{layout.description}</p>

                    {/* Stats Progress Bars */}
                    <div className="space-y-3 pt-2">
                      <div>
                        <div className="flex justify-between text-xs font-mono mb-1">
                          <span className="text-slate-400">Home Row Keys</span>
                          <span className="text-emerald-400 font-bold">{layout.stats.homeRowPct}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 rounded-full"
                            style={{ width: `${layout.stats.homeRowPct}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-mono mb-1">
                          <span className="text-slate-400">Top Row Keys</span>
                          <span className="text-amber-400 font-bold">{layout.stats.topRowPct}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${layout.stats.topRowPct}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-mono mb-1">
                          <span className="text-slate-400">Bottom Row Keys</span>
                          <span className="text-slate-400 font-bold">{layout.stats.bottomRowPct}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                          <div
                            className="h-full bg-slate-500 rounded-full"
                            style={{ width: `${layout.stats.bottomRowPct}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-mono mb-1">
                          <span className="text-slate-400">Same Finger Bigrams (SFB)</span>
                          <span className="text-purple-400 font-bold">{layout.stats.sameFingerPct}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                          <div
                            className="h-full bg-purple-400 rounded-full"
                            style={{ width: `${layout.stats.sameFingerPct * 4}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleApplyLayout(layout.id)}
                      className="w-full mt-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all cursor-pointer"
                    >
                      Set Active
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DESIGN CUSTOM LAYOUT */}
          {activeTab === 'custom' && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">Custom Keyboard Designer</h3>
                  <p className="text-xs text-slate-400">
                    Define your own key positions to calculate ergonomic efficiency and save as a preset.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Layout Name
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Row 2 (Top Letter Row - comma separated 10 keys)
                  </label>
                  <input
                    type="text"
                    value={customRow2}
                    onChange={(e) => setCustomRow2(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-purple-300 outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Row 3 (Home Row - comma separated 10 keys)
                  </label>
                  <input
                    type="text"
                    value={customRow3}
                    onChange={(e) => setCustomRow3(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-emerald-400 outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Row 4 (Bottom Letter Row - comma separated 10 keys)
                  </label>
                  <input
                    type="text"
                    value={customRow4}
                    onChange={(e) => setCustomRow4(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-400 outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Realtime Calculated Efficiency */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                <h4 className="text-xs font-bold text-slate-300 mb-3 uppercase tracking-wider font-mono">
                  Calculated Efficiency Preview
                </h4>
                {(() => {
                  const stats = calculateCustomStats();
                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Home Row Usage</span>
                        <span className="text-emerald-400 font-extrabold text-base">{stats.homeRowPct}%</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Top Row Usage</span>
                        <span className="text-amber-400 font-extrabold text-base">{stats.topRowPct}%</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Bottom Row Usage</span>
                        <span className="text-slate-300 font-extrabold text-base">{stats.bottomRowPct}%</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Estimated Score</span>
                        <span className="text-sky-400 font-extrabold text-base">{stats.score}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={handleSaveCustomLayout}
                  className="px-6 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-lg shadow-purple-500/20"
                >
                  Save & Apply Custom Layout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
