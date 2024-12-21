import type { Producer } from './producer';

export enum ProductStatus {
  Active = 'active',
  Inactive = 'inactive',
  OutOfStock = 'out_of_stock',
  Draft = 'draft'
}

export enum ProductUnit {
  Kilo = 'κιλό',
  Piece = 'τεμάχιο',
  Package = 'συσκευασία',
  Liter = 'λίτρο'
}

export enum ProductCategory {
  Vegetables = 'Λαχανικά',
  Fruits = 'Φρούτα',
  Legumes = 'Όσπρια',
  Dairy = 'Γαλακτοκομικά',
  Meat = 'Κρέατα',
  Honey = 'Μέλι',
  Olives = 'Ελιές',
  Oil = 'Λάδι'
}

export interface ProductSEO {
  title: string;
  description: string;
  slug: string;
  keywords: string[];
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary?: boolean;
  order?: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  unit: ProductUnit;
  attributes: Record<string, string>;
}

export interface ProductReview {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: ProductCategory;
  unit: ProductUnit;
  status: ProductStatus;
  producerId: string;
  producer?: Producer;
  images: ProductImage[];
  variants?: ProductVariant[];
  reviews?: ProductReview[];
  rating: number;
  reviewsCount: number;
  seo?: ProductSEO;
  createdAt: string;
  updatedAt: string;
  isPromoted?: boolean;
  promotionPrice?: number;
  promotionEndsAt?: string;
  minimumOrder?: number;
  maximumOrder?: number;
  tags?: string[];
  featured?: boolean;
}

export type NewProduct = Omit<Product, '_id' | 'producer' | 'rating' | 'reviewsCount' | 'createdAt' | 'updatedAt'>;

export type ProductFormData = {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: ProductCategory;
  unit: ProductUnit;
  status: ProductStatus;
  producerId?: string;
  images?: ProductImage[];
  seo?: ProductSEO;
  minimumOrder?: number;
  maximumOrder?: number;
  tags?: string[];
  featured?: boolean;
};

export interface ProductFilters {
  category?: ProductCategory;
  status?: ProductStatus;
  producerId?: string;
  minPrice?: number;
  maxPrice?: number;
  minStock?: number;
  maxStock?: number;
  search?: string;
  tags?: string[];
  isPromoted?: boolean;
  featured?: boolean;
}

export interface ProductStats {
  total: number;
  active: number;
  draft: number;
  outOfStock: number;
  featured: number;
  averagePrice: number;
  totalValue: number;
}

export interface ProductSortOptions {
  field: keyof Product | 'rating' | 'reviewsCount';
  order: 'asc' | 'desc';
}

export interface Column<T> {
  header: string;
  accessor: keyof T | string;
  cell?: (value: any, row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
  sortable?: boolean;
}

export interface StatItem {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
} 