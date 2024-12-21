import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';
import { Input } from '@/components/ui/Input';
import type { Product } from '@/types/product';

// Χρησιμοποιούμε τα sample data από το Products.tsx προσωρινά
const sampleProducts: Product[] = []; // TODO: Add sample data

function ProductCatalog() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = React.useState('');

  const category = searchParams.get('category');
  const producerId = searchParams.get('producer');
  const priceRange = searchParams.get('price');
  const inStock = searchParams.get('inStock') === 'true';

  const filteredProducts = sampleProducts.filter(product => {
    // Search filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Category filter
    if (category && product.category !== category) {
      return false;
    }

    // Producer filter
    if (producerId && product.producerId !== producerId) {
      return false;
    }

    // Price range filter
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      if (max && (product.price < min || product.price > max)) {
        return false;
      }
      if (!max && product.price < min) {
        return false;
      }
    }

    // Stock filter
    if (inStock && product.stock === 0) {
      return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <ProductFilters />
        </div>

        {/* Products */}
        <div className="flex-1">
          <div className="mb-6">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Αναζήτηση προϊόντων..."
              startIcon={<Search className="h-5 w-5 text-gray-400" />}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">
                Δεν βρέθηκαν προϊόντα με τα επιλεγμένα φίλτρα.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCatalog;