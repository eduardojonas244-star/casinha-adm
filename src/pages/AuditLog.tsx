import { useState } from "react";
import { auditLog, dt, AuditEntry } from "../mock/data";
import { StatusTag } from "../ui/StatusTag";
import { useToast } from "../ui/Toast";

export function AuditLogPage() {
  const { toast } = useToast();
  const [moduleFilter, setModuleFilter] = useState("");
  const [detail, setDetail] = useState<AuditEntry | null>(null);

  const rows = auditLog.filter((a) => !moduleFilter || a.module === moduleFilter);
  const modules = [...new Set(auditLog.map((a) => a.module))];

  return (
    <>
      <h1 className="page-title">Audit Log</h1>
      <p className="page-subtitle">Registro imutável de todas as ações de operadores — append-only, sem edição nem deleção.</p>
      <div className="panel">
        <div className="toolbar">
          <select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)}>
            <option value="">Módulo: todos</option>
            {modules.map((m) => <option key={m}>{m}</option>)}
          </select>
          <input type="date" defaultValue="2026-06-30" />
          <input type="date" defaultValue="2026-07-01" />
          <div className="spacer" />
          <button onClick={() => toast("Export CSV gerado (demonstração)")}>Export CSV</button>
        </div>
        <div className="table-wrap">
          <table className="data">
            <thead><tr><th>Quando</th><th>Quem</th><th>Módulo</th><th>Ação</th><th>Entidade</th><th>Resultado</th><th>IP</th><th></th></tr></thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id}>
                  <td className="nowrap mono">{dt(a.at)}</td>
                  <td>
                    <div>{a.who}</div>
                    {a.role !== "—" && <span className="tag blue">{a.role}</span>}
                  </td>
                  <td>{a.module}</td>
                  <td className="mono">{a.action}</td>
                  <td className="mono dim">{a.entity}</td>
                  <td><StatusTag value={a.outcome} /></td>
                  <td className="mono dim">{a.ip}</td>
                  <td><button className="link" onClick={() => setDetail(a)}>Ver diff</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {detail && (
        <div className="modal-backdrop" onClick={() => setDetail(null)}>
          <div className="modal" style={{ width: 720 }} onClick={(e) => e.stopPropagation()}>
            <h3>{detail.module}.{detail.action} — <StatusTag value={detail.outcome} /></h3>
            {detail.reason && <p><strong>Motivo:</strong> {detail.reason}</p>}
            <div className="diff-view">
              <div><strong>Antes</strong><pre>{JSON.stringify(detail.before, null, 2)}</pre></div>
              <div><strong>Depois</strong><pre>{JSON.stringify(detail.after, null, 2)}</pre></div>
            </div>
            <div className="actions"><button onClick={() => setDetail(null)}>Fechar</button></div>
          </div>
        </div>
      )}
    </>
  );
}
