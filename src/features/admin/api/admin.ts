import api from '@utils/api';
import type { AdminStats } from '@features/admin/types/stats';
import type { AdminProduct } from '@features/admin/types/product';
import type { AdminOrder } from '@features/admin/types/order';
import type { AdminUser } from '@features/admin/types/user';

export const adminApi = {
  // Dashboard & Stats
  getStats: async (): Promise<AdminStats> => {
    const response = await api.get<AdminStats>('/api/admin/stats');
    return response.data;
  },

  // Products
  getProducts: async () => {
    const response = await api.get<AdminProduct[]>('/api/admin/products');
    return response.data;
  },

  updateProduct: async (id: string, data: Partial<AdminProduct>) => {
    const response = await api.put<AdminProduct>(`/api/admin/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: string) => {
    await api.delete(`/api/admin/products/${id}`);
  },

  // Orders
  getOrders: async () => {
    const response = await api.get<AdminOrder[]>('/api/admin/orders');
    return response.data;
  },

  updateOrder: async (id: string, data: Partial<AdminOrder>) => {
    const response = await api.put<AdminOrder>(`/api/admin/orders/${id}`, data);
    return response.data;
  },

  // Users
  getUsers: async () => {
    const response = await api.get<AdminUser[]>('/api/admin/users');
    return response.data;
  },

  updateUser: async (id: string, data: Partial<AdminUser>) => {
    const response = await api.put<AdminUser>(`/api/admin/users/${id}`, data);
    return response.data;
  }
}; 