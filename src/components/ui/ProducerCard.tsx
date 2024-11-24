import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';

interface ProducerCardProps {
  producer: {
    id: string;
    name: string;
    location: string;
    image: string;
    rating: number;
    productCount: number;
    description: string;
  };
}

export function ProducerCard({ producer }: ProducerCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="aspect-[3/2] relative">
        <img
          src={producer.image}
          alt={producer.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full shadow-md">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{producer.rating}</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold">{producer.name}</h3>
          <div className="flex items-center text-neutral-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{producer.location}</span>
          </div>
        </div>

        <p className="text-sm text-neutral-600 mb-4">
          {producer.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-500">
            {producer.productCount} products
          </span>
          <Link
            to={`/producers/${producer.id}`}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            View Profile →
          </Link>
        </div>
      </div>
    </div>
  );
}