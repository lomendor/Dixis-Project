import { Request, Response } from 'express';
import { UserDocument } from '../models/user.types';

export interface AdminRequest extends Request {
  user: UserDocument;
}

export interface DashboardStats {
  overview: {
    totalOrders: number;
    totalProducts: number;
    totalProducers: number;
    totalUsers: number;
    revenue: number;
  };
  monthlySales: Array<{
    month: string;
    sales: number;
  }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customer: string;
    total: number;
    status: string;
    date: Date;
  }>;
  topProducers: Array<{
    _id: string;
    name: string;
    totalProducts: number;
    totalSales: number;
  }>;
  productDistribution: Array<{
    category: string;
    count: number;
  }>;
}
