import { api } from './client';

export interface Banner {
  id: string;
  title: string;
  highlight: string | null;
  subtitle: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  imageUrl: string | null;
  sortOrder: number;
  active: boolean;
}

export async function listBanners(): Promise<Banner[]> {
  const { data } = await api.get<Banner[]>('/admin/banners');
  return data;
}

export async function createBanner(input: Partial<Banner>) {
  const { data } = await api.post<Banner>('/admin/banners', input);
  return data;
}

export async function updateBanner(id: string, input: Partial<Banner>) {
  const { data } = await api.patch<Banner>(`/admin/banners/${id}`, input);
  return data;
}

export async function deleteBanner(id: string) {
  await api.delete(`/admin/banners/${id}`);
}
