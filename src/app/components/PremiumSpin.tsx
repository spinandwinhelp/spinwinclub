import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, X, ChevronDown, Coins } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

// ─── Prize definitions ──────────────────────────────────────────────────────
const PRIZES = [
  {
    index: 0, label: '10 Pts', sublabel: 'Points', icon: '🪙',
    color: '#4338CA', glow: 'rgba(99,102,241,0.4)',
    probability: 0.474899, rarity: 'Common',
    rarityColor: '#6B7280', points: 10,
  },
  {
    index: 1, label: '100 Pts', sublabel: 'Points', icon: '💎',
    color: '#1D4ED8', glow: 'rgba(59,130,246,0.4)',
    probability: 0.30, rarity: 'Uncommon',
    rarityColor: '#3B82F6', points: 100,
  },
  {
    index: 2, label: '500 Pts', sublabel: 'Points', icon: '⭐',
    color: '#BE185D', glow: 'rgba(236,72,153,0.4)',
    probability: 0.15, rarity: 'Rare',
    rarityColor: '#EC4899', points: 500,
  },
  {
    index: 3, label: '$5 Gift', sublabel: 'Gift Card', icon: '💰',
    color: '#C2410C', glow: 'rgba(249,115,22,0.4)',
    probability: 0.05, rarity: 'Rare',
    rarityColor: '#F97316', points: 0,
  },
  {
    index: 4, label: '$10 Gift', sublabel: 'Gift Card', icon: '🎁',
    color: '#047857', glow: 'rgba(16,185,129,0.4)',
    probability: 0.02, rarity: 'Epic',
    rarityColor: '#10B981', points: 0,
  },
  {
    index: 5, label: '$50 Gift', sublabel: 'Gift Card', icon: '💳',
    color: '#B45309', glow: 'rgba(245,158,11,0.4)',
    probability: 0.005, rarity: 'Legendary',
    rarityColor: '#F59E0B', points: 0,
  },
  {
    index: 6, label: 'AirPods', sublabel: 'Grand Prize', icon: '🎧',
    color: '#0E7490', glow: 'rgba(6,182,212,0.4)',
    probability: 0.0001, rarity: 'Mythic',
    rarityColor: '#06B6D4', points: 0,
  },
  {
    index: 7, label: 'iPhone', sublabel: 'Ultra Prize', icon: '📱',
    color: '#6D28D9', glow: 'rgba(139,92,246,0.5)',
    probability: 0.0000001, rarity: 'Mythic+',
    rarityColor: '#8B5CF6', points: 0,
  },
];

// ─── SVG Wheel helpers ───────────────────────────────────────────────────────
function polarToCart(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function segPath(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polarToCart(cx, cy, r, start);
  const e = polarToCart(cx, cy, r, end);
  const large = end - start > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`;
}

// ─── Weighted random ─────────────────────────────────────────────────────────
function weightedRandom() {
  const total = PRIZES.reduce((s, p) => s + p.probability, 0);
  let rand = Math.random() * total;
  for (const prize of PRIZES) {
    rand -= prize.probability;
    if (rand <= 0) return prize;
  }
  return PRIZES[PRIZES.length - 1];
}

const CX = 200, CY = 200, R = 180, R_TEXT = 120;
const SEG_COUNT = PRIZES.length;
const SEG_DEG = 360 / SEG_COUNT; // 45

// ─── Component ───────────────────────────────────────────────────────────────
export function PremiumSpin() {
  const { points, deductPoints, addPoints, addWin, incrementSpins } = useApp();
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<(typeof PRIZES)[0] | null>(null);
  const [showOdds, setShowOdds] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const rotRef = useRef(0);
  const COST = 500;

  const handleSpin = () => {
    if (spinning) return;
    if (!deductPoints(COST)) {
      toast.error(`Not enough points! You need ${COST} pts`, { duration: 2500 });
      return;
    }
    const prize = weightedRandom();
    setSpinning(true);
    setResult(null);

    const delta = 360 * 5 + (360 - (prize.index * SEG_DEG + SEG_DEG / 2));
    const newRot = rotRef.current + delta;
    rotRef.current = newRot;
    setRotation(newRot);

    setTimeout(() => {
      setSpinning(false);
      setResult(prize);
      if (prize.points > 0) {
        addPoints(prize.points);
        addWin({ label: prize.label, icon: prize.icon, type: 'spin' });
      }
      incrementSpins();
    }, 4500);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="px-4 pt-6 space-y-4">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <div className="w-16 h-3 rounded animate-pulse" style={{ background: 'var(--bg-surface-elevated)' }} />
            <div className="w-32 h-6 rounded animate-pulse" style={{ background: 'var(--bg-surface-elevated)' }} />
          </div>
          <div className="w-24 h-10 rounded-2xl animate-pulse" style={{ background: 'var(--bg-surface-elevated)' }} />
        </div>
        <div className="flex flex-col items-center justify-center mt-12 space-y-8">
          <div className="w-[300px] h-[300px] rounded-full animate-pulse" style={{ background: 'var(--bg-surface)', border: '4px solid var(--border-color)' }} />
          <div className="w-48 h-14 rounded-2xl animate-pulse" style={{ background: 'var(--bg-surface-elevated)' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 space-y-4 relative z-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Premium</p>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>Spin Wheel</h1>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-1.5 rounded-2xl px-3 py-2 border"
            style={{ background: 'var(--bg-surface-elevated)', borderColor: 'var(--border-highlight)' }}
          >
            <Coins size={14} style={{ color: '#FFD700' }} />
            <span className="text-sm font-numbers" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{points.toLocaleString()}</span>
          </div>
          <motion.button
            className="w-9 h-9 rounded-2xl flex items-center justify-center border"
            style={{ background: 'var(--bg-surface-elevated)', borderColor: 'var(--border-highlight)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowOdds((v: boolean) => !v)}
          >
            <Info size={16} style={{ color: 'var(--text-muted)' }} />
          </motion.button>
        </div>
      </div>

      {/* Odds panel */}
      <AnimatePresence>
        {showOdds && (
          <motion.div
            className="rounded-2xl p-4 overflow-hidden border"
            style={{
              background: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-highlight)',
            }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Prize Probabilities</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>As required by law</span>
            </div>
            <div className="space-y-2">
              {PRIZES.map(p => (
                <div key={p.index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{p.icon}</span>
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{p.label}</span>
                    <span
                      className="text-xs rounded px-1"
                      style={{ color: p.rarityColor, background: `${p.rarityColor}15` }}
                    >
                      {p.rarity}
                    </span>
                  </div>
                  <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                    {(p.probability * 100).toFixed(p.probability < 0.001 ? 7 : p.probability < 0.01 ? 4 : p.probability < 1 ? 2 : 1)}%
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs mt-3" style={{ color: 'var(--text-secondary)' }}>
              All prizes are real and legally obtainable. Odds displayed per spin.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wheel container */}
      <div className="relative flex flex-col items-center">
        {/* Glow ring */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)',
            opacity: 0.08,
            filter: 'blur(20px)',
          }}
        />

        {/* Pointer */}
        <div className="relative z-20 mb-[-8px]">
          <div
            className="w-0 h-0"
            style={{
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderTop: '20px solid #FFD700',
              filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.8))',
            }}
          />
        </div>

        {/* SVG Wheel */}
        <div className="relative">
          <motion.svg
            width="340"
            height="340"
            viewBox="0 0 400 400"
            animate={{ rotate: rotation }}
            transition={{ duration: 4.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'center' }}
          >
            <defs>
              {PRIZES.map(p => (
                <radialGradient key={p.index} id={`grad-${p.index}`} cx="30%" cy="30%">
                  <stop offset="0%" stopColor={p.color} stopOpacity="1" />
                  <stop offset="100%" stopColor={p.color} stopOpacity="0.8" />
                </radialGradient>
              ))}
            </defs>

            {/* Segments */}
            {PRIZES.map((p, i) => {
              const start = i * SEG_DEG;
              const end = (i + 1) * SEG_DEG;
              const mid = start + SEG_DEG / 2;
              const tc = polarToCart(CX, CY, R_TEXT, mid);

              return (
                <g key={i}>
                  <path
                    d={segPath(CX, CY, R, start, end)}
                    fill={`url(#grad-${i})`}
                  />
                  {/* Segment border */}
                  <path
                    d={segPath(CX, CY, R, start, end)}
                    fill="none"
                    stroke="var(--border-color)"
                    strokeWidth="1.5"
                  />
                  <text
                    x={tc.x}
                    y={tc.y - 8}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="22"
                    transform={`rotate(${mid}, ${tc.x}, ${tc.y})`}
                  >
                    {p.icon}
                  </text>
                  <text
                    x={tc.x}
                    y={tc.y + 14}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="9"
                    fill="#FFFFFF"
                    fontWeight="700"
                    transform={`rotate(${mid}, ${tc.x}, ${tc.y})`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {p.label}
                  </text>
                </g>
              );
            })}

            {/* Outer decorative ring */}
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--border-color)" strokeWidth="3" />
            <circle cx={CX} cy={CY} r={R - 4} fill="none" stroke="var(--bg-surface-elevated)" strokeWidth="1" />

            {/* Center hub */}
            <circle cx={CX} cy={CY} r={36} fill="var(--bg-main)" stroke="#FFD700" strokeWidth="2" />
            <circle cx={CX} cy={CY} r={28} fill="rgba(255, 215, 0, 0.15)" stroke="rgba(255, 215, 0, 0.3)" strokeWidth="1" />
            <text x={CX} y={CY - 5} textAnchor="middle" fontSize="11" fill="#FFD700" fontWeight="700" className="font-numbers">500</text>
            <text x={CX} y={CY + 9} textAnchor="middle" fontSize="8" fill="#FFD700" opacity="0.8" className="font-numbers uppercase font-bold tracking-widest">pts</text>
          </motion.svg>

          {/* Glow effect when spinning */}
          {spinning && (
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(255, 215, 0, 0.15) 0%, transparent 60%)' }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}
        </div>

        {/* Spin Button */}
        <motion.button
          className="magnetic-button premium-glow mt-6 rounded-2xl px-12 py-4 relative overflow-hidden"
          style={{
            background: spinning
              ? 'var(--bg-surface-elevated)'
              : 'linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, var(--bg-surface) 100%)',
            border: spinning ? '1px solid var(--border-color)' : '1px solid rgba(255, 215, 0, 0.4)',
            opacity: spinning ? 0.5 : 1,
            boxShadow: 'var(--shadow-elevated)',
          }}
          onClick={handleSpin}
          disabled={spinning}
        >
          {!spinning && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
          )}
          <span className="text-[#FFD700] relative z-10 uppercase tracking-widest" style={{ fontWeight: 800, fontSize: 13 }}>
            {spinning ? 'PROCESSING...' : `INITIATE SPIN — ${COST} PTS`}
          </span>
        </motion.button>

        <p className="text-xs mt-3 text-center" style={{ color: 'var(--text-muted)' }}>
          Tap to spin • Real prizes with transparent odds
        </p>
      </div>

      {/* Result Modal */}
      <AnimatePresence>
        {result && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setResult(null)}
            />
            <motion.div
              className="relative rounded-3xl overflow-hidden w-full max-w-sm"
              style={{
                background: 'var(--bg-surface)',
                border: `1px solid ${result.glow.replace('0.4', '0.3')}`,
                boxShadow: `0 0 60px ${result.glow}, 0 0 120px ${result.glow.replace('0.4', '0.1')}`,
              }}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 18, stiffness: 250 }}
            >
              <button
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center z-10 border"
                style={{ background: 'var(--bg-surface-elevated)', borderColor: 'var(--border-color)' }}
                onClick={() => setResult(null)}
              >
                <X size={14} style={{ color: 'var(--text-muted)' }} />
              </button>

              <div className="p-8 text-center">
                {/* Burst effect */}
                <div className="relative mb-4">
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <div
                      className="w-24 h-24 rounded-full"
                      style={{ background: `radial-gradient(circle, ${result.glow}, transparent)` }}
                    />
                  </motion.div>
                  <motion.div
                    className="text-7xl relative z-10"
                    animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.8, repeat: 2 }}
                  >
                    {result.icon}
                  </motion.div>
                </div>

                <div
                  className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1 mb-3 border"
                  style={{ background: `${result.rarityColor}10`, borderColor: `${result.rarityColor}30` }}
                >
                  <span style={{ color: result.rarityColor, fontSize: 11, fontWeight: 700 }}>✦ {result.rarity}</span>
                </div>

                <h2 className="mb-1" style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)' }}>{result.label}</h2>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{result.sublabel}</p>

                {result.points > 0 ? (
                  <div className="rounded-2xl p-4 mb-4 border" style={{ background: 'rgba(139,92,246,0.05)', borderColor: 'rgba(139,92,246,0.15)' }}>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Points added to your balance</p>
                    <p style={{ color: '#A78BFA', fontSize: 24, fontWeight: 800 }}>+{result.points} pts</p>
                  </div>
                ) : (
                  <div className="rounded-2xl p-4 mb-4 border" style={{ background: 'rgba(245,158,11,0.05)', borderColor: 'rgba(245,158,11,0.15)' }}>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Prize won! Claim in the store</p>
                    <p style={{ color: '#F59E0B', fontSize: 16, fontWeight: 700 }}>Subject to 48h verification</p>
                  </div>
                )}

                <motion.button
                  className="w-full rounded-2xl py-4"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-secondary), var(--color-primary))',
                    boxShadow: 'var(--shadow-glow)',
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setResult(null)}
                >
                  <span className="text-white" style={{ fontWeight: 700 }}>Spin Again</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
