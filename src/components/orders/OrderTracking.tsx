import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Package, Truck, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../utils/api';

interface OrderTrackingProps {
  orderId: string;
  trackingNumber: string;
  carrier: string;
}

export function OrderTracking({ orderId, trackingNumber, carrier }: OrderTrackingProps) {
  const { data: tracking, isLoading } = useQuery({
    queryKey: ['order-tracking', orderId],
    queryFn: async () => {
      const response = await api.get(
        `/shipping/tracking/${carrier}/${trackingNumber}`
      );
      return response.data;
    },
    refetchInterval: 60000, // Refresh every minute
  });

  if (isLoading) {
    return <div>Φόρτωση πληροφοριών παρακολούθησης...</div>;
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'in_transit':
        return <Truck className="h-6 w-6 text-blue-500" />;
      default:
        return <Package className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Παρακολούθηση Παραγγελίας</h3>
        <span className="text-sm text-gray-600">
          Αριθμός Αποστολής: {trackingNumber}
        </span>
      </div>

      <div className="space-y-6">
        {tracking?.events.map((event: any, index: number) => (
          <div
            key={index}
            className={`flex items-start gap-4 ${
              index === 0 ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            {getStatusIcon(event.status)}
            <div className="flex-grow">
              <p className="font-medium">{event.description}</p>
              <p className="text-sm">
                {format(new Date(event.timestamp), 'PPp')}
              </p>
              <p className="text-sm">{event.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}