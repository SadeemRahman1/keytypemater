export interface ArticleSection {
  subheading?: string;
  paragraph: string;
  image?: string;
  imageCaption?: string;
  bulletPoints?: string[];
  tipBox?: string;
  codeSnippet?: string;
  tableData?: { headers: string[]; rows: string[][] };
}

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  categoryId: 'typing-speed' | 'touch-typing' | 'typing-tests' | 'wpm-accuracy' | 'keyboard-guides' | 'keyboard-shortcuts' | 'govt-tests' | 'productivity' | 'career' | 'seo-landing';
  categoryName: string;
  author: string;
  date: string;
  readTime: string;
  wordCount: number;
  excerpt: string;
  coverImage: string;
  tags: string[];
  sections: ArticleSection[];
  practiceMode?: string;
  metaDescription?: string;
}

export interface BlogCategory {
  id: 'typing-speed' | 'touch-typing' | 'typing-tests' | 'wpm-accuracy' | 'keyboard-guides' | 'keyboard-shortcuts' | 'govt-tests' | 'productivity' | 'career' | 'seo-landing';
  name: string;
  icon: string;
  description: string;
  color: string;
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  { id: 'typing-speed', name: 'Typing Speed', icon: 'Zap', description: 'Strategies, routines, and techniques to boost your WPM to 100+', color: 'sky' },
  { id: 'touch-typing', name: 'Touch Typing', icon: 'Keyboard', description: 'Master home row anchors, finger matrices, and blind typing', color: 'indigo' },
  { id: 'typing-tests', name: 'Typing Tests', icon: 'Clock', description: 'Timed tests, paragraph challenges, and test format guides', color: 'amber' },
  { id: 'wpm-accuracy', name: 'WPM & Accuracy', icon: 'Calculator', description: 'Deep dive into typing metrics, formulas, CPM, and error rates', color: 'emerald' },
  { id: 'keyboard-guides', name: 'Keyboard Guides', icon: 'Layers', description: 'Mechanical vs membrane, layout ergonomics, and maintenance', color: 'purple' },
  { id: 'keyboard-shortcuts', name: 'Keyboard Shortcuts', icon: 'Command', description: 'Hotkeys for Windows, Mac, VS Code, Excel, Chrome, and Word', color: 'rose' },
  { id: 'govt-tests', name: 'Government Test Prep', icon: 'Shield', description: 'NTS, PPSC, FPSC, CSS, Clerk, and DEO exam preparation', color: 'blue' },
  { id: 'productivity', name: 'Productivity & Health', icon: 'Sparkles', description: 'Ergonomics, wrist health, sitting posture, and focus tools', color: 'teal' },
  { id: 'career', name: 'Career & Jobs', icon: 'Briefcase', description: 'Data entry careers, remote typing jobs, and resumes', color: 'orange' },
  { id: 'seo-landing', name: 'Online Courses & Tools', icon: 'BookOpen', description: 'Free typing tests, online tutors, courses, and lessons', color: 'cyan' },
];
