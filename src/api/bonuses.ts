import { api } from './client';
import type { Bonus } from '../types/api';

export async function createBonus(input: {
  userId: string;
  amount: number;
  expiresAt?: string;
}): Promise<Bonus> {
  const { data } = await api.post<Bonus>('/bonuses', input);
  return data;
}
