import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { z } from 'zod';
import api from '../../utils/api';
import type { Address, User } from '../../types';

const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(4, 'Valid postal code is required'),
  country: z.string().min(2, 'Country is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
});

function Profile() {
  const [isAddressModalOpen, setIsAddressModalOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const { data: user } = useQuery<User>({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await api.get('/user/profile');
      return response.data;
    },
  });

  const deleteAddress = useMutation({
    mutationFn: async (addressId: string) => {
      await api.delete(`/user/addresses/${addressId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast.success('Address deleted successfully');
    },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Το Προφίλ μου</h1>

      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Προσωπικά Στοιχεία</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Όνομα</p>
            <p className="font-medium">{user?.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Shipping Addresses */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Διευθύνσεις Αποστολής</h2>
          <button
            onClick={() => setIsAddressModalOpen(true)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <Plus className="h-5 w-5" />
            Προσθήκη Διεύθυνσης
          </button>
        </div>

        <div className="space-y-4">
          {user?.addresses.map((address: Address, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 flex justify-between items-start"
            >
              <div>
                <p className="font-medium">{address.fullName}</p>
                <p className="text-sm text-gray-600">{address.street}</p>
                <p className="text-sm text-gray-600">
                  {address.city}, {address.postalCode}
                </p>
                <p className="text-sm text-gray-600">{address.country}</p>
                <p className="text-sm text-gray-600">{address.phone}</p>
              </div>
              <button
                onClick={() => deleteAddress.mutate(index.toString())}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
      />
    </div>
  );
}

function AddressModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const addAddress = useMutation({
    mutationFn: async (data: Address) => {
      await api.post('/user/addresses', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast.success('Address added successfully');
      onClose();
    },
    onError: () => {
      toast.error('Failed to add address');
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget));

    try {
      const validatedData = addressSchema.parse(formData);
      setErrors({});
      await addAddress.mutateAsync(validatedData as Address);
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
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md w-full bg-white rounded-lg p-6">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Προσθήκη Νέας Διεύθυνσης
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Ονοματεπώνυμο
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className={`mt-1 block w-full rounded-md shadow-sm ${
                  errors.fullName ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                Διεύθυνση
              </label>
              <input
                type="text"
                id="street"
                name="street"
                className={`mt-1 block w-full rounded-md shadow-sm ${
                  errors.street ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.street && (
                <p className="mt-1 text-sm text-red-600">{errors.street}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  Πόλη
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    errors.city ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>

              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  Τ.Κ.
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    errors.postalCode ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.postalCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Χώρα
              </label>
              <input
                type="text"
                id="country"
                name="country"
                className={`mt-1 block w-full rounded-md shadow-sm ${
                  errors.country ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.country && (
                <p className="mt-1 text-sm text-red-600">{errors.country}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Τηλέφωνο
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className={`mt-1 block w-full rounded-md shadow-sm ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Ακύρωση
              </button>
              <button
                type="submit"
                disabled={addAddress.isPending}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {addAddress.isPending ? 'Αποθήκευση...' : 'Αποθήκευση'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default Profile;