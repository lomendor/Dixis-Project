import React from 'react';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import { Button } from '../ui/Button';

interface ProductReviewProps {
  productId: string;
  onClose?: () => void;
}

export function ProductReview({ productId, onClose }: ProductReviewProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState('');
  const [hoveredRating, setHoveredRating] = React.useState(0);

  const submitReview = useMutation({
    mutationFn: async () => {
      await api.post(`/products/${productId}/reviews`, {
        rating,
        comment,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      toast.success(t('feedback.reviewSubmitted'));
      onClose?.();
    },
    onError: () => {
      toast.error(t('feedback.reviewError'));
    },
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t('feedback.writeReview')}</h3>
      
      {/* Rating Stars */}
      <div className="flex items-center gap-2">
        <p className="text-sm text-gray-600">{t('feedback.rating')}:</p>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1"
              aria-label={t('feedback.ratingValue', { value })}
            >
              <Star
                className={`h-6 w-6 ${
                  (hoveredRating || rating) >= value
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Review Comment */}
      <div>
        <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700">
          {t('feedback.comment')}
        </label>
        <textarea
          id="review-comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder={t('feedback.commentPlaceholder')}
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={onClose}
        >
          {t('common.cancel')}
        </Button>
        <Button
          onClick={() => submitReview.mutate()}
          disabled={!rating || !comment || submitReview.isPending}
          loading={submitReview.isPending}
        >
          {t('feedback.submitReview')}
        </Button>
      </div>
    </div>
  );
}