import React from 'react';
import { Users, ShoppingBag, Store, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard = ({ title, value, icon, trend }: StatCardProps) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all transform hover:-translate-y-1 duration-200">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-[#4299E1]/10 text-[#4299E1] rounded-lg">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-semibold text-gray-900 font-['Inter']">{value}</h3>
          {trend && (
            <div className={`flex items-center mt-1 ${trend.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
              <span className="text-sm font-medium">
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-gray-500 ml-2">από τον προηγούμενο μήνα</span>
            </div>
          )}
        </div>
      </div>
    </div>
    <div className="mt-4 h-1 bg-gray-100 rounded">
      <div 
        className={`h-1 rounded ${trend?.isPositive ? 'bg-emerald-500' : 'bg-red-500'}`} 
        style={{ width: `${Math.min(Math.abs(trend?.value || 0) * 5, 100)}%` }}
      />
    </div>
  </div>
);

export function StatsCards() {
  const stats = [
    {
      title: 'Συνολικοί Χρήστες',
      value: '2,543',
      icon: <Users className="h-5 w-5" />,
      trend: { value: 12.5, isPositive: true }
    },
    {
      title: 'Παραγωγοί',
      value: '184',
      icon: <Store className="h-5 w-5" />,
      trend: { value: 8.2, isPositive: true }
    },
    {
      title: 'Προϊόντα',
      value: '856',
      icon: <ShoppingBag className="h-5 w-5" />,
      trend: { value: 4.1, isPositive: true }
    },
    {
      title: 'Συνολικός Τζίρος',
      value: '€124,523',
      icon: <TrendingUp className="h-5 w-5" />,
      trend: { value: 15.3, isPositive: true }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
} 