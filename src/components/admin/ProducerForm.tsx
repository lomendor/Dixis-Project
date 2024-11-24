import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import api from '../../utils/api';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const producerSchema = z.object({
  name: z.string().min(2, 'Το όνομα πρέπει να έχει τουλάχιστον 2 χαρακτήρες'),
  businessName: z.string().min(2, 'Η επωνυμία πρέπει να έχει τουλάχιστον 2 χαρακτήρες'),
  description: z.string().min(10, 'Η περιγραφή πρέπει να έχει τουλάχιστον 10 χαρακτήρες'),
  location: z.string().min(2, 'Η τοποθεσία είναι υποχρεωτική'),
  image: z.string().url('Παρακαλώ εισάγετε έγκυρο URL εικόνας'),
  coverImage: z.string().url('Παρακαλώ εισάγετε έγκυρο URL εικόνας εξωφύλλου'),
  email: z.string().email('Παρακαλώ εισάγετε έγκυρο email'),
  phone: z.string().min(10, 'Παρακαλώ εισάγετε έγκυρο τηλέφωνο'),
  website: z.string().url('Παρακαλώ εισάγετε έγκυρο URL ιστοσελίδας').optional(),
});

interface ProducerFormProps {
  producer?: {
    id: string;
    name: string;
    businessName: string;
    description: string;
    location: string;
    image: string;
    coverImage: string;
    contactInfo: {
      email: string;
      phone: string;
      website?: string;
    };
  };
  onClose: () => void;
}

export function ProducerForm({ producer, onClose }: ProducerFormProps) {
  const queryClient = useQueryClient();
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (producer) {
        return api.put(`/admin/producers/${producer.id}`, data);
      }
      return api.post('/admin/producers', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-producers'] });
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
    const data = {
      name: formData.get('name'),
      businessName: formData.get('businessName'),
      description: formData.get('description'),
      location: formData.get('location'),
      image: formData.get('image'),
      coverImage: formData.get('coverImage'),
      contactInfo: {
        email: formData.get('email'),
        phone: formData.get('phone'),
        website: formData.get('website'),
      },
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
      <Input
        label="Όνομα Παραγωγού"
        name="name"
        defaultValue={producer?.name}
        error={errors.name}
        required
      />

      <Input
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

      <Input
        label="Τοποθεσία"
        name="location"
        defaultValue={producer?.location}
        error={errors.location}
        required
      />

      <Input
        label="URL Εικόνας Προφίλ"
        name="image"
        type="url"
        defaultValue={producer?.image}
        error={errors.image}
        required
      />

      <Input
        label="URL Εικόνας Εξωφύλλου"
        name="coverImage"
        type="url"
        defaultValue={producer?.coverImage}
        error={errors.coverImage}
        required
      />

      <Input
        label="Email"
        name="email"
        type="email"
        defaultValue={producer?.contactInfo.email}
        error={errors.email}
        required
      />

      <Input
        label="Τηλέφωνο"
        name="phone"
        defaultValue={producer?.contactInfo.phone}
        error={errors.phone}
        required
      />

      <Input
        label="Ιστοσελίδα"
        name="website"
        type="url"
        defaultValue={producer?.contactInfo.website}
        error={errors.website}
      />

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onClose}>
          Ακύρωση
        </Button>
        <Button
          type="submit"
          loading={mutation.isPending}
          disabled={mutation.isPending}
        >
          {producer ? 'Ενημέρωση' : 'Προσθήκη'} Παραγωγού
        </Button>
      </div>
    </form>
  );
}