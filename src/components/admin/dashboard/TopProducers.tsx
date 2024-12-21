import { Card } from '@/components/ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Producer {
  name: string;
  sales: number;
  revenue: number;
  trend: {
    percentage: number;
    isPositive: boolean;
  };
}

interface TopProducersProps {
  producers: Producer[];
}

export function TopProducers({ producers }: TopProducersProps) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Κορυφαίοι Παραγωγοί</h3>
          <p className="text-sm text-gray-500 mt-1">Βάσει πωλήσεων</p>
        </div>
      </div>

      <div className="space-y-4">
        {producers.map((producer, index) => (
          <div 
            key={producer.name}
            className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                {index + 1}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">{producer.name}</h4>
                <p className="text-sm text-gray-500">{producer.sales} πωλήσεις</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                €{producer.revenue.toLocaleString()}
              </p>
              <div className={`flex items-center justify-end mt-1 ${
                producer.trend.isPositive ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {producer.trend.isPositive ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                <span className="text-sm">
                  {producer.trend.isPositive ? '+' : ''}{producer.trend.percentage}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
} 