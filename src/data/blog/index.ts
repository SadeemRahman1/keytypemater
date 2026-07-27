import { BlogArticle } from './types';
import { ensureFullArticleContent } from './contentGenerator';
import { TYPING_SPEED_ARTICLES } from './typingSpeed';
import { TOUCH_TYPING_ARTICLES } from './touchTyping';
import { TYPING_TESTS_ARTICLES } from './typingTests';
import { WPM_ACCURACY_ARTICLES } from './wpmAccuracy';
import { KEYBOARD_GUIDES_ARTICLES } from './keyboardGuides';
import { KEYBOARD_SHORTCUTS_ARTICLES } from './keyboardShortcuts';
import { GOVT_TESTS_ARTICLES } from './govtTests';
import { PRODUCTIVITY_ARTICLES } from './productivity';
import { CAREER_ARTICLES } from './career';
import { SEO_LANDING_ARTICLES } from './seoLanding';

export * from './types';
export * from './contentGenerator';

const RAW_BLOG_ARTICLES: BlogArticle[] = [
  ...TYPING_SPEED_ARTICLES,
  ...TOUCH_TYPING_ARTICLES,
  ...TYPING_TESTS_ARTICLES,
  ...WPM_ACCURACY_ARTICLES,
  ...KEYBOARD_GUIDES_ARTICLES,
  ...KEYBOARD_SHORTCUTS_ARTICLES,
  ...GOVT_TESTS_ARTICLES,
  ...PRODUCTIVITY_ARTICLES,
  ...CAREER_ARTICLES,
  ...SEO_LANDING_ARTICLES,
];

// Map every single article through ensureFullArticleContent so all 100 articles contain 3000+ words
export const ALL_BLOG_ARTICLES: BlogArticle[] = RAW_BLOG_ARTICLES.map(a => ensureFullArticleContent(a));

export function getArticlesByCategory(categoryId: string): BlogArticle[] {
  if (!categoryId || categoryId === 'all') return ALL_BLOG_ARTICLES;
  return ALL_BLOG_ARTICLES.filter(a => a.categoryId === categoryId);
}

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return ALL_BLOG_ARTICLES.find(a => a.slug === slug || a.id === slug);
}

export function searchBlogArticles(query: string, categoryId?: string): BlogArticle[] {
  let list = ALL_BLOG_ARTICLES;
  if (categoryId && categoryId !== 'all') {
    list = list.filter(a => a.categoryId === categoryId);
  }
  if (!query || !query.trim()) return list;

  const q = query.toLowerCase().trim();
  return list.filter(a =>
    a.title.toLowerCase().includes(q) ||
    a.excerpt.toLowerCase().includes(q) ||
    a.tags.some(t => t.toLowerCase().includes(q)) ||
    a.categoryName.toLowerCase().includes(q)
  );
}

export function getRelatedArticles(currentSlug: string, limit: number = 3): BlogArticle[] {
  const current = getArticleBySlug(currentSlug);
  if (!current) return ALL_BLOG_ARTICLES.slice(0, limit);

  return ALL_BLOG_ARTICLES
    .filter(a => a.slug !== currentSlug)
    .filter(a => a.categoryId === current.categoryId || a.tags.some(t => current.tags.includes(t)))
    .slice(0, limit);
}

