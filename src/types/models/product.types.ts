import { Types } from 'mongoose';
import { BaseDocument } from './base.types';

export interface ProductDocument extends BaseDocument {
  name: string;
  description: string;
  price: number;
  category: string;
  producer: Types.ObjectId;
  stock: number;
  images: string[];
  isActive: boolean;
  ratings: {
    userId: Types.ObjectId;
    rating: number;
    comment?: string;
  }[];
}

export interface UpdateProductBody {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
  isActive?: boolean;
  [key: string]: any;
} 