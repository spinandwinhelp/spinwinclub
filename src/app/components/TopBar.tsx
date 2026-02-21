import { useApp } from '../context/AppContext';
import { useTheme } from 'next-themes';
import { Coins, Zap, Flame, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

export function TopBar() {
    const { points, streak } = useApp();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    return (
        <div className="sticky top-0 z-50 w-full md:hidden backdrop-blur-md"
            style={{
                background: 'var(--glass-bg)',
                borderBottom: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-elevated)',
                paddingTop: 'env(safe-area-inset-top)'
            }}>
            <div className="flex items-center justify-between px-4 py-3">
                {/* Brand / Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}>
                        <Zap size={16} style={{ color: 'var(--bg-main)' }} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm tracking-wide leading-none" style={{ color: 'var(--text-primary)' }}>Spin & Win</span>
                        <span className="text-[10px] font-semibold tracking-widest leading-none mt-0.5" style={{ color: 'var(--color-primary)' }}>CLUB</span>
                    </div>
                </div>

                {/* User Stats & Actions */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md"
                        style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-highlight)' }}>
                        <Flame size={14} style={{ color: 'var(--color-alert)' }} />
                        <span className="font-numbers font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                            {streak}d
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md"
                        style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-highlight)' }}>
                        <Coins size={14} style={{ color: 'var(--color-secondary)' }} />
                        <span className="font-numbers font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                            {points.toLocaleString()}
                        </span>
                    </div>

                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-1.5 rounded-md hover:scale-105 transition-transform"
                            style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-highlight)', color: 'var(--text-primary)' }}
                        >
                            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
