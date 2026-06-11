import { api } from './client';
import type { GameCategory, PaginatedCategories } from '../types/api';

export async function listCategories(page = 0, limit = 20, search?: string): Promise<PaginatedCategories> {
  const { data } = await api.get<PaginatedCategories>('/admin/categories', { params: { page, limit, search } });
  return data;
}

export async function getCategory(id: string): Promise<GameCategory> {
  const { data } = await api.get<GameCategory>(`/admin/categories/${id}`);
  return data;
}

export async function createCategory(body: {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
}): Promise<GameCategory> {
  const { data } = await api.post<GameCategory>('/admin/categories', body);
  return data;
}

export async function updateCategory(
  id: string,
  body: Partial<{ name: string; slug: string; description: string; imageUrl: string; sortOrder: number }>,
): Promise<GameCategory> {
  const { data } = await api.patch<GameCategory>(`/admin/categories/${id}`, body);
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/admin/categories/${id}`);
}
