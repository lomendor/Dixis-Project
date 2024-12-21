import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { X, ImageIcon, Plus } from 'lucide-react';

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({ label, error, className, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      {...props}
      className={`mt-1 block w-full rounded-md shadow-sm ${
        error ? 'border-red-300' : 'border-gray-300'
      } focus:border-primary-500 focus:ring-primary-500 ${className}`}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'outline' | 'primary';
}

const CustomButton: React.FC<CustomButtonProps> = ({ children, loading, variant, ...props }) => (
  <button
    {...props}
    className={`px-4 py-2 rounded-md ${
      variant === 'outline'
        ? 'border border-gray-300 hover:bg-gray-50'
        : 'bg-primary-600 text-white hover:bg-primary-700'
    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    disabled={loading || props.disabled}
  >
    {loading ? 'Φόρτωση...' : children}
  </button>
);

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    producerId: string;
    images: string[];
  };
  onClose: () => void;
}

const productSchema = z.object({
  name: z.string().min(1, 'Το όνομα είναι υποχρεωτικό'),
  description: z.string().min(1, 'Η περιγραφή είναι υποχρεωτική'),
  price: z.number().min(0, 'Η τιμή πρέπει να είναι θετική'),
  stock: z.number().int().min(0, 'Το απόθεμα πρέπει να είναι θετικό'),
  category: z.string().min(1, 'Η κατηγορία είναι υποχρεωτική'),
  producerId: z.string().min(1, 'Ο παραγωγός είναι υποχρεωτικός'),
  images: z.array(z.string()).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export function ProductForm({ product, onClose }: ProductFormProps) {
  const queryClient = useQueryClient();
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [images, setImages] = React.useState<string[]>(product?.images || []);
  const [newImageUrl, setNewImageUrl] = React.useState('');

  const mutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      if (product) {
        return api.put(`/admin/products/${product.id}`, data);
      }
      return api.post('/admin/products', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
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
    const data: ProductFormData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      stock: parseInt(formData.get('stock') as string),
      category: formData.get('category') as string,
      producerId: formData.get('producerId') as string,
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
      <CustomInput
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
        <CustomInput
          label="Τιμή (€)"
          name="price"
          type="number"
          step="0.01"
          defaultValue={product?.price}
          error={errors.price}
          required
        />

        <CustomInput
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
          Παραγωγός
        </label>
        <select
          name="producerId"
          defaultValue={product?.producerId}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            errors.producerId ? 'border-red-300' : 'border-gray-300'
          } focus:border-primary-500 focus:ring-primary-500`}
          required
        >
          <option value="">Επιλέξτε παραγωγό</option>
          {/* Add your producer options here */}
        </select>
        {errors.producerId && (
          <p className="mt-1 text-sm text-red-600">{errors.producerId}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Εικόνες Προϊόντος
        </label>
        <div className="mt-2 space-y-4">
          <div className="flex gap-2">
            <CustomInput
              label="URL εικόνας"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="URL εικόνας"
              className="flex-grow"
            />
            <CustomButton
              type="button"
              onClick={handleAddImage}
              disabled={!newImageUrl}
            >
              <Plus className="h-5 w-5" />
            </CustomButton>
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
        <CustomButton variant="outline" onClick={onClose}>
          Ακύρωση
        </CustomButton>
        <CustomButton
          type="submit"
          loading={mutation.isPending}
          disabled={mutation.isPending}
        >
          {product ? 'Ενημέρωση' : 'Προσθήκη'} Προϊόντος
        </CustomButton>
      </div>
    </form>
  );
}