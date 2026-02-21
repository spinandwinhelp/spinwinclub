import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Volume2 } from 'lucide-react';

interface AdModalProps {
  open: boolean;
  onComplete: () => void;
  onClose: () => void;
}

const AD_BRANDS = [
  { name: 'NordVPN', tagline: 'Protect your privacy online', color: '#4F46E5', icon: '🛡️' },
  { name: 'Honey', tagline: 'Save money automatically', color: '#F59E0B', icon: '🍯' },
  { name: 'Duolingo', tagline: 'Learn a language in 5 min/day', color: '#10B981', icon: '🦉' },
  { name: 'Skillshare', tagline: 'Learn from the best creators', color: '#EC4899', icon: '🎨' },
  { name: 'Grammarly', tagline: 'Write with confidence', color: '#06B6D4', icon: '✍️' },
];

export function AdModal({ open, onComplete, onClose }: AdModalProps) {
  const [countdown, setCountdown] = useState(5);
  const [brand] = useState(() => AD_BRANDS[Math.floor(Math.random() * AD_BRANDS.length)]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!open) {
      setCountdown(5);
      setProgress(0);
      return;
    }
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(onComplete, 300);
          return 0;
        }
        return prev - 1;
      });
      setProgress(prev => Math.min(100, prev + 20));
    }, 1000);
    return () => clearInterval(interval);
  }, [open, onComplete]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <motion.div
            className="relative w-full max-w-[430px] rounded-t-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
              backdropFilter: 'blur(40px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderBottom: 'none',
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Ad Header */}
            <div className="flex items-center justify-between p-5 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-white/40 text-xs tracking-wider uppercase">Sponsored</span>
              </div>
              {countdown === 0 ? (
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                >
                  <X size={14} className="text-white" />
                </button>
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  {countdown}
                </div>
              )}
            </div>

            {/* Ad Content */}
            <div className="px-5 pb-5">
              <div
                className="rounded-2xl p-6 flex flex-col items-center gap-4 mb-4"
                style={{ background: `linear-gradient(135deg, ${brand.color}20, ${brand.color}08)`, border: `1px solid ${brand.color}30` }}
              >
                <div className="text-5xl">{brand.icon}</div>
                <div className="text-center">
                  <div className="text-white text-lg mb-1">{brand.name}</div>
                  <div className="text-white/50 text-sm">{brand.tagline}</div>
                </div>
                <div className="flex items-center gap-2 text-white/30 text-xs">
                  <Volume2 size={12} />
                  <span>Ad playing...</span>
                  <Play size={12} className="fill-white/30" />
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-white/40 mb-2">
                  <span>Watching ad...</span>
                  <span className="text-amber-400">+1 point reward</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <p className="text-white/30 text-xs text-center">
                Watch the full ad to earn your reward points
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
