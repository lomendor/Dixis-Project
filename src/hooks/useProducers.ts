import { useState } from 'react';
import { Producer, NewProducer } from '@/types';
import api from '@/lib/api';

interface Pagination {
  total: number;
  pages: number;
  currentPage: number;
}

interface UseProducersProps {
  page?: number;
  search?: string;
}

export const useProducers = ({ page = 1, search = '' }: UseProducersProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [producers, setProducers] = useState<Producer[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const refreshProducers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/producers?page=${page}&search=${search}`);
      setProducers(response.data.producers);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const addProducer = async (producer: NewProducer) => {
    setIsCreating(true);
    try {
      const response = await api.post('/producers', producer);
      await refreshProducers();
      return response.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  const updateProducer = async (id: string, updates: Partial<Producer>) => {
    setIsUpdating(true);
    try {
      const response = await api.put(`/producers/${id}`, updates);
      await refreshProducers();
      return response.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteProducer = async (id: string) => {
    setIsDeleting(true);
    try {
      await api.delete(`/producers/${id}`);
      await refreshProducers();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    producers,
    pagination,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    addProducer,
    updateProducer,
    deleteProducer,
    refetch: refreshProducers
  };
}; 