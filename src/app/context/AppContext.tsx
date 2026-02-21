import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

export interface RecentWin {
  id: string;
  label: string;
  icon: string;
  timestamp: Date;
  type: 'spin' | 'mystery' | 'task';
}

interface AppState {
  points: number;
  streak: number;
  adsWatchedToday: number;
  totalSpins: number;
  totalAdsWatched: number;
  recentWins: RecentWin[];
  dailyTarget: number;
  dailyProgress: number;
}

interface AppContextValue extends AppState {
  addPoints: (amount: number) => void;
  deductPoints: (amount: number) => boolean;
  incrementAd: () => void;
  resetDailyAds: () => void;
  addWin: (win: Omit<RecentWin, 'id' | 'timestamp'>) => void;
  incrementSpins: () => void;
  streakMultiplier: number;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    points: 1250,
    streak: 7,
    adsWatchedToday: 3,
    totalSpins: 42,
    totalAdsWatched: 210,
    dailyTarget: 200,
    dailyProgress: 145,
    recentWins: [
      { id: '1', label: '100 Points', icon: '💎', timestamp: new Date(Date.now() - 60000 * 5), type: 'spin' },
      { id: '2', label: '10 Points', icon: '🪙', timestamp: new Date(Date.now() - 60000 * 12), type: 'mystery' },
      { id: '3', label: '500 Points', icon: '⭐', timestamp: new Date(Date.now() - 60000 * 30), type: 'spin' },
    ],
  });

  const streakMultiplier = state.streak >= 30 ? 2.0 : state.streak >= 7 ? 1.5 : 1.0;

  const addPoints = useCallback((amount: number) => {
    const multiplied = Math.round(amount * streakMultiplier);
    setState(prev => ({
      ...prev,
      points: prev.points + multiplied,
      dailyProgress: Math.min(prev.dailyTarget, prev.dailyProgress + multiplied),
    }));
  }, [streakMultiplier]);

  const deductPoints = useCallback((amount: number): boolean => {
    let success = false;
    setState(prev => {
      if (prev.points >= amount) {
        success = true;
        return { ...prev, points: prev.points - amount };
      }
      return prev;
    });
    return success;
  }, []);

  const incrementAd = useCallback(() => {
    setState(prev => ({
      ...prev,
      adsWatchedToday: prev.adsWatchedToday + 1,
      totalAdsWatched: prev.totalAdsWatched + 1,
    }));
  }, []);

  const resetDailyAds = useCallback(() => {
    setState(prev => ({ ...prev, adsWatchedToday: 0 }));
  }, []);

  const addWin = useCallback((win: Omit<RecentWin, 'id' | 'timestamp'>) => {
    setState(prev => ({
      ...prev,
      recentWins: [
        { ...win, id: Math.random().toString(36).slice(2), timestamp: new Date() },
        ...prev.recentWins.slice(0, 4),
      ],
    }));
  }, []);

  const incrementSpins = useCallback(() => {
    setState(prev => ({ ...prev, totalSpins: prev.totalSpins + 1 }));
  }, []);

  return (
    <AppContext.Provider value={{
      ...state,
      addPoints,
      deductPoints,
      incrementAd,
      resetDailyAds,
      addWin,
      incrementSpins,
      streakMultiplier,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
