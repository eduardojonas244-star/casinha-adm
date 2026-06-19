import { api } from './client';

export interface AffiliateRow {
  id: string;
  referralCode: string;
  totalEarnings: string;
  active: boolean;
  userName: string;
  userEmail: string;
  referralCount: number;
  commissionCount: number;
}

export async function listAffiliates(page = 0, limit = 20) {
  const { data } = await api.get<{ data: AffiliateRow[]; total: number }>('/affiliates', {
    params: { page, limit },
  });
  return data;
}
