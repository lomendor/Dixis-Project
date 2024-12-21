import { useState, useEffect } from 'react';
import { useProductsStore } from '../stores/productsStore';
import type { Product } from '../types/product';

interface UseProductsError {
  message: string;
  code: string;
}

export const useProducts = () => {
  const store = useProductsStore();
  const [error, setError] = useState<UseProductsError | null>(null);

  useEffect(() => {
    if (!store.products.length) {
      store.fetchProducts().catch(err => {
        setError({
          message: 'Σφάλμα κατά τη φόρτωση των προϊόντων',
          code: err.code || 'UNKNOWN_ERROR'
        });
      });
    }
  }, []);

  return {
    products: store.products,
    isLoading: store.isLoading,
    error,
    addProduct: store.addProduct,
    updateProduct: store.updateProduct,
    deleteProduct: store.deleteProduct,
    refreshProducts: store.fetchProducts
  };
}; 