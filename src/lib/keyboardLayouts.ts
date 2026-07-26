export interface KeyboardLayoutData {
  id: string;
  name: string;
  category: 'standard' | 'dvorak' | 'colemak' | 'ergonomic' | 'matrix' | 'regional' | 'custom';
  description: string;
  homeRowKeys: string[];
  keyRows: {
    row1?: string[]; // number/symbol row
    row2: string[];  // top letter row
    row3: string[];  // home row
    row4: string[];  // bottom letter row
  };
  stats: {
    homeRowPct: number;
    topRowPct: number;
    bottomRowPct: number;
    sameHandPct: number;
    sameFingerPct: number;
    score: number;
  };
  isMatrix?: boolean;
}

export const KEYBOARD_LAYOUTS: KeyboardLayoutData[] = [
  {
    id: 'qwerty_us',
    name: 'QWERTY (United States)',
    category: 'standard',
    description: 'The standard layout for English typing. Designed in 1873 for typewriters to avoid mechanical jamming.',
    homeRowKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
    keyRows: {
      row1: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
      row2: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
      row3: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
      row4: ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
    },
    stats: {
      homeRowPct: 33,
      topRowPct: 52,
      bottomRowPct: 15,
      sameHandPct: 52,
      sameFingerPct: 18,
      score: 55,
    },
  },
  {
    id: 'qwerty_uk',
    name: 'QWERTY (United Kingdom)',
    category: 'regional',
    description: 'British English QWERTY variant with ISO Enter key placement and £ sign on Shift+3.',
    homeRowKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
    keyRows: {
      row1: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
      row2: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
      row3: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", '#'],
      row4: ['\\', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
    },
    stats: {
      homeRowPct: 33,
      topRowPct: 52,
      bottomRowPct: 15,
      sameHandPct: 52,
      sameFingerPct: 18,
      score: 55,
    },
  },
  {
    id: 'qwerty_jp',
    name: 'QWERTY (Japan JIS)',
    category: 'regional',
    description: 'Japanese standard JIS layout with dedicated language toggle keys and shortened spacebar.',
    homeRowKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
    keyRows: {
      row1: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '^', '¥'],
      row2: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '@', '['],
      row3: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', ':', ']'],
      row4: ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', '\\'],
    },
    stats: {
      homeRowPct: 33,
      topRowPct: 51,
      bottomRowPct: 16,
      sameHandPct: 51,
      sameFingerPct: 18,
      score: 56,
    },
  },
  {
    id: 'dvorak',
    name: 'Dvorak',
    category: 'dvorak',
    description: 'Patented in 1936 by August Dvorak. Places all vowels on the left home row and most common consonants on the right.',
    homeRowKeys: ['a', 'o', 'e', 'u', 'i', 'd', 'h', 't', 'n', 's'],
    keyRows: {
      row1: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '[', ']'],
      row2: ["'", ',', '.', 'p', 'y', 'f', 'g', 'c', 'r', 'l', '/', '='],
      row3: ['a', 'o', 'e', 'u', 'i', 'd', 'h', 't', 'n', 's', '-'],
      row4: [';', 'q', 'j', 'k', 'x', 'b', 'm', 'w', 'v', 'z'],
    },
    stats: {
      homeRowPct: 68,
      topRowPct: 22,
      bottomRowPct: 10,
      sameHandPct: 37,
      sameFingerPct: 10,
      score: 88,
    },
  },
  {
    id: 'dvorak_programmers',
    name: 'Dvorak (Programmers)',
    category: 'dvorak',
    description: 'Optimized for programmers, placing brackets, braces, and math symbols on unshifted number keys.',
    homeRowKeys: ['a', 'o', 'e', 'u', 'i', 'd', 'h', 't', 'n', 's'],
    keyRows: {
      row1: ['$', '&', '[', '{', '}', '(', '=', '*', ')', '+', ']', '!', '#'],
      row2: [';', ',', '.', 'p', 'y', 'f', 'g', 'c', 'r', 'l', '/', '@'],
      row3: ['a', 'o', 'e', 'u', 'i', 'd', 'h', 't', 'n', 's', '-'],
      row4: ["'", 'q', 'j', 'k', 'x', 'b', 'm', 'w', 'v', 'z'],
    },
    stats: {
      homeRowPct: 67,
      topRowPct: 23,
      bottomRowPct: 10,
      sameHandPct: 38,
      sameFingerPct: 10,
      score: 87,
    },
  },
  {
    id: 'colemak',
    name: 'Colemak',
    category: 'colemak',
    description: 'Designed in 2006 by Shai Coleman. Maintains QWERTY shortcuts (Cut/Copy/Undo) while placing ARST/NEIO on the home row.',
    homeRowKeys: ['a', 'r', 's', 't', 'g', 'm', 'n', 'e', 'i', 'o'],
    keyRows: {
      row1: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
      row2: ['q', 'w', 'f', 'p', 'g', 'j', 'l', 'u', 'y', ';', '[', ']'],
      row3: ['a', 'r', 's', 't', 'd', 'h', 'n', 'e', 'i', 'o', "'"],
      row4: ['z', 'x', 'c', 'v', 'b', 'k', 'm', ',', '.', '/'],
    },
    stats: {
      homeRowPct: 74,
      topRowPct: 19,
      bottomRowPct: 7,
      sameHandPct: 35,
      sameFingerPct: 11,
      score: 91,
    },
  },
  {
    id: 'colemak_dh',
    name: 'Colemak-DH (ANSI)',
    category: 'colemak',
    description: 'Modification of Colemak that moves D and H to the inner index finger positions to reduce lateral finger stretching.',
    homeRowKeys: ['a', 'r', 's', 't', 'g', 'm', 'n', 'e', 'i', 'o'],
    keyRows: {
      row1: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
      row2: ['q', 'w', 'f', 'p', 'b', 'j', 'l', 'u', 'y', ';', '[', ']'],
      row3: ['a', 'r', 's', 't', 'g', 'm', 'n', 'e', 'i', 'o', "'"],
      row4: ['z', 'x', 'c', 'd', 'v', 'k', 'h', ',', '.', '/'],
    },
    stats: {
      homeRowPct: 74,
      topRowPct: 18,
      bottomRowPct: 8,
      sameHandPct: 34,
      sameFingerPct: 10,
      score: 93,
    },
  },
  {
    id: 'colemak_dh_wide',
    name: 'Colemak-DH Wide (ANSI)',
    category: 'colemak',
    description: 'Moves the right hand one column to the right to create an ergonomic gap between wrists.',
    homeRowKeys: ['a', 'r', 's', 't', 'g', '=', 'm', 'n', 'e', 'i', 'o'],
    keyRows: {
      row1: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '['],
      row2: ['q', 'w', 'f', 'p', 'b', '-', 'j', 'l', 'u', 'y', ';', ']'],
      row3: ['a', 'r', 's', 't', 'g', '=', 'm', 'n', 'e', 'i', 'o', "'"],
      row4: ['z', 'x', 'c', 'd', 'v', 'k', 'h', ',', '.', '/'],
    },
    stats: {
      homeRowPct: 73,
      topRowPct: 19,
      bottomRowPct: 8,
      sameHandPct: 34,
      sameFingerPct: 10,
      score: 92,
    },
  },
  {
    id: 'colemak_dh_matrix',
    name: 'Colemak-DH (Matrix / Ortholinear)',
    category: 'matrix',
    description: 'Colemak-DH optimized for split or matrix non-staggered keyboards (e.g., Ergodox, Moonlander).',
    isMatrix: true,
    homeRowKeys: ['a', 'r', 's', 't', 'g', 'm', 'n', 'e', 'i', 'o'],
    keyRows: {
      row2: ['q', 'w', 'f', 'p', 'b', 'j', 'l', 'u', 'y', ';'],
      row3: ['a', 'r', 's', 't', 'g', 'm', 'n', 'e', 'i', 'o'],
      row4: ['z', 'x', 'c', 'd', 'v', 'k', 'h', ',', '.', '/'],
    },
    stats: {
      homeRowPct: 76,
      topRowPct: 17,
      bottomRowPct: 7,
      sameHandPct: 33,
      sameFingerPct: 9,
      score: 95,
    },
  },
  {
    id: 'workman',
    name: 'Workman',
    category: 'ergonomic',
    description: 'Designed by Vance Morrison in 2010. Balances finger movement according to natural hand anatomy.',
    homeRowKeys: ['d', 's', 't', 'r', 'g', 'h', 'n', 'e', 'o', 'i'],
    keyRows: {
      row1: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
      row2: ['q', 'w', 'f', 'p', 'v', 'j', 'l', 'u', 'y', ';', '[', ']'],
      row3: ['d', 's', 't', 'r', 'g', 'h', 'n', 'e', 'o', 'i', "'"],
      row4: ['z', 'x', 'c', 'm', 'b', 'k', 'y', ',', '.', '/'],
    },
    stats: {
      homeRowPct: 69,
      topRowPct: 21,
      bottomRowPct: 10,
      sameHandPct: 41,
      sameFingerPct: 11,
      score: 86,
    },
  },
  {
    id: 'canary',
    name: 'Canary',
    category: 'ergonomic',
    description: 'Modern 2022 layout built with computer optimization algorithms for smooth hand alternation.',
    homeRowKeys: ['w', 'r', 's', 't', 'f', 'm', 'n', 'e', 'i', 'o'],
    keyRows: {
      row1: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
      row2: ['c', 'l', 'd', 'p', 'v', 'z', 'y', 'u', 'o', 'y', ';', '['],
      row3: ['w', 'r', 's', 't', 'f', 'm', 'n', 'e', 'i', 'o', "'"],
      row4: ['q', 'j', 'g', 'k', 'b', 'x', 'h', ',', '.', '/'],
    },
    stats: {
      homeRowPct: 72,
      topRowPct: 20,
      bottomRowPct: 8,
      sameHandPct: 40,
      sameFingerPct: 10,
      score: 90,
    },
  },
  {
    id: 'nerps',
    name: 'Nerps',
    category: 'ergonomic',
    description: 'Ultra-low same-finger-bigram layout featuring smooth roll combinations on the home row.',
    homeRowKeys: ['n', 'r', 's', 't', 'g', 'y', 'e', 'a', 'i', 'o'],
    keyRows: {
      row1: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
      row2: ['p', 'l', 'c', 'd', 'v', 'k', 'u', 'o', 'w', ';', '[', ']'],
      row3: ['n', 'r', 's', 't', 'g', 'y', 'e', 'a', 'i', 'o', "'"],
      row4: ['z', 'x', 'f', 'm', 'b', 'j', 'h', ',', '.', '/'],
    },
    stats: {
      homeRowPct: 75,
      topRowPct: 18,
      bottomRowPct: 7,
      sameHandPct: 35,
      sameFingerPct: 9,
      score: 93,
    },
  },
  {
    id: 'hands_down_neu',
    name: 'Hands Down Neu',
    category: 'ergonomic',
    description: 'Adaptive design emphasizing comfortable inner rolls and minimizing index stretch.',
    homeRowKeys: ['r', 's', 'n', 't', 'g', 'm', 'a', 'e', 'i', 'h'],
    keyRows: {
      row1: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
      row2: ['w', 'c', 'l', 'p', 'v', 'j', 'f', 'u', 'o', 'y', '[', ']'],
      row3: ['r', 's', 'n', 't', 'g', 'm', 'a', 'e', 'i', 'h', "'"],
      row4: ['x', 'q', 'b', 'd', 'z', 'k', 'y', ',', '.', '/'],
    },
    stats: {
      homeRowPct: 73,
      topRowPct: 19,
      bottomRowPct: 8,
      sameHandPct: 36,
      sameFingerPct: 9,
      score: 91,
    },
  },
  {
    id: 'sturdy',
    name: 'Sturdy',
    category: 'ergonomic',
    description: 'Modern algorithmic layout designed for high comfort, low same-finger redirects, and stable typing feel.',
    homeRowKeys: ['r', 's', 't', 'c', 'g', 'm', 'n', 'e', 'a', 'i'],
    keyRows: {
      row1: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
      row2: ['v', 'm', 'l', 'c', 'p', 'x', 'f', 'o', 'u', 'y', '[', ']'],
      row3: ['r', 's', 't', 'c', 'g', 'm', 'n', 'e', 'a', 'i', "'"],
      row4: ['z', 'x', 'k', 'd', 'b', 'j', 'h', ',', '.', '/'],
    },
    stats: {
      homeRowPct: 72,
      topRowPct: 20,
      bottomRowPct: 8,
      sameHandPct: 39,
      sameFingerPct: 10,
      score: 89,
    },
  },
  {
    id: 'norman',
    name: 'Norman',
    category: 'ergonomic',
    description: 'Designed as a step between QWERTY and Colemak, minimizing key relocations while maximizing home row usage.',
    homeRowKeys: ['n', 'i', 'o', 'a', 'g', 'd', 't', 'e', 'r', 's'],
    keyRows: {
      row1: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
      row2: ['q', 'w', 'd', 'f', 'k', 'j', 'u', 'r', 'l', ';', '[', ']'],
      row3: ['n', 'i', 'o', 'a', 'g', 'd', 't', 'e', 'r', 's', "'"],
      row4: ['z', 'x', 'c', 'v', 'b', 'p', 'm', ',', '.', '/'],
    },
    stats: {
      homeRowPct: 65,
      topRowPct: 25,
      bottomRowPct: 10,
      sameHandPct: 44,
      sameFingerPct: 12,
      score: 82,
    },
  },
  {
    id: 'halmak',
    name: 'Halmak',
    category: 'ergonomic',
    description: 'Created using genetic AI optimization algorithms with 1 million iteration test passes.',
    homeRowKeys: ['w', 'r', 's', 't', 'p', 'f', 'n', 'e', 'a', 'i'],
    keyRows: {
      row1: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
      row2: ['q', 'l', 'r', 'b', 'z', ';', 'f', 'u', 'd', 'j', '[', ']'],
      row3: ['w', 'r', 's', 't', 'p', 'f', 'n', 'e', 'a', 'i', "'"],
      row4: ['v', 'x', 'c', 'g', 'y', 'm', 'k', ',', '.', '/'],
    },
    stats: {
      homeRowPct: 71,
      topRowPct: 21,
      bottomRowPct: 8,
      sameHandPct: 38,
      sameFingerPct: 10,
      score: 88,
    },
  },
  {
    id: 'engram',
    name: 'Engram',
    category: 'ergonomic',
    description: 'Ergonomic layout designed by Arno Klein specifically for prose, code, and math syntax balance.',
    homeRowKeys: ['r', 'n', 't', 's', 'g', 'h', 'a', 'e', 'i', 'o'],
    keyRows: {
      row1: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
      row2: ['b', 'y', 'o', 'u', "'", '"', 'l', 'd', 'w', 'v', 'z', '['],
      row3: ['r', 'n', 't', 's', 'g', 'h', 'a', 'e', 'i', 'o', ';'],
      row4: ['p', 'x', 'm', 'c', 'k', 'f', 'j', ',', '.', '/'],
    },
    stats: {
      homeRowPct: 70,
      topRowPct: 22,
      bottomRowPct: 8,
      sameHandPct: 37,
      sameFingerPct: 11,
      score: 87,
    },
  },
  {
    id: 'graphite',
    name: 'Graphite',
    category: 'ergonomic',
    description: 'Top-ranking computer optimized layout optimized for inward finger rolls and low redirection.',
    homeRowKeys: ['r', 'n', 't', 's', 'g', 'y', 'h', 'a', 'e', 'i'],
    keyRows: {
      row1: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
      row2: ['b', 'l', 'd', 'w', 'v', 'z', 'f', 'u', 'o', 'j', '[', ']'],
      row3: ['r', 'n', 't', 's', 'g', 'y', 'h', 'a', 'e', 'i', "'"],
      row4: ['q', 'x', 'm', 'c', 'k', 'p', 'v', ',', '.', '/'],
    },
    stats: {
      homeRowPct: 73,
      topRowPct: 19,
      bottomRowPct: 8,
      sameHandPct: 35,
      sameFingerPct: 10,
      score: 91,
    },
  },
  {
    id: 'mtgap',
    name: 'MTGAP',
    category: 'ergonomic',
    description: 'Famous layout developed by Michael Capewell using genetic optimization targeting finger travel speed.',
    homeRowKeys: ['y', 'p', 'o', 'u', 'j', 'k', 'd', 't', 'n', 's'],
    keyRows: {
      row1: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
      row2: ['v', 'w', 'l', 'h', 'k', 'q', 'f', 'g', 'c', 'r', '[', ']'],
      row3: ['y', 'p', 'o', 'u', 'j', 'k', 'd', 't', 'n', 's', "'"],
      row4: ['z', 'x', 'q', 'i', 'b', 'm', 'a', ',', '.', '/'],
    },
    stats: {
      homeRowPct: 69,
      topRowPct: 21,
      bottomRowPct: 10,
      sameHandPct: 36,
      sameFingerPct: 11,
      score: 86,
    },
  },
];

export function getLayoutById(id?: string): KeyboardLayoutData {
  if (!id) return KEYBOARD_LAYOUTS[0];
  const found = KEYBOARD_LAYOUTS.find((l) => l.id === id);
  if (found) return found;

  try {
    const stored = localStorage.getItem('keytype_custom_layouts_v1');
    if (stored) {
      const customs: KeyboardLayoutData[] = JSON.parse(stored);
      const customFound = customs.find((l) => l.id === id);
      if (customFound) return customFound;
    }
  } catch (e) {
    console.error(e);
  }

  return KEYBOARD_LAYOUTS[0];
}
