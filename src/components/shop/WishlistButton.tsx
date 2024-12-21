import { Heart } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface WishlistButtonProps {
  productId: string;
  isInWishlist: boolean;
}

export function WishlistButton({ productId, isInWishlist }: WishlistButtonProps) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const toggleWishlist = useMutation({
    mutationFn: async () => {
      if (isInWishlist) {
        await api.delete(`/wishlist/${productId}`);
      } else {
        await api.post('/wishlist', { productId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success(
        isInWishlist
          ? 'Αφαιρέθηκε από τα αγαπημένα'
          : 'Προστέθηκε στα αγαπημένα'
      );
    },
    onError: () => {
      toast.error('Παρουσιάστηκε σφάλμα');
    },
  });

  const handleClick = () => {
    if (!isAuthenticated) {
      toast.error('Παρακαλώ συνδεθείτε για να προσθέσετε στα αγαπημένα');
      return;
    }
    toggleWishlist.mutate();
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full transition-colors ${
        isInWishlist
          ? 'bg-red-100 text-red-600 hover:bg-red-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      aria-label={isInWishlist ? 'Αφαίρεση από τα αγαπημένα' : 'Προσθήκη στα αγαπημένα'}
    >
      <Heart
        className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`}
      />
    </button>
  );
}