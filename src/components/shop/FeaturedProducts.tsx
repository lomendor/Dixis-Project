import React from 'react';
import { sampleProducts } from '../../data/sampleProducts';
import { ProductCard } from '../ui/ProductCard';

export function FeaturedProducts() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">
          Προτεινόμενα Προϊόντα
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleProducts.slice(0, 3).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => {}}
              onToggleWishlist={() => {}}
            />
          ))}
        </div>
      </div>
    </section>
  );
}