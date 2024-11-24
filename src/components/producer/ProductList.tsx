import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import { ProductForm } from './ProductForm';
import { Button } from '../ui/Button';

export function ProductList() {
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const { data: products, isLoading } = useQuery({
    queryKey: ['producer-products'],
    queryFn: async () => {
      const response = await api.get('/producer/products');
      return response.data;
    },
  });

  const handleDelete = async (productId: string) => {
    if (window.confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το προϊόν;')) {
      try {
        await api.delete(`/producer/products/${productId}`);
        toast.success('Το προϊόν διαγράφηκε');
      } catch (error) {
        toast.error('Σφάλμα κατά τη διαγραφή του προϊόντος');
      }
    }
  };

  if (isLoading) {
    return <div>Φόρτωση...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Τα Προϊόντα μου</h2>
        <Button
          onClick={() => {
            setSelectedProduct(null);
            setIsFormOpen(true);
          }}
        >
          <Plus className="h-5 w-5 mr-2" />
          Νέο Προϊόν
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product: any) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.category}</p>
                </div>
                <p className="font-bold">€{product.price.toFixed(2)}</p>
              </div>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {product.description}
              </p>
              <div className="mt-4 flex justify-between items-center">
                <span className={`text-sm ${
                  product.stock > 10 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {product.stock} σε απόθεμα
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsFormOpen(true);
                    }}
                  >
                    <Edit2 className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-lg p-6">
            <Dialog.Title className="text-lg font-semibold mb-4">
              {selectedProduct ? 'Επεξεργασία' : 'Νέο'} Προϊόν
            </Dialog.Title>
            
            <ProductForm
              product={selectedProduct}
              onClose={() => setIsFormOpen(false)}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}