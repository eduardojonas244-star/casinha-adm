import { useState } from "react";
import { roles, permissionsMatrix, brl } from "../mock/data";
import { ConfirmModal } from "../ui/ConfirmModal";
import { useToast } from "../ui/Toast";

export function RolesPage() {
  const { toast } = useToast();
  const [selected, setSelected] = useState("FINANCEIRO");
  const [modal, setModal] = useState<string | null>(null);
  const role = roles.find((r) => r.name === selected)!;

  const limit = (v: number | null) => (v === null ? "Sem limite" : brl(v));

  return (
    <>
      <h1 className="page-title">Papéis & Permissões</h1>
      <p className="page-subtitle">Matriz papel × permissões e limites de aprovação. O front esconde, o backend nega.</p>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 16 }}>
        <div className="panel" style={{ padding: 8 }}>
          {roles.map((r) => (
            <div
              key={r.name}
              onClick={() => setSelected(r.name)}
              style={{ padding: "10px 12px", borderRadius: 6, cursor: "pointer", background: r.name === selected ? "var(--bg-hover)" : "transparent" }}
            >
              <div style={{ fontWeight: 600 }}>{r.name}</div>
              <div className="dim" style={{ fontSize: 12 }}>{r.members} membro(s) · saque {limit(r.withdrawalLimit)}</div>
            </div>
          ))}
        </div>

        <div className="panel">
          <div className="toolbar">
            <strong style={{ fontSize: 15 }}>{role.name}</strong>
            <span className="dim">Limite saque: {limit(role.withdrawalLimit)} · Limite ajuste: {limit(role.adjustmentLimit)}</span>
            <div className="spacer" />
            <button className="small" onClick={() => setModal(`Limites de aprovação — ${role.name}`)}>Editar limites</button>
            <button className="primary small" disabled={role.name === "ADMIN"} onClick={() => setModal(`Salvar permissões de ${role.name}`)}>Salvar permissões</button>
          </div>
          {role.name === "ADMIN" && <p className="dim">O papel ADMIN sempre possui todas as permissões e não pode ser reduzido.</p>}
          {permissionsMatrix.map((mod) => (
            <div key={mod.module} style={{ marginBottom: 14 }}>
              <div className="nav-section" style={{ padding: "6px 0" }}>{mod.module}</div>
              <div className="grid-cards">
                {mod.permissions.map((p) => (
                  <label key={p.key} style={{ display: "flex", gap: 8, alignItems: "flex-start", cursor: role.name === "ADMIN" ? "default" : "pointer" }}>
                    <input type="checkbox" defaultChecked={p.roles.includes(role.name)} disabled={role.name === "ADMIN"} />
                    <span>
                      <span className="mono">{p.key}</span>
                      <div className="dim" style={{ fontSize: 12 }}>{p.desc}</div>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {modal && (
        <ConfirmModal title={modal} onClose={() => setModal(null)} onConfirm={() => toast(`${modal}: registrado no audit log (demonstração)`)}>
          {modal.startsWith("Limites") && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label className="field">Limite de aprovação de saque (R$ — vazio = sem limite)
                <input defaultValue={role.withdrawalLimit !== null ? (role.withdrawalLimit / 100).toFixed(2) : ""} />
              </label>
              <label className="field">Limite de ajuste manual (R$ — vazio = sem limite)
                <input defaultValue={role.adjustmentLimit !== null ? (role.adjustmentLimit / 100).toFixed(2) : ""} />
              </label>
            </div>
          )}
        </ConfirmModal>
      )}
    </>
  );
}
