import { api } from './client';
import type { AdminUserListItem, UserProfile } from '../types/api';

export async function getMe(): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>('/users/me');
  return data;
}

export async function listUsers(page = 0, limit = 20): Promise<AdminUserListItem[]> {
  const { data } = await api.get<AdminUserListItem[]>('/users', { params: { page, limit } });
  return data;
}
