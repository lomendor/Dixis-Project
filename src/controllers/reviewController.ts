import type { Request, Response } from 'express-serve-static-core';
import mongoose from 'mongoose';
import Review, { ReviewSchema } from '../models/Review';
import Producer from '../models/Producer';
import { z } from 'zod';
import { NotificationService } from '../services/notificationService';

// Types για τα responses
type ApiResponse<T> = {
  status: 'success' | 'error';
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
};

// Extend Request type to include user
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      _id: string;
      role: string;
      managedProducers?: string[];
    };
  }
}

// Create review
export const createReview = async (
  req: Request<{}, {}, z.infer<typeof ReviewSchema>>,
  res: Response<ApiResponse<any>>
) => {
  try {
    const producer = await Producer.findById(req.body.producer);
    if (!producer) {
      return res.status(404).json({
        status: 'error',
        message: 'Ο παραγωγός δεν βρέθηκε'
      });
    }

    // Έλεγχος αν ο χρήστης έχει ήδη αξιολογήσει τον παραγωγό
    const existingReview = await Review.findOne({
      producer: req.body.producer,
      user: req.body.user
    });

    if (existingReview) {
      return res.status(400).json({
        status: 'error',
        message: 'Έχετε ήδη αξιολογήσει αυτόν τον παραγωγό'
      });
    }

    const review = await Review.create(req.body);

    // Ειδοποίηση παραγωγού για νέα αξιολόγηση
    await NotificationService.notifyProducerForNewReview(
      producer,
      review.rating,
      review.comment
    );

    return res.status(201).json({
      status: 'success',
      data: review
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        status: 'error',
        message: 'Μη έγκυρα δεδομένα',
        data: error.errors
      });
    }

    console.error('Error in createReview:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Σφάλμα κατά τη δημιουργία της αξιολόγησης'
    });
  }
};

// Get producer reviews
export const getProducerReviews = async (req: Request, res: Response) => {
  try {
    const { producerId } = req.params;
    const user = req.user;

    if (!user) {
      return res.json({
        status: 'error',
        message: 'Δεν έχετε συνδεθεί'
      });
    }

    // Έλεγχος δικαιωμάτων
    const canViewReviews = 
      user.role === 'admin' || 
      (user.role === 'seller' && user.managedProducers?.includes(producerId)) ||
      user._id === producerId;

    if (!canViewReviews) {
      return res.json({
        status: 'error',
        message: 'Δεν έχετε δικαίωμα πρόσβασης σε αυτές τις αξιολογήσεις'
      });
    }

    const page = Number(req.query.page || '1');
    const limit = Number(req.query.limit || '10');
    const skip = (page - 1) * limit;

    const query: any = { producer: req.params.producerId };
    if (req.query.status) {
      query.status = req.query.status;
    }

    const reviews = await Review.find(query)
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments(query);

    return res.json({
      status: 'success',
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error in getProducerReviews:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Σφάλμα κατά την ανάκτηση των αξιολογήσεων'
    });
  }
};

// Update review status
export const updateReviewStatus = async (
  req: Request<
    { reviewId: string },
    {},
    { status: 'approved' | 'rejected'; comments?: string }
  >,
  res: Response<ApiResponse<any>>
) => {
  try {
    const review = await Review.findById(req.params.reviewId)
      .populate('user', 'name email')
      .populate('producer', 'name');

    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Η αξιολόγηση δεν βρέθηκε'
      });
    }

    review.status = req.body.status;
    if (req.body.comments) {
      review.adminComments = req.body.comments;
    }
    await review.save();

    // Ειδοποίηση χρήστη για την κατάσταση της αξιολόγησης
    const user = await mongoose.model('User').findById(review.user).select('name email');
    const producer = await Producer.findById(review.producer).select('name');

    if (user && producer) {
      await NotificationService.notifyUserForReviewStatus(
        user,
        producer.name,
        req.body.status,
        req.body.comments
      );
    }

    return res.json({
      status: 'success',
      data: review
    });
  } catch (error) {
    console.error('Error in updateReviewStatus:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Σφάλμα κατά την ενημέρωση της κατάστασης της αξιολόγησης'
    });
  }
};

// Get review statistics
export const getReviewStatistics = async (req: Request, res: Response) => {
  try {
    const { producerId } = req.params;
    const user = req.user;

    if (!user) {
      return res.json({
        status: 'error',
        message: 'Δεν έχετε συνδεθεί'
      });
    }

    // Έλεγχος δικαιωμάτων
    const canViewReviews = 
      user.role === 'admin' || 
      (user.role === 'seller' && user.managedProducers?.includes(producerId)) ||
      user._id === producerId;

    if (!canViewReviews) {
      return res.json({
        status: 'error',
        message: 'Δεν έχετε δικαίωμα πρόσβασης σε αυτές τις στατιστικές'
      });
    }

    const stats = await Review.aggregate([
      { 
        $match: { 
          producer: new mongoose.Types.ObjectId(req.params.producerId),
          status: 'approved'
        } 
      },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 },
          averageRating: { $avg: '$rating' }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    if (stats.length === 0) {
      return res.json({
        status: 'success',
        data: {
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: []
        }
      });
    }

    const totalReviews = stats.reduce((acc, curr) => acc + curr.count, 0);
    const averageRating = stats.reduce((acc, curr) => acc + (curr._id * curr.count), 0) / totalReviews;

    return res.json({
      status: 'success',
      data: {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution: stats.map(s => ({
          rating: s._id,
          count: s.count,
          percentage: Math.round((s.count / totalReviews) * 100)
        }))
      }
    });
  } catch (error) {
    console.error('Error in getReviewStatistics:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Σφάλμα κατά την ανάκτηση των στατιστικών'
    });
  }
}; 