import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { ChevronDown } from 'lucide-react';

interface SalesData {
  date: string;
  sales: number;
}

interface SalesChartProps {
  data: SalesData[];
  title?: string;
}

type TimeRange = '7days' | '30days' | '90days' | '12months';

const timeRangeOptions: Record<TimeRange, string> = {
  '7days': 'Τελευταίες 7 ημέρες',
  '30days': 'Τελευταίες 30 ημέρες',
  '90days': 'Τελευταίες 90 ημέρες',
  '12months': 'Τελευταίοι 12 μήνες',
};

export function SalesChart({ data, title = 'Πωλήσεις ανά Μήνα' }: SalesChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('30days');

  // TODO: Implement actual data filtering based on timeRange
  const filteredData = data;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

        {/* Time Range Selector */}
        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="pl-4 pr-10 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#4299E1] focus:ring-1 focus:ring-[#4299E1] appearance-none"
          >
            {Object.entries(timeRangeOptions).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="date"
              stroke="#718096"
              tick={{ fill: '#718096' }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('el-GR', { month: 'short' });
              }}
            />
            <YAxis
              stroke="#718096"
              tick={{ fill: '#718096', fontSize: 12 }}
              tickFormatter={(value) => `€${value.toLocaleString()}`}
              width={80}
              domain={['auto', 'auto']}
              padding={{ top: 20, bottom: 20 }}
            />
            <Tooltip
              formatter={(value: number) => [`€${value.toLocaleString()}`, 'Πωλήσεις']}
              labelFormatter={(label) => {
                const date = new Date(label);
                return date.toLocaleDateString('el-GR', { month: 'long', year: 'numeric' });
              }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E2E8F0',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#4299E1"
              strokeWidth={2}
              dot={{ fill: '#4299E1', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#4299E1' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div>
          <p className="text-sm font-medium text-gray-500">Συνολικές Πωλήσεις</p>
          <p className="text-2xl font-semibold text-gray-900">
            €{data.reduce((sum, item) => sum + item.sales, 0).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Μέσος Όρος</p>
          <p className="text-2xl font-semibold text-gray-900">
            €{Math.round(data.reduce((sum, item) => sum + item.sales, 0) / data.length).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Υψηλότερη Τιμή</p>
          <p className="text-2xl font-semibold text-gray-900">
            €{Math.max(...data.map(item => item.sales)).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
} 