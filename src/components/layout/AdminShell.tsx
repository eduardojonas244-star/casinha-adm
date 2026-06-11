import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { paths } from '../../routes/paths';

const mainNav = [
  { to: paths.dashboard, label: 'Dashboard', icon: '📊' },
  { to: paths.users, label: 'Usuários', icon: '👥' },
  { to: paths.walletAdjustments, label: 'Carteira', icon: '💰' },
  { to: paths.bonuses, label: 'Bônus', icon: '🎁' },
  { to: paths.affiliates, label: 'Afiliados', icon: '🤝' },
];

const gamesNav = [
  { to: paths.gameCategories, label: 'Todas as Categorias', icon: '📁' },
  { to: paths.gameProviders, label: 'Todos os Provedores', icon: '📁' },
  { to: paths.games, label: 'Todos os Jogos', icon: '📁' },
  { to: paths.gameMatchHistory, label: 'Histórico de Partidas', icon: '📁' },
  { to: paths.gameLaunchConfig, label: 'Config. Abertura', icon: '🔒' },
  { to: paths.gameKeys, label: 'Chaves dos Jogos', icon: '⚙️' },
];

export function AdminShell() {
  const { profile, logout } = useAuth();
  const [gamesOpen, setGamesOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-casino-bg">
      <aside className="fixed inset-y-0 left-0 z-20 flex w-60 flex-col border-r border-casino-border bg-casino-surface">
        <div className="border-b border-casino-border px-5 py-6">
          <span className="inline-flex items-center gap-2">
            <span className="text-xl text-casino-green">◆</span>
            <span className="text-lg font-bold text-white">Admin</span>
          </span>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {mainNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === paths.dashboard}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  isActive
                    ? 'bg-casino-green/10 font-semibold text-casino-green'
                    : 'text-casino-muted hover:bg-casino-card hover:text-white'
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setGamesOpen((o) => !o)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-casino-muted hover:bg-casino-card hover:text-white"
            >
              <span className="flex items-center gap-3">
                <span>🎰</span>
                Jogos & Conteúdo
              </span>
              <span className="text-xs">{gamesOpen ? '▲' : '▼'}</span>
            </button>
            {gamesOpen && (
              <div className="ml-2 mt-1 space-y-0.5 border-l border-casino-border pl-2">
                {gamesNav.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === paths.games}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                        isActive
                          ? 'bg-casino-green/10 font-semibold text-casino-green'
                          : 'text-casino-muted hover:bg-casino-card hover:text-white'
                      }`
                    }
                  >
                    <span className="text-xs">{item.icon}</span>
                    {item.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </nav>
      </aside>

      <div className="ml-60 flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-casino-border bg-casino-bg/95 px-8 py-4 backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-wider text-casino-muted">Painel operacional</p>
            <p className="font-semibold text-white">{profile?.name ?? '—'}</p>
          </div>
          <div className="flex items-center gap-3">
            {profile && (
              <span className="rounded-full border border-casino-green/30 bg-casino-green/10 px-3 py-1 text-xs font-semibold text-casino-green">
                {profile.role}
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={() => void logout()}>
              Sair
            </Button>
          </div>
        </header>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
