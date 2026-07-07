import { useNavigate } from "react-router-dom";
import { dashboard, brl } from "../mock/data";
import { Kpi } from "../ui/Kpi";
import { PeriodSelector } from "../ui/PeriodSelector";

export function DashboardPage() {
  const navigate = useNavigate();
  return (
    <>
      {/* Filtro de período: Hoje / 7 dias / 30 dias / Custom */}
      <div className="toolbar">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle" style={{ margin: 0 }}>Visão consolidada da operação — todos os números derivados do ledger.</p>
        </div>
        <div className="spacer" />
        <PeriodSelector />
      </div>

      <div className="panel" style={{ marginBottom: 16 }}>
        <h3 className="panel-title">Ação necessária</h3>
        <div className="kpi-grid">
          {dashboard.actions.map((a) => (
            <Kpi key={a.label} label={a.label} value={a.value} sub={a.sub} to={a.to} tone={a.tone} />
          ))}
        </div>
      </div>

      {/* Fluxo de caixa */}
      <div className="panel" style={{ marginBottom: 16 }}>
        <h3 className="panel-title">Fluxo de caixa</h3>
        <div className="kpi-grid">
          {dashboard.cashflow.map((c) => (
            <Kpi key={c.label} label={c.label} value={c.value} sub={c.sub} delta={c.delta} />
          ))}
        </div>
      </div>

      {/* Resultado: GGR → NGR */}
      <div className="panel" style={{ marginBottom: 16 }}>
        <h3 className="panel-title">Resultado</h3>
        <div className="kpi-grid">
          {dashboard.result.map((c) => (
            <Kpi key={c.label} label={c.label} value={c.value} sub={c.sub} delta={c.delta} />
          ))}
        </div>
        <p className="dim" style={{ fontSize: 12, margin: "10px 0 0" }}>
          NGR = GGR − bônus convertido − taxa da processadora.
        </p>
      </div>

      <div className="grid-2" style={{ marginBottom: 16 }}>
        {/* Carteiras */}
        <div className="panel">
          <h3 className="panel-title">Carteiras</h3>
          <div className="kpi-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
            {dashboard.wallets.map((c) => (
              <Kpi key={c.label} label={c.label} value={c.value} sub={c.sub} delta={c.delta} />
            ))}
          </div>
        </div>

        {/* Aquisição & atividade */}
        <div className="panel">
          <h3 className="panel-title">Aquisição & atividade</h3>
          <div className="kpi-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
            {dashboard.acquisition.map((c) => (
              <Kpi key={c.label} label={c.label} value={c.value} sub={c.sub} delta={c.delta} />
            ))}
          </div>
          <p className="dim" style={{ fontSize: 12, margin: "10px 0 0" }}>
            Usuários ativos = <strong>depositaram</strong> no período selecionado.
          </p>
        </div>
      </div>

      <div className="grid-2">
        {/* Top 5 jogos por GGR */}
        <div className="panel">
          <h3 className="panel-title">Top 5 jogos por GGR</h3>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Jogo</th>
                  <th>Provedor</th>
                  <th className="right">Apostado</th>
                  <th className="right">GGR</th>
                  <th className="right">Sessões</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.topGames.map((g) => (
                  <tr key={g.game} className="clickable" onClick={() => navigate("/games?tab=catalogo")}>
                    <td style={{ fontWeight: 600 }}>{g.game}</td>
                    <td className="dim">{g.provider}</td>
                    <td className="right mono">{brl(g.wagered)}</td>
                    <td className="right mono pos">{brl(g.ggr)}</td>
                    <td className="right mono">{g.sessions.toLocaleString("pt-BR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top 5 provedoras por GGR */}
        <div className="panel">
          <h3 className="panel-title">Top 5 provedoras por GGR</h3>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Provedora</th>
                  <th className="right">Jogos</th>
                  <th className="right">Apostado</th>
                  <th className="right">GGR</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.topProviders.map((p) => (
                  <tr key={p.provider} className="clickable" onClick={() => navigate("/games?tab=provedores")}>
                    <td style={{ fontWeight: 600 }}>{p.provider}</td>
                    <td className="right mono">{p.games}</td>
                    <td className="right mono">{brl(p.wagered)}</td>
                    <td className="right mono pos">{brl(p.ggr)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
