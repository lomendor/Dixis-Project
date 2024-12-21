import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';

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

interface Producer {
  id: string;
  name: string;
  businessName: string;
  description: string;
  location: string;
  image: string;
}

interface ProducerFormProps {
  producer?: Producer;
  onClose: () => void;
}

const producerSchema = z.object({
  name: z.string().min(1, 'Το όνομα είναι υποχρεωτικό'),
  businessName: z.string().min(1, 'Η επωνυμία είναι υποχρεωτική'),
  description: z.string().min(1, 'Η περιγραφή είναι υποχρεωτική'),
  location: z.string().min(1, 'Η τοποθεσία είναι υποχρεωτική'),
  image: z.string().url('Μη έγκυρο URL εικόνας'),
});

type ProducerFormData = z.infer<typeof producerSchema>;

export function ProducerForm({ producer, onClose }: ProducerFormProps) {
  const queryClient = useQueryClient();
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: async (data: ProducerFormData) => {
      if (producer) {
        return api.put(`/admin/producers/${producer.id}`, data);
      }
      return api.post('/admin/producers', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['producers'] });
      toast.success(producer ? 'Ο παραγωγός ενημερώθηκε' : 'Ο παραγωγός προστέθηκε');
      onClose();
    },
    onError: () => {
      toast.error('Παρουσιάστηκε σφάλμα');
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: ProducerFormData = {
      name: formData.get('name') as string,
      businessName: formData.get('businessName') as string,
      description: formData.get('description') as string,
      location: formData.get('location') as string,
      image: formData.get('image') as string,
    };

    try {
      producerSchema.parse(data);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CustomInput
        label="Όνομα Παραγωγού"
        name="name"
        defaultValue={producer?.name}
        error={errors.name}
        required
      />

      <CustomInput
        label="Επωνυμία Επιχείρησης"
        name="businessName"
        defaultValue={producer?.businessName}
        error={errors.businessName}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Περιγραφή
        </label>
        <textarea
          name="description"
          rows={4}
          defaultValue={producer?.description}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            errors.description ? 'border-red-300' : 'border-gray-300'
          } focus:border-primary-500 focus:ring-primary-500`}
          required
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <CustomInput
        label="Τοποθεσία"
        name="location"
        defaultValue={producer?.location}
        error={errors.location}
        required
      />

      <CustomInput
        label="URL Εικόνας Προφίλ"
        name="image"
        type="url"
        defaultValue={producer?.image}
        error={errors.image}
        required
      />

      <div className="flex justify-end gap-4">
        <CustomButton variant="outline" onClick={onClose}>
          Ακύρωση
        </CustomButton>
        <CustomButton
          type="submit"
          loading={mutation.isPending}
          disabled={mutation.isPending}
        >
          {producer ? 'Ενημέρωση' : 'Προσθήκη'} Παραγωγού
        </CustomButton>
      </div>
    </form>
  );
}