import { api } from './client';
import type { FinancialReport } from '../types/api';

export async function getFinancialReport(): Promise<FinancialReport> {
  const { data } = await api.get<FinancialReport>('/reports/financial');
  return data;
}
