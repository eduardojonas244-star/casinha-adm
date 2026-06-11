import { api } from './client';
import type {
  PagnovoBalance,
  PagnovoCredentials,
  PagnovoWebhook,
  PagnovoWebhookDeliveryPage,
  PagnovoWebhookMetrics,
  PagnovoWebhookTestResult,
} from '../types/api';

export async function getPagnovoCredentials(): Promise<PagnovoCredentials> {
  const { data } = await api.get<PagnovoCredentials>('/admin/pagnovo/credentials');
  return data;
}

export async function getPagnovoBalance(): Promise<PagnovoBalance> {
  const { data } = await api.get<PagnovoBalance>('/admin/pagnovo/balance');
  return data;
}

export async function listPagnovoWebhooks(): Promise<PagnovoWebhook[]> {
  const { data } = await api.get<PagnovoWebhook[]>('/admin/pagnovo/webhooks');
  return data;
}

export async function createPagnovoWebhook(body: {
  description?: string;
  events?: string[];
}): Promise<PagnovoWebhook & { secret: string }> {
  const { data } = await api.post<PagnovoWebhook & { secret: string }>('/admin/pagnovo/webhooks', body);
  return data;
}

export async function updatePagnovoWebhook(
  id: string,
  body: { description?: string; events?: string[]; active?: boolean },
): Promise<PagnovoWebhook> {
  const { data } = await api.patch<PagnovoWebhook>(`/admin/pagnovo/webhooks/${id}`, body);
  return data;
}

export async function deletePagnovoWebhook(id: string): Promise<void> {
  await api.delete(`/admin/pagnovo/webhooks/${id}`);
}

export async function rotatePagnovoWebhookSecret(id: string): Promise<{ id: string; secret: string }> {
  const { data } = await api.post<{ id: string; secret: string }>(
    `/admin/pagnovo/webhooks/${id}/rotate-secret`,
  );
  return data;
}

export async function testPagnovoWebhook(id: string): Promise<PagnovoWebhookTestResult> {
  const { data } = await api.post<PagnovoWebhookTestResult>(`/admin/pagnovo/webhooks/${id}/test`);
  return data;
}

export async function listPagnovoDeliveries(
  id: string,
  page = 0,
  limit = 20,
): Promise<PagnovoWebhookDeliveryPage> {
  const { data } = await api.get<PagnovoWebhookDeliveryPage>(
    `/admin/pagnovo/webhooks/${id}/deliveries`,
    { params: { page, limit } },
  );
  return data;
}

export async function getPagnovoMetrics(
  id: string,
  period: '24h' | '7d' = '24h',
): Promise<PagnovoWebhookMetrics> {
  const { data } = await api.get<PagnovoWebhookMetrics>(`/admin/pagnovo/webhooks/${id}/metrics`, {
    params: { period },
  });
  return data;
}
