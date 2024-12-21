import { Document, Types, Model } from 'mongoose';
import { Request } from 'express-serve-static-core';
import { ParamsDictionary, Query } from 'express-serve-static-core';

export interface BaseDocument extends Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDocument extends BaseDocument {
  name: string;
  managedProducers?: Types.ObjectId[];
}

export interface ProducerDocument extends BaseDocument {
  name: string;
  email: string;
  status: string;
  feedback?: string;
}

export interface OrderDocument extends BaseDocument {
  orderNumber: string;
  total: number;
  status: string;
  user: Types.ObjectId | UserDocument;
  items: Array<{
    product: Types.ObjectId;
    quantity: number;
  }>;
}

export interface ProductDocument extends BaseDocument {
  category: string;
  producer: Types.ObjectId;
}

// Request Body Types
export interface AssignProducerBody {
  sellerId: string;
  producerId: string;
}

export interface ReviewApplicationBody {
  status: string;
  feedback?: string;
}

export interface UpdateUserBody {
  name?: string;
  email?: string;
  [key: string]: any;
}

export interface UpdateOrderBody {
  status?: string;
  [key: string]: any;
}

export interface ReviewParams extends ParamsDictionary {
  id: string;
}

// Custom Request Types
export interface TypedRequestBody<T> extends Omit<Request, 'body'> {
  body: T;
}

export interface TypedRequestParams<T extends ParamsDictionary> extends Omit<Request, 'params'> {
  params: T;
}

export interface TypedRequestQuery<T extends Query> extends Omit<Request, 'query'> {
  query: T;
}

export interface TypedRequest<T, P extends ParamsDictionary> extends Omit<Request, 'body' | 'params'> {
  body: T;
  params: P;
}

// Aggregate Result Types
export interface MonthlySalesResult {
  _id: string;
  month: string;
  sales: number;
}

export interface ProducerAggregateResult {
  _id: Types.ObjectId;
  name: string;
  totalProducts: number;
  totalSales: number;
}

export interface ProductDistributionResult {
  _id: string;
  category: string;
  count: number;
}

export interface PopulatedUser {
  _id: Types.ObjectId;
  name: string;
}

// Model Types
export type UserModel = Model<UserDocument>;
export type ProducerModel = Model<ProducerDocument>;
export type OrderModel = Model<OrderDocument>;
export type ProductModel = Model<ProductDocument>; 