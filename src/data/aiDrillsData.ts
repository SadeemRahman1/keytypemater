// Comprehensive AI Drill offline dataset and generator engine
// Provides realistic, highly targeted typing drills across all topics, difficulties, word lengths, and key focus combinations without needing backend API calls.

export interface TopicPreset {
  id: string;
  name: string;
  iconName: string;
  description: string;
}

export const TOPIC_PRESETS: TopicPreset[] = [
  { id: 'code', name: 'JavaScript & React Code', iconName: 'Code', description: 'Syntax, functions, arrow operators, hooks, arrays' },
  { id: 'tech', name: 'Cybersecurity & Cloud', iconName: 'Zap', description: 'Technical terminology, networking, encryption, hashes' },
  { id: 'medical', name: 'Medical Terminology', iconName: 'Stethoscope', description: 'Anatomy, Latin prefixes, complex medical spellings' },
  { id: 'business', name: 'Business & Finance', iconName: 'Briefcase', description: 'Executive emails, financial vocabulary, analytics' },
  { id: 'literature', name: 'Classic Literature', iconName: 'BookOpen', description: 'Rich prose, expressive vocabulary, quotes' },
];

// Targeted letter focus drills for every letter from A to Z
export const KEY_FOCUS_DRILLS: Record<string, { easy: string[]; medium: string[]; hard: string[] }> = {
  A: {
    easy: ['aall aask aact aadd aagile aahead aalways aapple aarray aappear'],
    medium: ['Analytic algorithms adjust architecture automatically across all active applications.'],
    hard: ['Array.map((item, idx) => item.a_value + idx * 1.05); // calculate average A'],
  },
  B: {
    easy: ['ball back bank base beat best bill blue bold book both bulb byte'],
    medium: ['Balanced binary trees boost baseline search performance for big data databases.'],
    hard: ['const buffer = Buffer.alloc(1024); byteLength += buffer.write("binary");'],
  },
  C: {
    easy: ['call case cell chat code coin cold core cost crop cube curl cyan'],
    medium: ['Clean concise code creates clear concepts and avoids complex unexpected bugs.'],
    hard: ['class Component extends React.Component { constructor(props) { super(props); } }'],
  },
  D: {
    easy: ['data date deal deep deck desk dial disk door drop dual duct duty'],
    medium: ['Dynamic database drivers deliver dependable data distribution across nodes.'],
    hard: ['document.addEventListener("DOMContentLoaded", () => { debugLog(data_id); });'],
  },
  E: {
    easy: ['each earn ease east edge edit else emit entry equal error event exam'],
    medium: ['Efficient execution engines elevate user experience across entire ecosystems.'],
    hard: ['export const handleEvent = async (e: Event) => { await execute(e.id); };'],
  },
  F: {
    easy: ['fact fair fall fast file fill find fire flex flow form free fuel'],
    medium: ['Flexible frameworks facilitate fast feature deployment and seamless flow.'],
    hard: ['function filterData(fileList) { return fileList.filter((f) => f.size > 0); }'],
  },
  G: {
    easy: ['gain game gate gear gift glad glow goal gold good grid grow guide'],
    medium: ['Great graphics engines generate smooth geometric grid alignments instantly.'],
    hard: ['git commit -m "fix(grid): global graph layout generator" --no-verify'],
  },
  H: {
    easy: ['half hall hand hard hash head heal heap heat help high hold home'],
    medium: ['High performance hardware handles heavy workloads with harmony and speed.'],
    hard: ['<header className="flex h-16 items-center justify-between px-4" id="head">'],
  },
  I: {
    easy: ['icon idea idle info init inch item info icon icon idle item init'],
    medium: ['Intuitive interfaces inspire immediate interaction and improve insight.'],
    hard: ['import { useState, useEffect, useImperativeHandle } from "react";'],
  },
  J: {
    easy: ['jack jam jar jaw jay job join joke jolt joy judge jump junk jury'],
    medium: ['Jagged JavaScript JSON objects join joinable journal records seamlessly.'],
    hard: ['const json = JSON.stringify({ jobId: 102, status: "JOINED" }, null, 2);'],
  },
  K: {
    easy: ['keep key kick kid kind king kit knee knife knock knot know kohl'],
    medium: ['Keyboards keep key knowledge keen through consistent keyboard practice.'],
    hard: ['Object.keys(keyMap).forEach((k) => keyStore.set(k, keyMap[k] * 2));'],
  },
  L: {
    easy: ['lack lake lamp land last late leaf leak left lens line link list'],
    medium: ['Logic loops learn local layout lines with elegant linear movement.'],
    hard: ['let lineList = logData.split("\\n").map((l, i) => `${i + 1}: ${l}`);'],
  },
  M: {
    easy: ['main make map mark mask math maze mean memory menu mesh mode move'],
    medium: ['Modern memory management minimizes overhead and maximizes throughput.'],
    hard: ['const maxVal = Math.max(...matrix.flatMap((m) => m.values || [0]));'],
  },
  N: {
    easy: ['name neat neck need nest net news next nice node noise note null'],
    medium: ['Network nodes negotiate new neighbor connections without any delay.'],
    hard: ['npm run build && node dist/server.js --port=3000 --env=production'],
  },
  O: {
    easy: ['open optics option orbit order organize output oval overflow overhead overwrite owner'],
    medium: ['Optimized object orientation offers ongoing order across system operations.'],
    hard: ['options = { overflow: "hidden", opacity: 0.95, offsetTop: 120 };'],
  },
  P: {
    easy: ['pack page pair path peak peer pen pie ping pipe plan plug port'],
    medium: ['Proper practice produces precise performance and pleasant speed progress.'],
    hard: ['process.env.PORT || 3000; const pathName = path.resolve(__dirname, "public");'],
  },
  Q: {
    easy: ['quad quake qualify quality quantum quark quarter quartz queen query queue quick quiet quit quota quote'],
    medium: ['Quick quiet queens question quantum queries and qualify quaint quartz stones.'],
    hard: ['const query = db.select().from(queueTable).where(eq(queue.status, "QUIET"));'],
  },
  R: {
    easy: ['race rank rate read real red rest rich ring rise risk road root'],
    medium: ['Rapid response rate reflects robust real-time database routing algorithms.'],
    hard: ['return res.status(200).json({ status: "ready", timestamp: Date.now() });'],
  },
  S: {
    easy: ['safe save scan scope screen search section seed seek select send set shift side sign site skip slide sort sound source space span speed stack star state step store style swap sync system'],
    medium: ['Systematic software structure support stable scalable speed simulations.'],
    hard: ['const state = useSelector((s) => s.settings.soundEnabled ?? true);'],
  },
  T: {
    easy: ['tab tag task team tech test text time title tool top track tree type'],
    medium: ['Touch typing speed thrives through total tactile timing and focus.'],
    hard: ['type TouchEvent = { target: HTMLElement; timeStamp: number; };'],
  },
  U: {
    easy: ['unit unix undo user unit upload update uppercase usage unique undo user'],
    medium: ['Unique user utility tools upgrade ultimate UI usability and understanding.'],
    hard: ['const url = new URL("https://user.api.io/v1/update?unit_id=909");'],
  },
  V: {
    easy: ['value vast vector view viral virtual visible vision visual vital voice void volume vote'],
    medium: ['Vivid vector visualizations validate versatile variable value vectors.'],
    hard: ['const v1 = vec3.create(); vec3.normalize(v1, [1.0, 2.5, 0.0]);'],
  },
  W: {
    easy: ['wage wait walk wall want warm wave way web week well west wide win wind wire wish word work world wrap write'],
    medium: ['Wise web workers write clean well-structured words without waste.'],
    hard: ['window.addEventListener("wheel", (e) => { width += e.deltaY * 0.1; });'],
  },
  X: {
    easy: ['examine axis box fix index flex matrix max mix next text wax pixel fix tax exact extra exit index fixbox hex flex box proxy apex tax wax index'],
    medium: ['Complex oxygen matrix examines nexus extensions and exact explicit syntax.'],
    hard: ['const x_pos = (max_val ^ 0xFF) & 0x0F; export default { x_pos };'],
  },
  Y: {
    easy: ['yard yarn year yell yes yet yield yoga yoke young youth yummy key buy copy cry dry fly sky try'],
    medium: ['Yielding young yearlings enjoy sunny yellow yards every yesterday.'],
    hard: ['const y = (year) => (year % 4 === 0 ? "leap" : "standard");'],
  },
  Z: {
    easy: ['zero zone zoom zest zig zag zinc zip zesty zodiac zombie zone zoom zero zone zoom zig zag'],
    medium: ['Zealous zebras zigzag quickly through azure zoo zones with zesty zeal.'],
    hard: ['z-index: 9999; transform: translate3d(0, 0, 0) scale(1.02);'],
  },
};

// Rich Topic-based passage collections categorized by difficulty
export const TOPIC_DRILLS: Record<string, Record<'easy' | 'medium' | 'hard', string[]>> = {
  code: {
    easy: [
      'let total = 0; for (let i = 0; i < 10; i++) { total += i; } console.log(total);',
      'const greeting = "Hello World"; function sayHello() { return greeting; }',
      'const numbers = [1, 2, 3, 4, 5]; const doubled = numbers.map(n => n * 2);',
      'if (user.isLoggedIn) { showDashboard(); } else { redirectToLogin(); }',
      'const isActive = true; const score = 100; const name = "Typing Master";',
    ],
    medium: [
      'import React, { useState, useEffect } from "react"; export const Counter = () => { const [count, setCount] = useState(0); return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>; };',
      'async function fetchData(url) { try { const res = await fetch(url); const data = await res.json(); return data; } catch (err) { console.error("API Fetch Error:", err); } }',
      'const calculateStats = (items) => { const total = items.reduce((acc, curr) => acc + curr.value, 0); const average = total / items.length; return { total, average }; };',
      'export interface UserProfile { id: string; username: string; email: string; isVerified: boolean; createdAt: Date; }',
    ],
    hard: [
      'const debounce = <T extends (...args: any[]) => void>(fn: T, delay: number = 300) => { let timer: NodeJS.Timeout; return (...args: Parameters<T>) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); }; };',
      'useMemo(() => data.filter(item => item.score >= 80 && item.tags.includes("active")).sort((a, b) => b.timestamp - a.timestamp), [data]);',
      'export class CircularQueue<T> { private buffer: (T | null)[]; private head = 0; private tail = 0; constructor(public readonly capacity: number) { this.buffer = new Array(capacity).fill(null); } }',
    ],
  },
  tech: {
    easy: [
      'Cloud computing allows users to store data safely on servers across the world.',
      'Cybersecurity protects systems and networks from digital threats and unauthorized access.',
      'A router directs internet traffic between devices on a local network quickly.',
      'Open source software gives developers freedom to inspect and modify code.',
      'Artificial intelligence processes information to solve problems and automate tasks.',
    ],
    medium: [
      'Distributed microservices communicate over lightweight gRPC protocols to maintain high availability and fault tolerance.',
      'Public key cryptography uses asymmetric key pairs to encrypt sensitive payloads before transmission over public channels.',
      'Containerization packages application code alongside all dependencies, ensuring consistent runtime behavior across cloud platforms.',
      'Continuous integration pipelines execute automated unit tests and linter checks on every pull request before deployment.',
    ],
    hard: [
      'Kubernetes ingress controllers manage TLS termination, rate-limiting (100 req/s), and round-robin traffic load balancing across pods.',
      'SHA-256 cryptographic hashes produce fixed 256-bit signatures; e.g. 0x4f8a9e21b7c3d0f5e1a9c8b7a6f5e4d3c2b1a0f9.',
      'TCP/IP handshake uses SYN, SYN-ACK, and ACK packets over port 443 with TLS 1.3 encryption handshake negotiates cipher suites.',
    ],
  },
  medical: {
    easy: [
      'The human heart pumps blood through arteries and veins to supply oxygen.',
      'Muscles contract and relax to allow movement of the skeleton and body.',
      'Neurons transmit electrical impulses across synapses throughout the brain.',
      'White blood cells defend the body against bacteria, viruses, and infections.',
      'Lungs absorb fresh oxygen from inhaled air and exhale carbon dioxide gas.',
    ],
    medium: [
      'Cardiovascular health depends on maintaining low blood pressure, steady pulse, and healthy cholesterol levels.',
      'The central nervous system coordinates motor signals through the spinal cord to peripheral motor neurons.',
      'Gastrointestinal absorption converts dietary nutrients into cellular energy via aerobic metabolic pathways.',
      'Pharmacological therapies target specific cellular receptors to alleviate inflammation and restore homeostasis.',
    ],
    hard: [
      'Erythrocytes transport hemoglobin (HbA1c) while leukocytes (e.g., neutrophils, lymphocytes) mediate humoral immunity response.',
      'Cerebrovascular circulation via the Circle of Willis supplies oxygenated blood (PaO2 > 95 mmHg) to the cerebral cortex.',
      'Subcutaneous injections of 0.5 mL epinephrine (1:1000) treat acute anaphylactic hypersensitivity reactions rapidly.',
    ],
  },
  business: {
    easy: [
      'Clear communication builds strong trust between teams and valued clients.',
      'Setting daily goals helps organize priority tasks and track work progress.',
      'Effective leadership encourages collaboration and supports creative ideas.',
      'Customer feedback provides insights to improve products and customer service.',
      'Financial planning ensures sustainable growth and protects business capital.',
    ],
    medium: [
      'Quarterly financial audits evaluate key performance metrics, operational overhead, and profit margins to optimize growth.',
      'Strategic marketing campaigns leverage consumer analytics to maximize brand awareness and conversion rates.',
      'Cross-functional alignment ensures product engineering and sales teams execute unified product launch milestones.',
      'Venture capital investors prioritize scalable recurring revenue models with strong retention and low acquisition costs.',
    ],
    hard: [
      'Q3 EBITDA increased by 14.8% YoY to $4.2M, driven by SaaS ARR growth ($12.5M) and reduced customer churn (<1.2%).',
      'The Board approved a $500k CapEx allocation for cloud infrastructure expansion (ROI estimated at 22.5% annualized).',
      'Key Performance Indicators (KPIs) include Customer Lifetime Value (CLV: $3,200) vs. Acquisition Cost (CAC: $450).',
    ],
  },
  literature: {
    easy: [
      'To be or not to be, that is the question that lingers in the quiet mind.',
      'All that glitters is not gold; often golden surfaces conceal simple stone.',
      'It was the best of times, it was the worst of times in a changing world.',
      'Not all those who wander are lost; some discover new paths in quiet solitude.',
      'The woods are lovely, dark and deep, but I have promises to keep before sleep.',
    ],
    medium: [
      'In the depth of winter, I finally learned that within me there lay an invincible summer that no cold could ever extinguish.',
      'We are such stuff as dreams are made on, and our little life is rounded with a sleep amidst the vast cosmic silence.',
      'There is no greater agony than bearing an untold story inside you, waiting for expression through written words.',
      'Courage is not the absence of fear, but rather the judgment that something else is more important than fear itself.',
    ],
    hard: [
      '“Do I dare disturb the universe? In a minute there is time for decisions and revisions which a minute will reverse.” — T.S. Eliot',
      '“It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.” — Jane Austen',
      '“Whatever our souls are made of, his and mine are the same; and if all else perished, and he remained, I should still continue to be.”',
    ],
  },
};

/**
 * Local AI Drill Generator Engine
 * Generates custom typing passages based on target keys, topic, difficulty, and word count.
 * Operates 100% locally and instantly without backend API dependencies.
 */
export function getOfflineAIDrill(options: {
  targetKeys?: string[];
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  wordCount?: number;
}): { text: string; title: string; targetKeyCount: number } {
  const {
    targetKeys = [],
    topic = 'code',
    difficulty = 'medium',
    wordCount = 35,
  } = options;

  let basePassages: string[] = [];

  // 1. Gather passages from selected topic and difficulty
  const topicObj = TOPIC_DRILLS[topic] || TOPIC_DRILLS.code;
  basePassages = [...(topicObj[difficulty] || topicObj.medium)];

  // 2. If target keys are specified, enrich base passages with target key focus sentences
  const keyDrillSnippets: string[] = [];
  let keyCountInResult = 0;

  if (targetKeys.length > 0) {
    targetKeys.forEach((k) => {
      const upperK = k.toUpperCase();
      if (KEY_FOCUS_DRILLS[upperK]) {
        const drillsForKey = KEY_FOCUS_DRILLS[upperK][difficulty] || KEY_FOCUS_DRILLS[upperK].medium;
        if (drillsForKey && drillsForKey.length > 0) {
          keyDrillSnippets.push(drillsForKey[Math.floor(Math.random() * drillsForKey.length)]);
        }
      }
    });
  }

  // Combine key drills and topic passages
  let combinedPool: string[] = [];
  if (keyDrillSnippets.length > 0) {
    // Alternate or prepend key focus sentences
    combinedPool = [...keyDrillSnippets, ...basePassages];
  } else {
    combinedPool = [...basePassages];
  }

  // Shuffle combined pool slightly for variety
  combinedPool.sort(() => Math.random() - 0.5);

  let rawText = combinedPool.join(' ');

  // 3. Trim or extend to approximate requested wordCount
  const words = rawText.split(/\s+/).filter(Boolean);

  let finalWords: string[] = [];
  if (words.length >= wordCount) {
    finalWords = words.slice(0, wordCount);
  } else {
    // Repeat or loop to reach requested length
    let currentWords = [...words];
    while (currentWords.length < wordCount) {
      const extraPassage = basePassages[Math.floor(Math.random() * basePassages.length)];
      currentWords.push(...extraPassage.split(/\s+/).filter(Boolean));
    }
    finalWords = currentWords.slice(0, wordCount);
  }

  const finalText = finalWords.join(' ');

  // Count occurrence of target keys in final text
  if (targetKeys.length > 0) {
    const lowerText = finalText.toLowerCase();
    targetKeys.forEach((k) => {
      const char = k.toLowerCase();
      const occurrences = lowerText.split(char).length - 1;
      keyCountInResult += occurrences;
    });
  }

  // Generate clear descriptive title
  const topicMeta = TOPIC_PRESETS.find((t) => t.id === topic);
  const topicName = topicMeta ? topicMeta.name : 'Custom Drill';
  const title = targetKeys.length > 0
    ? `AI Drill: ${topicName} (Focus: ${targetKeys.join(', ')})`
    : `AI Drill: ${topicName} (${difficulty.toUpperCase()})`;

  return {
    text: finalText,
    title,
    targetKeyCount: keyCountInResult,
  };
}
