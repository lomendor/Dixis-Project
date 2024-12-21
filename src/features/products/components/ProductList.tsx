import { useState } from 'react';
import { Search } from 'lucide-react';
import { ProductCard } from './ProductCard';
import type { Product } from '../types';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

interface ProductListProps {
  products: Product[];
  isLoading?: boolean;
  variant?: 'grid' | 'list';
  className?: string;
  showSearch?: boolean;
  onError?: (error: Error) => void;
}

/**
 * ProductList component displays a list of products with optional search functionality
 * 
 * @component
 * @example
 * ```tsx
 * <ProductList 
 *   products={products}
 *   variant="grid"
 *   showSearch
 *   onError={(error) => console.error(error)}
 * />
 * ```
 */
export function ProductList({
  products,
  isLoading = false,
  variant = 'grid',
  className,
  showSearch = true,
  onError
}: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.producer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Search Bar */}
      {showSearch && (
        <div className="mb-6">
          <div className="relative">
            <Input
              type="text"
              placeholder="Αναζήτηση προϊόντων..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      )}

      {/* No Results Message */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          {searchTerm ? (
            <div className="space-y-2">
              <p className="text-lg text-gray-600">
                Δε βρέθηκαν προϊόντα που να ταιριάζουν με "{searchTerm}"
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="text-emerald-600 hover:text-emerald-700"
              >
                Καθαρισμός αναζήτησης
              </button>
            </div>
          ) : (
            <p className="text-lg text-gray-600">
              Δεν υπάρχουν διαθέσιμα προϊόντα
            </p>
          )}
        </div>
      )}

      {/* Products Grid/List */}
      <div className={cn(
        "grid gap-6",
        variant === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1",
        filteredProducts.length > 0 && "mt-6"
      )}>
        {filteredProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            variant={variant === 'list' ? 'featured' : 'default'}
            onError={onError}
          />
        ))}
      </div>
    </div>
  );
} 