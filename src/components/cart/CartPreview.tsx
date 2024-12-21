import { useCart } from '@/context/CartContext';
import type { CartItem } from '@/types/cart';
import { Link } from 'react-router-dom';
import { X, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface CartPreviewProps {
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const CartPreview = ({ onClose, onMouseEnter, onMouseLeave }: CartPreviewProps) => {
  const { items, totalPrice, removeItem } = useCart();

  return (
    <div 
      className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Καλάθι</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Cart Items */}
      <div className="max-h-96 overflow-y-auto">
        {items.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Το καλάθι σας είναι άδειο
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {items.map((item: CartItem) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  
                  {/* Product Info */}
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500">{item.producerName}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <div className="text-sm">
                        <span className="font-medium text-emerald-600">
                          {formatCurrency(item.price)}
                        </span>
                        <span className="text-gray-500 ml-1">
                          × {item.quantity} {item.unit}
                        </span>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-900">Σύνολο</span>
            <span className="text-lg font-semibold text-emerald-600">
              {formatCurrency(totalPrice)}
            </span>
          </div>
          <Link
            to="/cart"
            onClick={onClose}
            className="block w-full py-2 px-4 bg-emerald-600 text-white text-center 
                     rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Ολοκλήρωση Παραγγελίας
          </Link>
        </div>
      )}
    </div>
  );
}; 