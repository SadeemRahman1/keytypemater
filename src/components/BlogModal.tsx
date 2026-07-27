import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  X,
  Clock,
  User,
  Tag,
  ArrowLeft,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Lightbulb,
  Play,
  Calculator,
  Share2,
  Globe,
  FileText,
  List,
  Layers
} from 'lucide-react';
import {
  ALL_BLOG_ARTICLES,
  BLOG_CATEGORIES,
  BlogArticle,
  getArticleBySlug,
  getRelatedArticles
} from '../data/blog';
import { UserSettings, TestMode } from '../types';
import { THEMES } from '../lib/themes';

interface BlogModalProps {
  isOpen: boolean;
  settings: UserSettings;
  onClose: () => void;
  onSelectPracticeMode?: (mode: TestMode) => void;
}

export const BlogModal: React.FC<BlogModalProps> = ({
  isOpen,
  settings,
  onClose,
  onSelectPracticeMode,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticleSlug, setActiveArticleSlug] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  // WPM Calculator interactive state (for WPM calculator article)
  const [calcCharCount, setCalcCharCount] = useState<number>(350);
  const [calcMinutes, setCalcMinutes] = useState<number>(1);
  const [calcErrors, setCalcErrors] = useState<number>(2);

  const theme = THEMES[settings.theme];

  // Filter articles based on query & selected category
  const filteredArticles = useMemo(() => {
    return ALL_BLOG_ARTICLES.filter((article) => {
      const matchesCategory =
        selectedCategory === 'all' || article.categoryId === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.tags.some((t) => t.toLowerCase().includes(q)) ||
        article.categoryName.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const activeArticle = useMemo(() => {
    if (!activeArticleSlug) return null;
    return getArticleBySlug(activeArticleSlug) || null;
  }, [activeArticleSlug]);

  const relatedArticles = useMemo(() => {
    if (!activeArticleSlug) return [];
    return getRelatedArticles(activeArticleSlug, 3);
  }, [activeArticleSlug]);

  if (!isOpen) return null;

  // Live WPM calculation formulas
  const grossWpm = Math.max(0, Math.round((calcCharCount / 5) / (calcMinutes || 1)));
  const netWpm = Math.max(0, Math.round(grossWpm - (calcErrors / (calcMinutes || 1))));
  const accuracy = Math.max(
    0,
    Math.min(100, Math.round(((calcCharCount - calcErrors) / (calcCharCount || 1)) * 100))
  );

  const handleShare = (article: BlogArticle) => {
    const fakeUrl = `https://keytypemaster.com/blog/${article.categoryId}/${article.slug}`;
    navigator.clipboard.writeText(fakeUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full max-w-6xl h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl border ${theme.border} ${theme.panelBg} shadow-2xl overflow-hidden`}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-800/80 bg-slate-900/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-slate-100 flex items-center gap-2">
                KeyType Master <span className="text-sky-400 font-mono text-xs font-semibold">ACADEMY & BLOG</span>
              </h2>
              <p className="text-xs text-slate-400 hidden sm:block">
                100+ In-Depth 3,000+ Word Guides for Touch Typing, Government Exams & Keyboard Mastery
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Close blog modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          {activeArticle ? (
            /* ------------------ FULL ARTICLE READER VIEW ------------------ */
            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn">
              {/* Back to List & Practice Header Navigation */}
              <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-800/60">
                <button
                  onClick={() => setActiveArticleSlug(null)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-sky-400 text-xs font-bold transition-all cursor-pointer border border-slate-700/60"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to All Articles</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShare(activeArticle)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>{copiedUrl ? 'Copied URL!' : 'Share Article'}</span>
                  </button>

                  {activeArticle.practiceMode && onSelectPracticeMode && (
                    <button
                      onClick={() => {
                        onSelectPracticeMode(activeArticle.practiceMode as TestMode);
                        onClose();
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-slate-950 text-xs font-extrabold shadow-lg shadow-sky-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-slate-950" />
                      <span>Practice Mode</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Sub-domain URL Breadcrumbs */}
              <div className="p-2.5 px-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center gap-2 text-xs font-mono text-slate-400 overflow-x-auto">
                <Globe className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="text-slate-500">keytypemaster.com</span>
                <span className="text-slate-600">/</span>
                <span className="text-sky-400 font-bold">blog</span>
                <span className="text-slate-600">/</span>
                <span className="text-amber-400 font-semibold">{activeArticle.categoryId}</span>
                <span className="text-slate-600">/</span>
                <span className="text-slate-200 truncate">{activeArticle.slug}</span>
              </div>

              {/* Cover Banner */}
              <div className="relative w-full h-64 sm:h-88 rounded-2xl overflow-hidden border border-slate-800 group shadow-xl">
                <img
                  src={activeArticle.coverImage}
                  alt={activeArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/20" />

                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 space-y-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-sky-500/30 text-sky-300 border border-sky-500/40 text-xs font-mono font-bold uppercase">
                      {activeArticle.categoryName}
                    </span>

                    {/* Word Count Badge */}
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      {activeArticle.wordCount.toLocaleString()} Words (Complete Guide)
                    </span>

                    <span className="flex items-center gap-1 text-xs text-slate-300 font-mono bg-slate-950/80 px-2.5 py-1 rounded-full border border-slate-800">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {activeArticle.readTime}
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-3xl font-black text-slate-100 tracking-tight leading-tight">
                    {activeArticle.title}
                  </h1>

                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono pt-1">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-sky-400" />
                      {activeArticle.author}
                    </span>
                    <span>•</span>
                    <span>{activeArticle.date}</span>
                  </div>
                </div>
              </div>

              {/* Excerpt Lead Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-sky-950/20 border border-sky-500/30 text-sky-200 text-sm sm:text-base leading-relaxed font-medium italic">
                "{activeArticle.excerpt}"
              </div>

              {/* Table of Contents Box */}
              {activeArticle.sections.length > 1 && (
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                    <List className="w-4 h-4" />
                    <span>Table of Contents ({activeArticle.sections.length} Major Sections)</span>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                    {activeArticle.sections.map((sec, idx) => (
                      <li key={idx} className="flex items-center gap-2 hover:text-sky-300 transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                        <span className="truncate">{sec.subheading || `Section ${idx + 1}`}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Article Content Sections */}
              <div className="space-y-8 text-slate-200 leading-relaxed text-sm sm:text-base">
                {activeArticle.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-4 pt-2 border-t border-slate-800/40 first:border-none first:pt-0">
                    {sec.subheading && (
                      <h3 className="text-lg sm:text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shrink-0" />
                        {sec.subheading}
                      </h3>
                    )}

                    <p className="text-slate-300 leading-relaxed">{sec.paragraph}</p>

                    {/* Section Image Illustration */}
                    {sec.image && (
                      <div className="my-4 space-y-2">
                        <div className="rounded-xl overflow-hidden border border-slate-800 max-h-88 shadow-md">
                          <img
                            src={sec.image}
                            alt={sec.subheading || 'Article illustration'}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {sec.imageCaption && (
                          <p className="text-xs text-slate-400 text-center font-mono italic">
                            📷 {sec.imageCaption}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Bullet points if present */}
                    {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                      <ul className="space-y-2.5 pl-1 sm:pl-2 my-4">
                        {sec.bulletPoints.map((bp, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-200">
                            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{bp}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Pro Tip Box if present */}
                    {sec.tipBox && (
                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm flex items-start gap-3 my-4">
                        <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-amber-300 font-bold mb-0.5">Pro Strategy Note</strong>
                          <span>{sec.tipBox}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Special Interactive WPM Calculator inside WPM Article */}
              {(activeArticle.id === 'wpm-calculator' || activeArticle.id === 'wpm-calculator-explained' || activeArticle.id === 'typing-accuracy-calculator') && (
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-sky-500/40 space-y-4 shadow-xl my-8">
                  <div className="flex items-center gap-2 text-sky-400 font-extrabold text-lg">
                    <Calculator className="w-5 h-5" />
                    <span>Interactive Real-Time WPM & Accuracy Calculator</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Test the official Gross WPM, Net WPM, and Accuracy formulas live. Adjust the sliders below to calculate your metrics.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-300 flex justify-between">
                        <span>Characters Typed:</span>
                        <span className="text-sky-400 font-bold">{calcCharCount}</span>
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="800"
                        step="10"
                        value={calcCharCount}
                        onChange={(e) => setCalcCharCount(Number(e.target.value))}
                        className="w-full accent-sky-400 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-300 flex justify-between">
                        <span>Test Duration (Minutes):</span>
                        <span className="text-sky-400 font-bold">{calcMinutes}m</span>
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={calcMinutes}
                        onChange={(e) => setCalcMinutes(Number(e.target.value))}
                        className="w-full accent-sky-400 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-300 flex justify-between">
                        <span>Uncorrected Errors:</span>
                        <span className="text-rose-400 font-bold">{calcErrors}</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        step="1"
                        value={calcErrors}
                        onChange={(e) => setCalcErrors(Number(e.target.value))}
                        className="w-full accent-rose-400 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Calculated Output Stats */}
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-center">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-mono uppercase block">Gross WPM</span>
                      <span className="text-xl sm:text-2xl font-black text-slate-200">{grossWpm}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-500/40">
                      <span className="text-[10px] text-sky-300 font-mono uppercase block font-bold">Net WPM</span>
                      <span className="text-2xl sm:text-3xl font-black text-sky-400">{netWpm}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40">
                      <span className="text-[10px] text-emerald-300 font-mono uppercase block font-bold">Accuracy</span>
                      <span className="text-2xl sm:text-3xl font-black text-emerald-400">{accuracy}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tags list */}
              <div className="flex items-center gap-2 flex-wrap pt-4 border-t border-slate-800">
                <Tag className="w-4 h-4 text-slate-400" />
                {activeArticle.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 text-xs font-mono border border-slate-700/50"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Related Articles Carousel / List */}
              {relatedArticles.length > 0 && (
                <div className="pt-8 border-t border-slate-800 space-y-4">
                  <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Related Guides in {activeArticle.categoryName}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {relatedArticles.map((rel) => (
                      <div
                        key={rel.id}
                        onClick={() => setActiveArticleSlug(rel.slug)}
                        className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/40 transition-all cursor-pointer flex flex-col justify-between gap-3 group"
                      >
                        <div className="space-y-2">
                          <img
                            src={rel.coverImage}
                            alt={rel.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-24 rounded-lg object-cover"
                          />
                          <span className="text-[10px] font-mono text-sky-400 font-bold uppercase block">
                            {rel.categoryName}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-sky-300 transition-colors line-clamp-2">
                            {rel.title}
                          </h4>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-800/60">
                          <span>{rel.readTime}</span>
                          <span className="text-sky-400 font-bold flex items-center gap-0.5">Read <ChevronRight className="w-3 h-3" /></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ------------------ MASTER ARTICLES HUB LIST & GRID VIEW ------------------ */
            <div className="space-y-6">
              {/* Header Hero Banner */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-sky-950/50 via-indigo-950/50 to-slate-900 border border-sky-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2.5 max-w-2xl">
                  <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-mono font-bold uppercase inline-flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    100+ Complete Touch Typing Articles & Govt Test Prep
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
                    Master Touch Typing, Keyboard Ergonomics & Govt Examinations
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Explore our comprehensive repository of 3,000+ word guides covering 10-finger typing techniques, NTS/PPSC/FPSC/CSS exam preparation, keyboard shortcuts, and WPM calculators.
                  </p>
                </div>

                <div className="w-full md:w-auto shrink-0 flex items-center justify-center">
                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1 shadow-lg">
                    <span className="text-3xl sm:text-4xl font-black text-sky-400">{ALL_BLOG_ARTICLES.length}</span>
                    <span className="text-xs text-slate-400 font-mono block">Published Guides</span>
                  </div>
                </div>
              </div>

              {/* Search & Category Filter Bar */}
              <div className="space-y-4">
                <div className="relative w-full">
                  <Search className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 100+ articles (e.g. NTS, PPSC, 100 WPM, Home Row, VS Code shortcuts, WPM calculator)..."
                    className="w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-sky-500 transition-all shadow-inner"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* 10 Category Tabs Bar */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                  {BLOG_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedCategory === cat.id
                          ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Articles Grid */}
              {filteredArticles.length === 0 ? (
                <div className="py-16 text-center space-y-3 bg-slate-900/40 rounded-2xl border border-slate-800/80">
                  <BookOpen className="w-10 h-10 text-slate-500 mx-auto" />
                  <p className="text-base text-slate-200 font-semibold">No articles match your search query</p>
                  <p className="text-xs text-slate-400">Try searching for broader keywords like "typing", "shortcuts", "NTS", or "speed".</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="mt-2 inline-block px-4 py-2 rounded-xl bg-sky-500/20 text-sky-400 text-xs font-bold hover:bg-sky-500/30 border border-sky-500/40 transition-colors cursor-pointer"
                  >
                    Reset Search & Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {filteredArticles.map((article) => (
                    <div
                      key={article.id}
                      onClick={() => setActiveArticleSlug(article.slug)}
                      className="group flex flex-col justify-between rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-sky-500/40 transition-all cursor-pointer overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1"
                    >
                      <div>
                        {/* Article Image Header */}
                        <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                          <img
                            src={article.coverImage}
                            alt={article.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                          <div className="absolute top-3 left-3 flex items-center gap-1.5">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-sky-300 border border-sky-500/30 text-[10px] font-mono font-bold uppercase">
                              {article.categoryName}
                            </span>
                          </div>

                          <div className="absolute bottom-2.5 right-3 flex items-center gap-1 text-[10px] text-slate-300 font-mono bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800">
                            <Clock className="w-3 h-3 text-amber-400" />
                            {article.readTime}
                          </div>
                        </div>

                        {/* Article Text Content */}
                        <div className="p-4 space-y-2">
                          <h3 className="font-extrabold text-sm sm:text-base text-slate-100 group-hover:text-sky-300 transition-colors line-clamp-2 leading-snug">
                            {article.title}
                          </h3>
                          <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                            {article.excerpt}
                          </p>
                        </div>
                      </div>

                      {/* Footer CTA */}
                      <div className="p-4 pt-0 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/40 mt-3">
                        <span className="font-mono text-[11px] text-emerald-400 font-semibold">{article.wordCount.toLocaleString()} words</span>
                        <span className="flex items-center gap-1 text-sky-400 font-bold group-hover:translate-x-1 transition-transform">
                          Read Guide <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
