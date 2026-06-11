import { api } from './client';
import type { PaginatedGames } from '../types/api';

export async function listGames(page = 0, limit = 20): Promise<PaginatedGames> {
  const { data } = await api.get<PaginatedGames>('/games', { params: { page, limit } });
  return data;
}

export async function syncGames(): Promise<{ synced: number }> {
  const { data } = await api.post<{ synced: number }>('/games/sync');
  return data;
}
