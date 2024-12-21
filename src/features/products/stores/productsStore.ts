import { create } from 'zustand';
import { api } from '@/lib/api';
import type { Product } from '@/types/models/product.types';

interface ProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setProducts: (products: Product[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // CRUD operations
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, '_id'>) => Promise<Product>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductsStore = create<ProductsState>()(set => ({
  products: [],
  isLoading: false,
  error: null,

  // Basic setters
  setProducts: (products) => set({ products }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // CRUD operations
  fetchProducts: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get('/products');
      const products = Array.isArray(response.data) ? response.data : 
                      response.data.products ? response.data.products : [];
      set({ products });
    } catch (err) {
      set({ error: 'Σφάλμα κατά τη φόρτωση των προϊόντων' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  addProduct: async (product) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/products', product);
      const newProduct = response.data;
      set(state => ({
        products: [...state.products, newProduct]
      }));
      return newProduct;
    } catch (err) {
      set({ error: 'Σφάλμα κατά την προσθήκη του προϊόντος' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updateProduct: async (id, product) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.put(`/products/${id}`, product);
      const updatedProduct = response.data;
      set(state => ({
        products: state.products.map(p => 
          p._id === id ? updatedProduct : p
        )
      }));
      return updatedProduct;
    } catch (err) {
      set({ error: 'Σφάλμα κατά την ενημέρωση του προϊόντος' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProduct: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await api.delete(`/products/${id}`);
      set(state => ({
        products: state.products.filter(p => p._id !== id)
      }));
    } catch (err) {
      set({ error: 'Σφάλμα κατά τη διαγραφή του προϊόντος' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  }
})); 