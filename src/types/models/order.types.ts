import { Types } from 'mongoose';
import { BaseDocument } from './base.types';

export interface OrderItem {
  product: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface OrderDocument extends BaseDocument {
  orderNumber: string;
  user: Types.ObjectId;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
}

export interface UpdateOrderBody {
  status?: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentStatus?: 'pending' | 'paid' | 'failed';
  [key: string]: any;
} 