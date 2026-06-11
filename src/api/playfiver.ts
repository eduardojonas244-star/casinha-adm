import { api } from './client';
import type { PlayFiverCredentials } from '../types/api';

export async function getPlayFiverCredentials(): Promise<PlayFiverCredentials> {
  const { data } = await api.get<PlayFiverCredentials>('/admin/playfiver/credentials');
  return data;
}

export async function getPlayFiverBalances(): Promise<Record<string, number>> {
  const { data } = await api.get<Record<string, number>>('/admin/playfiver/balances');
  return data;
}
