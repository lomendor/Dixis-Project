import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Package, TrendingUp, AlertCircle, ShoppingBag } from 'lucide-react';
import api from '../../utils/api';

export function DashboardStats() {
  const { data: stats } = useQuery({
    queryKey: ['producer-stats'],
    queryFn: async () => {
      const response = await api.get('/producer/stats');
      return response.data;
    },
  });

  const statCards = [
    {
      title: 'Συνολικά Προϊόντα',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Μηνιαία Έσοδα',
      value: `€${stats?.monthlyRevenue?.toFixed(2) || '0.00'}`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Εκκρεμείς Παραγγελίες',
      value: stats?.pendingOrders || 0,
      icon: ShoppingBag,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Χαμηλό Απόθεμα',
      value: stats?.lowStockProducts || 0,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <div key={stat.title} className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className={`${stat.bgColor} p-3 rounded-full`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-600">{stat.title}</p>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}