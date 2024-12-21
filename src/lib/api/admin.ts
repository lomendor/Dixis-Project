import { api } from '@/lib/api';
import type { AdminStats } from '@features/admin/types/stats';

export const adminApi = {
  getStats: async (): Promise<AdminStats> => {
    const response = await api.get<AdminStats>('/api/admin/stats');
    return response.data;
  }
}; 