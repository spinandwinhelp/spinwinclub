import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Flame, Zap, RotateCw, Package, ChevronRight,
  CheckCircle, Clock, Star, TrendingUp, Play, Coins
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AdModal } from './AdModal';
import { toast } from 'sonner';

function GlassCard({ children, className = '', style = {}, onClick }: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  return (
    <motion.div
      className={`rounded-3xl ${className}`}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-elevated)',
        ...style,
      }}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

const TASKS = [
  { id: 1, label: 'Watch 5 Ads Today', reward: 15, done: false, icon: '📺' },
  { id: 2, label: 'Complete a Premium Spin', reward: 50, done: false, icon: '🎰' },
  { id: 3, label: 'Open Mystery Box', reward: 30, done: false, icon: '📦' },
  { id: 4, label: 'Invite a Friend', reward: 500, done: false, icon: '👥' },
];

export function Dashboard() {
  const navigate = useNavigate();
  const {
    points, streak, adsWatchedToday, totalSpins,
    dailyTarget, dailyProgress,
    streakMultiplier, addPoints, incrementAd, addWin
  } = useApp();

  const [showAd, setShowAd] = useState(false);
  const [adCount, setAdCount] = useState(adsWatchedToday);

  const adsNeeded = 5;
  const adsLeft = adsNeeded - (adCount % adsNeeded);
  const progressPct = Math.min(100, (dailyProgress / dailyTarget) * 100);

  const handleWatchAd = () => setShowAd(true);

  const handleAdComplete = () => {
    setShowAd(false);
    incrementAd();
    setAdCount(prev => prev + 1);
    addPoints(1);
    addWin({ label: '+1 Point', icon: '🪙', type: 'task' });
    const newCount = adCount + 1;
    if (newCount % adsNeeded === 0) {
      toast.success('🎉 You earned a FREE Basic Spin!', {
        description: 'Head to the Spin screen to use it',
        duration: 4000,
      });
    } else {
      toast.success(`+1 Point earned! ${adsNeeded - (newCount % adsNeeded)} ads left for free spin`, { duration: 2500 });
    }
  };

  return (
    <div className="px-4 pt-6 pb-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm tracking-wide" style={{ color: 'var(--text-muted)' }}>Good evening</p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Welcome back 👋</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* Streak badge */}
          <motion.div
            className="flex items-center gap-1.5 rounded-2xl px-3 py-2 border"
            style={{
              background: streak >= 7 ? 'rgba(251,146,60,0.1)' : 'var(--bg-surface-elevated)',
              borderColor: streak >= 7 ? 'rgba(251,146,60,0.3)' : 'var(--border-highlight)',
            }}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Flame size={14} style={{ color: streak >= 7 ? '#FB923C' : 'var(--text-muted)' }} />
            <span style={{ color: streak >= 7 ? '#FB923C' : 'var(--text-secondary)', fontSize: 13, fontWeight: 600 }}>
              {streak}d
            </span>
          </motion.div>
          {/* Avatar */}
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg shadow-sm"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
          >
            👤
          </div>
        </div>
      </div>

      {/* Points Balance Card */}
      <GlassCard
        className="premium-glow relative overflow-hidden"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--color-primary)',
          boxShadow: 'var(--shadow-glow)',
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'var(--color-primary)', opacity: 0.05, filter: 'blur(80px)' }} />
        <div className="p-6 relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs tracking-widest uppercase mb-1 font-semibold" style={{ color: 'var(--color-primary)' }}>Total Balance</p>
              <motion.div
                key={points}
                initial={{ scale: 1.05, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-baseline gap-2"
              >
                <span className="font-numbers" style={{ fontSize: 44, fontWeight: 800, letterSpacing: -1, color: 'var(--text-primary)' }}>
                  {points.toLocaleString()}
                </span>
                <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>pts</span>
              </motion.div>
            </div>
            <div className="flex flex-col items-end gap-1">
              {streakMultiplier > 1 && (
                <div
                  className="flex items-center gap-1 rounded-xl px-2.5 py-1 border"
                  style={{ background: 'rgba(251,146,60,0.1)', borderColor: 'rgba(251,146,60,0.3)' }}
                >
                  <Star size={11} style={{ color: '#FB923C' }} />
                  <span style={{ color: '#FB923C', fontSize: 11, fontWeight: 700 }}>{streakMultiplier}x Bonus</span>
                </div>
              )}
              <div
                className="flex items-center gap-1 rounded-xl px-2.5 py-1"
                style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
              >
                <TrendingUp size={11} style={{ color: '#10B981' }} />
                <span style={{ color: '#10B981', fontSize: 11, fontWeight: 600 }}>+{totalSpins * 10} lifetime</span>
              </div>
            </div>
          </div>

          {/* Daily Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Daily Target</span>
              <span style={{ color: 'var(--color-secondary)', fontSize: 11, fontWeight: 600 }}>{dailyProgress}/{dailyTarget} pts</span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: 'var(--border-color)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'var(--color-primary)', boxShadow: 'var(--shadow-glow)' }}
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
            <p className="text-xs mt-1.5" style={{ color: 'var(--text-secondary)' }}>
              {progressPct >= 100 ? '🎉 Daily target reached!' : `${dailyTarget - dailyProgress} pts to complete daily goal`}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Main Actions Row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Watch Ad Card */}
        <motion.button
          className="magnetic-button rounded-3xl p-5 text-left relative overflow-hidden"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-elevated)'
          }}
          onClick={handleWatchAd}
        >
          <div className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center max-sm:hidden" style={{ background: 'var(--bg-surface-elevated)' }}>
            <Play size={10} style={{ color: 'var(--color-primary)' }} fill="var(--color-primary)" />
          </div>
          <div className="text-3xl mb-3">📺</div>
          <div className="text-sm mb-1" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Watch Ad</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 11 }}>+1 pt per ad</div>
          <div className="mt-3 flex items-center gap-1.5">
            {Array.from({ length: adsNeeded }).map((_, i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded-full"
                style={{
                  background: i < (adCount % adsNeeded) ? 'var(--color-primary)' : 'var(--border-color)',
                  boxShadow: i < (adCount % adsNeeded) ? '0 0 8px var(--color-primary)' : 'none',
                }}
              />
            ))}
          </div>
          <p style={{ color: 'var(--color-primary)', fontSize: 10, marginTop: 4, fontWeight: 500 }}>
            {adsLeft === adsNeeded ? 'Free spin ready!' : `${adsLeft} more = free spin`}
          </p>
        </motion.button>

        {/* Premium Spin Card */}
        <motion.button
          className="magnetic-button premium-glow rounded-3xl p-5 text-left relative overflow-hidden"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-elevated)'
          }}
          onClick={() => navigate('/spin')}
        >
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none" style={{ background: 'var(--color-secondary)', opacity: 0.05, filter: 'blur(40px)' }} />
          <div className="absolute top-3 right-3">
            <Zap size={14} style={{ color: 'var(--color-secondary)' }} />
          </div>
          <div className="text-3xl mb-3">🎰</div>
          <div className="text-sm mb-1" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Premium Spin</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 11 }}>Win big prizes</div>
          <div
            className="mt-3 rounded-xl px-2.5 py-1 inline-flex items-center gap-1 border"
            style={{ background: 'var(--bg-surface-elevated)', borderColor: 'var(--border-highlight)' }}
          >
            <Coins size={10} style={{ color: 'var(--color-secondary)' }} />
            <span style={{ color: 'var(--color-secondary)', fontSize: 10, fontWeight: 600 }}>500 pts</span>
          </div>
        </motion.button>
      </div>

      {/* Mystery Box */}
      <motion.button
        className="magnetic-button premium-glow w-full rounded-3xl p-5 text-left relative overflow-hidden flex items-center gap-4"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-elevated)'
        }}
        onClick={() => navigate('/mystery')}
      >
        <motion.div
          className="text-4xl"
          animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          📦
        </motion.div>
        <div className="flex-1">
          <div className="text-base mb-0.5" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Mystery Box</div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Snap to reveal your prize</div>
          <div className="flex items-center gap-2 mt-2">
            <div
              className="rounded-lg px-2 py-0.5 flex items-center gap-1"
              style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-highlight)' }}
            >
              <Coins size={9} style={{ color: 'var(--color-secondary)' }} />
              <span style={{ color: 'var(--color-secondary)', fontSize: 10, fontWeight: 600 }}>300 pts</span>
            </div>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>40% chance to win</span>
          </div>
        </div>
        <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
      </motion.button>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Spins', value: totalSpins, icon: '🎰', color: 'var(--color-secondary)' },
          { label: 'Day Streak', value: streak, icon: '🔥', color: '#FB923C' },
          { label: 'Ads Today', value: adCount % adsNeeded + '/' + adsNeeded, icon: '📺', color: 'var(--color-primary)' },
        ].map(stat => (
          <GlassCard key={stat.label}>
            <div className="p-4 text-center">
              <div className="text-xl mb-1">{stat.icon}</div>
              <div style={{ color: stat.color, fontSize: 18, fontWeight: 700 }}>{stat.value}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Point Yield Chart */}
      <div className="mt-8 mb-4">
        <h2 className="mb-3 tracking-wide" style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>Market Yield (7d)</h2>
        <div className="rounded-2xl p-4 relative overflow-hidden shadow-sm" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
          {/* Faux Sparkline Chart */}
          <div className="absolute inset-x-0 bottom-0 h-24 opacity-30 pointer-events-none overflow-hidden flex items-end">
            <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path d="M0,80 L10,70 L20,75 L30,40 L40,55 L50,30 L60,45 L70,20 L80,35 L90,10 L100,15 L100,100 L0,100 Z" fill="url(#chartGrad)" />
              <path d="M0,80 L10,70 L20,75 L30,40 L40,55 L50,30 L60,45 L70,20 L80,35 L90,10 L100,15" fill="none" stroke="var(--color-primary)" strokeWidth="2" />
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="flex justify-between items-end relative z-10 mb-8">
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--text-muted)' }}>Weekly Accumulation</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-numbers font-bold" style={{ color: 'var(--color-primary)' }}>+2,450</span>
                <span className="text-xs px-1.5 py-0.5 rounded uppercase font-bold tracking-wider" style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-highlight)', color: 'var(--color-primary)' }}>Bullish</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between relative z-10 pt-3" style={{ borderTop: '1px solid var(--border-highlight)' }}>
            <div className="text-center"><span className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Mon</span><p className="text-xs font-numbers" style={{ color: 'var(--text-secondary)' }}>+120</p></div>
            <div className="text-center"><span className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Tue</span><p className="text-xs font-numbers" style={{ color: 'var(--text-secondary)' }}>+340</p></div>
            <div className="text-center"><span className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Wed</span><p className="text-xs font-numbers" style={{ color: 'var(--color-primary)', textShadow: 'var(--shadow-glow)' }}>+890</p></div>
            <div className="text-center"><span className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Thu</span><p className="text-xs font-numbers" style={{ color: 'var(--text-secondary)' }}>+400</p></div>
            <div className="text-center"><span className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Today</span><p className="text-xs font-numbers font-bold" style={{ color: 'var(--text-primary)' }}>+{points > 0 ? '700' : '0'}</p></div>
          </div>
        </div>
      </div>

      {/* Cashout Banner */}
      <motion.button
        className="w-full rounded-3xl p-5 relative overflow-hidden"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-elevated)',
        }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/store')}
      >
        <div className="flex items-center gap-4">
          <div className="text-3xl">💸</div>
          <div className="flex-1 text-left">
            <div className="text-sm mb-0.5" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Redeem Rewards</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {points >= 5000 ? '✅ You can cash out now!' : `${(5000 - points).toLocaleString()} pts until cashout`}
            </div>
            <div className="h-1 rounded-full mt-2" style={{ background: 'var(--border-color)' }}>
              <div
                className="h-full rounded-full"
                style={{ background: 'var(--color-primary)', width: `${Math.min(100, (points / 5000) * 100)}%` }}
              />
            </div>
          </div>
          <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
        </div>
      </motion.button>

      <AdModal open={showAd} onComplete={handleAdComplete} onClose={() => setShowAd(false)} />
    </div>
  );
}
