import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { players, brl, d } from "../mock/data";
import { StatusTag } from "../ui/StatusTag";
import { useToast } from "../ui/Toast";

export function PlayersPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [kyc, setKyc] = useState("");
  const [segment, setSegment] = useState("");

  const rows = players.filter((p) => {
    const q = search.toLowerCase();
    const matchQ =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.cpf.includes(q) ||
      p.phone.includes(q) ||
      p.id.toLowerCase().includes(q);
    return matchQ && (!status || p.status === status) && (!kyc || p.kyc === kyc) && (!segment || p.segment === segment);
  });

  return (
    <>
      <h1 className="page-title">Jogadores</h1>
      <p className="page-subtitle">{players.length} jogadores · busca por nome, e-mail, CPF, telefone ou ID.</p>
      <div className="panel">
        <div className="toolbar">
          <input
            placeholder="Buscar nome, e-mail, CPF, telefone, ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 290 }}
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Status: todos</option>
            <option value="ACTIVE">Ativos</option>
            <option value="BLOCKED">Bloqueados</option>
            <option value="SELF_EXCLUDED">Autoexcluídos</option>
          </select>
          <select value={kyc} onChange={(e) => setKyc(e.target.value)}>
            <option value="">KYC: todos</option>
            <option value="APPROVED">Aprovado</option>
            <option value="PENDING">Pendente</option>
            <option value="IN_REVIEW">Em análise</option>
            <option value="REJECTED">Rejeitado</option>
          </select>
          <select value={segment} onChange={(e) => setSegment(e.target.value)}>
            <option value="">Segmento: todos</option>
            <option>VIP</option>
            <option>Alto valor</option>
            <option>Regular</option>
            <option>Novo</option>
            <option>Em risco</option>
          </select>
          <div className="spacer" />
          <button onClick={() => toast("Export CSV gerado (demonstração)")}>Export CSV</button>
        </div>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Jogador</th>
                <th>Cadastro</th>
                <th className="right">Depositado</th>
                <th className="right">GGR</th>
                <th className="right">Saldo (real / bônus)</th>
                <th>KYC</th>
                <th>Status</th>
                <th>Segmento</th>
                <th>Afiliado</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="clickable" onClick={() => navigate(`/players/${p.id}`)}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    <div className="dim" style={{ fontSize: 12 }}>{p.id} · {p.email}</div>
                  </td>
                  <td className="nowrap">{d(p.createdAt)}</td>
                  <td className="right mono">{brl(p.totalDeposited)}</td>
                  <td className={`right mono ${p.ggr >= 0 ? "pos" : "neg"}`}>{brl(p.ggr)}</td>
                  <td className="right mono">
                    {brl(p.balanceReal)} <span className="dim">/ {brl(p.balanceBonus)}</span>
                  </td>
                  <td><StatusTag value={p.kyc} /></td>
                  <td><StatusTag value={p.status} /></td>
                  <td><span className="tag blue">{p.segment}</span></td>
                  <td className="dim">{p.affiliate ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <button className="small" disabled>‹ Anterior</button>
          <span>Página 1 de 1 · {rows.length} de {players.length} jogadores</span>
          <button className="small" disabled>Próxima ›</button>
        </div>
      </div>
    </>
  );
}
