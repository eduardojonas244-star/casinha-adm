import { useState } from "react";
import { members, d } from "../mock/data";
import { StatusTag } from "../ui/StatusTag";
import { ConfirmModal } from "../ui/ConfirmModal";
import { useToast } from "../ui/Toast";

export function MembersPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<string | null>(null);

  const rows = members.filter(
    (m) => !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <h1 className="page-title">Equipe</h1>
      <p className="page-subtitle">Membros do backoffice, papéis e status.</p>
      <div className="panel">
        <div className="toolbar">
          <input placeholder="Buscar por nome ou e-mail" value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: 260 }} />
          <div className="spacer" />
          <button className="primary" onClick={() => setModal("Novo membro")}>+ Novo membro</button>
        </div>
        <div className="table-wrap">
          <table className="data">
            <thead><tr><th>Membro</th><th>Papel</th><th>Status</th><th>Criado em</th><th></th></tr></thead>
            <tbody>
              {rows.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{m.name}</div>
                    <div className="dim" style={{ fontSize: 12 }}>{m.email}</div>
                  </td>
                  <td><span className="tag blue">{m.role}</span></td>
                  <td><StatusTag value={m.status} /></td>
                  <td className="nowrap">{d(m.createdAt)}</td>
                  <td className="nowrap">
                    <button className="link" onClick={() => setModal(`Alterar papel de ${m.name}`)}>Papel</button>
                    <button className="link" onClick={() => setModal(`${m.status === "DISABLED" ? "Ativar" : "Desativar"} ${m.name}`)}>
                      {m.status === "DISABLED" ? "Ativar" : "Desativar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <ConfirmModal
          title={modal}
          danger={modal.startsWith("Desativar")}
          onClose={() => setModal(null)}
          onConfirm={() => toast(`${modal}: registrado no audit log (demonstração)`)}
        >
          {modal === "Novo membro" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label className="field">Nome<input /></label>
              <label className="field">E-mail<input type="email" /></label>
              <label className="field">Papel
                <select><option>ADMIN</option><option>FINANCEIRO</option><option>SUPORTE</option><option>CRM</option><option>RISCO</option><option>LEITURA</option></select>
              </label>
            </div>
          )}
          {modal.startsWith("Alterar papel") && (
            <label className="field">Novo papel
              <select><option>ADMIN</option><option>FINANCEIRO</option><option>SUPORTE</option><option>CRM</option><option>RISCO</option><option>LEITURA</option></select>
            </label>
          )}
        </ConfirmModal>
      )}
    </>
  );
}
