import type { Response } from 'express';
import Order from '../../models/Order';
import Product from '../../models/Product';
import Producer from '../../models/Producer';
import User from '../../models/User';
import type { AdminStats } from '@/features/admin/types/stats';
import type {
  TypedRequestBody,
  MonthlySalesResult,
  ProducerAggregateResult,
  ProductDistributionResult,
  PopulatedUser
} from '../../types/admin';
import { sendResponse, sendError } from '../../utils/response';

export const getStats = async (_req: TypedRequestBody<void>, res: Response): Promise<void> => {
  try {
    const [totalOrders, totalProducts, totalProducers, totalUsers] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      Producer.countDocuments(),
      User.countDocuments()
    ]);
    
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