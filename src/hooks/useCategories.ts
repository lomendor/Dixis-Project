import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { message } from 'antd';

interface Category {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  image?: string;
  isActive: boolean;
  order: number;
  parent?: {
    _id: string;
    name: string;
  };
  children?: Category[];
}

interface CategoryInput {
  name: string;
  description?: string;
  parent?: string;
  isActive: boolean;
  image?: File;
}

export function useCategories() {
  const queryClient = useQueryClient();

  // Fetch all categories
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await axios.get('/api/categories');
      return data;
    }
  });

  // Fetch category tree
  const { data: categoryTree } = useQuery<Category[]>({
    queryKey: ['categoryTree'],
    queryFn: async () => {
      const { data } = await axios.get('/api/categories/tree');
      return data;
    }
  });

  // Create category
  const createCategory = useMutation({
    mutationFn: async (categoryData: CategoryInput) => {
      const formData = new FormData();
      Object.entries(categoryData).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value);
        }
      });
      const { data } = await axios.post('/api/categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categoryTree'] });
      message.success('Η κατηγορία δημιουργήθηκε επιτυχώς');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Σφάλμα κατά τη δημιουργία');
    }
  });

  // Update category
  const updateCategory = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CategoryInput }) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value);
        }
      });
      const response = await axios.put(`/api/categories/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categoryTree'] });
      message.success('Η κατηγορία ενημερώθηκε επιτυχώς');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Σφάλμα κατά την ενημέρωση');
    }
  });

  // Delete category
  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categoryTree'] });
      message.success('Η κατηγορία διαγράφηκε επιτυχώς');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Σφάλμα κατά τη διαγραφή');
    }
  });

  // Update categories order
  const updateOrder = useMutation({
    mutationFn: async (categories: { _id: string; order: number; parent?: string }[]) => {
      await axios.patch('/api/categories/order', { categories });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categoryTree'] });
      message.success('Η σειρά των κατηγοριών ενημερώθηκε επιτυχώς');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Σφάλμα κατά την ενημέρωση της σειράς');
    }
  });

  // Update status
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: boolean }) => {
      const { data } = await axios.patch(`/api/categories/${id}/status`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categoryTree'] });
      message.success('Η κατάσταση της κατηγορίας ενημερώθηκε επιτυχώς');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Σφάλμα κατά την ενημέρωση της κατάστασης');
    }
  });

  return {
    categories,
    categoryTree,
    isLoading,
    createCategory,
    updateCategory,
    deleteCategory,
    updateOrder,
    updateStatus
  };
} 