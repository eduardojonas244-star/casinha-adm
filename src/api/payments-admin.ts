import { api } from './client';

export interface AdminDeposit {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  amount: string;
  status: string;
  createdAt: string;
}

export interface AdminWithdrawal {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  amount: string;
  status: string;
  pixKey: string;
  createdAt: string;
}

export async function listAdminDeposits(page = 0, limit = 20, status?: string) {
  const { data } = await api.get<{ data: AdminDeposit[]; total: number }>('/admin/deposits', {
    params: { page, limit, status },
  });
  return data;
}

export async function listAdminWithdrawals(page = 0, limit = 20, status?: string) {
  const { data } = await api.get<{ data: AdminWithdrawal[]; total: number }>('/admin/withdrawals', {
    params: { page, limit, status },
  });
  return data;
}
