import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Package, Truck } from 'lucide-react';
import ReactStars from 'react-stars';
import api from '../../utils/api';
import type { Order } from '../../types';

function Orders() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['user-orders'],
    queryFn: async () => {
      const response = await api.get('/user/orders');
      return response.data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Οι Παραγγελίες μου</h1>

      <div className="space-y-6">
        {orders?.map((order: Order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">Παραγγελία #{order.id}</h3>
                </div>
                <p className="text-sm text-gray-600">
                  {format(new Date(order.createdAt), 'PPP')}
                </p>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                  order.status === 'delivered'
                    ? 'bg-green-100 text-green-800'
                    : order.status === 'shipped'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Order Items */}
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
                      Ποσότητα: {item.quantity} × €{item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      €{(item.quantity * item.price).toFixed(2)}
                    </p>
                    {order.status === 'delivered' && (
                      <ReactStars
                        count={5}
                        value={0}
                        size={20}
                        color2="#2563eb"
                        edit={true}
                        onChange={(rating) => {
                          // Handle rating submission
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Tracking Information */}
            {order.trackingNumber && (
              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center gap-2 text-blue-600">
                  <Truck className="h-5 w-5" />
                  <span className="font-medium">
                    Tracking Number: {order.trackingNumber}
                  </span>
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="mt-6 pt-4 border-t flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">
                  Shipping Address:
                </p>
                <p className="text-sm">
                  {order.shippingAddress.fullName}
                </p>
                <p className="text-sm">
                  {order.shippingAddress.street}
                </p>
                <p className="text-sm">
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                </p>
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