import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@features/admin/api/admin';
import type { AdminStats } from '@features/admin/types/stats';

export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      try {
        const data = await adminApi.getStats();
        return data;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to fetch admin stats: ${error.message}`);
        }
        throw new Error('Failed to fetch admin stats');
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  });
} 