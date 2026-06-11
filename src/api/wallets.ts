import { api } from './client';
import type { WalletAdjustmentResult } from '../types/api';

export async function createAdjustment(input: {
  userId: string;
  amount: number;
  reason: string;
}): Promise<WalletAdjustmentResult> {
  const { data } = await api.post<WalletAdjustmentResult>('/wallets/adjustments', input);
  return data;
}
