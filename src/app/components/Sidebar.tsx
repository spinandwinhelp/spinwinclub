import { NavLink } from 'react-router';
import { motion } from 'motion/react';
import { Home, RotateCw, Package, ShoppingBag, Trophy, Coins, Zap, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from 'next-themes';

const NAV_ITEMS = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/spin', icon: RotateCw, label: 'Spin Wheel' },
    { to: '/mystery', icon: Package, label: 'Mystery Box' },
    { to: '/store', icon: ShoppingBag, label: 'Exchange' },
    { to: '/leaderboard', icon: Trophy, label: 'Rankings' },
];

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const { points } = useApp();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => setMounted(true), []);

    return (
        <>
            {/* Sidebar Content */}
            <motion.div
                className={`fixed inset-y-0 left-0 z-50 w-64 md:w-[280px] flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    }`}
                style={{
                    background: 'var(--glass-bg)',
                    backdropFilter: theme === 'dark' ? 'blur(30px)' : 'none',
                    borderRight: '1px solid var(--border-color)',
                }}
            >
                <div className="p-6 flex flex-col h-full">
                    {/* Logo & Brand */}
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}>
                            <Zap size={20} style={{ color: 'var(--bg-main)' }} />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg tracking-wide uppercase" style={{ color: 'var(--text-primary)' }}>Midnight</h1>
                            <p className="text-xs font-semibold tracking-widest" style={{ color: 'var(--color-primary)' }}>EXCHANGE</p>
                        </div>
                    </div>

                    {/* Quick Stats - Sidebar version */}
                    <div className="mb-8 p-4 rounded-2xl" style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-highlight)' }}>
                        <p className="text-xs uppercase tracking-wider mb-2 font-medium" style={{ color: 'var(--text-muted)' }}>Available Assets</p>
                        <div className="flex items-center gap-2">
                            <Coins size={18} style={{ color: 'var(--color-secondary)' }} />
                            <span className="font-numbers font-bold text-xl" style={{ color: 'var(--text-primary)' }}>{points.toLocaleString()}</span>
                            <span className="text-sm ml-1" style={{ color: 'var(--text-muted)' }}>pts</span>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 space-y-2">
                        <p className="text-xs px-3 mb-4 font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Command Center</p>
                        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
                            <NavLink key={to} to={to} end={to === '/'} onClick={() => setIsOpen(false)}>
                                {({ isActive }: { isActive: boolean }) => (
                                    <motion.div
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl relative overflow-hidden group transition-colors"
                                        whileHover={{ scale: 1.02, x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{
                                            background: isActive ? 'var(--bg-surface-elevated)' : 'transparent',
                                            color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                                        }}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="sidebar-active"
                                                className="absolute inset-0 rounded-xl"
                                                style={{ border: '1px solid var(--border-highlight)' }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        )}
                                        <Icon size={20} className="relative z-10" strokeWidth={isActive ? 2.5 : 2} />
                                        <span className="font-semibold text-sm relative z-10 tracking-wide">{label}</span>
                                    </motion.div>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* User Profile / Status & Theme Toggle */}
                    <div className="mt-auto pt-6 flex items-center justify-between" style={{ borderTop: '1px solid var(--border-highlight)' }}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full p-[2px]" style={{ background: 'linear-gradient(to top right, var(--color-secondary), var(--color-primary))' }}>
                                <div className="w-full h-full rounded-full flex items-center justify-center text-sm" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
                                    👤
                                </div>
                            </div>
                            <div>
                                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Operator #849</p>
                                <p className="text-xs font-numbers" style={{ color: 'var(--color-primary)' }}>Status: Active</p>
                            </div>
                        </div>
                        {mounted && (
                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="p-2.5 rounded-xl hover:scale-105 transition-transform"
                                style={{ background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}
                            >
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </>
    );
}
