import { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Crown, Medal, Star, TrendingUp, Users, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ALL_USERS = [
  { rank: 1, name: 'CryptoKing99', points: 48230, streak: 45, spins: 312, badge: '👑', country: '🇺🇸', change: 0 },
  { rank: 2, name: 'SpinMaster_X', points: 41850, streak: 30, spins: 278, badge: '⚡', country: '🇬🇧', change: 1 },
  { rank: 3, name: 'DiamondHands', points: 38920, streak: 22, spins: 245, badge: '💎', country: '🇨🇦', change: -1 },
  { rank: 4, name: 'PointsHunter', points: 32100, streak: 18, spins: 190, badge: '🎯', country: '🇦🇺', change: 2 },
  { rank: 5, name: 'GrindMaster', points: 29450, streak: 15, spins: 175, badge: '🔥', country: '🇩🇪', change: 0 },
  { rank: 6, name: 'NightOwl_Pro', points: 27300, streak: 12, spins: 160, badge: '🦉', country: '🇯🇵', change: -2 },
  { rank: 7, name: 'LuckyDraw_XL', points: 24800, streak: 10, spins: 148, badge: '🍀', country: '🇮🇳', change: 3 },
  { rank: 8, name: 'SpinBot_9000', points: 22100, streak: 8, spins: 135, badge: '🤖', country: '🇰🇷', change: 0 },
  { rank: 9, name: 'RewardRacer', points: 19500, streak: 7, spins: 122, badge: '🏎️', country: '🇧🇷', change: 1 },
  { rank: 10, name: 'DailyGrinder', points: 17200, streak: 5, spins: 110, badge: '⭐', country: '🇲🇽', change: -1 },
  { rank: 11, name: 'You', points: 1250, streak: 7, spins: 42, badge: '🎮', country: '🌍', change: 0, isMe: true },
];

const TABS = ['All Time', 'This Week', 'Monthly'];

export function Leaderboard() {
  const { points, streak, totalSpins } = useApp();
  const [tab, setTab] = useState('All Time');

  const top3 = ALL_USERS.slice(0, 3);
  const rest = ALL_USERS.slice(3);

  const myRank = ALL_USERS.find(u => u.isMe);
  const myIndex = ALL_USERS.findIndex(u => u.isMe) + 1;

  const podiumOrder = [top3[1], top3[0], top3[2]]; // 2nd, 1st, 3rd

  const podiumHeights = [80, 110, 60];
  const podiumColors = [
    { bg: 'rgba(156,163,175,0.15)', border: 'rgba(156,163,175,0.3)', text: '#9CA3AF', label: '🥈 2nd' },
    { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', text: '#F59E0B', label: '🥇 1st' },
    { bg: 'rgba(180,83,9,0.15)', border: 'rgba(180,83,9,0.25)', text: '#D97706', label: '🥉 3rd' },
  ];

  return (
    <div className="px-4 pt-6 space-y-5 relative z-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Rankings</p>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>Leaderboard</h1>
        </div>
        <div
          className="flex items-center gap-1.5 rounded-2xl px-3 py-2 border"
          style={{ background: 'var(--bg-surface-elevated)', borderColor: 'var(--border-highlight)' }}
        >
          <Users size={14} style={{ color: 'var(--text-muted)' }} />
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{ALL_USERS.length}K+ users</span>
        </div>
      </div>

      {/* Telegram Banner */}
      <motion.div
        className="rounded-3xl p-4 relative overflow-hidden border"
        style={{
          background: 'var(--bg-surface)',
          borderColor: 'rgba(37,99,235,0.25)',
          boxShadow: 'var(--shadow-elevated)',
        }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)' }}
          >
            ✈️
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm mb-0.5" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Join the Secret Spin Club</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Telegram community • Exclusive weekly bonuses</div>
          </div>
          <div
            className="rounded-xl px-3 py-1.5 flex items-center gap-1 flex-shrink-0"
            style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.25)' }}
          >
            <span style={{ color: '#3B82F6', fontSize: 11, fontWeight: 600 }}>Join</span>
            <ExternalLink size={9} style={{ color: '#3B82F6' }} />
          </div>
        </div>
      </motion.div>

      {/* Tab selector */}
      <div className="flex gap-2">
        {TABS.map(t => (
          <motion.button
            key={t}
            className="flex-1 rounded-xl py-2 text-sm border"
            style={{
              background: tab === t ? 'var(--bg-surface)' : 'var(--bg-surface-elevated)',
              borderColor: tab === t ? 'var(--color-primary)' : 'transparent',
              color: tab === t ? 'var(--color-primary)' : 'var(--text-secondary)',
              fontWeight: tab === t ? 600 : 500,
            }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setTab(t)}
          >
            {t}
          </motion.button>
        ))}
      </div>

      {/* Podium */}
      <div
        className="rounded-3xl p-6 border"
        style={{
          background: 'var(--bg-surface)',
          borderColor: 'var(--border-color)',
          boxShadow: 'var(--shadow-elevated)',
        }}
      >
        <div className="flex items-end justify-center gap-3">
          {podiumOrder.map((user, i) => {
            const colors = podiumColors[i];
            const isFirst = i === 1;
            return (
              <motion.div
                key={user.rank}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
              >
                {/* Avatar */}
                <div className="relative mb-2">
                  {isFirst && (
                    <motion.div
                      className="absolute -top-5 left-1/2 -translate-x-1/2 text-xl"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      👑
                    </motion.div>
                  )}
                  <div
                    className="rounded-2xl flex items-center justify-center text-xl relative"
                    style={{
                      width: isFirst ? 56 : 48,
                      height: isFirst ? 56 : 48,
                      background: colors.bg,
                      border: `2px solid ${colors.border}`,
                      boxShadow: isFirst ? `0 0 25px ${colors.border}` : 'none',
                    }}
                  >
                    {user.badge}
                  </div>
                </div>

                {/* Podium block */}
                <div
                  className="rounded-2xl flex flex-col items-center justify-end pb-3 w-24"
                  style={{
                    height: podiumHeights[i],
                    background: colors.bg,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <div className="text-xs" style={{ color: colors.text, fontWeight: 700 }}>{colors.label}</div>
                </div>

                {/* Info below */}
                <div className="mt-2 text-center">
                  <div className="text-xs" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {user.name.length > 10 ? user.name.slice(0, 9) + '…' : user.name}
                  </div>
                  <div style={{ color: colors.text, fontSize: 11, fontWeight: 700 }}>
                    {user.points.toLocaleString()} pts
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* My rank card */}
      <div
        className="rounded-2xl p-4 flex items-center gap-3 border"
        style={{
          background: 'var(--bg-surface)',
          borderColor: 'var(--color-secondary)',
          boxShadow: 'var(--shadow-elevated)',
        }}
      >
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-highlight)' }}
        >
          🎮
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>You</span>
            <span
              className="text-xs rounded-lg px-1.5 py-0.5"
              style={{ background: 'var(--bg-surface-elevated)', color: 'var(--color-secondary)', fontWeight: 600 }}
            >
              Rank #{myIndex}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{points.toLocaleString()} pts</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>•</span>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>🔥 {streak}d streak</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>•</span>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>🎰 {totalSpins} spins</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Top</div>
          <div style={{ color: 'var(--color-secondary)', fontWeight: 700, fontSize: 15 }}>
            {Math.round((myIndex / ALL_USERS.length) * 100)}%
          </div>
        </div>
      </div>

      {/* Full list */}
      <div className="space-y-2">
        {ALL_USERS.map((user, i) => {
          const isMe = user.isMe;
          return (
            <motion.div
              key={user.rank}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 border"
              style={{
                background: isMe ? 'var(--bg-surface)' : 'var(--bg-surface)',
                borderColor: isMe ? 'var(--color-secondary)' : 'var(--border-color)',
                boxShadow: isMe ? 'var(--shadow-elevated)' : 'none',
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              {/* Rank */}
              <div className="w-7 text-center flex-shrink-0">
                {user.rank <= 3 ? (
                  <span className="text-base">{['🥇', '🥈', '🥉'][user.rank - 1]}</span>
                ) : (
                  <span className="text-sm" style={{ fontWeight: 600, color: 'var(--text-muted)' }}>#{user.rank}</span>
                )}
              </div>

              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-highlight)',
                }}
              >
                {user.badge}
              </div>

              {/* Name & info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-sm truncate"
                    style={{ color: isMe ? 'var(--color-secondary)' : 'var(--text-primary)', fontWeight: isMe ? 700 : 500 }}
                  >
                    {user.name}
                  </span>
                  <span className="text-xs">{user.country}</span>
                  {isMe && (
                    <span
                      className="text-xs rounded px-1"
                      style={{ background: 'var(--bg-surface-elevated)', color: 'var(--color-secondary)', fontWeight: 600 }}
                    >
                      You
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>🔥 {user.streak}d</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>•</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>🎰 {user.spins}</span>
                </div>
              </div>

              {/* Points & change */}
              <div className="text-right flex-shrink-0">
                <div
                  className="text-sm"
                  style={{ color: isMe ? 'var(--color-secondary)' : 'var(--text-primary)', fontWeight: 700 }}
                >
                  {user.points.toLocaleString()}
                </div>
                <div className="flex items-center justify-end gap-0.5">
                  {user.change > 0 ? (
                    <span style={{ color: '#10B981', fontSize: 9 }}>▲{user.change}</span>
                  ) : user.change < 0 ? (
                    <span style={{ color: '#EF4444', fontSize: 9 }}>▼{Math.abs(user.change)}</span>
                  ) : (
                    <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>—</span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Monthly prize box */}
      <div
        className="rounded-3xl p-5 border"
        style={{
          background: 'var(--bg-surface)',
          borderColor: 'var(--border-color)',
          boxShadow: 'var(--shadow-elevated)',
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <Trophy size={20} style={{ color: '#F59E0B' }} />
          <span className="text-sm" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Monthly Champion Prize</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-4xl">📱</span>
          <div>
            <div className="text-sm" style={{ color: 'var(--text-primary)' }}>iPhone 15 Pro Max</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Awarded to #1 ranked user each month</div>
            <div style={{ color: '#F59E0B', fontSize: 11, fontWeight: 600, marginTop: 4 }}>
              Resets in 8 days • Keep grinding! 💪
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
