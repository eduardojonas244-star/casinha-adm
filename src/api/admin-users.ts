import { api } from './client';
import type { AdminUserDetail } from '../types/api';

export async function getAdminUser(id: string): Promise<AdminUserDetail> {
  const { data } = await api.get<AdminUserDetail>(`/admin/users/${id}`);
  return data;
}
