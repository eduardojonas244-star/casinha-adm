import { useState } from "react";
import { Link } from "react-router-dom";
import {
  withdrawals, deposits, gateways, failoverConfig,
  reconciliationRuns, reconciliationItems, brl, dt, d, pct,
} from "../mock/data";
import { StatusTag } from "../ui/StatusTag";
import { Tabs, useTab } from "../ui/Tabs";
import { ConfirmModal } from "../ui/ConfirmModal";
import { Toggle } from "../ui/Toggle";
import { useToast } from "../ui/Toast";

const TABS = [
  { key: "saques", label: "Fila de saques", count: withdrawals.filter((w) => w.status === "PENDING").length },
  { key: "depositos", label: "Depósitos" },
  { key: "gateways", label: "Gateways" },
  { key: "automacoes", label: "Automações / failover" },
  { key: "conciliacao", label: "Conciliação" },
];

export function PaymentsPage() {
  const tab = useTab(TABS);
  return (
    <>
      <h1 className="page-title">Pagamentos</h1>
      <p className="page-subtitle">Fila de saques com checks automáticos, depósitos, processadoras, failover e fechamento diário.</p>
      <Tabs tabs={TABS} />
      {tab === "saques" && <WithdrawalsTab />}
      {tab === "depositos" && <DepositsTab />}
      {tab === "gateways" && <GatewaysTab />}
      {tab === "automacoes" && <FailoverTab />}
      {tab === "conciliacao" && <ReconciliationTab />}
    </>
  );
}

// ---------------- Fila de saques ----------------
function Check({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="check">
      {ok ? <span className="ok">✓</span> : <span className="fail">✗</span>} {label}
    </div>
  );
}

function WithdrawalsTab() {
  const { toast } = useToast();
  const [status, setStatus] = useState("PENDING");
  const [modal, setModal] = useState<string | null>(null);
  const rows = withdrawals.filter((w) => w.status === status);

  return (
    <div className="panel">
      <div className="toolbar">
        {(["PENDING", "APPROVED", "PAID", "REJECTED", "FAILED"] as const).map((s) => (
          <button key={s} className={`small ${status === s ? "primary" : ""}`} onClick={() => setStatus(s)}>
            {{ PENDING: "Pendentes", APPROVED: "Aprovados", PAID: "Pagos", REJECTED: "Rejeitados", FAILED: "Falhas" }[s]}
            {" "}({withdrawals.filter((w) => w.status === s).length})
          </button>
        ))}
        <div className="spacer" />
        <span className="dim" style={{ fontSize: 12 }}>SLA médio do dia: <strong style={{ color: "var(--amber)" }}>1h44</strong></span>
        <button className="small" onClick={() => setModal("Aprovar em massa")}>Aprovar em massa</button>
      </div>

      <div className="wallet-cell" style={{ marginBottom: 12, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <Toggle defaultOn={false} onChange={(v) => toast(v ? "Auto-aprovação LIGADA (demonstração)" : "Auto-aprovação desligada")} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>Auto-aprovação de saques</div>
          <div className="dim" style={{ fontSize: 12 }}>Aprovar automaticamente até <strong>R$ 100,00</strong> com todos os checks ✓ e risco baixo · default OFF</div>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th></th>
              <th>Jogador</th>
              <th className="right">Valor</th>
              <th>Chave PIX</th>
              <th>Na fila</th>
              <th>Risco</th>
              <th>Checks automáticos</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((w) => (
              <tr key={w.id}>
                <td><input type="checkbox" disabled={!Object.values(w.checks).every(Boolean)} /></td>
                <td>
                  <Link to={`/players/${w.playerId}`} style={{ fontWeight: 600 }}>{w.playerName}</Link>
                  <div className="dim" style={{ fontSize: 12 }}>{w.id} · {w.email}</div>
                  {w.blockedByOperator && <span className="tag red">bloqueado por operador</span>}
                </td>
                <td className="right mono" style={{ fontWeight: 700 }}>{brl(w.amount)}</td>
                <td className="mono">
                  {w.pixKey}
                  <div>{w.pixOwnerMatch ? <span className="check"><span className="ok">✓ CPF do titular</span></span> : <span className="check"><span className="fail">✗ não pertence ao titular</span></span>}</div>
                </td>
                <td className="nowrap" style={w.minutesInQueue > 60 ? { color: "var(--red)", fontWeight: 700 } : undefined}>
                  {w.status === "PENDING" ? `${Math.floor(w.minutesInQueue / 60)}h${String(w.minutesInQueue % 60).padStart(2, "0")}` : "—"}
                </td>
                <td><StatusTag value={w.risk} /></td>
                <td>
                  <Check ok={w.checks.kyc} label="KYC aprovado" />
                  <Check ok={w.checks.rollover} label="Rollover cumprido" />
                  <Check ok={w.checks.pixCpf} label="PIX = CPF titular" />
                  <Check ok={w.checks.winRatio} label="Ganho ≤ 5× depósito" />
                  <Check ok={w.checks.device} label="Device exclusivo" />
                </td>
                <td className="nowrap">
                  {w.status === "PENDING" && (
                    <>
                      <button className="link" onClick={() => setModal(`Aprovar ${w.id} — ${brl(w.amount)}`)}>Aprovar</button>
                      <button className="link" style={{ color: "var(--red)" }} onClick={() => setModal(`Rejeitar ${w.id}`)}>Rejeitar</button>
                      <button className="link" style={{ color: "var(--amber)" }} onClick={() => setModal(`Escalar ${w.id} pra risco`)}>Escalar</button>
                    </>
                  )}
                  {w.status === "FAILED" && (
                    <button className="link" onClick={() => toast("Reprocessamento disparado — idempotente (demonstração)")}>Reprocessar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <div className="empty-state"><h3>Nada aqui</h3><p>Nenhum saque neste status.</p></div>}
      </div>

      <p className="dim" style={{ fontSize: 12, marginBottom: 0 }}>
        Estados no ledger: pedido <strong>reserva</strong> o valor → aprovação converte em saída → rejeição estorna.
        Aprovação em massa só com todos os checks ✓ e risco baixo. Aprovações respeitam o limite do papel (FINANCEIRO até R$ 500).
      </p>

      {modal && (
        <ConfirmModal
          title={modal}
          danger={modal.startsWith("Rejeitar")}
          onClose={() => setModal(null)}
          onConfirm={() => toast(`${modal}: executado e registrado no audit log (demonstração)`)}
        >
          {modal.startsWith("Rejeitar") && (
            <p className="dim" style={{ marginTop: 0 }}>O motivo é enviado ao jogador e a reserva é estornada no ledger.</p>
          )}
          {modal.startsWith("Aprovar em massa") && (
            <p className="dim" style={{ marginTop: 0 }}>Somente linhas com todos os checks ✓ e risco baixo. Linhas com device compartilhado ficam de fora.</p>
          )}
        </ConfirmModal>
      )}
    </div>
  );
}

// ---------------- Depósitos ----------------
function DepositsTab() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [receipt, setReceipt] = useState<typeof deposits[number] | null>(null);
  const rows = deposits.filter((dep) => !search || dep.txid.toLowerCase().includes(search.toLowerCase()) || (dep.e2e ?? "").toLowerCase().includes(search.toLowerCase()) || dep.playerName.toLowerCase().includes(search.toLowerCase()));

  const paid = deposits.filter((x) => x.status === "PAID").length;

  return (
    <div className="panel">
      <div className="toolbar">
        <input placeholder="Buscar por txid / e2e / nome…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: 280 }} />
        <input type="date" defaultValue="2026-07-01" />
        <div className="spacer" />
        <span className="dim" style={{ fontSize: 12 }}>
          Funil PIX do período: {deposits.length} gerados → {paid} pagos ({pct((paid / deposits.length) * 100)})
        </span>
        <button className="small" onClick={() => toast("Depósito manual: exige motivo + respeita limite do papel (demonstração)")}>+ Depósito manual</button>
      </div>
      <div className="table-wrap">
        <table className="data">
          <thead><tr><th>Jogador</th><th className="right">Valor</th><th>Status</th><th>Data</th><th>Gateway</th><th>Comprovante</th><th></th></tr></thead>
          <tbody>
            {rows.map((dep) => (
              <tr key={dep.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{dep.playerName}</div>
                  <div className="dim" style={{ fontSize: 12 }}>{dep.email}</div>
                </td>
                <td className="right mono">{brl(dep.amount)}</td>
                <td><StatusTag value={dep.status} /></td>
                <td className="nowrap mono">{dt(dep.at)}</td>
                <td>{dep.gateway}</td>
                <td>
                  {dep.e2e ? (
                    <button className="link" onClick={() => setReceipt(dep)}>ver comprovante</button>
                  ) : (
                    <span className="dim">—</span>
                  )}
                </td>
                <td>
                  {dep.status !== "PAID" && (
                    <button className="link" onClick={() => toast("Webhook reprocessado — idempotente (demonstração)")}>Reprocessar webhook</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {receipt && (
        <div className="modal-backdrop" onClick={() => setReceipt(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Comprovante de recebimento — {receipt.id}</h3>
            <div className="wallet-cell">
              <div className="lbl">Pagador</div>
              <div>{receipt.playerName}</div>
              <div className="lbl" style={{ marginTop: 8 }}>Valor</div>
              <div className="val">{brl(receipt.amount)}</div>
              <div className="lbl" style={{ marginTop: 8 }}>txid</div>
              <div className="mono">{receipt.txid}</div>
              <div className="lbl" style={{ marginTop: 8 }}>e2e</div>
              <div className="mono">{receipt.e2e}</div>
              <div className="lbl" style={{ marginTop: 8 }}>Recebido em</div>
              <div className="mono">{dt(receipt.at)} · {receipt.gateway}</div>
            </div>
            <div className="actions">
              <button onClick={() => setReceipt(null)}>Fechar</button>
              <button className="primary" onClick={() => setReceipt(null)}>Exportar PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------- Gateways ----------------
function GatewaysTab() {
  const { toast } = useToast();
  return (
    <>
      <div className="toolbar">
        <div className="spacer" />
        <button className="primary" onClick={() => toast("CRUD de processadora (demonstração)")}>+ Nova processadora</button>
      </div>
      {gateways.map((g) => (
        <div key={g.id} className="panel" style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <strong style={{ fontSize: 15 }}>{g.name}</strong>
                <span className={`health-dot ${g.healthy ? "green" : "red"}`} />
                <span className="dim" style={{ fontSize: 12 }}>{g.healthy ? `${g.latencyMs}ms` : "sem resposta"}</span>
                {g.priority === 1 && <span className="tag green">principal</span>}
                {!g.active && <span className="tag gray">inativa</span>}
              </div>
              <div className="dim" style={{ fontSize: 12, marginTop: 6 }}>
                API: <span className="mono">{g.apiUrl}</span>
              </div>
              <div className="dim" style={{ fontSize: 12, marginTop: 2 }}>
                Webhook: <span className="mono">{g.webhookUrl}</span>{" "}
                <button className="link small" onClick={() => toast("URL copiada")}>copiar</button>
              </div>
              <div className="dim" style={{ fontSize: 12, marginTop: 2 }}>
                Secret Key: <span className="mono">••••••••••••</span>{" "}
                <button className="link small" onClick={() => toast("Troca de secret (demonstração) — nunca exibida após salvar")}>trocar</button>
              </div>
            </div>
            <div className="wallet-cell">
              <div className="lbl">Taxas (alimenta o NGR)</div>
              <div className="val" style={{ fontSize: 14 }}>{pct(g.feePct)} + {brl(g.feeFixed)}</div>
            </div>
            <div className="wallet-cell">
              <div className="lbl">Roteamento por faixa</div>
              <div style={{ fontSize: 13 }}>
                {g.rangeMin === null && g.rangeMax === null && "qualquer valor"}
                {g.rangeMax !== null && g.rangeMin === null && `até ${brl(g.rangeMax)}`}
                {g.rangeMin !== null && `acima de ${brl(g.rangeMin - 1)}`}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
              <Toggle defaultOn={g.active} onChange={() => toast("Toggle de processadora (demonstração)")} />
              <button className="small" onClick={() => toast(g.healthy ? "Conexão OK — 200 em 180ms" : "Falha: timeout após 5s")}>Testar conexão</button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

// ---------------- Failover ----------------
function FailoverTab() {
  const { toast } = useToast();
  return (
    <>
      <div className="panel" style={{ marginBottom: 12 }}>
        <h3 className="panel-title">Regra de failover automático</h3>
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <Toggle defaultOn={failoverConfig.enabled} onChange={() => toast("Failover automático (demonstração)")} />
          <span>
            Se nenhum depósito for <strong>confirmado</strong> em{" "}
            <input defaultValue={failoverConfig.windowMinutes} style={{ width: 52 }} /> minutos com a processadora ativa
            (havendo pelo menos <input defaultValue={failoverConfig.minGenerated} style={{ width: 44 }} /> PIX gerados),
            trocar automaticamente para a reserva.
          </span>
        </div>
        <p className="dim" style={{ fontSize: 12 }}>
          Toda troca automática: audit log + alerta no header de saúde + notificação. Health check ativo por processadora (ping periódico).
        </p>
        <div className="toolbar" style={{ marginBottom: 0 }}>
          <button className="danger small" onClick={() => toast("Troca manual imediata (demonstração + audit)")}>Trocar agora pra PixPago</button>
          <button className="small" onClick={() => toast("Retorno pra principal (demonstração + audit)")}>Voltar pra principal</button>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 12 }}>
        <h3 className="panel-title">Ordem de prioridade (arraste pra reordenar)</h3>
        {gateways.map((g) => (
          <div key={g.id} className="wallet-cell" style={{ marginBottom: 8, display: "flex", gap: 12, alignItems: "center", cursor: "grab" }}>
            <span className="dim">⠿</span>
            <strong>{g.priority}º</strong>
            <span>{g.name}</span>
            <span className={`health-dot ${g.healthy ? "green" : "red"}`} />
            <div style={{ flex: 1 }} />
            {g.priority === 1 && <span className="tag green">ativa agora</span>}
          </div>
        ))}
      </div>

      <div className="panel">
        <h3 className="panel-title">Última troca automática</h3>
        <div className="wallet-cell">
          <div>
            <strong>{failoverConfig.lastSwitch.from} → {failoverConfig.lastSwitch.to}</strong>{" "}
            <span className="dim">em {dt(failoverConfig.lastSwitch.at)}</span>
          </div>
          <div className="dim" style={{ fontSize: 12.5, marginTop: 4 }}>
            Motivo: {failoverConfig.lastSwitch.reason} · retorno pra principal em {dt(failoverConfig.lastSwitch.returnedAt)}
          </div>
        </div>
      </div>
    </>
  );
}

// ---------------- Conciliação ----------------
function ReconciliationTab() {
  const { toast } = useToast();
  const [detail, setDetail] = useState<string | null>(null);
  return (
    <div className="panel">
      <div className="toolbar">
        <span className="dim" style={{ fontSize: 12 }}>Job noturno (BullMQ) gera o fechamento diário ledger × gateway.</span>
        <div className="spacer" />
        <button className="small" onClick={() => toast("Export CSV pra contabilidade (demonstração)")}>Export CSV</button>
      </div>
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Dia</th>
              <th className="right">Depósitos (ledger)</th>
              <th className="right">Depósitos (gateway)</th>
              <th className="right">Saques (ledger)</th>
              <th className="right">Saques (gateway)</th>
              <th className="right">Divergências</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {reconciliationRuns.map((r) => (
              <tr key={r.date}>
                <td className="mono">{d(r.date)}</td>
                <td className="right mono">{brl(r.ledgerDeposits)}</td>
                <td className="right mono">{brl(r.gatewayDeposits)}</td>
                <td className="right mono">{brl(r.ledgerWithdrawals)}</td>
                <td className="right mono">{brl(r.gatewayWithdrawals)}</td>
                <td className="right" style={r.divergences > 0 ? { color: "var(--red)", fontWeight: 700 } : undefined}>{r.divergences}</td>
                <td><StatusTag value={r.status} /></td>
                <td>{r.divergences > 0 && <button className="link" onClick={() => setDetail(r.date)}>ver linhas</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detail && (
        <div className="modal-backdrop" onClick={() => setDetail(null)}>
          <div className="modal" style={{ width: 640 }} onClick={(e) => e.stopPropagation()}>
            <h3>Divergências — {d(detail)}</h3>
            {reconciliationItems.map((i) => (
              <div key={i.id} className="wallet-cell" style={{ marginBottom: 8 }}>
                <div><span className="tag red">{i.kind}</span> <span className="mono">{i.ref}</span> · <strong>{brl(i.amount)}</strong></div>
                <div className="dim" style={{ fontSize: 12, marginTop: 4 }}>{i.note}</div>
              </div>
            ))}
            <div className="actions">
              <button onClick={() => setDetail(null)}>Fechar</button>
              <button className="primary" onClick={() => { toast("Webhooks reentregues — idempotente (demonstração)"); setDetail(null); }}>Reentregar webhooks</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
