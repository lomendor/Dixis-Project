import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { mockProducerStats } from '@/data/mockProducerStats';

interface ProducerStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
}

export function useProducerStats() {
  const { user } = useAuth();

  return useQuery<ProducerStats>({
    queryKey: ['producer-stats', user?._id],
    queryFn: async () => {
      // Προσομοίωση API call με mock δεδομένα
      await new Promise(resolve => setTimeout(resolve, 500));

      // Επιστροφή mock δεδομένων
      return mockProducerStats;
    },
    enabled: !!user?._id && (user?.role === 'producer' || user?.role === 'admin'),
  });
} 