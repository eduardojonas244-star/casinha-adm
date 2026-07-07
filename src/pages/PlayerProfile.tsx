import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  playerById, brl, dt, d,
  ledgerLines, deposits, withdrawals, bonusGrants,
  playerLogins, playerNotes, playerBets, responsibleGaming,
} from "../mock/data";
import { StatusTag } from "../ui/StatusTag";
import { Tabs, useTab } from "../ui/Tabs";
import { ConfirmModal } from "../ui/ConfirmModal";
import { PeriodSelector } from "../ui/PeriodSelector";
import { useToast } from "../ui/Toast";

const TABS = [
  { key: "extrato", label: "Carteira & extrato" },
  { key: "depositos", label: "Depósitos" },
  { key: "saques", label: "Saques" },
  { key: "apostas", label: "Apostas / sessões" },
  { key: "bonus", label: "Bônus" },
  { key: "logins", label: "Logins & devices" },
  { key: "notas", label: "Notas internas" },
  { key: "crm", label: "Comunicações CRM" },
  { key: "tickets", label: "Tickets" },
];

export function PlayerProfilePage() {
  const { id } = useParams();
  const p = playerById(id ?? "");
  const tab = useTab(TABS);
  const { toast } = useToast();
  const [modal, setModal] = useState<string | null>(null);

  const action = (title: string) => () => setModal(title);
  const confirm = (msg: string) => () => {
    toast(`${msg} (demonstração — registrado no audit log)`);
  };

  return (
    <>
      <div className="toolbar" style={{ marginBottom: 6 }}>
        <Link to="/players" className="dim">← Jogadores</Link>
      </div>

      {/* Cabeçalho */}
      <div className="panel">
        <div className="profile-header">
          <div className="avatar">{p.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</div>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <h1 className="page-title" style={{ margin: 0 }}>{p.name}</h1>
              <StatusTag value={p.status} />
              <span className="tag blue">{p.segment}</span>
              {p.withdrawBlocked && <span className="tag red">Saque bloqueado por operador</span>}
              {p.deviceShared && <span className="tag amber">Device compartilhado</span>}
            </div>
            <div className="dim" style={{ marginTop: 6, fontSize: 12.5 }}>
              {p.id} · {p.email} · {p.cpf} · {p.phone} · cadastro {d(p.createdAt)}
              {p.affiliate && <> · origem <span className="tag gray">{p.affiliate}</span></>}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", maxWidth: 460, justifyContent: "flex-end" }}>
            <button className="small" onClick={action("Editar saldo real")}>± Saldo real</button>
            <button className="small" onClick={action("Editar saldo bônus")}>± Saldo bônus</button>
            <button className="small danger" onClick={action("Bloquear jogador")}>Bloquear jogador</button>
            <button className="small danger" onClick={action(p.withdrawBlocked ? "Desbloquear saque" : "Bloquear saque")}>
              {p.withdrawBlocked ? "Desbloquear saque" : "Bloquear saque"}
            </button>
            <button className="small" onClick={action("Valor máximo de saque")}>Máx. saque</button>
            <button className="small" onClick={confirm("Link de redefinição de senha enviado ao jogador")}>Resetar senha</button>
            <button className="small" onClick={confirm("Sessões do jogador invalidadas")}>Forçar logout</button>
          </div>
        </div>

        {/* Card carteira */}
        <div style={{ marginTop: 16 }}>
          <div className="toolbar" style={{ marginBottom: 8 }}>
            <h3 className="panel-title" style={{ margin: 0 }}>Carteira (derivada do ledger)</h3>
            <div className="spacer" />
            <PeriodSelector />
          </div>
          <div className="wallet-grid">
            <div className="wallet-cell"><div className="lbl">Saldo real</div><div className="val">{brl(p.balanceReal)}</div></div>
            <div className="wallet-cell"><div className="lbl">Saldo bônus</div><div className="val">{brl(p.balanceBonus)}</div></div>
            <div className="wallet-cell"><div className="lbl">Em aposta (aberto)</div><div className="val">{brl(p.openBets)}</div></div>
            <div className="wallet-cell"><div className="lbl">Depósitos</div><div className="val">{brl(p.totalDeposited)}</div><div className="lbl" style={{ marginTop: 2 }}>{p.depositCount} transações</div></div>
            <div className="wallet-cell"><div className="lbl">Saques</div><div className="val">{brl(p.totalWithdrawn)}</div><div className="lbl" style={{ marginTop: 2 }}>{p.withdrawCount} pedidos</div></div>
            <div className="wallet-cell"><div className="lbl">GGR do jogador</div><div className={`val ${p.ggr >= 0 ? "pos" : "neg"}`}>{brl(p.ggr)}</div></div>
            {p.maxWithdrawOverride !== null && (
              <div className="wallet-cell" style={{ borderColor: "var(--amber)" }}>
                <div className="lbl">Máx. saque (override)</div>
                <div className="val" style={{ color: "var(--amber)" }}>{brl(p.maxWithdrawOverride)}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Jogo responsável */}
      <div className="panel">
        <h3 className="panel-title">Jogo responsável</h3>
        <div className="wallet-grid">
          <div className="wallet-cell">
            <div className="lbl">Limite de depósito</div>
            <div className="val">{responsibleGaming.depositLimit ? brl(responsibleGaming.depositLimit.value) : "—"}</div>
            {responsibleGaming.depositLimit && (
              <div className="lbl" style={{ marginTop: 2 }}>
                {responsibleGaming.depositLimit.period} · definido pelo <strong>{responsibleGaming.depositLimit.setBy}</strong> em {d(responsibleGaming.depositLimit.since)}
              </div>
            )}
          </div>
          <div className="wallet-cell">
            <div className="lbl">Limite de perda</div>
            <div className="val dim">não definido</div>
          </div>
          <div className="wallet-cell">
            <div className="lbl">Limite de sessão</div>
            <div className="val">{responsibleGaming.sessionLimit ? `${responsibleGaming.sessionLimit.value} min` : "—"}</div>
            {responsibleGaming.sessionLimit && (
              <div className="lbl" style={{ marginTop: 2 }}>
                {responsibleGaming.sessionLimit.period} · definido pelo <strong>{responsibleGaming.sessionLimit.setBy}</strong>
              </div>
            )}
          </div>
          <div className="wallet-cell">
            <div className="lbl">Pausa (cooling-off)</div>
            <div className="val dim">inativa</div>
          </div>
          <div className="wallet-cell">
            <div className="lbl">Autoexclusão</div>
            <div className="val dim">{p.status === "SELF_EXCLUDED" ? "ATIVA" : "inativa"}</div>
            <div className="lbl" style={{ marginTop: 2 }}>irreversível pelo período · bloqueia login, depósito e comunicação no serviço</div>
          </div>
        </div>
        <div className="toolbar" style={{ marginTop: 12, marginBottom: 0 }}>
          <button className="small" onClick={action("Editar limites de jogo responsável")}>Editar limites</button>
          <button className="small" onClick={action("Aplicar pausa (cooling-off)")}>Aplicar pausa</button>
          <button className="small danger" onClick={action("Autoexcluir jogador")}>Autoexclusão</button>
        </div>
      </div>

      {/* Abas */}
      <div className="panel">
        <Tabs tabs={TABS} />
        {tab === "extrato" && <ExtratoTab />}
        {tab === "depositos" && <DepositosTab />}
        {tab === "saques" && <SaquesTab />}
        {tab === "apostas" && <ApostasTab />}
        {tab === "bonus" && <BonusTab playerId={p.id} />}
        {tab === "logins" && <LoginsTab />}
        {tab === "notas" && <NotasTab />}
        {(tab === "crm" || tab === "tickets") && (
          <div className="empty-state">
            <h3>Disponível na Fase 2</h3>
            <p>{tab === "crm" ? "Histórico de comunicações CRM (e-mail, push, SMS) com este jogador." : "Tickets de suporte deste jogador."}</p>
          </div>
        )}
      </div>

      {modal && (
        <ConfirmModal
          title={modal}
          danger={/Bloquear|Autoexcluir/.test(modal)}
          onClose={() => setModal(null)}
          onConfirm={() => toast(`${modal}: ação registrada no audit log (demonstração)`)}
        >
          {modal === "Editar saldo real" && <AmountFields kind="real" />}
          {modal === "Editar saldo bônus" && <AmountFields kind="bonus" />}
          {modal === "Valor máximo de saque" && (
            <label className="field">
              Valor máximo por saque (R$) — vazio usa o limite global
              <input placeholder="ex: 1.000,00" defaultValue={p.maxWithdrawOverride ? (p.maxWithdrawOverride / 100).toFixed(2) : ""} />
            </label>
          )}
          {modal === "Autoexcluir jogador" && (
            <>
              <p className="dim" style={{ marginTop: 0 }}>
                Irreversível pelo período escolhido. Bloqueia login, depósito e comunicação <strong>no nível do serviço</strong>.
              </p>
              <label className="field">
                Período
                <select defaultValue="6 meses">
                  <option>30 dias</option>
                  <option>6 meses</option>
                  <option>1 ano</option>
                  <option>Indeterminado</option>
                </select>
              </label>
            </>
          )}
        </ConfirmModal>
      )}
    </>
  );
}

function AmountFields({ kind }: { kind: "real" | "bonus" }) {
  const [op, setOp] = useState<"add" | "remove">("add");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <button className={op === "add" ? "primary" : ""} onClick={() => setOp("add")} type="button">Adicionar</button>
        <button className={op === "remove" ? "danger" : ""} onClick={() => setOp("remove")} type="button">Remover</button>
      </div>
      <label className="field">
        Valor (R$)
        <input placeholder="ex: 100,00" autoFocus />
      </label>
      <p className="dim" style={{ margin: 0, fontSize: 12 }}>
        {kind === "real"
          ? "Sempre via lançamentos no ledger — nunca UPDATE direto. Remoção nunca deixa saldo negativo. Acima do limite do papel exige ADMIN."
          : "Conta de bônus separada no ledger. Adição manual herda o rollover (30x) e a validade padrão (7 dias) da casa."}
      </p>
    </div>
  );
}

function ExtratoTab() {
  const [filter, setFilter] = useState("");
  const rows = ledgerLines.filter((l) => !filter || l.kind === filter);
  return (
    <>
      <div className="toolbar">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">Tipo: todos</option>
          <option value="DEPOSIT">Depósito</option>
          <option value="BET">Aposta</option>
          <option value="WIN">Ganho</option>
          <option value="WITHDRAWAL_RESERVE">Reserva de saque</option>
          <option value="WITHDRAWAL_PAYOUT">Saque pago</option>
          <option value="BONUS_GRANT">Concessão de bônus</option>
          <option value="BONUS_CONVERSION">Conversão de bônus</option>
          <option value="MANUAL_ADJUSTMENT">Ajuste manual</option>
        </select>
      </div>
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr><th>Quando</th><th>Conta</th><th>Lançamento</th><th className="right">Valor</th><th className="right">Saldo corrente</th></tr>
          </thead>
          <tbody>
            {rows.map((l) => (
              <tr key={l.id}>
                <td className="nowrap mono">{dt(l.at)}</td>
                <td><span className={`tag ${l.account === "REAL" ? "green" : "amber"}`}>{l.account === "REAL" ? "Real" : "Bônus"}</span></td>
                <td>{l.desc}</td>
                <td className={`right mono ${l.amount >= 0 ? "pos" : "neg"}`}>{l.amount >= 0 ? "+" : ""}{brl(l.amount)}</td>
                <td className="right mono">{brl(l.balanceAfter)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function DepositosTab() {
  const rows = deposits.slice(0, 5);
  return (
    <div className="table-wrap">
      <table className="data">
        <thead><tr><th>Quando</th><th>Valor</th><th>Status</th><th>Gateway</th><th>txid / e2e</th></tr></thead>
        <tbody>
          {rows.map((dep) => (
            <tr key={dep.id}>
              <td className="nowrap mono">{dt(dep.at)}</td>
              <td className="mono">{brl(dep.amount)}</td>
              <td><StatusTag value={dep.status} /></td>
              <td>{dep.gateway}</td>
              <td className="mono dim">{dep.txid}{dep.e2e ? ` · ${dep.e2e}` : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SaquesTab() {
  const rows = withdrawals.slice(0, 5);
  return (
    <div className="table-wrap">
      <table className="data">
        <thead><tr><th>Pedido</th><th>Quando</th><th className="right">Valor</th><th>Chave PIX</th><th>Status</th></tr></thead>
        <tbody>
          {rows.map((w) => (
            <tr key={w.id}>
              <td className="mono">{w.id}</td>
              <td className="nowrap mono">{dt(w.requestedAt)}</td>
              <td className="right mono">{brl(w.amount)}</td>
              <td className="mono">
                {w.pixKey}{" "}
                <span className={`check ${w.pixOwnerMatch ? "" : ""}`}>
                  {w.pixOwnerMatch ? <span className="ok">✓ titular</span> : <span className="fail">✗ terceiro</span>}
                </span>
              </td>
              <td><StatusTag value={w.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ApostasTab() {
  return (
    <div className="table-wrap">
      <table className="data">
        <thead><tr><th>Round</th><th>Jogo</th><th>Provedor</th><th className="right">Aposta</th><th className="right">Ganho</th><th>Quando</th></tr></thead>
        <tbody>
          {playerBets.map((b) => (
            <tr key={b.round}>
              <td className="mono dim">{b.round}</td>
              <td style={{ fontWeight: 600 }}>{b.game}</td>
              <td className="dim">{b.provider}</td>
              <td className="right mono">{brl(b.bet)}</td>
              <td className={`right mono ${b.win > 0 ? "pos" : "dim"}`}>{b.win > 0 ? brl(b.win) : "—"}</td>
              <td className="nowrap mono">{dt(b.at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BonusTab({ playerId }: { playerId: string }) {
  const { toast } = useToast();
  const [modal, setModal] = useState<string | null>(null);
  const rows = bonusGrants.filter((g) => g.playerId === playerId);
  const list = rows.length > 0 ? rows : bonusGrants.slice(0, 2);
  return (
    <>
      {list.map((g) => {
        const progress = Math.min(100, (g.wagered / g.target) * 100);
        return (
          <div key={g.id} className="wallet-cell" style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ fontWeight: 600 }}>{g.campaign}</div>
                <div className="dim" style={{ fontSize: 12 }}>
                  {g.id} · {brl(g.amount)} · expira {dt(g.expiresAt)}
                </div>
              </div>
              <StatusTag value={g.status} />
              <div style={{ width: 220 }}>
                <div className="dim" style={{ fontSize: 11, marginBottom: 3 }}>
                  Rollover: {brl(g.wagered)} de {brl(g.target)} ({progress.toFixed(0)}%)
                </div>
                <div className="progress"><div style={{ width: `${progress}%` }} /></div>
              </div>
              <button className="small" onClick={() => setModal(`Editar validade — ${g.id}`)}>Validade</button>
              {(g.status === "ATIVO" || g.status === "DORMENTE") && (
                <button className="small danger" onClick={() => setModal(`Cancelar bônus — ${g.id}`)}>Cancelar</button>
              )}
            </div>
          </div>
        );
      })}
      {modal && (
        <ConfirmModal
          title={modal}
          danger={modal.startsWith("Cancelar")}
          onClose={() => setModal(null)}
          onConfirm={() => toast(`${modal}: registrado no audit log (demonstração)`)}
        >
          {modal.startsWith("Editar") && (
            <label className="field">
              Nova data de expiração
              <input type="date" defaultValue="2026-07-10" />
            </label>
          )}
        </ConfirmModal>
      )}
    </>
  );
}

function LoginsTab() {
  return (
    <div className="table-wrap">
      <table className="data">
        <thead><tr><th>Quando</th><th>IP</th><th>Device</th><th>Fingerprint</th><th></th></tr></thead>
        <tbody>
          {playerLogins.map((l, i) => (
            <tr key={i}>
              <td className="nowrap mono">{dt(l.at)}</td>
              <td className="mono">{l.ip}</td>
              <td>{l.device}</td>
              <td className="mono dim">{l.fingerprint}</td>
              <td>{l.shared && <span className="tag red">compartilhado com P-6094</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NotasTab() {
  const { toast } = useToast();
  const [text, setText] = useState("");
  return (
    <>
      <div className="toolbar">
        <input
          placeholder="Nova nota interna (append-only)…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ flex: 1 }}
        />
        <button
          className="primary small"
          disabled={text.trim().length < 3}
          onClick={() => {
            toast("Nota registrada (demonstração)");
            setText("");
          }}
        >
          Adicionar
        </button>
      </div>
      {playerNotes.map((n, i) => (
        <div key={i} className="wallet-cell" style={{ marginBottom: 8 }}>
          <div className="dim" style={{ fontSize: 11.5, marginBottom: 4 }}>{dt(n.at)} · {n.by}</div>
          <div>{n.text}</div>
        </div>
      ))}
    </>
  );
}
