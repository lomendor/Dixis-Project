import type { Producer } from '@/types/producer';

/**
 * Κατάσταση προϊόντος
 * @enum {string}
 */
export enum ProductStatus {
  /** Ενεργό και διαθέσιμο προς πώληση */
  Active = 'active',
  /** Ανενεργό, δεν εμφανίζεται στο κατάστημα */
  Inactive = 'inactive',
  /** Εξαντλημένο απόθεμα */
  OutOfStock = 'out_of_stock'
}

/**
 * Μονάδα μέτρησης προϊόντος
 * @enum {string}
 */
export enum ProductUnit {
  Kilo = 'κιλό',
  Piece = 'τεμάχιο',
  Package = 'συσκευασία',
  Liter = 'λίτρο'
}

/**
 * Κατηγορίες προϊόντων
 * @enum {string}
 */
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

/**
 * SEO πληροφορίες προϊόντος
 * @interface
 */
export interface ProductSEO {
  /** SEO τίτλος */
  title: string;
  /** SEO περιγραφή */
  description: string;
  /** URL slug */
  slug: string;
  /** Λέξεις κλειδιά */
  keywords: string[];
}

/**
 * Εικόνα προϊόντος
 * @interface
 */
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

/**
 * Παραλλαγή προϊόντος
 * @interface
 */
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

/**
 * Κριτική προϊόντος
 * @interface
 */
export interface ProductReview {
  /** Μοναδικό αναγνωριστικό κριτικής */
  id: string;
  /** ID χρήστη που έκανε την κριτική */
  userId: string;
  /** Βαθμολογία (1-5) */
  rating: number;
  /** Σχόλιο */
  comment: string;
  /** Ημερομηνία δημιουργίας */
  createdAt: string;
  /** Ημερομηνία τελευταίας ενημέρωσης */
  updatedAt?: string;
}

/**
 * Κύριο interface προϊόντος
 * @interface
 */
export interface Product {
  /** Μοναδικό αναγνωριστικό */
  _id: string;
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
  producerId: string;
  /** Πληροφορίες παραγωγού */
  producer?: Producer;
  /** Εικόνες */
  images: ProductImage[];
  /** Παραλλαγές */
  variants?: ProductVariant[];
  /** Κριτικές */
  reviews?: ProductReview[];
  /** Μέση βαθμολογία */
  rating?: number;
  /** Πλήθος κριτικών */
  reviewsCount?: number;
  /** SEO πληροφορίες */
  seo?: ProductSEO;
  /** Ημερομηνία δημιουργίας */
  createdAt: string;
  /** Ημερομηνία τελευταίας ενημέρωσης */
  updatedAt: string;
  /** Αν είναι σε προσφορά */
  isPromoted?: boolean;
  /** Τιμή προσφοράς */
  promotionPrice?: number;
  /** Ημερομηνία λήξης προσφοράς */
  promotionEndsAt?: string;
  /** Ελάχιστη ποσότητα παραγγελίας */
  minimumOrder?: number;
  /** Μέγιστη ποσότητα παραγγελίας */
  maximumOrder?: number;
  /** Ετικέτες */
  tags?: string[];
}

/**
 * Τύπος για νέο προϊόν (χωρίς τα αυτόματα πεδία)
 */
export type NewProduct = Omit<Product, '_id' | 'producer' | 'rating' | 'reviewsCount' | 'createdAt' | 'updatedAt'>;

/**
 * Δεδομένα φόρμας προϊόντος
 * @interface
 */
export interface ProductFormData {
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
}

/**
 * Φίλτρα αναζήτησης προϊόντων
 * @interface
 */
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

/**
 * Επιλογές ταξινόμησης προϊόντων
 * @interface
 */
export interface ProductSortOptions {
  field: keyof Product | 'rating' | 'reviewsCount';
  order: 'asc' | 'desc';
}

/**
 * Στήλη για πίνακα προϊόντων
 * @interface
 */
export interface ProductTableColumn<T> {
  header: string;
  accessor: keyof T | string;
  cell?: (value: any, row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
  sortable?: boolean;
}

/**
 * Στατιστικό στοιχείο προϊόντος
 * @interface
 */
export interface ProductStatItem {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
}
 