import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CartItem } from '@/types/common/cart.types';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export default function Cart() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();
  const [postalCode, setPostalCode] = useState('');
  const shippingCost = items.length ? 5 : 0;
  const total = totalPrice + shippingCost;

  const handleQuantityChange = (id: string, change: number) => {
    const item = items.find((item: CartItem) => item.id === id);
    if (!item) return;
    
    const newQuantity = item.quantity + change;
    if (newQuantity < 1) return;
    
    updateQuantity(id, newQuantity);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 mt-20">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Το καλάθι σας είναι άδειο</h2>
          <p className="text-gray-600 mb-6">
            Περιηγηθείτε στα προϊόντα μας και προσθέστε αυτά που σας ενδιαφέρουν
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-4 py-2 border border-transparent 
                     text-sm font-medium rounded-lg text-white bg-emerald-600 
                     hover:bg-emerald-700 transition-colors"
          >
            Προβολή Προϊόντων
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-20">
      <h1 className="text-2xl font-bold mb-6">Το Καλάθι μου</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item: CartItem) => (
            <Card key={item.id} className="p-4">
              <div className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        από {item.producerName}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-end mt-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, -1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {formatCurrency(item.price)} / {item.unit}
                      </p>
                      <p className="font-semibold">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Σύνοψη Παραγγελίας</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Ταχυδρομικός Κώδικας
                </label>
                <Input
                  id="postalCode"
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 5))}
                  placeholder="π.χ. 12345"
                  className="w-full"
                  maxLength={5}
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Υποσύνολο</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Μεταφορικά</span>
                  <span>{formatCurrency(shippingCost)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Σύνολο</span>
                    <span className="text-lg">{formatCurrency(total)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Συμπεριλαμβάνεται ΦΠΑ
                  </p>
                </div>
              </div>
            </div>
            
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              size="lg"
              disabled={!postalCode || postalCode.length < 5}
              onClick={() => {
                // TODO: Implement checkout logic
                toast.success('Η παραγγελία σας καταχωρήθηκε!');
              }}
            >
              Ολοκλήρωση Παραγγελίας
            </Button>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              Πατώντας "Ολοκλήρωση Παραγγελίας" αποδέχεστε τους όρους χρήσης
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}