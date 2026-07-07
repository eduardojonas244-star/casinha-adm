const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

function getAdminToken(): string | null {
  return localStorage.getItem('bko_admin_token');
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export type MetaTrackingConfig = {
  enabled: boolean;
  pixelId: string | null;
  accessTokenMasked: string | null;
  hasAccessToken: boolean;
  testEventCode: string | null;
  paymentWebhookUrl: string | null;
  outboundCallbackUrl: string | null;
  eventToggles: Record<string, boolean>;
  eventMappings: Record<string, string>;
  updatedAt: string;
};

export const trackingApi = {
  getConfig: () => apiFetch<MetaTrackingConfig>('/admin/tracking/config'),
  updateConfig: (body: Partial<MetaTrackingConfig> & { accessToken?: string | null }) =>
    apiFetch<MetaTrackingConfig>('/admin/tracking/config', {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  getAuditLog: (page = 1) =>
    apiFetch<{ items: unknown[]; total: number }>(`/admin/tracking/audit-log?page=${page}`),
  getEventLog: (page = 1) =>
    apiFetch<{ items: unknown[]; total: number }>(`/admin/tracking/event-log?page=${page}`),
};
