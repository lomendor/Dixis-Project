import { Document, Types } from 'mongoose';
import { UserDocument } from './user.types';
import { ProductDocument } from './product.types';

export enum OrderStatus {
  Pending = 'pending',
  Processing = 'processing',
  Completed = 'completed',
  Cancelled = 'cancelled'
}

export enum PaymentMethod {
  Card = 'card',
  Cash = 'cash',
  BankTransfer = 'bank_transfer'
}

export enum PaymentStatus {
  Pending = 'pending',
  Completed = 'completed',
  Failed = 'failed'
}

export interface OrderItem {
  product: ProductDocument['_id'];
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface OrderDocument extends Document {
  user: UserDocument['_id'];
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PopulatedOrder extends Omit<OrderDocument, 'user'> {
  user: {
    _id: string;
    name: string;
  };
}

export interface LeanOrder {
  _id: Types.ObjectId;
  user: {
    _id: Types.ObjectId;
    name: string;
  };
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderNumber?: string;
  createdAt: Date;
  updatedAt: Date;
} 