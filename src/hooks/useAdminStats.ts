import { useQuery } from '@tanstack/react-query';
import { AdminStats } from '../types';
import api from '../utils/api';

// Mock δεδομένα για development
const mockStats: AdminStats = {
  totalUsers: 150,
  totalProducers: 45,
  totalProducts: 234,
  totalOrders: 567,
  totalRevenue: 45670,
  pendingVerifications: 12,
  activeUsers: 89,
  monthlyGrowth: {
    users: 24,
    orders: 156,
    revenue: 12450
  },
  recentOrders: [
    {
      id: '1',
      customerName: 'Γιώργος Παπαδόπουλος',
      total: 156.50,
      status: 'pending',
      date: '2024-01-15'
    },
    {
      id: '2',
      customerName: 'Μαρία Κωνσταντίνου',
      total: 89.90,
      status: 'completed',
      date: '2024-01-14'
    }
  ],
  topProducts: [
    {
      id: '1',
      name: 'Έξτρα Παρθένο Ελαιόλαδο',
      sales: 89,
      revenue: 1780
    },
    {
      id: '2',
      name: 'Θυμαρίσιο Μέλι',
      sales: 67,
      revenue: 1005
    }
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