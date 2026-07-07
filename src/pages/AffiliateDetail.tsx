import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { affiliates, affiliateReceipts, brl, dt, pct } from "../mock/data";
import { Kpi } from "../ui/Kpi";
import { PeriodSelector } from "../ui/PeriodSelector";
import { ConfirmModal } from "../ui/ConfirmModal";
import { StatusTag } from "../ui/StatusTag";
import { useToast } from "../ui/Toast";

export function AffiliateDetailPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const [payModal, setPayModal] = useState(false);
  const a = affiliates.find((x) => x.id === id) ?? affiliates[0];
  const receipts = affiliateReceipts.filter((r) => r.affiliateId === a.id);

  return (
    <>
      <div className="toolbar" style={{ marginBottom: 6 }}>
        <Link to="/affiliates" className="dim">← Afiliados</Link>
      </div>
      <div className="toolbar">
        <div>
          <h1 className="page-title">
            {a.code} <StatusTag value={a.status} /> <span className="tag blue">{a.model}</span>
          </h1>
          <p className="page-subtitle" style={{ margin: 0 }}>
            {a.user} · chave PIX <span className="mono">{a.pixKey}</span> · mesma visão que o afiliado acessa no portal dele
          </p>
        </div>
        <div className="spacer" />
        <PeriodSelector />
      </div>

      <div className="panel" style={{ marginBottom: 14, borderColor: a.toReceive > 0 ? "var(--amber)" : undefined }}>
        <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <div className="kpi-label">Comissão a receber</div>
            <div className="kpi-value" style={{ color: a.toReceive > 0 ? "var(--amber)" : undefined }}>{brl(a.toReceive)}</div>
          </div>
          <div style={{ flex: 1 }} />
          <button className="primary" disabled={a.toReceive === 0} onClick={() => setPayModal(true)}>
            Pagar afiliado (PIX via processadora ativa)
          </button>
        </div>
        <p className="dim" style={{ fontSize: 12, margin: "10px 0 0" }}>
          Exige permissão <span className="mono">affiliates.pay</span> + limite por papel. Sai pela conta{" "}
          <span className="mono">affiliate_payouts</span> do ledger — a conciliação continua fechando em zero.
        </p>
      </div>

      <div className="panel" style={{ marginBottom: 14 }}>
        <h3 className="panel-title">Funil</h3>
        <div className="kpi-grid">
          <Kpi label="Cadastros" value={a.registrations.toLocaleString("pt-BR")} />
          <Kpi label="FTDs" value={a.ftds.toString()} sub={`conversão ${pct((a.ftds / a.registrations) * 100)}`} />
          <Kpi label="Valor de FTD" value={brl(a.ftdValue)} />
          <Kpi label="Ticket médio dep." value={brl(Math.round(a.depositsValue / a.depositsCount))} />
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 14 }}>
        <h3 className="panel-title">Financeiro</h3>
        <div className="kpi-grid">
          <Kpi label="Depósitos" value={brl(a.depositsValue)} sub={`${a.depositsCount.toLocaleString("pt-BR")} transações`} />
          <Kpi label="Saques" value={brl(a.withdrawalsValue)} />
          <Kpi label="NET depósito" value={brl(a.depositsValue - a.withdrawalsValue)} />
          <Kpi label="Total apostado" value={brl(a.betsValue)} />
          <Kpi label="GGR" value={brl(a.ggr)} />
          <Kpi label="NGR do afiliado" value={brl(a.ngr)} sub="NGR dos jogadores − a pagar pro afiliado" />
        </div>
      </div>

      <div className="panel">
        <h3 className="panel-title">Comprovantes de pagamento deste afiliado</h3>
        {receipts.length === 0 && <div className="empty-state"><h3>Nenhum pagamento ainda</h3></div>}
        {receipts.map((r) => (
          <div key={r.id} className="wallet-cell" style={{ marginBottom: 6, display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <span className="mono dim">{r.id}</span>
            <span className="mono">{dt(r.at)}</span>
            <strong className="mono">{brl(r.amount)}</strong>
            <span className="mono dim">e2e {r.e2e}</span>
            <div style={{ flex: 1 }} />
            <button className="small" onClick={() => toast("Comprovante exportado em PDF (demonstração)")}>Export PDF</button>
          </div>
        ))}
      </div>

      {payModal && (
        <ConfirmModal
          title={`Pagar ${a.code} — ${brl(a.toReceive)}`}
          onClose={() => setPayModal(false)}
          onConfirm={() => toast(`Pagamento de ${brl(a.toReceive)} disparado via PagFast — lançamento em affiliate_payouts + comprovante gerado (demonstração)`)}
        >
          <div className="wallet-cell">
            <div className="lbl">Valor</div>
            <div className="val">{brl(a.toReceive)}</div>
            <div className="lbl" style={{ marginTop: 8 }}>Chave PIX do afiliado</div>
            <div className="mono">{a.pixKey}</div>
            <div className="lbl" style={{ marginTop: 8 }}>Processadora</div>
            <div>PagFast (ativa)</div>
          </div>
        </ConfirmModal>
      )}
    </>
  );
}
