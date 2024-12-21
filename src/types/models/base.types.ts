import { Document, Types } from 'mongoose';

export interface BaseDocument extends Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface BaseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type WithId<T> = T & { _id: Types.ObjectId }; 