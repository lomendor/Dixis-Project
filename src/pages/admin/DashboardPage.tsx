import { Box } from '@chakra-ui/react';
import { StatsCards } from '@components/admin/dashboard/StatsCards';
import { SalesChart } from '@components/admin/dashboard/SalesChart';
import { OrdersTable, OrderStatus } from '@components/admin/dashboard/OrdersTable';
import { TopProducers } from '@components/admin/dashboard/TopProducers';
import { ProductDistribution } from '@components/admin/dashboard/ProductDistribution';
import { useAdminStats } from '@features/admin/hooks/useAdminStats';

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
    date: '2024-03-15',
    items: 3
  },
  { 
    id: 'ORD-2024-002', 
    customer: 'Γιώργος Π.', 
    total: 89.90, 
    status: 'processing' as OrderStatus,
    date: '2024-03-14',
    items: 2
  },
  { 
    id: 'ORD-2024-003', 
    customer: 'Ελένη Μ.', 
    total: 234.00, 
    status: 'completed' as OrderStatus,
    date: '2024-03-14',
    items: 4
  },
  { 
    id: 'ORD-2024-004', 
    customer: 'Νίκος Α.', 
    total: 67.80, 
    status: 'pending' as OrderStatus,
    date: '2024-03-13',
    items: 1
  },
  { 
    id: 'ORD-2024-005', 
    customer: 'Σοφία Δ.', 
    total: 178.30, 
    status: 'processing' as OrderStatus,
    date: '2024-03-13',
    items: 3
  },
];

const productDistributionData = [
  { name: 'Φρούτα', value: 35, color: '#FF6B6B' },
  { name: 'Λαχανικά', value: 45, color: '#4ECDC4' },
  { name: 'Γαλακτοκομικά', value: 20, color: '#45B7D1' },
  { name: 'Κρέατα', value: 15, color: '#96CEB4' },
  { name: 'Μέλι & Μαρμελάδες', value: 25, color: '#FFEEAD' },
];

function DashboardPage() {
  const { isLoading } = useAdminStats();

  if (isLoading) {
    return <div>Φόρτωση...</div>;
  }

  return (
    <Box p={6} maxW="7xl" mx="auto">
      <div className="space-y-6">
        {/* Stats Cards */}
        <StatsCards />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Chart */}
          <div className="lg:col-span-2">
            <SalesChart data={salesData} />
          </div>

          {/* Product Distribution */}
          <div>
            <ProductDistribution data={productDistributionData} />
          </div>
        </div>

        {/* Top Producers & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Producers */}
          <div className="lg:col-span-1">
            <TopProducers producers={topProducers} />
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <OrdersTable orders={recentOrders} />
          </div>
        </div>
      </div>
    </Box>
  );
}

export default DashboardPage; 