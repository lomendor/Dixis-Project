import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Package, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';
import type { Product, Order } from '../types';

function ProducerDashboard() {
  const { data: products } = useQuery<Product[]>({
    queryKey: ['producer-products'],
    queryFn: async () => {
      const response = await fetch('/api/products/producer');
      return response.json();
    },
  });

  const { data: orders } = useQuery<Order[]>({
    queryKey: ['producer-orders'],
    queryFn: async () => {
      const response = await fetch('/api/orders/producer');
      return response.json();
    },
  });

  const stats = [
    {
      label: 'Total Products',
      value: products?.length || 0,
      icon: Package,
      color: 'text-blue-600',
    },
    {
      label: 'Total Sales',
      value: orders?.length || 0,
      icon: ShoppingBag,
      color: 'text-green-600',
    },
    {
      label: 'Revenue',
      value: `$${orders?.reduce((sum, order) => sum + order.total, 0).toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: 'text-purple-600',
    },
    {
      label: 'Growth',
      value: '+12.5%',
      icon: TrendingUp,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`${stat.color}`}>
                <stat.icon className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Management */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Products</h2>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
            Add New Product
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4">Product</th>
                <th className="text-left py-4">Price</th>
                <th className="text-left py-4">Stock</th>
                <th className="text-left py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">${product.price}</td>
                  <td className="py-4">{product.stock}</td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button className="text-indigo-600 hover:text-indigo-800">Edit</button>
                      <button className="text-red-600 hover:text-red-800">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Recent Orders</h2>
        <div className="space-y-4">
          {orders?.slice(0, 5).map((order) => (
            <div key={order.id} className="border-b pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Order #{order.id}</p>
                  <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${order.total.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">{order.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProducerDashboard;