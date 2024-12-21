import { Document } from 'mongoose';

export interface CategoryDocument extends Document {
  name: string;
  description?: string;
  slug: string;
  parent?: CategoryDocument['_id'] | null;
  image?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  children?: CategoryDocument[]; // Virtual
}
