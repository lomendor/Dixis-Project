import { useState, useCallback } from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types/product';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  onError?: (error: Error) => void;
}

export function ProductCard({ product, onError }: ProductCardProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuantityChange = useCallback((change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  }, [quantity, product.stock]);

  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      addItem(product, quantity);
      setQuantity(1);
      toast.success('Το προϊόν προστέθηκε στο καλάθι');
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Σφάλμα προσθήκης στο καλάθι');
      onError?.(err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isOutOfStock = product.stock === 0 || product.status === 'out_of_stock';

  return (
    <article 
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      aria-labelledby={`product-${product._id}-title`}
    >
      <div className="aspect-square relative">
        <img 
          src={product.images[0]?.url || '/placeholder-product.jpg'} 
          alt={product.images[0]?.alt || product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-medium px-4 py-2 bg-black/70 rounded-full">
              Εξαντλήθηκε
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 
              id={`product-${product._id}-title`}
              className="font-semibold text-lg"
            >
              {product.name}
            </h3>
            {product.producer?.name && (
              <p className="text-sm text-gray-600">
                από {product.producer.name}
              </p>
            )}
          </div>
          <p className="font-semibold text-lg">
            {formatCurrency(product.price)}
            <span className="text-sm text-gray-500 ml-1">/ {product.unit}</span>
          </p>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-4">
          <div 
            className="flex items-center gap-2 bg-gray-50 rounded-lg p-1"
            role="group"
            aria-label="Επιλογή ποσότητας"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1 || isOutOfStock || isLoading}
              aria-label="Μείωση ποσότητας"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center" aria-label="Επιλεγμένη ποσότητα">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= product.stock || isOutOfStock || isLoading}
              aria-label="Αύξηση ποσότητας"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-gray-300"
            onClick={handleAddToCart}
            disabled={isOutOfStock || isLoading}
            aria-busy={isLoading}
          >
            <ShoppingCart className="w-4 h-4 mr-2" aria-hidden="true" />
            {isOutOfStock 
              ? 'Εξαντλήθηκε' 
              : isLoading 
                ? 'Προσθήκη...' 
                : 'Προσθήκη στο καλάθι'}
          </Button>
        </div>

        {product.stock < 10 && product.stock > 0 && (
          <p className="text-xs text-orange-600 mt-2" role="alert">
            Απέμειναν μόνο {product.stock} {product.unit}
          </p>
        )}
      </div>
    </article>
  );
} 