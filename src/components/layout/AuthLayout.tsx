import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-casino-bg px-4 py-8">
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-2">
          <span className="text-3xl text-casino-green">◆</span>
          <span className="text-3xl font-bold text-white">RicãoBet Admin</span>
        </span>
      </div>
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-casino-green/20 bg-casino-card p-6 shadow-neon-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
