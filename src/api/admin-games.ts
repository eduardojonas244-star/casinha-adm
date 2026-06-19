import { api } from './client';
import type { AdminGame, PaginatedAdminGames } from '../types/api';

export async function listAdminGames(
  page = 0,
  limit = 20,
  filters?: { search?: string; provider?: string; categoryId?: string; showOnHome?: boolean },
): Promise<PaginatedAdminGames> {
  const { data } = await api.get<PaginatedAdminGames>('/admin/games', {
    params: { page, limit, ...filters },
  });
  return data;
}

export async function syncAdminGames(): Promise<{ synced: number; validImages: number; invalidImages: number }> {
  const { data } = await api.post<{ synced: number; validImages: number; invalidImages: number }>('/admin/games/sync');
  return data;
}

export async function updateAdminGame(
  id: string,
  body: Partial<{ showOnHome: boolean; gameOriginal: boolean; active: boolean }>,
): Promise<AdminGame> {
  const { data } = await api.patch<AdminGame>(`/admin/games/${id}`, body);
  return data;
}

export async function deleteAdminGame(id: string): Promise<void> {
  await api.delete(`/admin/games/${id}`);
}
