import { Request } from 'express-serve-static-core';
import { Types } from 'mongoose';

export interface Producer {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  location: {
    address: string;
    city: string;
    region: string;
    postalCode: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  contact: {
    email: string;
    phone: string;
    website?: string;
  };
  products?: Types.ObjectId[];
  rating?: number;
  reviews?: Types.ObjectId[];
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProducerRequest extends Omit<Request, 'body'> {
  body: Omit<Producer, '_id' | 'createdAt' | 'updatedAt'>;
}

export interface UpdateProducerRequest extends Omit<Request, 'body' | 'params'> {
  params: {
    id: string;
  };
  body: Partial<Omit<Producer, '_id' | 'createdAt' | 'updatedAt'>>;
}

export interface GetProducerRequest extends Omit<Request, 'params'> {
  params: {
    id: string;
  };
}

export interface DeleteProducerRequest extends Omit<Request, 'params'> {
  params: {
    id: string;
  };
}
