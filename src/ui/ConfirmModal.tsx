import { useState, ReactNode } from "react";

/**
 * Modal de confirmação com MOTIVO OBRIGATÓRIO — reusado em toda ação sensível.
 * O motivo vai no body da request e cai no audit log.
 */
export function ConfirmModal(props: {
  title: string;
  children?: ReactNode;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: (reason: string) => Promise<void> | void;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (reason.trim().length < 3) return;
    setBusy(true);
    try {
      await props.onConfirm(reason.trim());
      props.onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={props.onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{props.title}</h3>
        {props.children}
        <label className="field" style={{ marginTop: 12 }}>
          Motivo (obrigatório)
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Descreva o motivo desta ação — ficará registrado no audit log"
            autoFocus
          />
        </label>
        <div className="actions">
          <button onClick={props.onClose} disabled={busy}>
            Cancelar
          </button>
          <button
            className={props.danger ? "danger" : "primary"}
            onClick={submit}
            disabled={busy || reason.trim().length < 3}
          >
            {busy ? "Processando..." : (props.confirmLabel ?? "Confirmar")}
          </button>
        </div>
      </div>
    </div>
  );
}
