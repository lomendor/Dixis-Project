import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  description: string;
  image: string;
  productCount: number;
  slug: string;
}

export function CategoryCard({ name, description, image, productCount, slug }: CategoryCardProps) {
  return (
    <Link
      to={`/products?category=${slug}`}
      className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="aspect-[4/3] relative">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-xl font-bold mb-2">{name}</h3>
          <p className="text-sm text-gray-200 mb-4">{description}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">{productCount} products</span>
            <ArrowRight className="h-5 w-5 transform group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}