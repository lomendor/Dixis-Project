import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../utils/api';

interface ShippingRate {
  provider: string;
  service: string;
  cost: number;
  currency: string;
  estimatedDays: number;
}

interface ShippingRateCalculatorProps {
  origin: {
    postalCode: string;
    city: string;
  };
  destination: {
    postalCode: string;
    city: string;
  };
  packages: Array<{
    weight: number;
    length?: number;
    width?: number;
    height?: number;
  }>;
  onSelect: (rate: ShippingRate) => void;
}

export function ShippingRateCalculator({
  origin,
  destination,
  packages,
  onSelect,
}: ShippingRateCalculatorProps) {
  const { data: rates, isLoading } = useQuery({
    queryKey: ['shipping-rates', origin, destination, packages],
    queryFn: async () => {
      const response = await api.post('/shipping/rates', {
        origin,
        destination,
        packages,
      });
      return response.data as ShippingRate[];
    },
  });

  if (isLoading) {
    return <div>Υπολογισμός κόστους αποστολής...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Επιλογές Αποστολής</h3>
      <div className="space-y-2">
        {rates?.map((rate) => (
          <div
            key={`${rate.provider}-${rate.service}`}
            className="flex items-center justify-between p-4 border rounded-lg hover:border-blue-500 cursor-pointer"
            onClick={() => onSelect(rate)}
          >
            <div>
              <p className="font-medium">{rate.provider}</p>
              <p className="text-sm text-gray-600">{rate.service}</p>
              <p className="text-sm text-gray-600">
                Παράδοση σε {rate.estimatedDays} ημέρες
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">
                {rate.cost.toFixed(2)} {rate.currency}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}