import { useState } from "react";
import { Link } from "react-router-dom";
import { bonusCampaigns, bonusGrants, bonusAlerts, bonusHouseConfig, brl, dt, d, pct } from "../mock/data";
import { StatusTag } from "../ui/StatusTag";
import { Tabs, useTab } from "../ui/Tabs";
import { ConfirmModal } from "../ui/ConfirmModal";
import { useToast } from "../ui/Toast";

const TABS = [
  { key: "campanhas", label: "Campanhas" },
  { key: "config", label: "Config. da casa" },
  { key: "concessoes", label: "Concessões" },
  { key: "alertas", label: "Anti-abuse", count: bonusAlerts.length },
];

export function BonusPage() {
  const tab = useTab(TABS);
  return (
    <>
      <h1 className="page-title">Bônus</h1>
      <p className="page-subtitle">Interface do bonus engine — consumo real-first: bônus fica dormente até o saldo real zerar.</p>
      <Tabs tabs={TABS} />
      {tab === "campanhas" && <CampaignsTab />}
      {tab === "config" && <ConfigTab />}
      {tab === "concessoes" && <GrantsTab />}
      {tab === "alertas" && <AlertsTab />}
    </>
  );
}

function CampaignsTab() {
  const { toast } = useToast();
  const [status, setStatus] = useState<"ATIVA" | "AGENDADA" | "ENCERRADA">("ATIVA");
  const [editor, setEditor] = useState<string | null>(null);
  const rows = bonusCampaigns.filter((c) => (status === "ATIVA" ? c.status === "ATIVA" || c.status === "PAUSADA" : c.status === status));

  return (
    <div className="panel">
      <div className="toolbar">
        {(["ATIVA", "AGENDADA", "ENCERRADA"] as const).map((s) => (
          <button key={s} className={`small ${status === s ? "primary" : ""}`} onClick={() => setStatus(s)}>
            {{ ATIVA: "Ativas", AGENDADA: "Agendadas", ENCERRADA: "Encerradas" }[s]}
          </button>
        ))}
        <div className="spacer" />
        <button className="primary" onClick={() => setEditor("Nova campanha")}>+ Nova campanha</button>
      </div>
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr><th>Campanha</th><th>Tipo</th><th>Gatilho</th><th className="right">Concedido</th><th className="right">Convertido</th><th className="right">Custo/NGR</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{c.name}</div>
                  <div className="dim" style={{ fontSize: 12 }}>rollover {c.rollover}x · validade {c.validityDays}d · {d(c.start)}{c.end ? ` → ${d(c.end)}` : " → sem fim"}</div>
                </td>
                <td>{c.type}</td>
                <td className="dim">{c.trigger}</td>
                <td className="right mono">{brl(c.granted)}</td>
                <td className="right mono">{brl(c.converted)}</td>
                <td className="right mono">{c.costOverNgr > 0 ? pct(c.costOverNgr) : "—"}</td>
                <td><StatusTag value={c.status} /></td>
                <td className="nowrap">
                  <button className="link" onClick={() => setEditor(c.name)}>Editar</button>
                  <button className="link" onClick={() => toast(`Campanha duplicada (demonstração)`)}>Duplicar</button>
                  {c.status === "ATIVA" && <button className="link" style={{ color: "var(--amber)" }} onClick={() => toast("Campanha pausada (demonstração)")}>Pausar</button>}
                  {c.status !== "ENCERRADA" && <button className="link" style={{ color: "var(--red)" }} onClick={() => toast("Campanha encerrada (demonstração)")}>Encerrar</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editor && <CampaignEditor name={editor} onClose={() => setEditor(null)} />}
    </div>
  );
}

function CampaignEditor({ name, onClose }: { name: string; onClose: () => void }) {
  const { toast } = useToast();
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ width: 640 }} onClick={(e) => e.stopPropagation()}>
        <h3>{name === "Nova campanha" ? "Nova campanha" : `Editar — ${name}`}</h3>
        <div className="grid-2" style={{ gap: 10 }}>
          <label className="field">Nome<input defaultValue={name === "Nova campanha" ? "" : name} /></label>
          <label className="field">Tipo
            <select defaultValue="Match de depósito">
              <option>Match de depósito</option>
              <option>Cashback</option>
              <option>Valor fixo</option>
              <option>Freespins (estrutura pronta — execução depende do agregador)</option>
            </select>
          </label>
          <label className="field">% do match<input defaultValue="100" /></label>
          <label className="field">Teto (R$)<input defaultValue="200,00" /></label>
          <label className="field">Rollover (herda global: {bonusHouseConfig.rolloverWelcome}x)<input placeholder={`${bonusHouseConfig.rolloverWelcome}x (global)`} /></label>
          <label className="field">Validade (herda global: {bonusHouseConfig.validityDays}d)<input placeholder={`${bonusHouseConfig.validityDays} dias (global)`} /></label>
          <label className="field">Jogos/categorias elegíveis<input defaultValue="Todas exceto: Ao vivo" /></label>
          <label className="field">Segmento-alvo<input defaultValue="todos" /></label>
          <label className="field">Código promocional (opcional)<input /></label>
          <label className="field">Limite por jogador<input defaultValue="1" /></label>
          <label className="field">Orçamento total (R$)<input defaultValue="50.000,00" /></label>
          <label className="field">Agendamento<input type="date" defaultValue="2026-07-04" /></label>
        </div>
        <div className="actions">
          <button onClick={onClose}>Cancelar</button>
          <button className="primary" onClick={() => { toast("Campanha salva (demonstração)"); onClose(); }}>Salvar campanha</button>
        </div>
      </div>
    </div>
  );
}

function ConfigTab() {
  const { toast } = useToast();
  const [modal, setModal] = useState(false);
  return (
    <>
      <div className="panel" style={{ marginBottom: 12 }}>
        <h3 className="panel-title">Configuração global da casa (bonus_house_config)</h3>
        <div className="wallet-grid">
          <div className="wallet-cell"><div className="lbl">Rollover boas-vindas</div><div className="val">{bonusHouseConfig.rolloverWelcome}x</div></div>
          <div className="wallet-cell"><div className="lbl">Rollover cashback</div><div className="val">{bonusHouseConfig.rolloverCashback}x</div></div>
          <div className="wallet-cell"><div className="lbl">Validade padrão</div><div className="val">{bonusHouseConfig.validityDays} dias</div></div>
          <div className="wallet-cell" style={{ borderColor: "var(--amber)" }}>
            <div className="lbl">Aposta máxima com bônus ⚠</div>
            <div className="val">{bonusHouseConfig.maxBetWithBonus === null ? "sem limite" : brl(bonusHouseConfig.maxBetWithBonus)}</div>
          </div>
          <div className="wallet-cell" style={{ borderColor: "var(--amber)" }}>
            <div className="lbl">Contribuição por vertical ⚠</div>
            <div className="val" style={{ fontSize: 14 }}>slots {bonusHouseConfig.weights.slots}% · ao vivo {bonusHouseConfig.weights.live}% · crash {bonusHouseConfig.weights.crash}%</div>
          </div>
        </div>
        <div className="toolbar" style={{ marginTop: 12, marginBottom: 0 }}>
          <button className="primary small" onClick={() => setModal(true)}>Editar configuração</button>
        </div>
      </div>

      <div className="panel" style={{ borderColor: "var(--amber)" }}>
        <h3 className="panel-title" style={{ color: "var(--amber)" }}>⚠ Nota de risco registrada (decisão de negócio do Hugo — seção 3.8)</h3>
        <p className="dim" style={{ fontSize: 13, margin: 0 }}>
          Sem aposta máxima e com contribuição 100% no ao vivo, estratégias de baixa variância (apostas de cobertura em
          roleta/bacará) convertem bônus em real com risco quase nulo — vetor clássico de bonus abuse. Por isso são
          <strong> parâmetros configuráveis</strong>: se o abuso aparecer nos alertas, a proteção liga pelo painel, sem deploy.
          Mudanças só afetam bônus concedidos <strong>após</strong> a mudança.
        </p>
      </div>

      {modal && (
        <ConfirmModal title="Editar configuração global de bônus" onClose={() => setModal(false)} onConfirm={() => toast("Config salva — só afeta bônus concedidos após a mudança (demonstração)")}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <label className="field">Rollover boas-vindas (x)<input defaultValue="30" /></label>
            <label className="field">Rollover cashback (x)<input defaultValue="2" /></label>
            <label className="field">Validade padrão (dias)<input defaultValue="7" /></label>
            <label className="field">Aposta máxima com bônus (R$ — vazio = sem limite)<input /></label>
            <label className="field">Peso slots (%)<input defaultValue="100" /></label>
            <label className="field">Peso ao vivo (%)<input defaultValue="100" /></label>
            <label className="field">Peso crash (%)<input defaultValue="100" /></label>
          </div>
        </ConfirmModal>
      )}
    </>
  );
}

function GrantsTab() {
  const { toast } = useToast();
  const [modal, setModal] = useState(false);
  return (
    <div className="panel">
      <div className="toolbar">
        <span className="dim" style={{ fontSize: 12 }}>Progresso de rollover em tempo real, por concessão.</span>
        <div className="spacer" />
        <button className="primary" onClick={() => setModal(true)}>+ Concessão manual</button>
      </div>
      <div className="table-wrap">
        <table className="data">
          <thead><tr><th>Jogador</th><th>Campanha</th><th className="right">Valor</th><th style={{ width: 220 }}>Rollover</th><th>Expira</th><th>Status</th></tr></thead>
          <tbody>
            {bonusGrants.map((g) => {
              const progress = Math.min(100, (g.wagered / g.target) * 100);
              return (
                <tr key={g.id}>
                  <td><Link to={`/players/${g.playerId}`} style={{ fontWeight: 600 }}>{g.playerName}</Link><div className="dim" style={{ fontSize: 12 }}>{g.id}</div></td>
                  <td className="dim">{g.campaign}</td>
                  <td className="right mono">{brl(g.amount)}</td>
                  <td>
                    <div className="dim" style={{ fontSize: 11, marginBottom: 3 }}>{brl(g.wagered)} de {brl(g.target)} ({progress.toFixed(0)}%)</div>
                    <div className="progress thin"><div style={{ width: `${progress}%` }} /></div>
                  </td>
                  <td className="nowrap mono">{dt(g.expiresAt)}</td>
                  <td><StatusTag value={g.status} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modal && (
        <ConfirmModal title="Concessão manual de bônus" onClose={() => setModal(false)} onConfirm={() => toast("Bônus concedido — acima de R$ 500 exigiria ADMIN (demonstração)")}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <label className="field">Jogador (ID) ou lista em massa (upload)<input placeholder="P-1043 ou arquivo .csv" /></label>
            <label className="field">Valor (R$)<input placeholder="ex: 50,00" /></label>
            <p className="dim" style={{ margin: 0, fontSize: 12 }}>Herda rollover ({bonusHouseConfig.rolloverWelcome}x) e validade ({bonusHouseConfig.validityDays}d) da casa. Acima do limite do papel exige ADMIN.</p>
          </div>
        </ConfirmModal>
      )}
    </div>
  );
}

function AlertsTab() {
  const { toast } = useToast();
  return (
    <div className="panel">
      <p className="dim" style={{ fontSize: 12.5, marginTop: 0 }}>
        Alertas de anti-abuse — decisão sempre humana. Blacklist de bônus remove o jogador de todas as campanhas automáticas.
      </p>
      {bonusAlerts.map((a) => (
        <div key={a.id} className="wallet-cell" style={{ marginBottom: 10, display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <StatusTag value={a.severity} />
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ fontWeight: 600 }}>{a.kind}</div>
            <div className="dim" style={{ fontSize: 12.5 }}>{a.detail}</div>
            <div className="dim" style={{ fontSize: 11.5, marginTop: 2 }}>{dt(a.at)}</div>
          </div>
          <button className="small" onClick={() => toast("Enviado pra central de risco (demonstração)")}>Escalar</button>
          <button className="small danger" onClick={() => toast("Jogador incluído na blacklist de bônus (demonstração + audit)")}>Blacklist de bônus</button>
        </div>
      ))}
    </div>
  );
}
