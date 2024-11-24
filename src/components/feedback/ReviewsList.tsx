import React from 'react';
import { useTranslation } from 'react-i18next';
import { Star, ThumbsUp, Flag } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../ui/Button';

interface Review {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
  isHelpful?: boolean;
}

interface ReviewsListProps {
  reviews: Review[];
  onHelpful: (reviewId: string) => void;
  onReport: (reviewId: string) => void;
}

export function ReviewsList({ reviews, onHelpful, onReport }: ReviewsListProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('feedback.reviews')}</h2>
      {reviews.map((review) => (
        <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <img
                src={review.user.avatar || `https://ui-avatars.com/api/?name=${review.user.name}`}
                alt=""
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="font-medium">{review.user.name}</h3>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {format(new Date(review.createdAt), 'PPP')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-4 text-gray-600">{review.comment}</p>

          <div className="mt-4 flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onHelpful(review.id)}
              className={review.isHelpful ? 'text-primary-600' : ''}
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              {review.helpful} {t('feedback.helpful')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReport(review.id)}
            >
              <Flag className="h-4 w-4 mr-2" />
              {t('feedback.report')}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}