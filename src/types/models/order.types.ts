import { Document } from 'mongoose';

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  producer: string;
}

export interface OrderDocument extends Document {
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  shippingStatus: string;
  paymentStatus: string;
  shippingAddress: string;
  orderDate: Date;
  notes?: string;
} 