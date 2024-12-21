import type { Product } from '@/types/product';

export interface AdminProduct extends Product {
  // Επιπλέον πεδία για το admin interface
  lastUpdated: string;
  updatedBy: {
    id: string;
    name: string;
  };
  history: {
    action: 'created' | 'updated' | 'deleted';
    timestamp: string;
    userId: string;
    changes?: Record<string, any>;
  }[];
  analytics: {
    views: number;
    sales: number;
    revenue: number;
    conversionRate: number;
  };
} 