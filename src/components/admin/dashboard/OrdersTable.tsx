import { Card } from '@/components/ui/Card';
import { ChevronRight } from 'lucide-react';

export type OrderStatus = 'completed' | 'processing' | 'pending';

interface Order {
  id: string;
  customer: string;
  total: number;
  status: OrderStatus;
  date: string;
  items: number;
}

interface OrdersTableProps {
  orders: Order[];
}

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const styles = {
    completed: 'bg-green-100 text-green-800',
    processing: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800'
  };

  const labels = {
    completed: 'Ολοκληρώθηκε',
    processing: 'Σε επεξεργασία',
    pending: 'Σε αναμονή'
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Πρόσφατες Παραγγελίες</h3>
          <p className="text-sm text-gray-500 mt-1">Τελευταίες 5 παραγγελίες</p>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
          Προβολή όλων
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Αριθμός
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Πελάτης
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ημερομηνία
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Προϊόντα
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Σύνολο
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Κατάσταση
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr 
                key={order.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                  {order.id}
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium">
                      {order.customer.charAt(0)}
                    </div>
                    <span className="ml-3 text-sm text-gray-900">{order.customer}</span>
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.date}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.items} προϊόντα
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  €{order.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <StatusBadge status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
} 