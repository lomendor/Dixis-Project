import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { Package } from 'lucide-react';
import api from '../../utils/api';
import type { Order } from '../../types';

function Orders() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = React.useState('all');

  const { data: orders, isLoading } = useQuery({
    queryKey: ['producer-orders', filter],
    queryFn: async () => {
      const response = await api.get(`/producer/orders?status=${filter}`);
      return response.data;
    },
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      await api.put(`/producer/orders/${orderId}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['producer-orders'] });
      toast.success('Order status updated');
    },
    onError: () => {
      toast.error('Failed to update order status');
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Παραγγελίες</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Όλες οι παραγγελίες</option>
          <option value="pending">Σε εκκρεμότητα</option>
          <option value="processing">Σε επεξεργασία</option>
          <option value="shipped">Απεσταλμένες</option>
          <option value="delivered">Παραδομένες</option>
        </select>
      </div>

      <div className="space-y-4">
        {orders?.map((order: Order) => (
          <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">Order #{order.id}</h3>
                </div>
                <p className="text-sm text-gray-600">
                  {format(new Date(order.createdAt), 'PPP')}
                </p>
              </div>
              <select
                value={order.status}
                onChange={(e) => 
                  updateOrderStatus.mutate({ 
                    orderId: order.id, 
                    status: e.target.value 
                  })
                }
                className="rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-grow">
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity} × €{item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-semibold">
                    €{(item.quantity * item.price).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Total Items: {
                  order.items.reduce((sum, item) => sum + item.quantity, 0)
                }</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Order Total</p>
                <p className="text-xl font-bold">€{order.total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;