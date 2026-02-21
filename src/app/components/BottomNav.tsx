import { NavLink } from 'react-router';
import { motion } from 'motion/react';
import { Home, RotateCw, Package, ShoppingBag, Trophy } from 'lucide-react';

const NAV_ITEMS = [
    { to: '/', icon: Home, label: 'Dash' },
    { to: '/spin', icon: RotateCw, label: 'Spin' },
    { to: '/mystery', icon: Package, label: 'Mystery' },
    { to: '/store', icon: ShoppingBag, label: 'Store' },
    { to: '/leaderboard', icon: Trophy, label: 'Ranks' },
];

export function BottomNav() {
    return (
        <div
            className="fixed inset-x-0 z-50 md:hidden flex justify-center px-4 pointer-events-none"
            style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
        >
            <div
                className="flex items-center justify-around px-2 py-2 backdrop-blur-2xl rounded-full w-full max-w-[380px] pointer-events-auto"
                style={{
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-elevated)',
                }}
            >
                {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
                    <NavLink key={to} to={to} end={to === '/'}>
                        {({ isActive }: { isActive: boolean }) => (
                            <div className="relative flex flex-col items-center justify-center w-[4.5rem] h-14">
                                {isActive && (
                                    <motion.div
                                        layoutId="bottom-nav-active"
                                        className="absolute inset-0 rounded-full"
                                        style={{
                                            background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)',
                                            border: '1px solid color-mix(in srgb, var(--color-primary) 30%, transparent)'
                                        }}
                                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                                    />
                                )}

                                <motion.div
                                    animate={{
                                        y: isActive ? -2 : 0,
                                        scale: isActive ? 1.05 : 1
                                    }}
                                    className="z-10 flex flex-col items-center"
                                >
                                    <Icon
                                        size={20}
                                        className="mb-1"
                                        strokeWidth={isActive ? 2.5 : 2}
                                        style={{ color: isActive ? 'var(--color-primary)' : 'var(--text-muted)' }}
                                    />
                                    <span
                                        className="text-[10px] uppercase tracking-wider font-semibold"
                                        style={{ color: isActive ? 'var(--color-primary)' : 'var(--text-muted)' }}
                                    >
                                        {label}
                                    </span>
                                </motion.div>

                                {/* Active glow dot */}
                                {isActive && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 w-1 h-1 rounded-full shadow-[0_0_8px_var(--color-primary)]"
                                        style={{ background: 'var(--color-primary)' }}
                                    />
                                )}
                            </div>
                        )}
                    </NavLink>
                ))}
            </div>
        </div>
    );
}
