import { api } from './client';
import type { GameLaunchConfig } from '../types/api';

export async function getGameLaunchConfig(): Promise<GameLaunchConfig> {
  const { data } = await api.get<GameLaunchConfig>('/admin/game-launch-config');
  return data;
}

export async function updateGameLaunchConfig(body: { requireDailyDeposit: boolean }): Promise<GameLaunchConfig> {
  const { data } = await api.patch<GameLaunchConfig>('/admin/game-launch-config', body);
  return data;
}
