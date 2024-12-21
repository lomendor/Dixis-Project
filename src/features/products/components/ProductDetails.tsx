import { useState } from 'react';
import { ShoppingCart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../types';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface ProductDetailsProps {
  product: Product;
  className?: string;
  onError?: (error: Error) => void;
}

/**
 * ProductDetails component displays detailed information about a product
 * 
 * @component
 * @example
 * ```tsx
 * <ProductDetails 
 *   product={product}
 *   onError={(error) => console.error(error)}
 * />
 * ```
 */
export function ProductDetails({ product, className, onError }: ProductDetailsProps) {
  const { addItem } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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
      toast.success('Το προϊόν προστέθηκε στο καλάθι');
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Σφάλμα προσθήκης στο καλάθι');
      onError?.(err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const isOutOfStock = product.stock === 0 || product.status === 'out_of_stock';

  return (
    <div className={cn("bg-white rounded-2xl shadow-lg overflow-hidden", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="relative aspect-square">
          <img
            src={product.images[selectedImageIndex]?.url || '/placeholder-product.jpg'}
            alt={product.images[selectedImageIndex]?.alt || product.name}
            className="w-full h-full object-cover"
          />
          
          {product.images.length > 1 && (
            <>
              <button
                onClick={previousImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
                aria-label="Προηγούμενη εικόνα"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
                aria-label="Επόμενη εικόνα"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Thumbnail Navigation */}
          {product.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index === selectedImageIndex ? "bg-emerald-600" : "bg-white/80"
                  )}
                  aria-label={`Μετάβαση στην εικόνα ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="p-6 md:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            {product.producer?.name && (
              <p className="text-gray-600">από {product.producer.name}</p>
            )}
          </div>

          {/* Price and Stock */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-emerald-600">
                {formatCurrency(product.price)}
              </span>
              <span className="text-gray-500">/ {product.unit}</span>
            </div>
            <p className={cn(
              "text-sm font-medium",
              isOutOfStock ? "text-red-600" : "text-emerald-600"
            )}>
              {isOutOfStock ? 'Εξαντλήθηκε' : `${product.stock} ${product.unit} διαθέσιμα`}
            </p>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* Producer Info */}
          {product.producer && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <h2 className="font-semibold">Σχετικά με τον παραγωγό</h2>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="font-medium">{product.producer.rating || 0}/5</span>
                {product.producer.productsCount > 0 && (
                  <span className="text-gray-500">
                    ({product.producer.productsCount} προϊόντα)
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isLoading}
            className="w-full h-12 text-lg"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {isOutOfStock 
              ? 'Εξαντλήθηκε' 
              : isLoading 
                ? 'Προσθήκη...' 
                : 'Προσθήκη στο καλάθι'
            }
          </Button>
        </div>
      </div>
    </div>
  );
} 