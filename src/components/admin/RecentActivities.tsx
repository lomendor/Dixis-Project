import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ShoppingBag, UserPlus, Store, AlertTriangle } from 'lucide-react';
import api from '../../utils/api';

export function RecentActivities() {
  const { data: activities } = useQuery({
    queryKey: ['admin-activities'],
    queryFn: async () => {
      const response = await api.get('/admin/activities');
      return response.data;
    },
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="h-5 w-5 text-blue-600" />;
      case 'user':
        return <UserPlus className="h-5 w-5 text-green-600" />;
      case 'producer':
        return <Store className="h-5 w-5 text-purple-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Πρόσφατη Δραστηριότητα</h2>
      <div className="space-y-4">
        {activities?.map((activity: any) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50"
          >
            {getIcon(activity.type)}
            <div className="flex-grow">
              <p className="text-sm text-gray-900">{activity.description}</p>
              <p className="text-xs text-gray-500">
                {format(new Date(activity.timestamp), 'PPp')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}