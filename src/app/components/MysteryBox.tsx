import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Coins } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

// ─── Prize pool ──────────────────────────────────────────────────────────────
const MYSTERY_PRIZES = [
  { label: '10 Points', icon: '🪙', value: 10, probability: 0.45, type: 'points', color: 'var(--color-primary)', rarity: 'Common' },
  { label: '50 Points', icon: '💎', value: 50, probability: 0.25, type: 'points', color: 'var(--color-secondary)', rarity: 'Uncommon' },
  { label: '100 Points', icon: '⭐', value: 100, probability: 0.12, type: 'points', color: '#EC4899', rarity: 'Rare' },
  { label: '300 Points', icon: '🔥', value: 300, probability: 0.05, type: 'points', color: '#F97316', rarity: 'Epic' },
  { label: '$1 Gift Card', icon: '🎁', value: 1, probability: 0.07, type: 'gift', color: '#10B981', rarity: 'Rare' },
  { label: '$5 Gift Card', icon: '💳', value: 5, probability: 0.02, type: 'gift', color: '#FFD700', rarity: 'Legendary' },
  { label: 'Spin Ticket', icon: '🎰', value: 1, probability: 0.03, type: 'ticket', color: '#8B5CF6', rarity: 'Epic' },
  { label: 'Try Again', icon: '💫', value: 0, probability: 0.01, type: 'empty', color: '#6B7280', rarity: 'Common' },
];

function weightedRandom() {
  const total = MYSTERY_PRIZES.reduce((s, p) => s + p.probability, 0);
  let rand = Math.random() * total;
  for (const p of MYSTERY_PRIZES) {
    rand -= p.probability;
    if (rand <= 0) return p;
  }
  return MYSTERY_PRIZES[MYSTERY_PRIZES.length - 1];
}

const COST = 300;

type Prize = (typeof MYSTERY_PRIZES)[0];
type Phase = 'idle' | 'dealing' | 'ready' | 'flipping' | 'revealed';

// ─── Particle burst on reveal ────────────────────────────────────────────────
function ParticleBurst({ color }: { color: string }) {
  const particles = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * 360;
    const rad = (angle * Math.PI) / 180;
    const distance = 80 + Math.random() * 40;
    return {
      id: i,
      x: Math.cos(rad) * distance,
      y: Math.sin(rad) * distance,
      size: 3 + Math.random() * 4,
      delay: Math.random() * 0.15,
    };
  });

  const resolvedColor = color.startsWith('var(') ? '#00FFA3' : color;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            background: color,
            boxShadow: `0 0 8px ${resolvedColor}`,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.7, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

// ─── Card Front (holographic face-down) ──────────────────────────────────────
function CardFront() {
  return (
    <div
      className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-color)',
        boxShadow: '0 0 30px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.04)',
        backfaceVisibility: 'hidden',
      }}
    >
      {/* Holographic shimmer */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
        style={{ backfaceVisibility: 'hidden' }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(105deg, transparent 30%, rgba(255, 215, 0, 0.08) 45%, rgba(0, 255, 163, 0.06) 55%, transparent 70%)',
          }}
          animate={{ x: ['-120%', '120%'] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Center logo / icon */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="text-5xl drop-shadow-md">📦</div>
        <div
          className="text-xs font-bold tracking-[0.25em] uppercase"
          style={{ color: 'var(--text-secondary)' }}
        >
          TAP TO REVEAL
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t border-l rounded-tl-sm" style={{ borderColor: 'var(--border-highlight)' }} />
      <div className="absolute top-3 right-3 w-4 h-4 border-t border-r rounded-tr-sm" style={{ borderColor: 'var(--border-highlight)' }} />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l rounded-bl-sm" style={{ borderColor: 'var(--border-highlight)' }} />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r rounded-br-sm" style={{ borderColor: 'var(--border-highlight)' }} />
    </div>
  );
}

// ─── Card Back (prize reveal) ────────────────────────────────────────────────
function CardBack({ prize }: { prize: Prize }) {
  const isVar = prize.color.startsWith('var(');
  const colorStatic = isVar ? '#00FFA3' : prize.color;
  return (
    <div
      className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-2 overflow-hidden"
      style={{
        background: `var(--bg-surface)`,
        border: `1px solid var(--border-color)`,
        boxShadow: `0 0 40px ${colorStatic}20, inset 0 1px 0 rgba(255,255,255,0.04)`,
        backfaceVisibility: 'hidden',
        transform: 'rotateY(180deg)',
      }}
    >
      <div className="absolute inset-0 opacity-10" style={{ background: prize.color }} />
      {/* Prize icon */}
      <motion.div
        className="text-6xl relative z-10 drop-shadow-lg"
        animate={{ scale: [0.8, 1.1, 1], rotate: [0, -8, 8, 0] }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        {prize.icon}
      </motion.div>

      {/* Rarity badge */}
      <div
        className="rounded-xl px-3 py-1 relative z-10 border"
        style={{ background: 'var(--bg-surface-elevated)', borderColor: 'var(--border-highlight)' }}
      >
        <span style={{ color: prize.color, fontSize: 11, fontWeight: 700 }}>✦ {prize.rarity}</span>
      </div>

      {/* Label */}
      <div className="text-lg font-bold relative z-10" style={{ color: 'var(--text-primary)' }}>{prize.label}</div>

      {/* Sub-info */}
      {prize.type === 'points' && prize.value > 0 && (
        <div className="font-numbers relative z-10" style={{ color: prize.color, fontSize: 14, fontWeight: 700 }}>
          +{prize.value} pts
        </div>
      )}
      {prize.type === 'gift' && (
        <div className="text-xs relative z-10" style={{ color: 'var(--text-muted)' }}>Claim via email in 48h</div>
      )}
      {prize.type === 'empty' && (
        <div className="text-xs relative z-10" style={{ color: 'var(--text-muted)' }}>Better luck next time 💫</div>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export function MysteryBox() {
  const { points, deductPoints, addPoints, addWin } = useApp();
  const [prize, setPrize] = useState<Prize | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');

  // Award prize when revealed
  useEffect(() => {
    if (phase !== 'revealed' || !prize) return;
    if (prize.type === 'points' && prize.value > 0) {
      addPoints(prize.value);
      addWin({ label: prize.label, icon: prize.icon, type: 'mystery' });
      toast.success(`${prize.icon} You won ${prize.label}!`, { duration: 3000 });
    } else if (prize.type !== 'empty') {
      addWin({ label: prize.label, icon: prize.icon, type: 'mystery' });
      toast.success(`${prize.icon} ${prize.label} won!`, { duration: 3000 });
    }
  }, [phase]);

  const handleOpen = () => {
    if (!deductPoints(COST)) {
      toast.error(`Need ${COST} pts to open Mystery Box`, { duration: 2500 });
      return;
    }
    const p = weightedRandom();
    setPrize(p);
    setPhase('dealing');
    // Card slides in from bottom
    setTimeout(() => setPhase('ready'), 600);
  };

  const handleFlip = () => {
    if (phase !== 'ready') return;
    setPhase('flipping');
    setTimeout(() => setPhase('revealed'), 500);
  };

  const handleReset = () => {
    setPhase('idle');
    setPrize(null);
  };



  return (
    <div className="px-4 pt-6 space-y-5 relative z-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--color-secondary)' }}>Card Reveal</p>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>Mystery Box</h1>
        </div>
        <div
          className="flex items-center gap-1.5 rounded-2xl px-3 py-2 border"
          style={{ background: 'var(--bg-surface-elevated)', borderColor: 'var(--border-highlight)' }}
        >
          <Coins size={14} style={{ color: '#FFD700' }} />
          <span className="text-sm font-numbers" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{points.toLocaleString()}</span>
        </div>
      </div>

      {/* ── Main Card Arena ── */}
      <div
        className="rounded-3xl overflow-hidden relative"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-elevated)',
          minHeight: 380,
        }}
      >
        <div className="p-6 flex flex-col items-center justify-center" style={{ minHeight: 360 }}>

          {/* ── Idle Phase: Purchase prompt ── */}
          {phase === 'idle' && (
            <motion.div
              className="text-center space-y-5 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Floating box */}
              <motion.div
                className="text-8xl drop-shadow-xl"
                animate={{ y: [0, -10, 0], rotate: [0, -2, 2, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                📦
              </motion.div>

              <div>
                <h2 className="mb-1" style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>What&apos;s Inside?</h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Spend {COST} pts to reveal a card</p>
              </div>

              {/* Prize preview grid */}
              <div className="grid grid-cols-4 gap-2">
                {MYSTERY_PRIZES.slice(0, 8).map((p) => (
                  <div
                    key={p.label}
                    className="rounded-2xl p-2 text-center border overflow-hidden relative"
                    style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
                  >
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: p.color }} />
                    <div className="text-xl mb-1 relative z-10 drop-shadow-sm">{p.icon}</div>
                    <div className="relative z-10" style={{ fontSize: 8, fontWeight: 600, color: 'var(--text-muted)' }}>{p.label}</div>
                  </div>
                ))}
              </div>

              {/* Open button */}
              <motion.button
                className="magnetic-button premium-glow w-full rounded-2xl py-4 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, var(--bg-surface-elevated) 0%, var(--bg-surface) 100%)',
                  border: '1px solid var(--border-color)',
                }}
                onClick={handleOpen}
              >
                <span className="relative z-10 uppercase tracking-widest" style={{ fontWeight: 800, fontSize: 13, color: 'var(--color-primary)' }}>
                  DEAL CARD — {COST} PTS
                </span>
              </motion.button>

              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>40% chance to win real prizes</p>
            </motion.div>
          )}

          {/* ── Card dealing + ready + flip animation ── */}
          {prize && (phase === 'dealing' || phase === 'ready' || phase === 'flipping' || phase === 'revealed') && (
            <div className="relative flex flex-col items-center w-full">
              {/* Card container with perspective */}
              <div style={{ perspective: 1000 }} className="relative">
                <motion.div
                  className="relative cursor-pointer hover:scale-105 transition-transform"
                  style={{
                    width: 240,
                    height: 320,
                    transformStyle: 'preserve-3d',
                  }}
                  // Deal animation: slide up from below
                  initial={{ y: 300, opacity: 0, rotateY: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    rotateY: phase === 'flipping' || phase === 'revealed' ? 180 : 0,
                  }}
                  transition={
                    phase === 'dealing'
                      ? { type: 'spring', damping: 20, stiffness: 200, mass: 0.8 }
                      : phase === 'flipping' || phase === 'revealed'
                        ? { type: 'spring', damping: 22, stiffness: 280, duration: 0.4 }
                        : { duration: 0.1 }
                  }
                  onClick={handleFlip}
                >
                  {/* Front face */}
                  <CardFront />

                  {/* Back face (prize) */}
                  <CardBack prize={prize} />
                </motion.div>

                {/* Particle burst on reveal */}
                <AnimatePresence>
                  {phase === 'revealed' && <ParticleBurst color={prize.color} />}
                </AnimatePresence>

                {/* Ambient glow under card */}
                <motion.div
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-8 rounded-full pointer-events-none"
                  style={{
                    background: phase === 'revealed' ? `radial-gradient(ellipse, ${prize.color.startsWith('var(') ? '#00FFA3' : prize.color}40, transparent)` : 'radial-gradient(ellipse, rgba(0, 0, 0, 0.05), transparent)',
                  }}
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>

              {/* Instruction text */}
              {phase === 'ready' && (
                <motion.p
                  className="text-xs mt-6 tracking-widest uppercase font-bold"
                  style={{ color: 'var(--text-secondary)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ✦ Tap the card to flip ✦
                </motion.p>
              )}

              {/* Post-reveal action button */}
              {phase === 'revealed' && (
                <motion.div
                  className="mt-8 w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.button
                    className="magnetic-button w-full rounded-2xl py-4 flex items-center justify-center gap-2 border shadow-sm hover:shadow"
                    style={{
                      background: 'var(--bg-surface)',
                      borderColor: 'var(--border-color)',
                    }}
                    onClick={handleReset}
                  >
                    <RefreshCw size={14} style={{ color: 'var(--color-primary)' }} />
                    <span className="uppercase tracking-widest" style={{ fontWeight: 800, fontSize: 12, color: 'var(--text-primary)' }}>
                      DEAL AGAIN
                    </span>
                  </motion.button>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Prize odds table ── */}
      <div
        className="rounded-3xl p-5 border shadow-sm"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
      >
        <h3 className="text-sm mb-3" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Possible Prizes & Odds</h3>
        <div className="space-y-2">
          {MYSTERY_PRIZES.map((p) => (
            <div key={p.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>{p.icon}</span>
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{p.label}</span>
                <span
                  className="text-xs rounded px-1"
                  style={{ color: p.color, background: `${p.color.startsWith('var(') ? 'rgba(0,0,0,0.05)' : p.color + '12'}`, fontSize: 9 }}
                >
                  {p.rarity}
                </span>
              </div>
              <span className="text-xs font-numbers" style={{ color: 'var(--text-muted)' }}>{(p.probability * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
        <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>Odds are transparent and legally required</p>
      </div>
    </div>
  );
}
