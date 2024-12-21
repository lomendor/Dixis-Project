import { Request } from 'express-serve-static-core';
import { Types } from 'mongoose';
import type { Multer } from 'multer';

export interface Category {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  slug: string;
  image?: string;
  parent?: Types.ObjectId | Category;
  children?: Types.ObjectId[] | Category[];
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryDocument extends Category {
  toObject(): Category;
}

export interface CategoryTree extends Omit<Category, 'children'> {
  children: CategoryTree[];
}

export interface GetCategoriesRequest extends Omit<Request, 'query'> {
  query: {
    parent?: string;
  };
}

export interface GetCategoryRequest extends Omit<Request, 'params'> {
  params: {
    id: string;
  };
}

export interface CreateCategoryRequest extends Omit<Request, 'body' | 'file'> {
  body: Omit<Category, '_id' | 'createdAt' | 'updatedAt' | 'slug'>;
  file?: Express.Multer.File;
}

export interface UpdateCategoryRequest extends Omit<Request, 'body' | 'params' | 'file'> {
  params: {
    id: string;
  };
  body: Partial<Omit<Category, '_id' | 'createdAt' | 'updatedAt' | 'slug'>>;
  file?: Express.Multer.File;
}

export interface DeleteCategoryRequest extends Omit<Request, 'params'> {
  params: {
    id: string;
  };
}

export interface UpdateOrderRequest extends Omit<Request, 'body'> {
  body: {
    categories: Array<{
      _id: string;
      order: number;
    }>;
  };
}
