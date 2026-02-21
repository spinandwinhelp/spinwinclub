import { motion } from 'motion/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function MeshBackground() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Don't render animated orbs in light mode for performance
  const isDark = mounted && theme === 'dark';

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base — uses theme variable */}
      <div className="absolute inset-0" style={{ background: 'var(--bg-main)' }} />

      {isDark && (
        <>
          {/* Purple orb - top left */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: '60vw',
              height: '60vw',
              top: '-15vw',
              left: '-10vw',
              background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Cyan orb - top right */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: '50vw',
              height: '50vw',
              top: '20vw',
              right: '-10vw',
              background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />

          {/* Pink orb - bottom center */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: '55vw',
              height: '55vw',
              bottom: '-10vw',
              left: '20vw',
              background: 'radial-gradient(circle, rgba(236,72,153,0.10) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
            animate={{ scale: [1, 1.06, 1], opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          />

          {/* Gold orb - mid left */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: '35vw',
              height: '35vw',
              top: '50vw',
              left: '-5vw',
              background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
              filter: 'blur(30px)',
            }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />

          {/* Noise texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </>
      )}
    </div>
  );
}
