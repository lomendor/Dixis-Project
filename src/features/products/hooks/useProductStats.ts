import { useMemo } from 'react';
import type { Product, ProductStats } from '../types/product';

export const useProductStats = (products: Product[]): ProductStats => {
  return useMemo(() => {
    const stats: ProductStats = {
      total: products.length,
      active: products.filter(p => p.status === 'active').length,
      draft: products.filter(p => p.status === 'draft').length,
      outOfStock: products.filter(p => p.stock === 0).length,
      featured: products.filter(p => p.featured).length,
      averagePrice: products.reduce((acc, p) => acc + p.price, 0) / products.length || 0,
      totalValue: products.reduce((acc, p) => acc + (p.price * p.stock), 0)
    };

    return stats;
  }, [products]);
}; 