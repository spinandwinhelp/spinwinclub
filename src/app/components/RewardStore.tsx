import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Clock, Coins, ChevronRight, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

const CATEGORIES = ['All', 'Gift Cards', 'Electronics', 'Digital', 'Raffle'];

const REWARDS = [
  {
    id: 1, name: 'iPhone 15 Raffle', description: 'Monthly draw — 1 winner', icon: '📱',
    cost: 2000, category: 'Raffle', color: 'var(--color-secondary)',
    badge: 'HOT', delivery: 'Monthly draw',
    detail: 'Each ticket enters you into the monthly iPhone draw. Winner announced every 1st of the month.',
  },
  {
    id: 2, name: 'AirPods Raffle', description: 'Weekly draw — 2 winners', icon: '🎧',
    cost: 1000, category: 'Raffle', color: '#06B6D4',
    badge: 'WEEKLY', delivery: 'Weekly draw',
    detail: 'Two AirPods winners are selected every Friday from raffle ticket holders.',
  },
  {
    id: 3, name: '$50 Amazon Gift Card', description: 'Digital delivery', icon: '🛒',
    cost: 50000, category: 'Gift Cards', color: '#F59E0B',
    badge: null, delivery: '48h delivery',
    detail: 'Delivered via email within 48 hours after identity verification.',
  },
  {
    id: 4, name: '$25 Amazon Gift Card', description: 'Digital delivery', icon: '🎁',
    cost: 25000, category: 'Gift Cards', color: '#10B981',
    badge: 'POPULAR', delivery: '48h delivery',
    detail: 'Delivered via email within 48 hours after identity verification.',
  },
  {
    id: 5, name: '$10 Amazon Gift Card', description: 'Digital delivery', icon: '💳',
    cost: 10000, category: 'Gift Cards', color: '#3B82F6',
    badge: null, delivery: '48h delivery',
    detail: 'Delivered via email within 48 hours after identity verification.',
  },
  {
    id: 6, name: '$5 Amazon Gift Card', description: 'Digital delivery', icon: '💰',
    cost: 5000, category: 'Gift Cards', color: '#EC4899',
    badge: null, delivery: '48h delivery',
    detail: 'Most popular redemption. Min. 5,000 points required.',
  },
  {
    id: 7, name: '$1 Amazon Gift Card', description: 'Min. redemption tier', icon: '🪙',
    cost: 1000, category: 'Gift Cards', color: '#6B7280',
    badge: null, delivery: '48h delivery',
    detail: 'Entry-level redemption. Great for saving up your rewards.',
  },
  {
    id: 8, name: 'Discord Nitro', description: '1 month subscription', icon: '💜',
    cost: 5000, category: 'Digital', color: '#5865F2',
    badge: null, delivery: '24h delivery',
    detail: 'Discord Nitro gift code, valid for 1 month.',
  },
  {
    id: 9, name: 'Minecraft Java Edition', description: 'PC game license', icon: '⛏️',
    cost: 15000, category: 'Digital', color: '#65A30D',
    badge: null, delivery: '48h delivery',
    detail: 'Official Minecraft Java Edition license key.',
  },
  {
    id: 10, name: 'Premium Badge', description: 'In-app exclusive', icon: '🏆',
    cost: 500, category: 'Digital', color: '#F59E0B',
    badge: 'NEW', delivery: 'Instant',
    detail: 'Exclusive profile badge that shows your premium status in the leaderboard.',
  },
  {
    id: 11, name: 'Streak Freeze', description: 'Protect your streak', icon: '🧊',
    cost: 300, category: 'Digital', color: '#06B6D4',
    badge: null, delivery: 'Instant',
    detail: 'Prevents your daily streak from resetting if you miss a day.',
  },
  {
    id: 12, name: '2× Point Boost', description: '24 hours active', icon: '⚡',
    cost: 800, category: 'Digital', color: '#EC4899',
    badge: null, delivery: 'Instant',
    detail: 'Double all points earned for the next 24 hours.',
  },
];

const MIN_CASHOUT = 5000;

export function RewardStore() {
  const { points, deductPoints } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selected, setSelected] = useState<(typeof REWARDS)[0] | null>(null);
  const [redeemed, setRedeemed] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const filtered = activeCategory === 'All' ? REWARDS : REWARDS.filter(r => r.category === activeCategory);

  const handleRedeem = (reward: typeof REWARDS[0]) => {
    if (!deductPoints(reward.cost)) {
      toast.error(`Not enough points! Need ${reward.cost.toLocaleString()} pts`, { duration: 2500 });
      setSelected(null);
      return;
    }
    setRedeemed((prev: number[]) => [...prev, reward.id]);
    setSelected(null);
    toast.success(`✅ ${reward.name} redeemed! Check your email within ${reward.delivery}.`, { duration: 4000 });
  };

  const canAfford = (cost: number) => points >= cost;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="px-4 pt-6 space-y-4">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <div className="w-16 h-3 rounded animate-pulse" style={{ background: 'var(--bg-surface-elevated)' }} />
            <div className="w-32 h-6 rounded animate-pulse" style={{ background: 'var(--bg-surface-elevated)' }} />
          </div>
          <div className="w-24 h-10 rounded-2xl animate-pulse" style={{ background: 'var(--bg-surface-elevated)' }} />
        </div>

        {/* Progress Skeleton */}
        <div className="w-full h-24 rounded-2xl animate-pulse mb-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }} />

        {/* Categories Skeleton */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-20 h-9 rounded-xl animate-pulse" style={{ background: 'var(--bg-surface-elevated)' }} />
          ))}
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="w-full h-40 rounded-3xl animate-pulse" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 space-y-4 relative z-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Redeem</p>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>Reward Store</h1>
        </div>
        <div
          className="flex items-center gap-1.5 rounded-2xl px-3 py-2 border"
          style={{ background: 'var(--bg-surface-elevated)', borderColor: 'var(--border-highlight)' }}
        >
          <Coins size={14} style={{ color: '#F59E0B' }} />
          <span className="text-sm" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{points.toLocaleString()}</span>
        </div>
      </div>

      {/* Cashout progress */}
      <div
        className="rounded-2xl p-4 border"
        style={{
          background: 'var(--bg-surface)',
          borderColor: 'var(--border-color)',
          boxShadow: 'var(--shadow-elevated)',
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">💸</span>
            <span className="text-sm" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Cashout Progress</span>
          </div>
          <span style={{ color: 'var(--color-primary)', fontSize: 13, fontWeight: 700 }} className="font-numbers">
            {points.toLocaleString()} / {MIN_CASHOUT.toLocaleString()} pts
          </span>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: 'var(--border-color)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--color-primary)', boxShadow: 'var(--shadow-glow)', width: `${Math.min(100, (points / MIN_CASHOUT) * 100)}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (points / MIN_CASHOUT) * 100)}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        {points >= MIN_CASHOUT ? (
          <p style={{ color: '#10B981', fontSize: 11, marginTop: 6, fontWeight: 600 }}>
            ✅ You're eligible to cash out! Subject to 48h fraud review.
          </p>
        ) : (
          <p className="text-xs mt-1.5" style={{ color: 'var(--text-secondary)' }}>
            {(MIN_CASHOUT - points).toLocaleString()} more pts needed for minimum cashout
          </p>
        )}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map(cat => (
          <motion.button
            key={cat}
            className="rounded-xl px-4 py-2 whitespace-nowrap flex-shrink-0 text-sm border"
            style={{
              background: activeCategory === cat ? 'var(--bg-surface)' : 'var(--bg-surface-elevated)',
              borderColor: activeCategory === cat ? 'var(--color-primary)' : 'transparent',
              color: activeCategory === cat ? 'var(--color-primary)' : 'var(--text-secondary)',
              fontWeight: activeCategory === cat ? 600 : 500,
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.map((reward, i) => {
          const affordable = canAfford(reward.cost);
          const done = redeemed.includes(reward.id);
          // Hard fallback for variable colors if needed inside color-mix
          const c = reward.color.startsWith('var(') ? '#00C805' : reward.color;

          return (
            <motion.button
              key={reward.id}
              className="rounded-3xl p-4 text-left relative overflow-hidden"
              style={{
                background: done ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                border: done ? '1px solid var(--border-highlight)' : '1px solid var(--border-color)',
                opacity: affordable ? 1 : 0.6,
                boxShadow: done ? 'none' : 'var(--shadow-elevated)'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: affordable ? 1 : 0.6, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => !done && setSelected(reward)}
            >
              {reward.badge && (
                <div
                  className="absolute top-2 right-2 rounded-lg px-1.5 py-0.5"
                  style={{
                    background: reward.badge === 'HOT' ? 'rgba(239,68,68,0.1)' : reward.badge === 'POPULAR' ? 'rgba(245,158,11,0.1)' : 'rgba(139,92,246,0.1)',
                    fontSize: 8,
                    fontWeight: 700,
                    color: reward.badge === 'HOT' ? '#F87171' : reward.badge === 'POPULAR' ? '#F59E0B' : '#8B5CF6',
                  }}
                >
                  {reward.badge}
                </div>
              )}

              {done && (
                <div className="absolute top-2 right-2">
                  <CheckCircle size={14} style={{ color: '#10B981' }} />
                </div>
              )}

              <div className="text-3xl mb-3">{reward.icon}</div>
              <div className="text-xs mb-0.5" style={{ fontWeight: 600, lineHeight: 1.3, color: 'var(--text-primary)' }}>{reward.name}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{reward.description}</div>

              <div className="mt-3 flex items-center justify-between">
                <div
                  className="rounded-lg px-2 py-0.5 flex items-center gap-1 border"
                  style={{
                    background: affordable ? 'var(--bg-surface-elevated)' : 'var(--bg-main)',
                    borderColor: 'var(--border-highlight)',
                  }}
                >
                  <Coins size={9} style={{ color: affordable ? c : 'var(--text-muted)' }} />
                  <span className="font-numbers" style={{ color: affordable ? c : 'var(--text-muted)', fontSize: 11, fontWeight: 700 }}>
                    {reward.cost >= 1000 ? `${(reward.cost / 1000).toFixed(0)}k` : reward.cost}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={8} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{reward.delivery}</span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="rounded-2xl p-4 border" style={{ background: 'var(--bg-surface-elevated)', borderColor: 'var(--border-highlight)' }}>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          All redemptions are subject to a 48-hour manual fraud review. Raffle tickets are for the sweepstakes model — no purchase necessary alternative entry available. Points have no cash value outside this platform.
        </p>
      </div>

      {/* Reward Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            />
            <motion.div
              className="relative w-full max-w-4xl mx-auto rounded-t-3xl overflow-hidden"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderBottom: 'none',
                boxShadow: `0 -20px 60px rgba(0,0,0,0.1)`,
              }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                      style={{ background: 'var(--bg-surface-elevated)', border: `1px solid var(--border-highlight)` }}
                    >
                      {selected.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>{selected.name}</div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{selected.description}</div>
                    </div>
                  </div>
                  <button
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-highlight)' }}
                    onClick={() => setSelected(null)}
                  >
                    <X size={14} style={{ color: 'var(--text-muted)' }} />
                  </button>
                </div>

                <div className="rounded-2xl p-4 mb-5 border" style={{ background: 'var(--bg-surface-elevated)', borderColor: 'var(--border-highlight)' }}>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{selected.detail}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="rounded-2xl p-3 text-center border" style={{ background: 'var(--bg-surface-elevated)', borderColor: 'var(--border-highlight)' }}>
                    <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Cost</div>
                    <div className="flex items-center justify-center gap-1">
                      <Coins size={13} style={{ color: selected.color.startsWith('var(') ? 'var(--color-primary)' : selected.color }} />
                      <span className="font-numbers" style={{ color: selected.color.startsWith('var(') ? 'var(--color-primary)' : selected.color, fontWeight: 700, fontSize: 16 }}>{selected.cost.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="rounded-2xl p-3 text-center border" style={{ background: 'var(--bg-surface-elevated)', borderColor: 'var(--border-highlight)' }}>
                    <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Delivery</div>
                    <div className="flex items-center justify-center gap-1">
                      <Clock size={12} style={{ color: 'var(--text-muted)' }} />
                      <span className="text-sm" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selected.delivery}</span>
                    </div>
                  </div>
                </div>

                {!canAfford(selected.cost) && (
                  <div className="rounded-2xl p-3 mb-4 flex items-center gap-2" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <span style={{ color: '#F87171', fontSize: 12 }}>⚠️ You need {(selected.cost - points).toLocaleString()} more pts to redeem this reward.</span>
                  </div>
                )}

                <motion.button
                  className="w-full rounded-2xl py-4 flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: canAfford(selected.cost)
                      ? `linear-gradient(135deg, var(--color-primary), var(--color-secondary))`
                      : 'var(--bg-surface-elevated)',
                    border: canAfford(selected.cost) ? 'none' : '1px solid var(--border-color)',
                    opacity: canAfford(selected.cost) ? 1 : 0.6,
                    boxShadow: canAfford(selected.cost) ? `var(--shadow-glow)` : 'none',
                  }}
                  whileTap={canAfford(selected.cost) ? { scale: 0.97 } : undefined}
                  onClick={() => canAfford(selected.cost) && handleRedeem(selected)}
                >
                  <span style={{ fontWeight: 700, color: canAfford(selected.cost) ? '#FFFFFF' : 'var(--text-muted)' }}>
                    {canAfford(selected.cost) ? `Redeem — ${selected.cost.toLocaleString()} pts` : 'Not enough points'}
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
