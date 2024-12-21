import { useQuery } from '@tanstack/react-query';
import type { AdminStats } from '@/features/admin/types/stats';
import { api } from '@/lib/api';

// Mock δεδομένα για development
const mockStats: AdminStats = {
  overview: {
    totalOrders: 567,
    totalProducts: 234,
    totalProducers: 45,
    totalUsers: 150,
    revenue: 45670
  },
  monthlySales: [
    { month: '2024-01', sales: 12450 },
    { month: '2023-12', sales: 10200 },
    { month: '2023-11', sales: 9800 }
  ],
  recentOrders: [
    {
      id: '1',
      orderNumber: 'ORD-001',
      customer: 'Γιώργος Παπαδόπουλος',
      total: 156.50,
      status: 'pending',
      date: new Date('2024-01-15')
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      customer: 'Μαρία Κωνσταντίνου',
      total: 89.90,
      status: 'completed',
      date: new Date('2024-01-14')
    }
  ],
  topProducers: [
    {
      id: '1',
      name: 'Παραδοσιακό Ελαιοτριβείο',
      totalProducts: 12,
      totalSales: 1780
    },
    {
      id: '2',
      name: 'Μελισσοκομία Κρήτης',
      totalProducts: 8,
      totalSales: 1005
    }
  ],
  productDistribution: [
    { category: 'Ελαιόλαδο', count: 89 },
    { category: 'Μέλι', count: 67 }
  ]
};

export const useAdminStats = () => {
  return useQuery<AdminStats>({
    queryKey: ['adminStats'],
    queryFn: async () => {
      // Σε development mode επιστρέφουμε mock δεδομένα
      if (import.meta.env.MODE === 'development') {
        return new Promise((resolve) => {
          setTimeout(() => resolve(mockStats), 1000); // Προσομοίωση καθυστέρησης δικτύου
        });
      }
      
      // Σε production θα καλούμε το πραγματικό API
      const response = await api.get('/admin/stats');
      return response.data;
    },
    refetchInterval: 60000, // Ανανέωση κάθε λεπτό
  });
}; 