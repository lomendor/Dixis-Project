import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../utils/api';

interface Notification {
  id: string;
  type: 'order' | 'stock' | 'system';
  message: string;
  createdAt: string;
  read: boolean;
}

export function Notifications() {
  const { data: notifications } = useQuery({
    queryKey: ['producer-notifications'],
    queryFn: async () => {
      const response = await api.get('/producer/notifications');
      return response.data;
    },
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="h-5 w-5 text-blue-600" />;
      case 'stock':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Ειδοποιήσεις</h2>
      <div className="space-y-4">
        {notifications?.map((notification: Notification) => (
          <div
            key={notification.id}
            className={`flex items-start gap-4 p-4 rounded-lg ${
              notification.read ? 'bg-gray-50' : 'bg-blue-50'
            }`}
          >
            {getIcon(notification.type)}
            <div className="flex-grow">
              <p className={`${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                {notification.message}
              </p>
              <p className="text-sm text-gray-500">
                {format(new Date(notification.createdAt), 'PPp')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}