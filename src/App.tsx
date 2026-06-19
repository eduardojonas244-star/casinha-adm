import type { ReactNode } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AdminShell } from './components/layout/AdminShell';
import { AuthLayout } from './components/layout/AuthLayout';
import { AdminRoute } from './routes/AdminRoute';
import { GuestRoute } from './routes/GuestRoute';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { UsersPage } from './pages/UsersPage';
import { WalletAdjustmentPage } from './pages/WalletAdjustmentPage';
import { BonusesPage } from './pages/BonusesPage';
import { GamesPage } from './pages/GamesPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { ProvidersPage } from './pages/ProvidersPage';
import { MatchHistoryPage } from './pages/MatchHistoryPage';
import { GameLaunchConfigPage } from './pages/GameLaunchConfigPage';
import { PlayFiverKeysPage } from './pages/PlayFiverKeysPage';
import { PagnovoCredentialsPage } from './pages/PagnovoCredentialsPage';
import { PagnovoWebhooksPage } from './pages/PagnovoWebhooksPage';
import { AffiliatesPage } from './pages/AffiliatesPage';
import { AccessDeniedPage } from './pages/AccessDeniedPage';

function Staff({ children }: { children: ReactNode }) {
  return <AdminRoute>{children}</AdminRoute>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/access-denied" element={<AccessDeniedPage />} />

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        </Route>

        <Route
          element={
            <Staff>
              <AdminShell />
            </Staff>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="wallets/adjustments" element={<WalletAdjustmentPage />} />
          <Route path="bonuses" element={<BonusesPage />} />
          <Route path="games" element={<GamesPage />} />
          <Route path="games/categories" element={<CategoriesPage />} />
          <Route path="games/categories/:id" element={<CategoryDetailPage />} />
          <Route path="games/providers" element={<ProvidersPage />} />
          <Route path="games/match-history" element={<MatchHistoryPage />} />
          <Route path="games/launch-config" element={<GameLaunchConfigPage />} />
          <Route path="games/keys" element={<PlayFiverKeysPage />} />
          <Route path="payments/credentials" element={<PagnovoCredentialsPage />} />
          <Route path="payments/webhooks" element={<PagnovoWebhooksPage />} />
          <Route path="affiliates" element={<AffiliatesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
