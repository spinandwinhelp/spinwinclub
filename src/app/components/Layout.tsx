import { Outlet } from 'react-router';
import { MeshBackground } from './MeshBackground';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { TopBar } from './TopBar';

export function Layout() {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-main)' }}>
      <MeshBackground />
      <Sidebar />
      <div className="flex-1 md:ml-[280px] min-h-screen relative z-10 overflow-y-auto pb-24 md:pb-0">
        <TopBar />
        <div className="w-full max-w-4xl mx-auto md:pb-10">
          <Outlet />
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
