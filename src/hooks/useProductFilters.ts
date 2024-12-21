import { useState, useMemo } from 'react';
import { Product, ProductCategory, ProductStatus } from '@/types/product';
import { FilterField } from '@/components/common/Filter/BaseFilter';

export const useProductFilters = (products: Product[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});

  const filterFields: FilterField[] = useMemo(() => [
    {
      id: 'category',
      label: 'Κατηγορία',
      options: Object.entries(ProductCategory).map(([_, value]) => ({
        value,
        label: value
      }))
    },
    {
      id: 'status',
      label: 'Κατάσταση',
      options: Object.entries(ProductStatus).map(([_, value]) => ({
        value,
        label: value === ProductStatus.Active ? 'Ενεργό' :
               value === ProductStatus.Inactive ? 'Ανενεργό' :
               'Εκτός Αποθέματος'
      }))
    }
  ], []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Έλεγχος αναζήτησης
      const matchesSearch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Έλεγχος φίλτρων
      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return product[key as keyof Product] === value;
      });

      return matchesSearch && matchesFilters;
    });
  }, [products, searchQuery, filters]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleFilter = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
  };

  return {
    filters,
    searchQuery,
    filterFields,
    handleSearch,
    handleFilter,
    filteredProducts,
  };
}; 