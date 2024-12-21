import React, { useState } from 'react';
import { OrderList } from './OrderList';
import { OrderDetails } from './OrderDetails';
import { Returns } from './Returns';
import { Order } from '@/types/order';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Tabs } from '@/components/ui/Tabs';
import { Package, RefreshCcw } from 'lucide-react';

// Mock data
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customerId: 'CUST-001',
    customerName: 'Γιώργος Παπαδόπουλος',
    customerEmail: 'g.papadopoulos@example.com',
    status: 'processing',
    paymentStatus: 'paid',
    shippingStatus: 'processing',
    shippingAddress: {
      street: 'Σόλωνος 45',
      city: 'Αθήνα',
      postalCode: '10672',
      country: 'Ελλάδα',
      phone: '2101234567'
    },
    billingAddress: {
      street: 'Σόλωνος 45',
      city: 'Αθήνα',
      postalCode: '10672',
      country: 'Ελλάδα',
      phone: '2101234567'
    },
    items: [
      {
        id: 'ITEM-001',
        productId: 'PROD-001',
        sku: 'SKU001',
        name: 'Βιολογικό Ελαιόλαδο',
        quantity: 2,
        price: 25.00,
        total: 50.00
      },
      {
        id: 'ITEM-002',
        productId: 'PROD-002',
        sku: 'SKU002',
        name: 'Φέτα ΠΟΠ',
        quantity: 1,
        price: 12.50,
        total: 12.50
      }
    ],
    subtotal: 62.50,
    shippingCost: 5.00,
    tax: 16.20,
    total: 83.70,
    notes: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customerId: 'CUST-002',
    customerName: 'Μαρία Κωνσταντίνου',
    customerEmail: 'm.konstantinou@example.com',
    status: 'pending',
    paymentStatus: 'pending',
    shippingStatus: 'pending',
    shippingAddress: {
      street: 'Τσιμισκή 78',
      city: 'Θεσσαλονίκη',
      postalCode: '54622',
      country: 'Ελλάδα',
      phone: '2310123456'
    },
    billingAddress: {
      street: 'Τσιμισκή 78',
      city: 'Θεσσαλονίκη',
      postalCode: '54622',
      country: 'Ελλάδα',
      phone: '2310123456'
    },
    items: [
      {
        id: 'ITEM-003',
        productId: 'PROD-003',
        sku: 'SKU003',
        name: 'Μέλι Θυμαρίσιο',
        quantity: 3,
        price: 15.00,
        total: 45.00
      }
    ],
    subtotal: 45.00,
    shippingCost: 5.00,
    tax: 12.00,
    total: 62.00,
    notes: [],
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  }
];

export default function Orders() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('orders');
  const queryClient = useQueryClient();

  // Fetch orders - προσωρινά χρησιμοποιούμε mock data
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      // Προσωρινά επιστρέφουμε mock data
      return mockOrders;
      // Όταν συνδεθούμε με το backend:
      // const response = await api.get('/orders');
      // return response.data;
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
      {selectedOrder ? (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Λεπτομέρειες Παραγγελίας
            </h1>
            <button
              onClick={() => setSelectedOrderId(null)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Επιστροφή στη λίστα
            </button>
          </div>
          <OrderDetails
            order={selectedOrder}
            onStatusUpdate={(status) => 
              updateOrderStatus.mutate({ orderIds: [selectedOrder.id], status })
            }
            onTrackingUpdate={(tracking) =>
              updateTrackingNumber.mutate({ orderId: selectedOrder.id, tracking })
            }
          />
        </>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Διαχείριση Παραγγελιών
            </h1>
          </div>

          <Tabs 
            defaultValue="orders" 
            className="space-y-6"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <Tabs.List className="bg-white p-1 rounded-lg border">
              <Tabs.Trigger 
                value="orders"
                className="flex items-center gap-2 px-4 py-2 rounded-md data-[state=active]:bg-gray-100"
              >
                <Package className="w-4 h-4" />
                Παραγγελίες
              </Tabs.Trigger>
              <Tabs.Trigger 
                value="returns"
                className="flex items-center gap-2 px-4 py-2 rounded-md data-[state=active]:bg-gray-100"
              >
                <RefreshCcw className="w-4 h-4" />
                Επιστροφές & Ακυρώσεις
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="orders">
              <OrderList
                orders={orders}
                onViewDetails={setSelectedOrderId}
                onStatusUpdate={(orderIds, status) => updateOrderStatus.mutate({ orderIds, status })}
                onExportCSV={handleExportCSV}
                onPrintInvoices={handlePrintInvoices}
              />
            </Tabs.Content>

            <Tabs.Content value="returns">
              <Returns />
            </Tabs.Content>
          </Tabs>
        </>
      )}
    </div>
  );
} 