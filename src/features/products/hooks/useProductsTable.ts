import { useState, useMemo } from 'react';
import type { Product, ProductFilters } from '../types/product';

interface UseProductsTableProps {
  products: Product[];
  filters: ProductFilters;
  defaultPageSize?: number;
}

interface UseProductsTableResult {
  filteredProducts: Product[];
  sortedProducts: Product[];
  paginatedProducts: Product[];
  sortConfig: {
    key: keyof Product | null;
    direction: 'asc' | 'desc';
  };
  currentPage: number;
  pageSize: number;
  totalPages: number;
  handleSort: (key: keyof Product) => void;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
}

export const useProductsTable = ({
  products,
  filters,
  defaultPageSize = 10
}: UseProductsTableProps): UseProductsTableResult => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product | null;
    direction: 'asc' | 'desc';
  }>({
    key: null,
    direction: 'asc'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (filters.category && product.category !== filters.category) return false;
      if (filters.producerId && product.producerId !== filters.producerId) return false;
      if (filters.minPrice && product.price < filters.minPrice) return false;
      if (filters.maxPrice && product.price > filters.maxPrice) return false;
      if (filters.status && product.status !== filters.status) return false;
      if (filters.featured !== undefined && product.featured !== filters.featured) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower) ||
          (product.producer?.name?.toLowerCase() || '').includes(searchLower)
        );
      }
      return true;
    });
  }, [products, filters]);

  const sortedProducts = useMemo(() => {
    if (!sortConfig.key) return filteredProducts;

    return [...filteredProducts].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredProducts, sortConfig]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedProducts.slice(startIndex, startIndex + pageSize);
  }, [sortedProducts, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedProducts.length / pageSize);

  const handleSort = (key: keyof Product) => {
    setSortConfig(current => ({
      key,
      direction:
        current.key === key && current.direction === 'asc'
          ? 'desc'
          : 'asc'
    }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return {
    filteredProducts,
    sortedProducts,
    paginatedProducts,
    sortConfig,
    currentPage,
    pageSize,
    totalPages,
    handleSort,
    handlePageChange,
    handlePageSizeChange
  };
}; 