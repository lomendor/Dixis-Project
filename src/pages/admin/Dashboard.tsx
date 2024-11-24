import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, ShoppingBag, Store, TrendingUp } from 'lucide-react';
import { AdminStats } from '../../components/admin/AdminStats';
import { RecentActivities } from '../../components/admin/RecentActivities';
import { PerformanceChart } from '../../components/admin/PerformanceChart';
import api from '../../utils/api';

function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await api.get('/admin/stats');
      return response.data;
    },
  });

  const statCards = [
    {
      title: 'Συνολικοί Χρήστες',
      value: stats?.totalUsers || 0,
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Συνολικές Παραγγελίες',
      value: stats?.totalOrders || 0,
      change: '+25%',
      icon: ShoppingBag,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Ενεργοί Παραγωγοί',
      value: stats?.activeProducers || 0,
      change: '+8%',
      icon: Store,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Μηνιαία Έσοδα',
      value: `€${stats?.monthlyRevenue?.toFixed(2) || '0.00'}`,
      change: '+18%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Πίνακας Διαχείρισης</h1>

      {/* Stats Grid */}
      <AdminStats stats={statCards} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <PerformanceChart />
        
        {/* Recent Activities */}
        <RecentActivities />
      </div>
    </div>
  );
}

export default AdminDashboard;