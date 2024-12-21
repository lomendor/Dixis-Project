// User & Auth Types
export * from './user';
export * from './product';

// Producer Types
export interface Producer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  productsCount: number;
}

export type NewProducer = Omit<Producer, '_id'>;

// Admin Stats Types
export interface AdminStats {
  totalUsers: number;
  totalProducers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingVerifications: number;
  activeUsers: number;
  monthlyGrowth: {
    users: number;
    orders: number;
    revenue: number;
  };
  recentOrders: Array<{
    id: string;
    customerName: string;
    total: number;
    status: string;
    date: string;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
}

// Common Types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface SortParams {
  field: string;
  order: 'asc' | 'desc';
}

export interface FilterParams {
  [key: string]: any;
}

export interface QueryParams extends PaginationParams, Partial<SortParams> {
  filters?: FilterParams;
  search?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}