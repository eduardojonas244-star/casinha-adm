import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { kycCases, playerById, brl, d, dt } from "../mock/data";
import { StatusTag } from "../ui/StatusTag";
import { ConfirmModal } from "../ui/ConfirmModal";
import { useToast } from "../ui/Toast";

export function KycReviewPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const [modal, setModal] = useState<string | null>(null);
  const k = kycCases.find((c) => c.id === id) ?? kycCases[0];
  const p = playerById(k.playerId);
  const age = Math.floor((Date.now() - new Date(k.birthDate).getTime()) / (365.25 * 86400000));
  const underage = age < 18;

  return (
    <>
      <div className="toolbar" style={{ marginBottom: 6 }}>
        <Link to="/kyc" className="dim">← Fila de KYC</Link>
      </div>
      <div className="toolbar">
        <div>
          <h1 className="page-title">Revisão KYC — {k.id}</h1>
          <p className="page-subtitle" style={{ margin: 0 }}>
            <Link to={`/players/${p.id}`}>{p.name}</Link> · enviado em {dt(k.submittedAt)} · <StatusTag value={k.status} />
            {k.lockedAmount > 0 && <> · <span className="tag amber">{brl(k.lockedAmount)} travados em saque</span></>}
          </p>
        </div>
        <div className="spacer" />
        <button className="primary" onClick={() => setModal("Aprovar KYC")}>Aprovar</button>
        <button onClick={() => setModal("Pedir reenvio de documento")}>Pedir reenvio</button>
        <button className="danger" onClick={() => setModal("Rejeitar KYC")}>Rejeitar</button>
        <button onClick={() => setModal("Escalar pra risco")}>Escalar pra risco</button>
      </div>

      {underage && (
        <div className="panel" style={{ borderColor: "var(--red)", marginBottom: 14 }}>
          <strong style={{ color: "var(--red)" }}>⚠ Menor de idade detectado ({age} anos)</strong>
          <p className="dim" style={{ margin: "6px 0 0", fontSize: 13 }}>
            Bloqueio automático da conta aplicado no nível do serviço + alerta de risco + registro. Aprovação impossível.
          </p>
        </div>
      )}

      <div className="grid-3">
        <div className="panel">
          <h3 className="panel-title">Documentos ({k.docs.length}) — zoom no clique</h3>
          {k.docs.map((doc) => (
            <div key={doc} className="doc-frame" style={{ marginBottom: 10, cursor: "zoom-in" }} onClick={() => toast(`Zoom em "${doc}" (demonstração)`)}>
              <div className="doc-icon">🪪</div>
              <div>{doc}</div>
              <div style={{ fontSize: 11 }}>imagem enviada pelo jogador</div>
            </div>
          ))}
        </div>

        <div className="panel">
          <h3 className="panel-title">Selfie lado a lado</h3>
          <div className="doc-frame" style={{ minHeight: 250 }}>
            <div className="doc-icon">🤳</div>
            <div>Selfie do jogador</div>
          </div>
          <div className="wallet-cell" style={{ marginTop: 10 }}>
            <div className="lbl">Face-match</div>
            <div className="val" style={{ fontSize: 14 }}>
              <span className="tag amber">MOCK — trocar por integração real</span>
            </div>
            <div className="dim" style={{ fontSize: 12, marginTop: 4 }}>interface FaceMatchProvider pronta; adapter mock ativo</div>
          </div>
        </div>

        <div className="panel">
          <h3 className="panel-title">Dados extraídos vs cadastro</h3>
          <table className="data">
            <tbody>
              <tr><td className="dim">Nome</td><td>{p.name}</td><td><span className="check"><span className="ok">✓</span></span></td></tr>
              <tr><td className="dim">CPF</td><td className="mono">{p.cpf}</td><td><span className="check"><span className="ok">✓</span></span></td></tr>
              <tr>
                <td className="dim">Nascimento</td>
                <td>{d(k.birthDate)} ({age} anos)</td>
                <td>{underage ? <span className="check"><span className="fail">✗ menor</span></span> : <span className="check"><span className="ok">✓</span></span>}</td>
              </tr>
              <tr>
                <td className="dim">Checagem CPF</td>
                <td><StatusTag value={k.cpfCheck} /></td>
                <td><span className="tag gray" style={{ fontSize: 10 }}>CpfVerificationProvider · MOCK</span></td>
              </tr>
            </tbody>
          </table>
          <p className="dim" style={{ fontSize: 12 }}>
            Aprovação de KYC destrava automaticamente os saques pendentes do jogador — voltam pra fila de pagamentos como "pronto pra revisão".
          </p>
        </div>
      </div>

      {modal && (
        <ConfirmModal
          title={modal}
          danger={modal.startsWith("Rejeitar")}
          onClose={() => setModal(null)}
          onConfirm={() => toast(`${modal}: executado (demonstração). ${modal === "Aprovar KYC" ? "Saques do jogador destravados." : ""}`)}
        >
          {modal === "Pedir reenvio de documento" && (
            <p className="dim" style={{ marginTop: 0 }}>O motivo notifica o jogador e o caso volta pra fila.</p>
          )}
        </ConfirmModal>
      )}
    </>
  );
}
