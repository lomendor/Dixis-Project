export interface Overview {
  totalOrders: number;
  totalProducts: number;
  totalProducers: number;
  totalUsers: number;
  revenue: number;
}

export interface MonthlySales {
  month: string;
  sales: number;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  customer: string;
  total: number;
  status: string;
  date: Date;
}

export interface TopProducer {
  id: string;
  name: string;
  totalProducts: number;
  totalSales: number;
}

export interface ProductDistribution {
  category: string;
  count: number;
}

export interface AdminStats {
  overview: Overview;
  monthlySales: MonthlySales[];
  recentOrders: RecentOrder[];
  topProducers: TopProducer[];
  productDistribution: ProductDistribution[];
} 