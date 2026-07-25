import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { BarChart2, Zap, Target, Clock, Trophy, History, Key, X, Trash2 } from 'lucide-react';
import { TestResult, KeyStat, UserSettings } from '../types';
import { THEMES } from '../lib/themes';
import { KEYBR_LETTER_ORDER } from '../lib/wordGenerator';

interface HistoryDashboardProps {
  results: TestResult[];
  keyStats: Record<string, KeyStat>;
  settings: UserSettings;
  onClearHistory: () => void;
  onClose: () => void;
}

export const HistoryDashboard: React.FC<HistoryDashboardProps> = ({
  results,
  keyStats,
  settings,
  onClearHistory,
  onClose,
}) => {
  const theme = THEMES[settings.theme];
  const [activeTab, setActiveTab] = useState<'history' | 'key-mechanics'>('history');

  // Summary Metrics
  const totalTests = results.length;
  const topWpm = totalTests > 0 ? Math.max(...results.map((r) => r.wpm)) : 0;
  const avgWpm = totalTests > 0 ? Math.round(results.reduce((acc, r) => acc + r.wpm, 0) / totalTests) : 0;
  const avgAcc = totalTests > 0 ? Math.round(results.reduce((acc, r) => acc + r.accuracy, 0) / totalTests) : 0;
  const totalSeconds = results.reduce((acc, r) => acc + r.timeSeconds, 0);

  // Prepare WPM progression data for overall chart
  const historyChartData = results
    .slice()
    .reverse()
    .map((r, idx) => ({
      testNumber: idx + 1,
      wpm: r.wpm,
      accuracy: r.accuracy,
      mode: r.modeDetail,
    }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn select-none">
      <div className={`relative w-full max-w-4xl rounded-2xl border ${theme.border} ${theme.panelBg} p-6 sm:p-8 flex flex-col gap-6 shadow-2xl max-h-[90vh]`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-100">Performance Analytics & Key Mechanics</h3>
              <p className="text-xs text-slate-400">Comprehensive speed history and individual letter mastery</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs text-slate-400 block">Total Tests</span>
            <span className="text-xl font-bold font-mono text-slate-100">{totalTests}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs text-slate-400 block">Top WPM</span>
            <span className="text-xl font-bold font-mono text-amber-400">{topWpm}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs text-slate-400 block">Average WPM</span>
            <span className="text-xl font-bold font-mono text-sky-400">{avgWpm}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs text-slate-400 block">Avg Accuracy</span>
            <span className="text-xl font-bold font-mono text-emerald-400">{avgAcc}%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-xs text-slate-400 block">Practice Time</span>
            <span className="text-xl font-bold font-mono text-purple-300">{Math.round(totalSeconds / 60)}m</span>
          </div>
        </div>

        {/* Tab Toggle Bar */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-sky-500 text-slate-950 shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Test History ({results.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('key-mechanics')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'key-mechanics'
                  ? 'bg-sky-500 text-slate-950 shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>Key Mechanics Heatmap</span>
            </button>
          </div>

          {results.length > 0 && activeTab === 'history' && (
            <button
              onClick={onClearHistory}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-medium transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pr-1">
          {activeTab === 'history' && (
            <div className="flex flex-col gap-6">
              {/* Overall WPM Chart */}
              {historyChartData.length > 1 && (
                <div className="w-full h-48 p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                  <span className="text-xs font-semibold text-slate-300 block mb-2">Overall WPM Growth Trend</span>
                  <ResponsiveContainer width="100%" height="85%">
                    <LineChart data={historyChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                      <XAxis dataKey="testNumber" stroke="#64748b" tick={{ fontSize: 10 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '8px',
                          color: '#f8fafc',
                          fontSize: '11px',
                        }}
                      />
                      <Line type="monotone" dataKey="wpm" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* History Table */}
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Mode</th>
                      <th className="p-3">WPM</th>
                      <th className="p-3">Accuracy</th>
                      <th className="p-3">Time</th>
                      <th className="p-3">Errors</th>
                      <th className="p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {results.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500">
                          No typing sessions recorded yet. Complete a test to see your history!
                        </td>
                      </tr>
                    ) : (
                      results.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="p-3 font-semibold text-slate-200">{r.modeDetail}</td>
                          <td className="p-3 font-mono font-bold text-sky-400">{r.wpm} WPM</td>
                          <td className="p-3 font-mono text-emerald-400">{r.accuracy}%</td>
                          <td className="p-3 text-slate-400">{r.timeSeconds}s</td>
                          <td className="p-3 text-rose-400">{r.errors}</td>
                          <td className="p-3 text-slate-500 text-[11px]">
                            {new Date(r.timestamp).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'key-mechanics' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {KEYBR_LETTER_ORDER.map((key) => {
                const kStat = keyStats[key];
                const totalTyped = kStat ? kStat.totalTyped : 0;
                const errors = kStat ? kStat.errors : 0;
                const confidence = kStat ? kStat.confidence : 0;
                const avgLatency = totalTyped > 0 ? Math.round(kStat.totalLatencyMs / totalTyped) : 0;
                const accuracy = totalTyped > 0 ? Math.round(((totalTyped - errors) / totalTyped) * 100) : 100;

                return (
                  <div
                    key={key}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between gap-2 transition-all ${
                      confidence >= 80
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                        : confidence >= 50
                        ? 'bg-sky-950/20 border-sky-500/40 text-sky-300'
                        : totalTyped > 0
                        ? 'bg-rose-950/20 border-rose-500/40 text-rose-300'
                        : 'bg-slate-900/40 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-extrabold text-lg uppercase">{key}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950/50">
                        {confidence}% Mastery
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-400 pt-1 border-t border-slate-800/40">
                      <div>Latency: <span className="text-slate-200 font-mono">{avgLatency}ms</span></div>
                      <div>Accuracy: <span className="text-slate-200 font-mono">{accuracy}%</span></div>
                      <div>Typed: <span className="text-slate-200 font-mono">{totalTyped}</span></div>
                      <div>Errors: <span className="text-rose-400 font-mono">{errors}</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
