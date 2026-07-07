import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { kycCases, brl } from "../mock/data";
import { StatusTag } from "../ui/StatusTag";
import { Toggle } from "../ui/Toggle";
import { useToast } from "../ui/Toast";

export function KycPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState("PENDING");
  const [sort, setSort] = useState<"locked" | "time">("locked");

  const rows = kycCases
    .filter((k) => k.status === status)
    .sort((a, b) => (sort === "locked" ? b.lockedAmount - a.lockedAmount : b.waitingHours - a.waitingHours));

  return (
    <>
      <h1 className="page-title">KYC</h1>
      <p className="page-subtitle">Fila de verificação — gate obrigatório no 1º saque. Aprovação destrava saques pendentes automaticamente.</p>

      <div className="panel" style={{ marginBottom: 14 }}>
        <h3 className="panel-title">Gatilhos de exigência</h3>
        <div style={{ display: "flex", gap: 26, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Toggle defaultOn onChange={() => toast("Gatilho travado por decisão de produto (1º saque)")} />
            <span>1º saque <span className="tag gray">travado — default on</span></span>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Toggle defaultOn={false} onChange={() => toast("Gatilho por depósito acumulado (demonstração)")} />
            <span>Depósito acumulado &gt; <input defaultValue="5.000,00" style={{ width: 90 }} /> R$</span>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="toolbar">
          {(["PENDING", "IN_REVIEW", "APPROVED", "REJECTED"] as const).map((s) => (
            <button key={s} className={`small ${status === s ? "primary" : ""}`} onClick={() => setStatus(s)}>
              {{ PENDING: "Pendentes", IN_REVIEW: "Em análise", APPROVED: "Aprovados", REJECTED: "Rejeitados" }[s]}
              {" "}({kycCases.filter((k) => k.status === s).length})
            </button>
          ))}
          <div className="spacer" />
          <select value={sort} onChange={(e) => setSort(e.target.value as "locked" | "time")}>
            <option value="locked">Ordenar por R$ travado</option>
            <option value="time">Ordenar por tempo de espera</option>
          </select>
        </div>

        {rows.length === 0 && <div className="empty-state"><h3>Fila vazia</h3><p>Nenhum caso neste status.</p></div>}

        {rows.map((k) => (
          <div key={k.id} className="wallet-cell" style={{ marginBottom: 10, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <Link to={`/players/${k.playerId}`} style={{ fontWeight: 600 }}>{k.playerName}</Link>
              <div className="dim" style={{ fontSize: 12 }}>{k.id} · {k.playerId} · docs: {k.docs.join(", ")}</div>
            </div>
            <div className="wallet-cell" style={{ background: "var(--bg-panel)" }}>
              <div className="lbl">R$ travado</div>
              <div className="val" style={{ fontSize: 15, color: k.lockedAmount > 0 ? "var(--amber)" : undefined }}>{brl(k.lockedAmount)}</div>
            </div>
            <div className="wallet-cell" style={{ background: "var(--bg-panel)" }}>
              <div className="lbl">Espera</div>
              <div className="val" style={{ fontSize: 15, color: k.waitingHours > 24 ? "var(--red)" : undefined }}>
                {k.waitingHours > 0 ? `${k.waitingHours.toFixed(1).replace(".", ",")}h` : "—"}
              </div>
            </div>
            <StatusTag value={k.status} />
            <button className="primary small" onClick={() => navigate(`/kyc/${k.id}`)}>Revisar</button>
          </div>
        ))}
      </div>
    </>
  );
}
