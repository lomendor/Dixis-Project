import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, MapPin } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  rating: number;
  reviews: number;
  producer: {
    id: string;
    name: string;
    location: string;
  };
}

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
}

export function ProductCard({ product, onAddToCart, onToggleWishlist }: ProductCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <article 
      className="group bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link 
        to={`/products/${product.id}`} 
        className="block relative aspect-[4/3]"
        aria-label={`Προβολή λεπτομερειών για ${product.name}`}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        <div 
          className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        />
      </Link>

      <div className="p-4">
        {/* Producer Info */}
        <Link 
          to={`/producers/${product.producer.id}`}
          className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 mb-2"
        >
          <MapPin className="h-4 w-4" />
          <span>{product.producer.name}</span>
          <span className="text-gray-400">·</span>
          <span className="text-gray-600">{product.producer.location}</span>
        </Link>

        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-900">
            <Link 
              to={`/products/${product.id}`}
              className="hover:text-primary-600"
            >
              {product.name}
            </Link>
          </h3>
          <div className="flex items-center gap-1" aria-label={`Βαθμολογία ${product.rating} από 5 αστέρια`}>
            <Star className="h-4 w-4 text-yellow-400 fill-current" aria-hidden="true" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-sm text-gray-500">
              ({product.reviews})
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900" aria-label={`Τιμή: ${formatCurrency(product.price)}`}>
            {formatCurrency(product.price)}
          </span>
          
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                onToggleWishlist();
              }}
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              aria-label="Προσθήκη στα αγαπημένα"
            >
              <Heart className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                onAddToCart();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
              aria-label="Προσθήκη στο καλάθι"
            >
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              <span className="hidden sm:inline">Προσθήκη</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}