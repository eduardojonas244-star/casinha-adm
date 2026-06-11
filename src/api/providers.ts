import { api } from './client';
import type { CatalogProvider, PaginatedProviders } from '../types/api';

export async function listProviders(
  page = 0,
  limit = 20,
  search?: string,
  active?: boolean,
): Promise<PaginatedProviders> {
  const { data } = await api.get<PaginatedProviders>('/admin/providers', {
    params: { page, limit, search, active },
  });
  return data;
}

export async function getProvider(id: string): Promise<CatalogProvider> {
  const { data } = await api.get<CatalogProvider>(`/admin/providers/${id}`);
  return data;
}

export async function syncProviders(): Promise<{ synced: number }> {
  const { data } = await api.post<{ synced: number }>('/admin/providers/sync');
  return data;
}

export async function updateProvider(
  id: string,
  body: Partial<{ name: string; active: boolean; rtp: number; views: number; imageUrl: string }>,
): Promise<CatalogProvider> {
  const { data } = await api.patch<CatalogProvider>(`/admin/providers/${id}`, body);
  return data;
}

export async function deleteProvider(id: string): Promise<void> {
  await api.delete(`/admin/providers/${id}`);
}
