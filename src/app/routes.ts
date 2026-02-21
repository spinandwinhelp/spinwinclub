import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { PremiumSpin } from './components/PremiumSpin';
import { MysteryBox } from './components/MysteryBox';
import { RewardStore } from './components/RewardStore';
import { Leaderboard } from './components/Leaderboard';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'spin', Component: PremiumSpin },
      { path: 'mystery', Component: MysteryBox },
      { path: 'store', Component: RewardStore },
      { path: 'leaderboard', Component: Leaderboard },
    ],
  },
]);
