import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Image as ImageIcon, Plus, X } from 'lucide-react';
import { z } from 'zod';
import api from '../../utils/api';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const productSchema = z.object({
  name: z.string().min(2, 'Το όνομα πρέπει να έχει τουλάχιστον 2 χαρακτήρες'),
  description: z.string().min(10, 'Η περιγραφή πρέπει να έχει τουλάχιστον 10 χαρακτήρες'),
  price: z.number().min(0.01, 'Η τιμή πρέπει να είναι μεγαλύτερη από 0'),
  stock: z.number().int().min(0, 'Το απόθεμα δεν μπορεί να είναι αρνητικό'),
  category: z.string().min(1, 'Παρακαλώ επιλέξτε κατηγορία'),
  images: z.array(z.string().url()).min(1, 'Προσθέστε τουλάχιστον μία εικόνα'),
});

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    images: string[];
  };
  onClose: () => void;
}

export function ProductForm({ product, onClose }: ProductFormProps) {
  const queryClient = useQueryClient();
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [images, setImages] = React.useState<string[]>(product?.images || []);
  const [newImageUrl, setNewImageUrl] = React.useState('');

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (product) {
        return api.put(`/producer/products/${product.id}`, data);
      }
      return api.post('/producer/products', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['producer-products'] });
      toast.success(product ? 'Το προϊόν ενημερώθηκε' : 'Το προϊόν προστέθηκε');
      onClose();
    },
    onError: () => {
      toast.error('Παρουσιάστηκε σφάλμα');
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      stock: parseInt(formData.get('stock') as string),
      category: formData.get('category') as string,
      images,
    };

    try {
      productSchema.parse(data);
      setErrors({});
      mutation.mutate(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  const handleAddImage = () => {
    if (newImageUrl && !images.includes(newImageUrl)) {
      setImages([...images, newImageUrl]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Όνομα Προϊόντος"
        name="name"
        defaultValue={product?.name}
        error={errors.name}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Περιγραφή
        </label>
        <textarea
          name="description"
          rows={4}
          defaultValue={product?.description}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            errors.description ? 'border-red-300' : 'border-gray-300'
          } focus:border-primary-500 focus:ring-primary-500`}
          required
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Τιμή (€)"
          name="price"
          type="number"
          step="0.01"
          defaultValue={product?.price}
          error={errors.price}
          required
        />

        <Input
          label="Απόθεμα"
          name="stock"
          type="number"
          defaultValue={product?.stock}
          error={errors.stock}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Κατηγορία
        </label>
        <select
          name="category"
          defaultValue={product?.category}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            errors.category ? 'border-red-300' : 'border-gray-300'
          } focus:border-primary-500 focus:ring-primary-500`}
          required
        >
          <option value="">Επιλέξτε κατηγορία</option>
          <option value="olive-oil">Ελαιόλαδο</option>
          <option value="honey">Μέλι</option>
          <option value="wine">Κρασί</option>
          <option value="cheese">Τυρί</option>
          <option value="herbs">Βότανα</option>
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Εικόνες Προϊόντος
        </label>
        <div className="mt-2 space-y-4">
          <div className="flex gap-2">
            <Input
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="URL εικόνας"
              className="flex-grow"
            />
            <Button
              type="button"
              onClick={handleAddImage}
              disabled={!newImageUrl}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Product ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {images.length === 0 && (
              <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-1 text-sm text-gray-500">
                    Προσθέστε εικόνες προϊόντος
                  </p>
                </div>
              </div>
            )}
          </div>
          {errors.images && (
            <p className="text-sm text-red-600">{errors.images}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onClose}>
          Ακύρωση
        </Button>
        <Button
          type="submit"
          loading={mutation.isPending}
          disabled={mutation.isPending}
        >
          {product ? 'Ενημέρωση' : 'Προσθήκη'} Προϊόντος
        </Button>
      </div>
    </form>
  );
}