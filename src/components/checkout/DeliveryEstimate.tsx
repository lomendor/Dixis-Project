import React from 'react';
import { Truck, Calendar } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { el } from 'date-fns/locale';

interface DeliveryEstimateProps {
  shippingMethod: {
    id: string;
    name: string;
    minDays: number;
    maxDays: number;
  };
}

export function DeliveryEstimate({ shippingMethod }: DeliveryEstimateProps) {
  const today = new Date();
  const estimatedDelivery = {
    earliest: addDays(today, shippingMethod.minDays),
    latest: addDays(today, shippingMethod.maxDays),
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-start gap-4">
        <Truck className="h-6 w-6 text-gray-400" />
        <div>
          <h3 className="font-medium text-gray-900">
            Εκτιμώμενη Παράδοση
          </h3>
          <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              {format(estimatedDelivery.earliest, 'd MMMM', { locale: el })} - {' '}
              {format(estimatedDelivery.latest, 'd MMMM', { locale: el })}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Η παράδοση γίνεται τις εργάσιμες ημέρες, 09:00 - 17:00
          </p>
        </div>
      </div>
    </div>
  );
}