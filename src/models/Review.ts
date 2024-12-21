import { z } from 'zod';
import mongoose, { Schema, Model } from 'mongoose';

// Zod schema για validation
export const ReviewSchema = z.object({
  producer: z.string(),
  user: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'Το σχόλιο πρέπει να έχει τουλάχιστον 10 χαρακτήρες'),
  order: z.string().optional(),
  status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
  adminComments: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

// Mongoose schema
const reviewSchema = new Schema({
  producer: {
    type: Schema.Types.ObjectId,
    ref: 'Producer',
    required: [true, 'Ο παραγωγός είναι υποχρεωτικός']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Ο χρήστης είναι υποχρεωτικός']
  },
  rating: {
    type: Number,
    required: [true, 'Η βαθμολογία είναι υποχρεωτική'],
    min: [1, 'Η ελάχιστη βαθμολογία είναι 1'],
    max: [5, 'Η μέγιστη βαθμολογία είναι 5']
  },
  comment: {
    type: String,
    required: [true, 'Το σχόλιο είναι υποχρεωτικό'],
    minlength: [10, 'Το σχόλιο πρέπει να έχει τουλάχιστον 10 χαρακτήρες']
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminComments: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
reviewSchema.index({ producer: 1, user: 1 }, { unique: true });
reviewSchema.index({ status: 1 });
reviewSchema.index({ createdAt: -1 });

// Middleware για ενημέρωση του μέσου όρου αξιολογήσεων του παραγωγού
reviewSchema.post('save', async function() {
  const Review = this.constructor as Model<Review>;
  const stats = await Review.aggregate([
    { $match: { producer: this.producer, status: 'approved' } },
    {
      $group: {
        _id: '$producer',
        avgRating: { $avg: '$rating' },
        numReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Producer').findByIdAndUpdate(this.producer, {
      rating: Math.round(stats[0].avgRating * 10) / 10
    });
  }
});

export type Review = z.infer<typeof ReviewSchema>;
export default mongoose.model('Review', reviewSchema); 