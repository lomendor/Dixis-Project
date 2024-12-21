import { Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import Producer from '../models/Producer';
import User from '../models/User';
import type { AdminStats } from '@/features/admin/types/stats';
import {
  TypedRequestBody,
  TypedRequestParams,
  AssignProducerBody,
  ReviewApplicationBody,
  UpdateUserBody,
  UpdateOrderBody,
  ReviewParams,
  PopulatedUser,
  MonthlySalesResult,
  ProducerAggregateResult,
  ProductDistributionResult,
  UserDocument,
  OrderDocument
} from '../types/admin';
import { HTTP_STATUS, sendResponse, sendError } from '../utils/response';

export const getStats = async (_req: TypedRequestBody<void>, res: Response): Promise<void> => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalProducers = await Producer.countDocuments();
    const totalUsers = await User.countDocuments();
    
    const revenueResult = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const revenue = revenueResult[0]?.total || 0;

    // Fetch monthly sales for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlySalesResults = await Order.aggregate<MonthlySalesResult>([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          sales: { $sum: '$total' }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 1,
          month: '$_id',
          sales: 1
        }
      }
    ]);

    const monthlySales = monthlySalesResults.map(result => ({
      month: result.month,
      sales: result.sales
    }));

    // Fetch recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate<{ user: PopulatedUser }>('user', 'name')
      .select('orderNumber total status createdAt user')
      .lean()
      .then(orders => orders.map(order => ({
        id: order._id.toString(),
        orderNumber: order.orderNumber,
        customer: order.user.name,
        total: order.total,
        status: order.status,
        date: order.createdAt
      })));

    // Fetch top producers
    const topProducersResults = await Producer.aggregate<ProducerAggregateResult>([
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'producer',
          as: 'products'
        }
      },
      {
        $lookup: {
          from: 'orders',
          localField: 'products._id',
          foreignField: 'items.product',
          as: 'sales'
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          totalProducts: { $size: '$products' },
          totalSales: {
            $sum: {
              $map: {
                input: '$sales',
                as: 'sale',
                in: '$$sale.total'
              }
            }
          }
        }
      },
      { $sort: { totalSales: -1 } },
      { $limit: 5 }
    ]);

    const topProducers = topProducersResults.map(producer => ({
      id: producer._id.toString(),
      name: producer.name,
      totalProducts: producer.totalProducts,
      totalSales: producer.totalSales
    }));

    // Fetch product distribution by category
    const productDistributionResults = await Product.aggregate<ProductDistributionResult>([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 1,
          category: '$_id',
          count: 1
        }
      }
    ]);

    const productDistribution = productDistributionResults.map(result => ({
      category: result.category,
      count: result.count
    }));

    const stats: AdminStats = {
      overview: {
        totalOrders,
        totalProducts,
        totalProducers,
        totalUsers,
        revenue
      },
      monthlySales,
      recentOrders,
      topProducers,
      productDistribution
    };

    sendResponse(res, stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    sendError(res, 'Internal server error');
  }
};

export const assignProducerToSeller = async (
  req: TypedRequestBody<AssignProducerBody>,
  res: Response
): Promise<void> => {
  const { sellerId, producerId } = req.body;

  try {
    const user = await User.findById(sellerId).lean() as UserDocument | null;
    const producer = await Producer.findById(producerId).lean();

    if (!user) {
      sendError(res, 'Seller not found', HTTP_STATUS.NOT_FOUND);
      return;
    }

    if (!producer) {
      sendError(res, 'Producer not found', HTTP_STATUS.NOT_FOUND);
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      sellerId,
      {
        $addToSet: { managedProducers: producerId }
      },
      { new: true }
    ).lean();

    if (!updatedUser) {
      sendError(res, 'Failed to update user', HTTP_STATUS.NOT_FOUND);
      return;
    }

    sendResponse(res, { message: 'Producer assigned successfully' });
  } catch (error) {
    console.error('Error assigning producer:', error);
    sendError(res, 'Internal server error');
  }
};

// Producer Management
export const getPendingApplications = async (_req: TypedRequestBody<void>, res: Response): Promise<void> => {
  try {
    const applications = await Producer.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .select('name email status createdAt')
      .lean();
    sendResponse(res, applications);
  } catch (error) {
    console.error('Error fetching pending applications:', error);
    sendError(res, 'Internal server error');
  }
};

export const reviewApplication = async (
  req: TypedRequestBody<ReviewApplicationBody> & TypedRequestParams<ReviewParams>,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { status, feedback } = req.body;

  try {
    const producer = await Producer.findByIdAndUpdate(
      id,
      { status, feedback },
      { new: true }
    ).lean();

    if (!producer) {
      sendError(res, 'Producer not found', HTTP_STATUS.NOT_FOUND);
      return;
    }

    sendResponse(res, producer);
  } catch (error) {
    console.error('Error reviewing application:', error);
    sendError(res, 'Internal server error');
  }
};

// User Management
export const getUsers = async (_req: TypedRequestBody<void>, res: Response): Promise<void> => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();
    sendResponse(res, users);
  } catch (error) {
    console.error('Error fetching users:', error);
    sendError(res, 'Internal server error');
  }
};

export const updateUser = async (
  req: TypedRequestBody<UpdateUserBody> & TypedRequestParams<ReviewParams>,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    ).select('-password').lean();

    if (!user) {
      sendError(res, 'User not found', HTTP_STATUS.NOT_FOUND);
      return;
    }

    sendResponse(res, user);
  } catch (error) {
    console.error('Error updating user:', error);
    sendError(res, 'Internal server error');
  }
};

// Order Management
export const getOrders = async (_req: TypedRequestBody<void>, res: Response): Promise<void> => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .lean() as OrderDocument[];
    sendResponse(res, orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    sendError(res, 'Internal server error');
  }
};

export const updateOrder = async (
  req: TypedRequestBody<UpdateOrderBody> & TypedRequestParams<ReviewParams>,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const order = await Order.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    ).populate('user', 'name email').lean() as OrderDocument | null;

    if (!order) {
      sendError(res, 'Order not found', HTTP_STATUS.NOT_FOUND);
      return;
    }

    sendResponse(res, order);
  } catch (error) {
    console.error('Error updating order:', error);
    sendError(res, 'Internal server error');
  }
}; 