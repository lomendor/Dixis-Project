import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export type OrderStatus = 'completed' | 'processing' | 'pending' | 'cancelled';

interface Order {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  items: {
    id: string;
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export function useAdminOrders() {
  const { data: orders, isLoading, error } = useQuery<Order[]>({
    queryKey: ['admin', 'orders'],
    queryFn: async () => {
      const response = await api.get('/admin/orders');
      return response.data;
    }
  });

  const ordersByStatus = orders?.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<OrderStatus, number>) || {};

  const totalOrders = orders?.length || 0;
  const totalRevenue = orders?.reduce((sum, order) => sum + order.total, 0) || 0;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const recentOrders = orders?.slice(0, 5).map(order => ({
    id: order.id,
    customer: order.customer.name,
    total: order.total,
    status: order.status,
    date: order.createdAt,
    items: order.items.length
  })) || [];

  return {
    orders,
    isLoading,
    error,
    stats: {
      total: totalOrders,
      revenue: totalRevenue,
      average: averageOrderValue,
      byStatus: ordersByStatus
    },
    recentOrders
  };
} 