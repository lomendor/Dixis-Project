import React, { useState } from 'react';
import { OrderList } from './OrderList';
import { OrderDetails } from './OrderDetails';
import { Order } from '@/types/order';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function Orders() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch orders
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await api.get('/orders');
      return response.data;
    },
  });

  // Update order status
  const updateOrderStatus = useMutation({
    mutationFn: async ({ orderIds, status }: { orderIds: string[], status: string }) => {
      await api.put('/orders/bulk-status-update', { orderIds, status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Η κατάσταση των παραγγελιών ενημερώθηκε');
    },
    onError: () => {
      toast.error('Σφάλμα κατά την ενημέρωση των παραγγελιών');
    },
  });

  // Update tracking number
  const updateTrackingNumber = useMutation({
    mutationFn: async ({ orderId, tracking }: { orderId: string, tracking: string }) => {
      await api.put(`/orders/${orderId}/tracking`, { tracking });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Ο αριθμός παρακολούθησης ενημερώθηκε');
    },
    onError: () => {
      toast.error('Σφάλμα κατά την ενημέρωση του αριθμού παρακολούθησης');
    },
  });

  // Export orders to CSV
  const handleExportCSV = async () => {
    try {
      const response = await api.get('/orders/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `orders-${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Η εξαγωγή ολοκληρώθηκε');
    } catch (error) {
      toast.error('Σφάλμα κατά την εξαγωγή των παραγγελιών');
    }
  };

  // Print invoices
  const handlePrintInvoices = async (orderIds: string[]) => {
    try {
      const response = await api.post('/orders/print-invoices', { orderIds }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoices-${new Date().toISOString()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Η εκτύπωση των τιμολογίων ολοκληρώθηκε');
    } catch (error) {
      toast.error('Σφάλμα κατά την εκτύπωση των τιμολογίων');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  const selectedOrder = selectedOrderId 
    ? orders?.find((order: Order) => order.id === selectedOrderId)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {selectedOrder ? 'Λεπτομέρειες Παραγγελίας' : 'Διαχείριση Παραγγελιών'}
        </h1>
        {selectedOrder && (
          <button
            onClick={() => setSelectedOrderId(null)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Επιστροφή στη λίστα
          </button>
        )}
      </div>

      {selectedOrder ? (
        <OrderDetails
          order={selectedOrder}
          onStatusUpdate={(status) => 
            updateOrderStatus.mutate({ orderIds: [selectedOrder.id], status })
          }
          onTrackingUpdate={(tracking) =>
            updateTrackingNumber.mutate({ orderId: selectedOrder.id, tracking })
          }
        />
      ) : (
        <OrderList
          orders={orders}
          onViewDetails={setSelectedOrderId}
          onStatusUpdate={(orderIds, status) => updateOrderStatus.mutate({ orderIds, status })}
          onExportCSV={handleExportCSV}
          onPrintInvoices={handlePrintInvoices}
        />
      )}
    </div>
  );
} 