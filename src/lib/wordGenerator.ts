import { QuoteCategory } from '../types';

export const KEYBR_LETTER_ORDER = [
  'e', 't', 'a', 'o', 'i', 'n', 's', 'h', 'r', 'd', 'l', 'u', 'c', 'm', 'f', 'y', 'w', 'g', 'p', 'b', 'v', 'k', 'x', 'j', 'q', 'z'
];

export const COMMON_WORDS = [
  'the', 'be', 'of', 'and', 'a', 'to', 'in', 'he', 'have', 'it', 'that', 'for', 'they', 'I', 'with', 'as', 'not', 'on', 'she', 'at',
  'by', 'this', 'we', 'you', 'do', 'but', 'from', 'or', 'which', 'one', 'would', 'all', 'will', 'there', 'say', 'who', 'make', 'when', 'can', 'more',
  'if', 'no', 'man', 'out', 'other', 'so', 'what', 'time', 'up', 'go', 'about', 'than', 'into', 'could', 'state', 'only', 'new', 'year', 'some', 'take',
  'come', 'these', 'know', 'see', 'use', 'get', 'like', 'then', 'first', 'any', 'work', 'now', 'may', 'such', 'give', 'over', 'think', 'most', 'even',
  'find', 'day', 'also', 'after', 'way', 'many', 'must', 'look', 'before', 'great', 'back', 'through', 'long', 'where', 'much', 'should', 'well', 'people',
  'down', 'own', 'just', 'because', 'good', 'each', 'those', 'feel', 'seem', 'how', 'high', 'too', 'place', 'little', 'world', 'very', 'still', 'nation',
  'hand', 'old', 'life', 'tell', 'write', 'become', 'here', 'show', 'house', 'both', 'between', 'need', 'mean', 'call', 'develop', 'under', 'last', 'right',
  'move', 'thing', 'general', 'school', 'never', 'same', 'another', 'begin', 'while', 'number', 'part', 'turn', 'real', 'leave', 'might', 'want', 'point',
  'form', 'off', 'child', 'few', 'small', 'since', 'against', 'ask', 'late', 'home', 'interest', 'large', 'person', 'end', 'open', 'public', 'follow', 'during',
  'present', 'without', 'again', 'hold', 'code', 'data', 'function', 'variable', 'logic', 'system', 'network', 'value', 'array', 'object', 'script', 'style'
];

export const QUOTES: Array<{ quote: string; author: string; category: QuoteCategory }> = [
  {
    quote: "Simplicity is prerequisite for reliability.",
    author: "Edsger W. Dijkstra",
    category: "tech"
  },
  {
    quote: "Talk is cheap. Show me the code.",
    author: "Linus Torvalds",
    category: "short"
  },
  {
    quote: "Programs must be written for people to read, and only incidentally for machines to execute.",
    author: "Harold Abelson",
    category: "medium"
  },
  {
    quote: "The best way to predict the future is to invent it.",
    author: "Alan Kay",
    category: "short"
  },
  {
    quote: "It's not a bug – it's an undocumented feature.",
    author: "Anonymous",
    category: "short"
  },
  {
    quote: "Knowledge is power, but practice is the key to mastery. Speed follows accuracy, and accuracy demands focus.",
    author: "KeyType Wisdom",
    category: "medium"
  },
  {
    quote: "To touch type efficiently, let your eyes stay on the screen while your hands memorize the exact spatial layout of every key.",
    author: "Typing Guide",
    category: "medium"
  },
  {
    quote: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
    author: "Albert Einstein",
    category: "literature"
  },
  {
    quote: "const fibonacci = (n) => n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2);",
    author: "JavaScript snippet",
    category: "code"
  },
  {
    quote: "function filterKeyStats(stats, threshold = 85) { return stats.filter(s => s.confidence < threshold); }",
    author: "TypeScript snippet",
    category: "code"
  },
  {
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "literature"
  }
];

// N-gram syllable building blocks for keybr procedural word engine
const SYLLABLE_PATTERNS = [
  ['e', 't', 'a'], ['o', 'i', 'n'], ['s', 'h', 'r'], ['d', 'l', 'u'], ['c', 'm', 'f'],
  ['y', 'w', 'g'], ['p', 'b', 'v'], ['k', 'x', 'j'], ['q', 'z']
];

/**
 * Generate procedural Keybr pseudo-words using ONLY the currently unlocked letters.
 */
export function generateKeybrWords(unlockedLetters: string[], count: number = 25, targetWeakKey?: string): string {
  const allowed = new Set(unlockedLetters.map(l => l.toLowerCase()));
  const targetKey = targetWeakKey ? targetWeakKey.toLowerCase() : unlockedLetters[unlockedLetters.length - 1];

  const words: string[] = [];

  // Syllables crafted from combinations of unlocked letters
  const validVowels = ['e', 'a', 'o', 'i', 'u', 'y'].filter(v => allowed.has(v));
  const validConsonants = KEYBR_LETTER_ORDER.filter(c => allowed.has(c) && !validVowels.includes(c));

  const fallbackVowel = validVowels.length > 0 ? validVowels : ['e'];
  const fallbackConsonant = validConsonants.length > 0 ? validConsonants : ['t'];

  for (let i = 0; i < count; i++) {
    // Determine word length (3 to 6 chars)
    const len = Math.floor(Math.random() * 3) + 3;
    let word = '';

    // Enforce target weak key in every 2nd word to build muscle memory
    const mustIncludeTarget = i % 2 === 0 && allowed.has(targetKey);

    for (let j = 0; j < len; j++) {
      if (j === 0 || j === 2 || j === 4) {
        // Consonant
        const c = validConsonants[Math.floor(Math.random() * validConsonants.length)] || fallbackConsonant[0];
        word += c;
      } else {
        // Vowel
        const v = validVowels[Math.floor(Math.random() * validVowels.length)] || fallbackVowel[0];
        word += v;
      }
    }

    if (mustIncludeTarget && !word.includes(targetKey)) {
      // Replace a character with the target key
      const pos = Math.floor(Math.random() * word.length);
      word = word.substring(0, pos) + targetKey + word.substring(pos + 1);
    }

    words.push(word);
  }

  return words.join(' ');
}

/**
 * Generate random words list from common dictionary with optional numbers / punctuation.
 */
export function generateRandomWords(count: number = 25, includeNumbers = false, includePunctuation = false): string {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    let word = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];

    if (includeNumbers && Math.random() < 0.15) {
      word = String(Math.floor(Math.random() * 900) + 10);
    }

    if (includePunctuation && Math.random() < 0.2) {
      const puncs = ['.', ',', '!', '?', ';', ':'];
      const p = puncs[Math.floor(Math.random() * puncs.length)];
      word = word + p;
    }

    if (includePunctuation && Math.random() < 0.1) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }

    words.push(word);
  }
  return words.join(' ');
}

/**
 * Get random quote from library.
 */
export function getRandomQuote(category: QuoteCategory = 'all'): { quote: string; author: string } {
  const filtered = category === 'all' 
    ? QUOTES 
    : QUOTES.filter(q => q.category === category || (category === 'literature' && q.category === 'medium'));
  
  const selected = filtered[Math.floor(Math.random() * filtered.length)] || QUOTES[0];
  return { quote: selected.quote, author: selected.author };
}
