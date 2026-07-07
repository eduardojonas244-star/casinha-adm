import { useEffect, useState } from "react";
import { Tabs, useTab } from "../ui/Tabs";
import { Toggle } from "../ui/Toggle";
import { ConfirmModal } from "../ui/ConfirmModal";
import { useToast } from "../ui/Toast";
import { trackingApi, type MetaTrackingConfig } from "../api/tracking";

const TABS = [
  { key: "config", label: "Pixel & CAPI" },
  { key: "eventos", label: "Eventos" },
  { key: "urls", label: "Webhooks" },
  { key: "logs", label: "Auditoria" },
];

const DEFAULT_CONFIG: MetaTrackingConfig = {
  enabled: false,
  pixelId: "",
  accessTokenMasked: null,
  hasAccessToken: false,
  testEventCode: "",
  paymentWebhookUrl: "http://localhost:3010/webhooks/pagnovo",
  outboundCallbackUrl: "",
  eventToggles: {
    LEAD: true,
    COMPLETE_REGISTRATION: true,
    PURCHASE: true,
    REFUND: true,
  },
  eventMappings: {
    LEAD: "Lead",
    COMPLETE_REGISTRATION: "CompleteRegistration",
    PURCHASE: "Purchase",
    REFUND: "Refund",
  },
  updatedAt: new Date().toISOString(),
};

const INTERNAL_EVENTS = [
  { key: "LEAD", label: "Lead", when: "Registro iniciado" },
  { key: "COMPLETE_REGISTRATION", label: "CompleteRegistration", when: "Conta criada / e-mail verificado" },
  { key: "PURCHASE", label: "Purchase", when: "PIX confirmado (webhook processadora)" },
  { key: "REFUND", label: "Refund", when: "Estorno confirmado (webhook)" },
] as const;

export function MarketingPage() {
  const tab = useTab(TABS);
  const { toast } = useToast();
  const [config, setConfig] = useState<MetaTrackingConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newToken, setNewToken] = useState("");
  const [auditLog, setAuditLog] = useState<unknown[]>([]);
  const [eventLog, setEventLog] = useState<unknown[]>([]);
  const [confirmSave, setConfirmSave] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const data = await trackingApi.getConfig();
        setConfig(data);
      } catch {
        const cached = localStorage.getItem("bko_meta_tracking");
        if (cached) setConfig(JSON.parse(cached) as MetaTrackingConfig);
        toast("Modo demo — configure o token admin (localStorage bko_admin_token) para salvar na API.", "info");
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        enabled: config.enabled,
        pixelId: config.pixelId || null,
        testEventCode: config.testEventCode || null,
        paymentWebhookUrl: config.paymentWebhookUrl || null,
        outboundCallbackUrl: config.outboundCallbackUrl || null,
        eventToggles: config.eventToggles,
        eventMappings: config.eventMappings,
        ...(newToken ? { accessToken: newToken } : {}),
      };
      const updated = await trackingApi.updateConfig(payload);
      setConfig(updated);
      setNewToken("");
      toast("Configuração de tracking salva!");
    } catch {
      localStorage.setItem("bko_meta_tracking", JSON.stringify(config));
      toast("Salvo localmente (demo) — API indisponível ou sem token admin.");
    } finally {
      setSaving(false);
      setConfirmSave(false);
    }
  };

  const loadLogs = async () => {
    try {
      const [audit, events] = await Promise.all([
        trackingApi.getAuditLog(),
        trackingApi.getEventLog(),
      ]);
      setAuditLog(audit.items);
      setEventLog(events.items);
    } catch {
      toast("Logs disponíveis apenas com API autenticada.", "info");
    }
  };

  useEffect(() => {
    if (tab === "logs") void loadLogs();
  }, [tab]);

  if (loading) {
    return <p className="dim">Carregando configuração de tracking…</p>;
  }

  return (
    <>
      <h1 className="page-title">Tracking — Meta Pixel & CAPI</h1>
      <p className="page-subtitle">
        Pixel no browser + Conversions API no servidor, com deduplicação por <code>event_id</code>.
        Purchase dispara só após confirmação da processadora (webhook).
      </p>
      <Tabs tabs={TABS} />

      {tab === "config" && (
        <div className="panel" style={{ maxWidth: 720 }}>
          <div className="field-row">
            <span>Tracking ativo</span>
            <Toggle checked={config.enabled} onChange={(v) => setConfig({ ...config, enabled: v })} />
          </div>
          <label className="field">
            Pixel ID (Meta)
            <input
              value={config.pixelId ?? ""}
              onChange={(e) => setConfig({ ...config, pixelId: e.target.value })}
              placeholder="Ex: 123456789012345"
            />
          </label>
          <label className="field">
            Access Token (CAPI)
            <input
              type="password"
              value={newToken}
              onChange={(e) => setNewToken(e.target.value)}
              placeholder={config.hasAccessToken ? "•••••••• (deixe vazio para manter)" : "Cole o token do Events Manager"}
            />
            <span className="dim" style={{ fontSize: 12 }}>
              Armazenado criptografado no banco. Nunca exibido em texto puro após salvo.
            </span>
          </label>
          <label className="field">
            Test Event Code
            <input
              value={config.testEventCode ?? ""}
              onChange={(e) => setConfig({ ...config, testEventCode: e.target.value })}
              placeholder="TEST12345 — Events Manager → Testar eventos"
            />
          </label>
          <div className="toolbar" style={{ marginTop: 16 }}>
            <button className="primary" disabled={saving} onClick={() => setConfirmSave(true)}>
              Salvar configuração
            </button>
          </div>
        </div>
      )}

      {tab === "eventos" && (
        <div className="panel">
          <p className="dim" style={{ marginBottom: 12 }}>
            Mapeie eventos internos → eventos Meta. Use o mesmo nome no Pixel (browser) para deduplicação.
          </p>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Evento interno</th>
                  <th>Quando</th>
                  <th>Evento Meta</th>
                  <th>Ativo</th>
                </tr>
              </thead>
              <tbody>
                {INTERNAL_EVENTS.map((ev) => (
                  <tr key={ev.key}>
                    <td className="mono">{ev.key}</td>
                    <td className="dim">{ev.when}</td>
                    <td>
                      <input
                        className="mono"
                        style={{ width: "100%" }}
                        value={config.eventMappings[ev.key] ?? ""}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            eventMappings: { ...config.eventMappings, [ev.key]: e.target.value },
                          })
                        }
                      />
                    </td>
                    <td>
                      <Toggle
                        checked={config.eventToggles[ev.key] ?? true}
                        onChange={(v) =>
                          setConfig({
                            ...config,
                            eventToggles: { ...config.eventToggles, [ev.key]: v },
                          })
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="toolbar" style={{ marginTop: 12 }}>
            <button className="primary" onClick={() => setConfirmSave(true)}>Salvar mapeamento</button>
          </div>
        </div>
      )}

      {tab === "urls" && (
        <div className="panel" style={{ maxWidth: 720 }}>
          <label className="field">
            URL de webhook de entrada (processadora → nós)
            <input
              value={config.paymentWebhookUrl ?? ""}
              onChange={(e) => setConfig({ ...config, paymentWebhookUrl: e.target.value })}
            />
            <span className="dim" style={{ fontSize: 12 }}>Cadastre esta URL na Pagnovo / gateway PIX.</span>
          </label>
          <label className="field">
            URL de callback de saída (opcional)
            <input
              value={config.outboundCallbackUrl ?? ""}
              onChange={(e) => setConfig({ ...config, outboundCallbackUrl: e.target.value })}
              placeholder="https://… (afiliados, outras plataformas)"
            />
          </label>
          <button className="primary" style={{ marginTop: 12 }} onClick={() => setConfirmSave(true)}>
            Salvar URLs
          </button>
        </div>
      )}

      {tab === "logs" && (
        <div className="grid-2" style={{ gap: 16 }}>
          <div className="panel">
            <h3 style={{ marginTop: 0 }}>Auditoria de config</h3>
            {auditLog.length === 0 ? (
              <p className="dim">Nenhum registro ou API sem autenticação.</p>
            ) : (
              <ul className="dim" style={{ fontSize: 12 }}>
                {auditLog.map((row, i) => (
                  <li key={i}>{JSON.stringify(row)}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="panel">
            <h3 style={{ marginTop: 0 }}>Eventos CAPI enviados</h3>
            {eventLog.length === 0 ? (
              <p className="dim">Nenhum evento ainda.</p>
            ) : (
              <ul className="dim" style={{ fontSize: 12 }}>
                {eventLog.map((row, i) => (
                  <li key={i}>{JSON.stringify(row)}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {confirmSave && (
        <ConfirmModal
          title="Salvar tracking"
          confirmLabel="Salvar"
          onConfirm={() => void save()}
          onClose={() => setConfirmSave(false)}
        >
          <p className="dim">Alterações no Pixel ID, token ou URLs afetam conversões em produção.</p>
        </ConfirmModal>
      )}
    </>
  );
}
