import { api } from './client';

export async function listAffiliates(): Promise<unknown[]> {
  const { data } = await api.get<unknown[]>('/affiliates');
  return data;
}
