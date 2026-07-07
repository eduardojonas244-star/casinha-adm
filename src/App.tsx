import { Routes, Route, Navigate, NavLink, useNavigate } from "react-router-dom";
import { health } from "./mock/data";
import { DashboardPage } from "./pages/Dashboard";
import { PlayersPage } from "./pages/Players";
import { PlayerProfilePage } from "./pages/PlayerProfile";
import { PaymentsPage } from "./pages/Payments";
import { KycPage } from "./pages/Kyc";
import { KycReviewPage } from "./pages/KycReview";
import { BonusPage } from "./pages/Bonus";
import { AffiliatesPage } from "./pages/Affiliates";
import { AffiliateDetailPage } from "./pages/AffiliateDetail";
import { GamesPage } from "./pages/Games";
import { MembersPage } from "./pages/Members";
import { RolesPage } from "./pages/Roles";
import { AuditLogPage } from "./pages/AuditLog";
import { MarketingPage } from "./pages/Marketing";
import { PlaceholderPage } from "./pages/Placeholder";

function HealthBar() {
  const navigate = useNavigate();
  return (
    <div className="health-bar">
      <strong style={{ color: "var(--text)", fontSize: 12 }}>Saúde da operação</strong>
      {health.map((h) => (
        <span key={h.label} className="health-item" title={h.detail} onClick={() => navigate("/payments?tab=gateways")}>
          <span className={`health-dot ${h.status}`} />
          {h.label}
        </span>
      ))}
      <div style={{ flex: 1 }} />
      <span className="dim">qua, 01/07/2026 · 20:12</span>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const item = (to: string, label: string) => (
    <NavLink to={to} className={({ isActive }) => (isActive ? "active" : "")}>
      {label}
    </NavLink>
  );

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">RicaoBet BKO</div>
        <nav>
          {item("/dashboard", "Dashboard")}
          <div className="nav-section">Operação</div>
          {item("/players", "Jogadores")}
          {item("/payments", "Pagamentos")}
          {item("/kyc", "KYC")}
          {item("/bonus", "Bônus")}
          {item("/affiliates", "Afiliados")}
          {item("/games", "Jogos & Conteúdo")}
          <div className="nav-section">Administração</div>
          {item("/marketing", "Tracking (Meta)")}
          {item("/members", "Equipe")}
          {item("/roles", "Papéis & Permissões")}
          {item("/audit", "Audit Log")}
          <div className="nav-section">Fase 2</div>
          {item("/crm", "CRM")}
          {item("/risk", "Risco & Compliance")}
          {item("/support", "Suporte")}
          {item("/reports", "Relatórios")}
        </nav>
        <div className="user-box">
          <div>hugo@ricaobet.dev</div>
          <div style={{ margin: "4px 0" }}>
            <span className="tag blue">ADMIN</span> <span className="tag amber">Demo</span>
          </div>
        </div>
      </aside>
      <div className="content-col">
        <HealthBar />
        <main className="main">{children}</main>
      </div>
    </div>
  );
}

export function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/players" element={<PlayersPage />} />
        <Route path="/players/:id" element={<PlayerProfilePage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/kyc" element={<KycPage />} />
        <Route path="/kyc/:id" element={<KycReviewPage />} />
        <Route path="/bonus" element={<BonusPage />} />
        <Route path="/affiliates" element={<AffiliatesPage />} />
        <Route path="/affiliates/:id" element={<AffiliateDetailPage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/marketing" element={<MarketingPage />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/audit" element={<AuditLogPage />} />
        <Route path="/crm" element={<PlaceholderPage title="CRM" description="Segmentos, jornadas, campanhas multicanal e medição por holdout." />} />
        <Route path="/risk" element={<PlaceholderPage title="Risco & Compliance" description="Central de alertas, fingerprint/multiconta, AML e relatórios regulatórios." />} />
        <Route path="/support" element={<PlaceholderPage title="Suporte" description="Integração com a plataforma de tickets (anti-zombie, turnos, rating)." />} />
        <Route path="/reports" element={<PlaceholderPage title="Relatórios" description="GGR/NGR, coortes, LTV e aquisição." />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Shell>
  );
}
