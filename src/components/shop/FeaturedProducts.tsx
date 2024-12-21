import React from 'react';
import { useTranslation } from 'react-i18next';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product } from '@/types/product';

// Χρησιμοποιούμε τα sample data από το Products.tsx προσωρινά
const sampleProducts: Product[] = []; // TODO: Add sample data

export function FeaturedProducts() {
  const { t } = useTranslation();

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">
          {t('products.featured')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleProducts.slice(0, 3).map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
}