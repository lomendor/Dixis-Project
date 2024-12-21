import { Response } from 'express';
import User from '../models/User';
import Product from '../models/Product';
import Order from '../models/Order';
import Producer from '../models/Producer';
import { AdminRequest, DashboardStats } from '../../src/types/controllers/admin.types';
import { LeanOrder } from '../../src/types/models/order.types';

// Get admin dashboard stats
export const getStats = async (req: AdminRequest, res: Response) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Δεν έχετε δικαίωμα πρόσβασης σε αυτό το resource'
      });
    }

    // Get basic stats
    const [totalOrders, totalProducts, totalProducers, totalUsers] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      Producer.countDocuments(),
      User.countDocuments()
    ]);

    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const revenue = revenueResult[0]?.total || 0;

    // Get monthly sales for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlySales = await Order.aggregate([
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
          month: '$_id',
          sales: 1,
          _id: 0
        }
      }
    ]);

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name')
      .lean<LeanOrder>()
      .then(orders => orders.map(order => ({
        id: order._id.toString(),
        orderNumber: order.orderNumber || `ORD-${order._id.toString().slice(-6)}`,
        customer: order.user.name,
        total: order.total,
        status: order.status,
        date: order.createdAt
      })));

    // Get top producers
    const topProducers = await Producer.aggregate([
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
          as: 'orders'
        }
      },
      {
        $project: {
          name: 1,
          totalProducts: { $size: '$products' },
          totalSales: {
            $sum: {
              $map: {
                input: '$orders',
                as: 'order',
                in: { $cond: [{ $eq: ['$$order.status', 'completed'] }, '$$order.total', 0] }
              }
            }
          }
        }
      },
      { $sort: { totalSales: -1 } },
      { $limit: 5 }
    ]);

    // Get product distribution by category
    const productDistribution = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    const stats: DashboardStats = {
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

    res.json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Σφάλμα κατά την ανάκτηση των στατιστικών'
    });
  }
};
