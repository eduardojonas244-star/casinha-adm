import { useNavigate } from "react-router-dom";
import { affiliates, affiliateReceipts, brl, dt, pct } from "../mock/data";
import { StatusTag } from "../ui/StatusTag";
import { Tabs, useTab } from "../ui/Tabs";
import { Kpi } from "../ui/Kpi";
import { PeriodSelector } from "../ui/PeriodSelector";
import { useToast } from "../ui/Toast";

const TABS = [
  { key: "lista", label: "Afiliados" },
  { key: "kpis", label: "KPIs agregados" },
  { key: "comprovantes", label: "Comprovantes de pagamento" },
];

export function AffiliatesPage() {
  const tab = useTab(TABS);
  return (
    <>
      <h1 className="page-title">Afiliados</h1>
      <p className="page-subtitle">CPA / RevShare / híbrido · atribuição no cadastro, imutável após o FTD.</p>
      <Tabs tabs={TABS} />
      {tab === "lista" && <ListTab />}
      {tab === "kpis" && <KpisTab />}
      {tab === "comprovantes" && <ReceiptsTab />}
    </>
  );
}

function ListTab() {
  const navigate = useNavigate();
  const { toast } = useToast();
  return (
    <div className="panel">
      <div className="toolbar">
        <div className="spacer" />
        <button className="primary" onClick={() => toast("Novo afiliado: gera código e link rastreado (demonstração)")}>+ Novo afiliado</button>
      </div>
      <div className="table-wrap">
        <table className="data">
          <thead><tr><th>Código</th><th>Usuário vinculado</th><th>Modelo</th><th className="right">A receber</th><th className="right">Cadastros</th><th className="right">FTDs</th><th>Status</th></tr></thead>
          <tbody>
            {affiliates.map((a) => (
              <tr key={a.id} className="clickable" onClick={() => navigate(`/affiliates/${a.id}`)}>
                <td><span className="mono" style={{ fontWeight: 700 }}>{a.code}</span></td>
                <td className="dim">{a.user}</td>
                <td><span className="tag blue">{a.model}</span></td>
                <td className="right mono" style={a.toReceive > 0 ? { color: "var(--amber)", fontWeight: 700 } : undefined}>{brl(a.toReceive)}</td>
                <td className="right mono">{a.registrations.toLocaleString("pt-BR")}</td>
                <td className="right mono">{a.ftds}</td>
                <td><StatusTag value={a.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KpisTab() {
  const sum = (fn: (a: typeof affiliates[number]) => number) => affiliates.reduce((acc, a) => acc + fn(a), 0);
  const totalDeposits = sum((a) => a.depositsValue);
  const totalWithdrawals = sum((a) => a.withdrawalsValue);
  const totalRegs = sum((a) => a.registrations);
  const totalFtds = sum((a) => a.ftds);
  return (
    <div className="panel">
      <div className="toolbar">
        <h3 className="panel-title" style={{ margin: 0 }}>Todos os afiliados</h3>
        <div className="spacer" />
        <PeriodSelector />
      </div>
      <div className="kpi-grid">
        <Kpi label="Depósitos de afiliados" value={brl(totalDeposits)} sub={`${sum((a) => a.depositsCount).toLocaleString("pt-BR")} transações`} />
        <Kpi label="Saques" value={brl(totalWithdrawals)} />
        <Kpi label="NET depósito" value={brl(totalDeposits - totalWithdrawals)} sub="depósitos − saques" />
        <Kpi label="GGR gerado" value={brl(sum((a) => a.ggr))} />
        <Kpi label="Cadastros" value={totalRegs.toLocaleString("pt-BR")} />
        <Kpi label="FTDs" value={totalFtds.toString()} sub={`conversão ${pct((totalFtds / totalRegs) * 100)}`} />
        <Kpi label="Valor de FTD" value={brl(sum((a) => a.ftdValue))} sub="soma dos primeiros depósitos" />
        <Kpi label="Ticket médio dep." value={brl(Math.round(totalDeposits / sum((a) => a.depositsCount)))} />
      </div>
    </div>
  );
}

function ReceiptsTab() {
  const { toast } = useToast();
  const grouped = affiliates
    .map((a) => ({ affiliate: a, receipts: affiliateReceipts.filter((r) => r.affiliateId === a.id) }))
    .filter((g) => g.receipts.length > 0);
  return (
    <div className="panel">
      <p className="dim" style={{ fontSize: 12.5, marginTop: 0 }}>
        Central de comprovantes — cada pagamento gera comprovante automaticamente. Pagamentos saem pela conta
        <span className="mono"> affiliate_payouts</span> do ledger, nunca misturados com saques de jogadores.
      </p>
      {grouped.map(({ affiliate, receipts }) => (
        <div key={affiliate.id} style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>
            {affiliate.code} <span className="dim" style={{ fontWeight: 400 }}>· {receipts.length} pagamento(s)</span>
          </div>
          {receipts.map((r) => (
            <div key={r.id} className="wallet-cell" style={{ marginBottom: 6, display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
              <span className="mono dim">{r.id}</span>
              <span className="mono">{dt(r.at)}</span>
              <strong className="mono">{brl(r.amount)}</strong>
              <span className="mono dim">txid {r.txid} · e2e {r.e2e}</span>
              <span className="dim" style={{ fontSize: 12 }}>pago por {r.paidBy}</span>
              <div style={{ flex: 1 }} />
              <button className="small" onClick={() => toast("Comprovante exportado em PDF (demonstração)")}>Export PDF</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
