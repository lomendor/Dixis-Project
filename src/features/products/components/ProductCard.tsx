import { useState, useCallback } from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import type { Product } from '../types/index';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
  onError?: (error: Error) => void;
}

/**
 * ProductCard component displays a product with its details and actions
 * 
 * @component
 * @example
 * ```tsx
 * <ProductCard 
 *   product={product}
 *   variant="featured"
 *   onError={(error) => console.error(error)}
 * />
 * ```
 */
export function ProductCard({ 
  product, 
  variant = 'default',
  className,
  onError 
}: ProductCardProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuantityChange = useCallback((change: number) => {
    setQuantity(prev => {
      const newQuantity = prev + change;
      return newQuantity >= 1 && newQuantity <= product.stock ? newQuantity : prev;
    });
  }, [product.stock]);

  const handleAddToCart = async () => {
    if (!product.stock || isOutOfStock) return;

    try {
      setIsLoading(true);
      await addItem({
        id: product._id,
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url || '',
        producerId: product.producerId,
        producerName: product.producer?.name || ''
      });
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
      className={cn(
        "bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all",
        variant === 'compact' && 'max-w-xs',
        variant === 'featured' && 'md:flex md:max-w-2xl',
        className
      )}
      aria-labelledby={`product-${product._id}-title`}
    >
      {/* Product Image */}
      <div className={cn(
        "aspect-square relative",
        variant === 'featured' && 'md:w-1/2 md:aspect-auto'
      )}>
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
      
      {/* Product Details */}
      <div className={cn(
        "p-4",
        variant === 'featured' && 'md:w-1/2 md:p-6'
      )}>
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 
              id={`product-${product._id}-title`}
              className={cn(
                "font-semibold",
                variant === 'featured' ? 'text-xl' : 'text-lg'
              )}
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

        <p className={cn(
          "text-gray-600 text-sm mb-4",
          variant === 'compact' ? 'line-clamp-2' : 'line-clamp-3'
        )}>
          {product.description}
        </p>

        {/* Quantity Controls and Add to Cart */}
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
            <span 
              className="w-8 text-center" 
              aria-label="Επιλεγμένη ποσότητα"
            >
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

        {/* Stock Warning */}
        {product.stock < 10 && product.stock > 0 && (
          <p className="text-xs text-orange-600 mt-2" role="alert">
            Απέμειναν μόνο {product.stock} {product.unit}
          </p>
        )}
      </div>
    </article>
  );
} 