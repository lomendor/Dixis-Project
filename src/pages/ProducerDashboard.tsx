import type { ProducerStats } from '@/types';

export const mockProducerStats: ProducerStats = {
  totalProducts: 20,
  totalOrders: 100,
  totalRevenue: 25000,
  monthlyGrowth: 10,
  recentOrders: [
    { id: 'o1', total: 200, status: 'completed', createdAt: '2023-08-01' },
    { id: 'o2', total: 150, status: 'pending', createdAt: '2023-08-02' }
  ]
};