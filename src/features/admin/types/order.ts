import type { Order } from '@/types/order';

export interface AdminOrder extends Order {
  // Επιπλέον πεδία για το admin interface
  processingHistory: {
    status: Order['status'];
    timestamp: string;
    note?: string;
    userId: string;
  }[];
  internalNotes: string[];
  riskScore?: number;
  fraudChecks?: {
    passed: boolean;
    timestamp: string;
    details: string;
  }[];
  adminActions: {
    action: 'approve' | 'reject' | 'refund' | 'flag';
    timestamp: string;
    userId: string;
    reason?: string;
  }[];
} 