import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import api from '../../utils/api';

export function PerformanceChart() {
  const { data: performanceData } = useQuery({
    queryKey: ['admin-performance'],
    queryFn: async () => {
      const response = await api.get('/admin/performance');
      return response.data;
    },
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Απόδοση Πλατφόρμας</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(new Date(date), 'MMM d')}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(date) => format(new Date(date), 'PPP')}
              formatter={(value) => [`€${value}`, 'Έσοδα']}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#2563eb"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}