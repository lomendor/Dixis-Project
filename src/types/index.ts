// Existing types remain the same...

export interface AdminStats {
  totalUsers: number;
  totalProducers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingVerifications: number;
  activeUsers: number;
  monthlyGrowth: {
    users: number;
    revenue: number;
    orders: number;
  };
}

export interface ProducerApplication {
  id: string;
  userId: string;
  companyName: string;
  description: string;
  documents: {
    type: string;
    url: string;
  }[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success';
  audience: 'all' | 'producers' | 'consumers';
  active: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  parentId?: string;
  image?: string;
  active: boolean;
  productsCount: number;
}

export interface AdminUser extends User {
  role: 'admin';
  permissions: string[];
  lastLogin: string;
}