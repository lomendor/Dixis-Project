import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  producer: {
    id: string;
    name: string;
  };
  status: 'active' | 'inactive';
  createdAt: string;
}

export function useAdminProducts() {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['admin', 'products'],
    queryFn: async () => {
      const response = await api.get('/admin/products');
      return response.data;
    }
  });

  const productsByCategory = products?.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const totalProducts = products?.length || 0;
  const activeProducts = products?.filter(p => p.status === 'active').length || 0;
  const outOfStock = products?.filter(p => p.stock === 0).length || 0;

  return {
    products,
    isLoading,
    error,
    stats: {
      total: totalProducts,
      active: activeProducts,
      outOfStock
    },
    productsByCategory
  };
} 