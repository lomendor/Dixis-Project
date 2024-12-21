import { Types } from 'mongoose';
import { BaseDocument } from './base.types';

export enum ProductStatus {
  /** Ενεργό και διαθέσιμο προς πώληση */
  Active = 'active',
  /** Ανενεργό, δεν εμφανίζεται στο κατάστημα */
  Inactive = 'inactive',
  /** Εξαντλημένο απόθεμα */
  OutOfStock = 'out_of_stock',
  /** Πρόχειρο */
  Draft = 'draft'
}

export enum ProductUnit {
  /** Κιλό */
  Kilo = 'κιλό',
  /** Τεμάχιο */
  Piece = 'τεμάχιο',
  /** Συσκευασία */
  Package = 'συσκευασία',
  /** Λίτρο */
  Liter = 'λίτρο'
}

export enum ProductCategory {
  /** Λαχανικά */
  Vegetables = 'Λαχανικά',
  /** Φρούτα */
  Fruits = 'Φρούτα',
  /** Όσπρια */
  Legumes = 'Όσπρια',
  /** Γαλακτοκομικά */
  Dairy = 'Γαλακτοκομικά',
  /** Κρέατα */
  Meat = 'Κρέατα',
  /** Μέλι */
  Honey = 'Μέλι',
  /** Ελιές */
  Olives = 'Ελιές',
  /** Λάδι */
  Oil = 'Λάδι'
}

export interface ProductImage {
  /** Μοναδικό αναγνωριστικό εικόνας */
  id: string;
  /** URL εικόνας */
  url: string;
  /** Εναλλακτικό κείμενο για accessibility */
  alt?: string;
  /** Αν είναι η κύρια εικόνα */
  isPrimary?: boolean;
  /** Σειρά εμφάνισης */
  order?: number;
}

export interface ProductVariant {
  /** Μοναδικό αναγνωριστικό παραλλαγής */
  id: string;
  /** Όνομα παραλλαγής */
  name: string;
  /** Κωδικός SKU */
  sku: string;
  /** Τιμή */
  price: number;
  /** Διαθέσιμο απόθεμα */
  stock: number;
  /** Μονάδα μέτρησης */
  unit: ProductUnit;
  /** Χαρακτηριστικά παραλλαγής */
  attributes: Record<string, string>;
}

export interface ProductReview {
  /** ID χρήστη που έκανε την κριτική */
  userId: Types.ObjectId;
  /** Βαθμολογία (1-5) */
  rating: number;
  /** Σχόλιο */
  comment?: string;
  /** Ημερομηνία δημιουργίας */
  createdAt: Date;
  /** Ημερομηνία τελευταίας ενημέρωσης */
  updatedAt?: Date;
}

export interface ProductDocument extends BaseDocument {
  /** Όνομα προϊόντος */
  name: string;
  /** Περιγραφή */
  description: string;
  /** Τιμή */
  price: number;
  /** Διαθέσιμο απόθεμα */
  stock: number;
  /** Κατηγορία */
  category: ProductCategory;
  /** Μονάδα μέτρησης */
  unit: ProductUnit;
  /** Κατάσταση */
  status: ProductStatus;
  /** ID παραγωγού */
  producerId: Types.ObjectId;
  /** Εικόνες */
  images: ProductImage[];
  /** Παραλλαγές */
  variants?: ProductVariant[];
  /** Κριτικές */
  reviews: ProductReview[];
  /** Μέση βαθμολογία */
  rating: number;
  /** Πλήθος κριτικών */
  reviewsCount: number;
  /** SEO πληροφορίες */
  seo?: {
    title: string;
    description: string;
    slug: string;
    keywords: string[];
  };
  /** Αν είναι σε προσφορά */
  isPromoted: boolean;
  /** Τιμή προσφοράς */
  promotionPrice?: number;
  /** Ημερομηνία λήξης προσφοράς */
  promotionEndsAt?: Date;
  /** Ελάχιστη ποσότητα παραγγελίας */
  minimumOrder?: number;
  /** Μέγιστη ποσότητα παραγγελίας */
  maximumOrder?: number;
  /** Ετικέτες */
  tags: string[];
  /** Αν είναι προτεινόμενο */
  featured: boolean;
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
  images: ProductImage[];
  variants?: ProductVariant[];
  reviews?: ProductReview[];
  rating: number;
  reviewsCount: number;
  seo?: {
    title: string;
    description: string;
    slug: string;
    keywords: string[];
  };
  isPromoted: boolean;
  promotionPrice?: number;
  promotionEndsAt?: string;
  minimumOrder?: number;
  maximumOrder?: number;
  tags: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PopulatedProduct extends Omit<Product, 'producerId'> {
  producer: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: ProductCategory;
  unit: ProductUnit;
  status: ProductStatus;
  producerId: string;
  minimumOrder: number | null;
  maximumOrder: number | null;
  images: ProductImage[];
  variants?: ProductVariant[];
  seo: ProductDocument['seo'] | null;
  tags: string[];
  isPromoted: boolean;
  promotionPrice: number | null;
  promotionEndsAt: Date | null;
  featured: boolean;
}

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

export interface ProductTableColumn<T> {
  header: string;
  accessor: keyof T | string;
  cell?: (value: any, row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
  sortable?: boolean;
}

export interface ProductStatItem {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
}

export type CreateProductData = Omit<Product, '_id' | 'createdAt' | 'updatedAt'>;

export type UpdateProductData = Partial<CreateProductData>; 