import React from 'react';
import { StatsCards } from './dashboard/StatsCards';
import { OrdersTable, OrderStatus } from './dashboard/OrdersTable';
import { SalesChart } from './dashboard/SalesChart';
import { TopProducers } from './dashboard/TopProducers';

const salesData = [
  { date: '2024-01', sales: 65400 },
  { date: '2024-02', sales: 78500 },
  { date: '2024-03', sales: 89700 },
  { date: '2024-04', sales: 95600 },
  { date: '2024-05', sales: 110200 },
  { date: '2024-06', sales: 124500 },
];

const topProducers = [
  { 
    name: 'Αγρόκτημα Παπαδόπουλου', 
    sales: 245, 
    revenue: 45600,
    trend: { percentage: 12.5, isPositive: true }
  },
  { 
    name: 'Μελισσοκομία Γεωργίου', 
    sales: 189, 
    revenue: 38900,
    trend: { percentage: 8.3, isPositive: true }
  },
  { 
    name: 'Οινοποιείο Νικολάου', 
    sales: 156, 
    revenue: 32400,
    trend: { percentage: 2.1, isPositive: false }
  },
  { 
    name: 'Ελαιώνες Δημητρίου', 
    sales: 134, 
    revenue: 28700,
    trend: { percentage: 5.7, isPositive: true }
  },
  { 
    name: 'Κτήμα Αθανασίου', 
    sales: 112, 
    revenue: 24500,
    trend: { percentage: 3.2, isPositive: false }
  },
];

const recentOrders = [
  { 
    id: 'ORD-2024-001', 
    customer: 'Μαρία Κ.', 
    total: 156.50, 
    status: 'completed' as OrderStatus,
    date: '2024-03-15'
  },
  { 
    id: 'ORD-2024-002', 
    customer: 'Γιώργος Π.', 
    total: 89.90, 
    status: 'processing' as OrderStatus,
    date: '2024-03-14'
  },
  { 
    id: 'ORD-2024-003', 
    customer: 'Ελένη Μ.', 
    total: 234.00, 
    status: 'completed' as OrderStatus,
    date: '2024-03-14'
  },
  { 
    id: 'ORD-2024-004', 
    customer: 'Νίκος Α.', 
    total: 67.80, 
    status: 'pending' as OrderStatus,
    date: '2024-03-13'
  },
  { 
    id: 'ORD-2024-005', 
    customer: 'Σοφία Δ.', 
    total: 178.30, 
    status: 'processing' as OrderStatus,
    date: '2024-03-13'
  },
];

export function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <StatsCards />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2">
          <SalesChart data={salesData} />
        </div>

        {/* Top Producers */}
        <div>
          <TopProducers producers={topProducers} />
        </div>
      </div>

      {/* Recent Orders */}
      <OrdersTable orders={recentOrders} />
    </div>
  );
} 