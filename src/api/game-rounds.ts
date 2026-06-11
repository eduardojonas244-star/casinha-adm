import { api } from './client';
import type { PaginatedGameRounds } from '../types/api';

export async function listGameRounds(
  page = 0,
  limit = 20,
  filters?: { search?: string; outcome?: string; from?: string; to?: string },
): Promise<PaginatedGameRounds> {
  const { data } = await api.get<PaginatedGameRounds>('/admin/game-rounds', {
    params: { page, limit, ...filters },
  });
  return data;
}
