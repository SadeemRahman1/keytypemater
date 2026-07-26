import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, X, Trophy, Zap, Shield, Flame, RotateCcw, Volume2, Play, Award, Rocket, Target, Sparkles, Flag, Heart } from 'lucide-react';
import { UserSettings } from '../types';
import { THEMES } from '../lib/themes';
import { soundEngine } from '../lib/soundEngine';

interface TypingGamesModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onRecordGameStats?: (score: number, wpm: number) => void;
}

type GameMode = 'hub' | 'meteors' | 'racer' | 'balloons';

interface HighScores {
  meteors: number;
  racer: number;
  balloons: number;
}

const COMMON_WORDS = [
  'time', 'year', 'people', 'way', 'day', 'man', 'thing', 'woman', 'life', 'child',
  'world', 'school', 'state', 'family', 'student', 'group', 'country', 'problem', 'hand', 'part',
  'place', 'case', 'week', 'company', 'system', 'program', 'question', 'work', 'government', 'number',
  'night', 'point', 'home', 'water', 'room', 'mother', 'area', 'money', 'story', 'fact',
  'month', 'lot', 'right', 'study', 'book', 'eye', 'job', 'word', 'business', 'issue',
  'side', 'kind', 'head', 'house', 'service', 'friend', 'father', 'power', 'hour', 'game',
  'line', 'end', 'member', 'law', 'car', 'city', 'community', 'name', 'president', 'team',
  'minute', 'idea', 'kid', 'body', 'information', 'back', 'parent', 'face', 'others', 'level'
];

const RACER_SENTENCES = [
  "The quick brown fox jumps over the lazy dog in a spectacular display of speed and agility.",
  "Touch typing empowers developers and writers to output ideas at the rate of pure thought.",
  "Speed and precision come from calm breathing, relaxed shoulders, and consistent home row discipline.",
  "Engineers who master muscle memory navigate complex key combinations without breaking deep focus."
];

export const TypingGamesModal: React.FC<TypingGamesModalProps> = ({
  isOpen,
  onClose,
  settings,
  onRecordGameStats,
}) => {
  const [currentGame, setCurrentGame] = useState<GameMode>('hub');
  const [highScores, setHighScores] = useState<HighScores>({
    meteors: 0,
    racer: 0,
    balloons: 0,
  });

  const theme = THEMES[settings.theme];

  // Load high scores
  useEffect(() => {
    try {
      const stored = localStorage.getItem('keytype_game_scores_v1');
      if (stored) {
        setHighScores(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveHighScore = (game: keyof HighScores, score: number) => {
    setHighScores((prev) => {
      const updated = { ...prev, [game]: Math.max(prev[game], score) };
      try {
        localStorage.setItem('keytype_game_scores_v1', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className={`relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border ${theme.border} bg-slate-900 shadow-2xl overflow-hidden`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-600 text-slate-950 shadow-lg shadow-amber-500/20">
              <Gamepad2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Typing Arcade & Games
                <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-bold">
                  Fun Drills
                </span>
              </h2>
              <p className="text-xs text-slate-400">Boost your WPM, finger speed, and accuracy through interactive gaming!</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentGame !== 'hub' && (
              <button
                onClick={() => setCurrentGame('hub')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
              >
                ← Back to Arcade Hub
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          {currentGame === 'hub' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Game 1: Meteor Defense */}
              <div className="group relative flex flex-col justify-between p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/50 transition-all hover:shadow-xl hover:shadow-amber-500/10">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Rocket className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-amber-400 font-bold flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5" /> Best: {highScores.meteors} pts
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                    Meteor Defense
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Words fall from outer space! Type words to fire laser cannons and destroy meteors before they hit base shields.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentGame('meteors')}
                  className="mt-6 w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" /> Launch Defense
                </button>
              </div>

              {/* Game 2: Nitro Racer */}
              <div className="group relative flex flex-col justify-between p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-sky-500/50 transition-all hover:shadow-xl hover:shadow-sky-500/10">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      <Flame className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-sky-400 font-bold flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5" /> Best: {highScores.racer} WPM
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-sky-400 transition-colors">
                    Nitro Track Racer
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Race head-to-head against AI drivers! Every correct keystroke powers your turbo engine and nitro boosts!
                  </p>
                </div>
                <button
                  onClick={() => setCurrentGame('racer')}
                  className="mt-6 w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" /> Start Race
                </button>
              </div>

              {/* Game 3: Balloon Burst */}
              <div className="group relative flex flex-col justify-between p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/50 transition-all hover:shadow-xl hover:shadow-emerald-500/10">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Target className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5" /> Best: {highScores.balloons} pts
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                    Balloon Burst
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Colorful balloons float upwards with letters and short words. Test your instant finger reflexes before they float away!
                  </p>
                </div>
                <button
                  onClick={() => setCurrentGame('balloons')}
                  className="mt-6 w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" /> Pop Balloons
                </button>
              </div>
            </div>
          )}

          {/* Active Mini Game Component */}
          {currentGame === 'meteors' && (
            <MeteorDefenseGame
              volume={settings.soundVolume}
              soundTheme={settings.soundTheme}
              onFinish={(score) => saveHighScore('meteors', score)}
            />
          )}

          {currentGame === 'racer' && (
            <NitroRacerGame
              volume={settings.soundVolume}
              soundTheme={settings.soundTheme}
              onFinish={(wpm) => saveHighScore('racer', wpm)}
            />
          )}

          {currentGame === 'balloons' && (
            <BalloonBurstGame
              volume={settings.soundVolume}
              soundTheme={settings.soundTheme}
              onFinish={(score) => saveHighScore('balloons', score)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   GAME 1: METEOR DEFENSE
   ========================================================================= */
type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface Meteor {
  id: number;
  word: string;
  x: number; // percentage 10 - 80%
  y: number; // percentage 0 - 90%
  speed: number;
}

const MeteorDefenseGame: React.FC<{
  volume: number;
  soundTheme: any;
  onFinish: (score: number) => void;
}> = ({ volume, soundTheme, onFinish }) => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(4);
  const [maxHealth, setMaxHealth] = useState(4);
  const [streak, setStreak] = useState(0);
  const [typedInput, setTypedInput] = useState('');
  const [meteors, setMeteors] = useState<Meteor[]>([]);
  const [laserEffect, setLaserEffect] = useState<{ x: number; id: number } | null>(null);
  const [damageFlash, setDamageFlash] = useState(false);

  const requestRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);
  const nextIdRef = useRef<number>(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const meteorsRef = useRef<Meteor[]>([]);

  const getDifficultySettings = (diff: DifficultyLevel) => {
    switch (diff) {
      case 'easy':
        return { maxLives: 4, spawnInterval: 2200, baseSpeed: 0.20, speedVar: 0.15 };
      case 'hard':
        return { maxLives: 3, spawnInterval: 950, baseSpeed: 0.55, speedVar: 0.35 };
      case 'medium':
      default:
        return { maxLives: 4, spawnInterval: 1500, baseSpeed: 0.35, speedVar: 0.25 };
    }
  };

  const startGame = () => {
    const settings = getDifficultySettings(difficulty);
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setHealth(settings.maxLives);
    setMaxHealth(settings.maxLives);
    setStreak(0);
    setTypedInput('');
    setMeteors([]);
    meteorsRef.current = [];
    nextIdRef.current = 1;
    lastSpawnRef.current = performance.now();
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const gameLoop = (time: number) => {
      const config = getDifficultySettings(difficulty);

      let currentMeteors = meteorsRef.current;

      // Spawn meteors
      if (time - lastSpawnRef.current > config.spawnInterval) {
        lastSpawnRef.current = time;
        const randomWord = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];
        const newMeteor: Meteor = {
          id: nextIdRef.current++,
          word: randomWord,
          x: 10 + Math.random() * 75,
          y: 0,
          speed: config.baseSpeed + Math.random() * config.speedVar,
        };
        currentMeteors = [...currentMeteors, newMeteor];
      }

      // Update meteors positions
      const next: Meteor[] = [];
      let hitCount = 0;

      for (const m of currentMeteors) {
        const newY = m.y + m.speed;
        if (newY >= 82) {
          hitCount++;
        } else {
          next.push({ ...m, y: newY });
        }
      }

      meteorsRef.current = next;
      setMeteors(next);

      if (hitCount > 0) {
        soundEngine.playGameExplosion(volume);
        setDamageFlash(true);
        setTimeout(() => setDamageFlash(false), 300);

        setHealth((h) => {
          const nextH = Math.max(0, h - hitCount);
          if (nextH <= 0) {
            setGameOver(true);
            setIsPlaying(false);
          }
          return nextH;
        });
        setStreak(0);
      }

      requestRef.current = requestAnimationFrame(gameLoop);
    };

    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, gameOver, volume, difficulty]);

  useEffect(() => {
    if (gameOver) {
      onFinish(score);
    }
  }, [gameOver, score]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    // Strict typing check: check if current typedInput is already invalid (not a prefix of any meteor)
    const cleanTyped = typedInput.trim().toLowerCase();
    const isCurrentPrefix = meteorsRef.current.some((m) =>
      m.word.toLowerCase().startsWith(cleanTyped)
    );

    if (cleanTyped.length > 0 && !isCurrentPrefix && val.length > typedInput.length) {
      soundEngine.playKeySound(soundTheme, volume, false, true);
      return;
    }

    setTypedInput(val);
    const cleanVal = val.trim().toLowerCase();

    // Check if typed input matches any meteor
    const match = meteorsRef.current.find((m) => m.word.toLowerCase() === cleanVal);
    if (match) {
      soundEngine.playGameLaser(volume);
      soundEngine.playGameExplosion(volume * 0.7);

      setLaserEffect({ x: match.x, id: Date.now() });
      setTimeout(() => setLaserEffect(null), 200);

      const next = meteorsRef.current.filter((m) => m.id !== match.id);
      meteorsRef.current = next;
      setMeteors(next);
      setScore((s) => s + match.word.length * 10 + streak * 5);
      setStreak((st) => st + 1);
      setTypedInput('');
    } else {
      soundEngine.playKeySound(soundTheme, volume);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full h-[460px] rounded-2xl bg-slate-950 border border-slate-800 p-4 relative overflow-hidden select-none font-mono">
      {/* Top Bar Stats & Difficulty */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 rounded-xl border border-slate-800 z-10 flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1 rounded-xl border border-slate-800">
            <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider">Shields:</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: maxHealth }).map((_, i) => (
                <span
                  key={i}
                  className={`text-base transition-all duration-300 ${
                    i < health
                      ? 'scale-100 opacity-100 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                      : 'scale-75 opacity-25 grayscale'
                  }`}
                >
                  ❤️
                </span>
              ))}
            </div>
          </div>

          <div className="text-xs text-amber-400 font-bold">
            Score: <span className="text-white font-mono text-sm">{score}</span>
          </div>
        </div>

        {/* Difficulty Controls */}
        <div className="flex items-center gap-2">
          {!isPlaying && (
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-semibold">
              <button
                onClick={() => setDifficulty('easy')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Easy
              </button>
              <button
                onClick={() => setDifficulty('medium')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Medium
              </button>
              <button
                onClick={() => setDifficulty('hard')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  difficulty === 'hard' ? 'bg-red-500/20 text-red-400 border border-red-500/40 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Hard
              </button>
            </div>
          )}

          <div className="text-xs text-sky-400 font-bold">
            Streak: <span className="text-white">{streak}x</span>
          </div>
        </div>
      </div>

      {/* Main Sky Area */}
      <div className={`relative flex-1 rounded-xl bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/40 border transition-colors overflow-hidden ${
        damageFlash ? 'border-red-500 ring-2 ring-red-500/50 bg-red-950/30' : 'border-slate-800/60'
      }`}>
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-950/85 z-20 text-center">
            <Rocket className="w-12 h-12 text-amber-400 mb-2 animate-bounce" />
            <h3 className="text-xl font-bold text-white mb-1">Meteor Defense</h3>
            <p className="text-xs text-slate-400 max-w-md mb-4">
              Words are dropping from deep space! Type each word accurately to fire your laser defense grid before meteors hit base shield.
            </p>

            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs text-slate-400 font-semibold">Select Speed Mode:</span>
              <div className="flex gap-1.5">
                {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold uppercase transition-all ${
                      difficulty === d
                        ? d === 'easy' ? 'bg-emerald-500 text-slate-950' : d === 'medium' ? 'bg-amber-500 text-slate-950' : 'bg-red-500 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startGame}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-red-600 text-slate-950 font-bold text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:scale-105 transition-transform cursor-pointer"
            >
              Start Game ({difficulty.toUpperCase()})
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-950/90 z-20 text-center">
            <Shield className="w-12 h-12 text-red-500 mb-2 animate-pulse" />
            <h3 className="text-2xl font-bold text-white mb-1">Base Shields Destroyed!</h3>
            <p className="text-sm text-amber-400 font-bold mb-4">Final Score: {score} PTS ({difficulty.toUpperCase()})</p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
          </div>
        )}

        {/* Falling Meteors */}
        {meteors.map((m) => {
          const isTargeted = m.word.toLowerCase().startsWith(typedInput.trim().toLowerCase()) && typedInput.trim().length > 0;
          return (
            <div
              key={m.id}
              style={{ left: `${m.x}%`, top: `${m.y}%` }}
              className="absolute transform -translate-x-1/2 flex flex-col items-center pointer-events-none"
            >
              {/* Flame / Trail above the meteor */}
              <div className="w-1.5 h-4 bg-gradient-to-t from-amber-500 via-orange-500 to-transparent rounded-full animate-pulse opacity-90 -mb-1" />
              <div
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-mono shadow-lg transition-transform ${
                  isTargeted
                    ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-400 scale-110'
                    : 'bg-slate-900/90 text-slate-100 border-amber-500/40 shadow-amber-500/10'
                }`}
              >
                {m.word}
              </div>
            </div>
          );
        })}

        {/* Laser Effect Beam */}
        {laserEffect && (
          <div
            style={{ left: `${laserEffect.x}%` }}
            className="absolute bottom-0 top-0 w-1 bg-gradient-to-t from-sky-400 via-amber-300 to-white animate-pulse transform -translate-x-1/2 shadow-[0_0_15px_#38bdf8]"
          />
        )}

        {/* Base Laser Turret Cannon Line */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-amber-500 to-sky-500 border-t border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.5)]" />
      </div>

      {/* Type Box */}
      <div className="relative z-10">
        <input
          ref={inputRef}
          type="text"
          value={typedInput}
          onChange={handleInputChange}
          disabled={!isPlaying || gameOver}
          placeholder={isPlaying ? "Type falling words here..." : "Select mode & Start Game!"}
          className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-center font-bold text-sm focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>
    </div>
  );
};

/* =========================================================================
   GAME 2: NITRO RACER
   ========================================================================= */
const NitroRacerGame: React.FC<{
  volume: number;
  soundTheme: any;
  onFinish: (wpm: number) => void;
}> = ({ volume, soundTheme, onFinish }) => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [sentence, setSentence] = useState('');
  const [typedInput, setTypedInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [playerWpm, setPlayerWpm] = useState(0);
  const [inputShake, setInputShake] = useState(false);

  // Bot positions (0 to 100%)
  const [bot1Pos, setBot1Pos] = useState(0);
  const [bot2Pos, setBot2Pos] = useState(0);
  const [bot3Pos, setBot3Pos] = useState(0);

  // Inactivity / 5s Idle Timeout State when all candidate AI bots reach 100%
  const lastUserTypeTimeRef = useRef<number>(Date.now());
  const [idleCountdown, setIdleCountdown] = useState<number | null>(null);
  const [idleEnded, setIdleEnded] = useState(false);

  const timerRef = useRef<any>(null);

  const getBotIncrements = (diff: DifficultyLevel) => {
    switch (diff) {
      case 'easy':
        return { b1: 0.35, b2: 0.55, b3: 0.75, b1Name: 'Rookie (25 WPM)', b2Name: 'Amateur (40 WPM)', b3Name: 'Pro (55 WPM)' };
      case 'hard':
        return { b1: 0.75, b2: 1.05, b3: 1.35, b1Name: 'Pro (55 WPM)', b2Name: 'Turbo (75 WPM)', b3Name: 'Nitro Legend (95 WPM)' };
      case 'medium':
      default:
        return { b1: 0.55, b2: 0.80, b3: 1.05, b1Name: 'Rookie (40 WPM)', b2Name: 'Pro (60 WPM)', b3Name: 'Turbo (75 WPM)' };
    }
  };

  const startRace = () => {
    const s = RACER_SENTENCES[Math.floor(Math.random() * RACER_SENTENCES.length)];
    setSentence(s);
    setTypedInput('');
    setIsPlaying(true);
    setGameOver(false);
    setIdleEnded(false);
    setIdleCountdown(null);
    setStartTime(Date.now());
    lastUserTypeTimeRef.current = Date.now();
    setPlayerWpm(0);
    setBot1Pos(0);
    setBot2Pos(0);
    setBot3Pos(0);
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const incs = getBotIncrements(difficulty);

    timerRef.current = setInterval(() => {
      let b1 = 0, b2 = 0, b3 = 0;
      setBot1Pos((p) => { b1 = Math.min(100, p + incs.b1); return b1; });
      setBot2Pos((p) => { b2 = Math.min(100, p + incs.b2); return b2; });
      setBot3Pos((p) => { b3 = Math.min(100, p + incs.b3); return b3; });

      // Check if ALL AI candidates reached 100%
      if (b1 >= 100 && b2 >= 100 && b3 >= 100) {
        const elapsedSinceType = Date.now() - lastUserTypeTimeRef.current;
        if (elapsedSinceType >= 5000) {
          // All candidate bots finished & user idle for 5s -> End Game
          setIsPlaying(false);
          setGameOver(true);
          setIdleEnded(true);
          soundEngine.playCompletionChime(volume);
          onFinish(playerWpm);
        } else {
          const secLeft = Math.max(1, Math.ceil((5000 - elapsedSinceType) / 1000));
          setIdleCountdown(secLeft);
        }
      } else {
        setIdleCountdown(null);
      }
    }, 200);

    return () => clearInterval(timerRef.current);
  }, [isPlaying, gameOver, difficulty, playerWpm, volume, onFinish]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    lastUserTypeTimeRef.current = Date.now();
    setIdleCountdown(null);

    // Rule 1: Check if current typedInput ALREADY contains a mistake
    let firstErrorIndex = -1;
    for (let i = 0; i < typedInput.length; i++) {
      if (typedInput[i] !== sentence[i]) {
        firstErrorIndex = i;
        break;
      }
    }

    // If there is ALREADY a mistake in typedInput AND user tries to type MORE characters
    if (firstErrorIndex !== -1 && val.length > typedInput.length) {
      soundEngine.playKeySound(soundTheme, volume, false, true);
      setInputShake(true);
      setTimeout(() => setInputShake(false), 300);
      return; // Block typing further characters until mistake is corrected with backspace!
    }

    setTypedInput(val);
    soundEngine.playKeySound(soundTheme, volume);

    if (startTime) {
      const timeSec = (Date.now() - startTime) / 1000 / 60;
      const words = val.length / 5;
      const currentWpm = Math.round(words / timeSec) || 0;
      setPlayerWpm(currentWpm);
    }

    if (val === sentence) {
      soundEngine.playCompletionChime(volume);
      setIsPlaying(false);
      setGameOver(true);
      setIdleEnded(false);
      const finalWpm = playerWpm;
      onFinish(finalWpm);
    }
  };

  const playerPos = Math.min(100, Math.round((typedInput.length / sentence.length) * 100)) || 0;
  const botInfo = getBotIncrements(difficulty);

  return (
    <div className="flex flex-col gap-4 w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono">
      {!isPlaying && !gameOver && (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Flame className="w-12 h-12 text-sky-400 mb-2 animate-bounce" />
          <h3 className="text-xl font-bold text-white mb-1">Nitro Track Race</h3>
          <p className="text-xs text-slate-400 max-w-md mb-4">
            Type the passage as quickly and accurately as possible to beat 3 AI racers in a 100m drag race!
          </p>

          {/* Difficulty Selector */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs text-slate-400 font-semibold">Race Difficulty:</span>
            <div className="flex gap-1.5">
              {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold uppercase transition-all ${
                    difficulty === d
                      ? d === 'easy' ? 'bg-emerald-500 text-slate-950' : d === 'medium' ? 'bg-amber-500 text-slate-950' : 'bg-red-500 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startRace}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-slate-950 font-bold text-sm uppercase tracking-wider shadow-lg shadow-sky-500/20 hover:scale-105 transition-transform cursor-pointer"
          >
            Start Engine ({difficulty.toUpperCase()})
          </button>
        </div>
      )}

      {(isPlaying || gameOver) && (
        <>
          {/* Race Track Canvas */}
          <div className="flex flex-col gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            {/* Lane 1: Player */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs font-bold text-sky-400">
                <span>🏎️ YOU (Player)</span>
                <span>{playerWpm} WPM</span>
              </div>
              <div className="relative h-6 bg-slate-950 rounded-lg border border-sky-500/30 overflow-hidden">
                <div
                  style={{ left: `${playerPos}%` }}
                  className="absolute top-0 bottom-0 w-8 bg-sky-500 rounded flex items-center justify-center text-xs transform -translate-x-full transition-all duration-150 shadow-[0_0_10px_#38bdf8]"
                >
                  🚀
                </div>
              </div>
            </div>

            {/* Lane 2: Turbo AI */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>🏎️ {botInfo.b3Name}</span>
                <span>{Math.round(bot3Pos)}%</span>
              </div>
              <div className="relative h-4 bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
                <div
                  style={{ left: `${bot3Pos}%` }}
                  className="absolute top-0 bottom-0 w-6 bg-red-500 rounded flex items-center justify-center text-[10px] transform -translate-x-full"
                >
                  🏎️
                </div>
              </div>
            </div>

            {/* Lane 3: Pro AI */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>🏎️ {botInfo.b2Name}</span>
                <span>{Math.round(bot2Pos)}%</span>
              </div>
              <div className="relative h-4 bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
                <div
                  style={{ left: `${bot2Pos}%` }}
                  className="absolute top-0 bottom-0 w-6 bg-amber-500 rounded flex items-center justify-center text-[10px] transform -translate-x-full"
                >
                  🏎️
                </div>
              </div>
            </div>

            {/* Lane 4: Easy AI */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>🏎️ {botInfo.b1Name}</span>
                <span>{Math.round(bot1Pos)}%</span>
              </div>
              <div className="relative h-4 bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
                <div
                  style={{ left: `${bot1Pos}%` }}
                  className="absolute top-0 bottom-0 w-6 bg-emerald-500 rounded flex items-center justify-center text-[10px] transform -translate-x-full"
                >
                  🏎️
                </div>
              </div>
            </div>
          </div>

          {/* Idle Timeout Warning Banner */}
          {idleCountdown !== null && isPlaying && (
            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold text-xs animate-pulse">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                All candidates finished 100%! Game will end due to 5s inactivity in:
              </span>
              <span className="text-sm font-mono font-black bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-lg shadow-md">
                {idleCountdown}s
              </span>
            </div>
          )}

          {/* Passage Area */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-sm leading-relaxed text-slate-300">
            {sentence.split('').map((char, i) => {
              let color = 'text-slate-400';
              if (i < typedInput.length) {
                color = typedInput[i] === char ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-red-400 bg-red-500/20';
              }
              return (
                <span key={i} className={color}>
                  {char}
                </span>
              );
            })}
          </div>

          {/* Input Box */}
          <input
            type="text"
            value={typedInput}
            onChange={handleInputChange}
            disabled={gameOver}
            autoFocus
            placeholder="Type passage above to race..."
            className={`w-full px-4 py-3 rounded-xl bg-slate-900 border text-white font-mono text-sm focus:outline-none transition-all ${
              inputShake ? 'border-red-500 ring-2 ring-red-500/50 bg-red-950/20' : 'border-slate-700 focus:border-sky-400'
            }`}
          />

          {gameOver && (
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 text-center flex flex-col items-center gap-2">
              <Flag className={`w-10 h-10 ${idleEnded ? 'text-amber-400' : 'text-emerald-400'} animate-bounce`} />
              <h4 className="text-lg font-bold text-white">
                {idleEnded ? 'Race Completed (Inactivity Timeout)' : 'Race Finished!'}
              </h4>
              <p className={`text-xs font-bold ${idleEnded ? 'text-amber-300' : 'text-emerald-300'}`}>
                {idleEnded
                  ? 'All AI candidates reached 100% and 5 seconds of idle pause elapsed.'
                  : `Your Speed: ${playerWpm} WPM (${difficulty.toUpperCase()})`}
              </p>
              <button
                onClick={startRace}
                className="mt-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-slate-950 font-bold text-xs uppercase tracking-wider cursor-pointer hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-sky-500/20"
              >
                <RotateCcw className="w-4 h-4" /> Restart Race
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

/* =========================================================================
   GAME 3: BALLOON BURST
   ========================================================================= */
interface Balloon {
  id: number;
  word: string;
  x: number; // 10 to 80%
  y: number; // 100 to 0%
  speed: number;
  color: string;
}

const BALLOON_COLORS = ['bg-red-500', 'bg-sky-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500'];

const BalloonBurstGame: React.FC<{
  volume: number;
  soundTheme: any;
  onFinish: (score: number) => void;
}> = ({ volume, soundTheme, onFinish }) => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [typedInput, setTypedInput] = useState('');

  const requestRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);
  const nextIdRef = useRef<number>(1);
  const inputRef = useRef<HTMLInputElement>(null);

  const balloonsRef = useRef<Balloon[]>([]);

  const getBalloonSettings = (diff: DifficultyLevel) => {
    switch (diff) {
      case 'easy':
        return { time: 60, interval: 1600, baseSpeed: 0.22, speedVar: 0.18 };
      case 'hard':
        return { time: 30, interval: 700, baseSpeed: 0.60, speedVar: 0.35 };
      case 'medium':
      default:
        return { time: 45, interval: 1100, baseSpeed: 0.38, speedVar: 0.25 };
    }
  };

  const startGame = () => {
    const config = getBalloonSettings(difficulty);
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setTimeLeft(config.time);
    setBalloons([]);
    setTypedInput('');
    nextIdRef.current = 1;
    lastSpawnRef.current = performance.now();
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setIsPlaying(false);
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, gameOver]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const gameLoop = (time: number) => {
      const config = getBalloonSettings(difficulty);

      if (time - lastSpawnRef.current > config.interval) {
        lastSpawnRef.current = time;
        const randomWord = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)].slice(0, 4);
        const newB: Balloon = {
          id: nextIdRef.current++,
          word: randomWord,
          x: 10 + Math.random() * 75,
          y: 100,
          speed: config.baseSpeed + Math.random() * config.speedVar,
          color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
        };
        const next = [...balloonsRef.current, newB];
        balloonsRef.current = next;
        setBalloons(next);
      }

      const updated = balloonsRef.current
        .map((b) => ({ ...b, y: b.y - b.speed }))
        .filter((b) => b.y > -10);
      balloonsRef.current = updated;
      setBalloons(updated);

      requestRef.current = requestAnimationFrame(gameLoop);
    };

    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, gameOver, difficulty]);

  useEffect(() => {
    if (gameOver) {
      onFinish(score);
    }
  }, [gameOver, score]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    // Strict typing check: check if current typedInput is already invalid (not a prefix of any balloon)
    const cleanTyped = typedInput.trim().toLowerCase();
    const isCurrentPrefix = balloonsRef.current.some((b) =>
      b.word.toLowerCase().startsWith(cleanTyped)
    );

    if (cleanTyped.length > 0 && !isCurrentPrefix && val.length > typedInput.length) {
      soundEngine.playKeySound(soundTheme, volume, false, true);
      return;
    }

    setTypedInput(val);
    const cleanVal = val.trim().toLowerCase();

    const match = balloonsRef.current.find((b) => b.word.toLowerCase() === cleanVal);
    if (match) {
      soundEngine.playGamePowerup(volume);
      const next = balloonsRef.current.filter((b) => b.id !== match.id);
      balloonsRef.current = next;
      setBalloons(next);
      setScore((s) => s + 10);
      setTypedInput('');
    } else {
      soundEngine.playKeySound(soundTheme, volume);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full h-[450px] rounded-2xl bg-slate-950 border border-slate-800 p-4 relative overflow-hidden select-none font-mono">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 rounded-xl border border-slate-800 z-10 flex-wrap gap-2">
        <div className="text-xs text-emerald-400 font-bold">
          Score: <span className="text-white text-sm">{score}</span>
        </div>

        {/* Difficulty Controls */}
        {!isPlaying && (
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-semibold">
            <button
              onClick={() => setDifficulty('easy')}
              className={`px-2 py-0.5 rounded-lg transition-colors ${
                difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Easy
            </button>
            <button
              onClick={() => setDifficulty('medium')}
              className={`px-2 py-0.5 rounded-lg transition-colors ${
                difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => setDifficulty('hard')}
              className={`px-2 py-0.5 rounded-lg transition-colors ${
                difficulty === 'hard' ? 'bg-red-500/20 text-red-400 border border-red-500/40 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hard
            </button>
          </div>
        )}

        <div className="text-xs text-amber-400 font-bold">
          Time: <span className="text-white text-sm">{timeLeft}s</span>
        </div>
      </div>

      <div className="relative flex-1 rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-950/80 z-20 text-center">
            <Target className="w-12 h-12 text-emerald-400 mb-2 animate-bounce" />
            <h3 className="text-xl font-bold text-white mb-1">Balloon Burst</h3>
            <p className="text-xs text-slate-400 max-w-md mb-4">
              Pop as many rising balloons as possible by typing their letters before time runs out!
            </p>

            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs text-slate-400 font-semibold">Speed Mode:</span>
              <div className="flex gap-1.5">
                {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold uppercase transition-all ${
                      difficulty === d
                        ? d === 'easy' ? 'bg-emerald-500 text-slate-950' : d === 'medium' ? 'bg-amber-500 text-slate-950' : 'bg-red-500 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startGame}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform cursor-pointer"
            >
              Start Popping ({difficulty.toUpperCase()})
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-950/90 z-20 text-center">
            <Trophy className="w-12 h-12 text-amber-400 mb-2 animate-bounce" />
            <h3 className="text-2xl font-bold text-white mb-1">Time's Up!</h3>
            <p className="text-sm text-emerald-400 font-bold mb-4">Total Score: {score} PTS ({difficulty.toUpperCase()})</p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Play Again
            </button>
          </div>
        )}

        {balloons.map((b) => (
          <div
            key={b.id}
            style={{ left: `${b.x}%`, top: `${b.y}%` }}
            className={`absolute transform -translate-x-1/2 w-14 h-18 rounded-full ${b.color} text-slate-950 font-bold flex items-center justify-center text-xs shadow-lg border-2 border-white/20`}
          >
            {b.word}
          </div>
        ))}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={typedInput}
        onChange={handleInputChange}
        disabled={!isPlaying || gameOver}
        placeholder={isPlaying ? "Type balloon letters..." : "Select mode & Start Game"}
        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-center font-bold text-sm focus:outline-none focus:border-emerald-400 transition-colors"
      />
    </div>
  );
};
