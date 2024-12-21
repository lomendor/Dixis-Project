import React from 'react';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Package, Truck, CreditCard, FileText, MessageSquare } from 'lucide-react';
import { Order } from '@/types/order';
import { OrderTracking } from '@/components/orders/OrderTracking';

interface OrderDetailsProps {
  order: Order;
  onStatusUpdate: (status: string) => void;
  onTrackingUpdate: (tracking: string) => void;
}

export function OrderDetails({ order, onStatusUpdate, onTrackingUpdate }: OrderDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Παραγγελία #{order.orderNumber}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Εκτύπωση
          </Button>
          <Button variant="solid" size="sm">
            Αποθήκευση Αλλαγών
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <Tabs.List>
          <Tabs.Trigger value="general">
            <Package className="w-4 h-4 mr-2" />
            Γενικές Πληροφορίες
          </Tabs.Trigger>
          <Tabs.Trigger value="products">
            <Package className="w-4 h-4 mr-2" />
            Προϊόντα
          </Tabs.Trigger>
          <Tabs.Trigger value="shipping">
            <Truck className="w-4 h-4 mr-2" />
            Αποστολή & Πληρωμή
          </Tabs.Trigger>
          <Tabs.Trigger value="invoice">
            <FileText className="w-4 h-4 mr-2" />
            Τιμολόγηση
          </Tabs.Trigger>
          <Tabs.Trigger value="communication">
            <MessageSquare className="w-4 h-4 mr-2" />
            Επικοινωνία
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="general">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Στοιχεία Πελάτη</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Ονοματεπώνυμο</label>
                  <Input value={order.customerName} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input value={order.customerEmail} readOnly />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Διευθύνσεις</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Διεύθυνση Αποστολής</label>
                  <textarea 
                    className="w-full p-2 border rounded-md"
                    value={`${order.shippingAddress.street}
${order.shippingAddress.city}, ${order.shippingAddress.postalCode}
${order.shippingAddress.country}
Τηλ: ${order.shippingAddress.phone}`}
                    readOnly
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Διεύθυνση Τιμολόγησης</label>
                  <textarea 
                    className="w-full p-2 border rounded-md"
                    value={`${order.billingAddress.street}
${order.billingAddress.city}, ${order.billingAddress.postalCode}
${order.billingAddress.country}
Τηλ: ${order.billingAddress.phone}`}
                    readOnly
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="products">
          <div className="space-y-6">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">SKU</th>
                  <th className="text-left py-3">Προϊόν</th>
                  <th className="text-right py-3">Ποσότητα</th>
                  <th className="text-right py-3">Τιμή</th>
                  <th className="text-right py-3">Σύνολο</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-4">{item.sku}</td>
                    <td className="py-4">{item.name}</td>
                    <td className="py-4 text-right">
                      <Input 
                        type="number" 
                        value={item.quantity}
                        className="w-20 text-right"
                        min={1}
                      />
                    </td>
                    <td className="py-4 text-right">{item.price.toFixed(2)}€</td>
                    <td className="py-4 text-right">{(item.quantity * item.price).toFixed(2)}€</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className="text-right py-4 font-medium">Υποσύνολο:</td>
                  <td className="text-right py-4">{order.subtotal.toFixed(2)}€</td>
                </tr>
                <tr>
                  <td colSpan={4} className="text-right py-4 font-medium">ΦΠΑ:</td>
                  <td className="text-right py-4">{order.tax.toFixed(2)}€</td>
                </tr>
                <tr>
                  <td colSpan={4} className="text-right py-4 font-medium">Έξοδα Αποστολής:</td>
                  <td className="text-right py-4">{order.shippingCost.toFixed(2)}€</td>
                </tr>
                <tr className="font-bold">
                  <td colSpan={4} className="text-right py-4">Σύνολο:</td>
                  <td className="text-right py-4">{order.total.toFixed(2)}€</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Tabs.Content>

        <Tabs.Content value="shipping">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Κατάσταση Πληρωμής</h3>
              <div className="space-y-4">
                <select 
                  className="w-full p-2 border rounded-md"
                  value={order.paymentStatus}
                  onChange={(e) => onStatusUpdate(e.target.value)}
                >
                  <option value="pending">Σε αναμονή</option>
                  <option value="paid">Πληρώθηκε</option>
                  <option value="failed">Απέτυχε</option>
                  <option value="refunded">Επιστροφή χρημάτων</option>
                </select>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Κατάσταση Αποστολής</h3>
              <div className="space-y-4">
                <select 
                  className="w-full p-2 border rounded-md"
                  value={order.shippingStatus}
                  onChange={(e) => onStatusUpdate(e.target.value)}
                >
                  <option value="pending">Σε αναμονή</option>
                  <option value="processing">Σε επεξεργασία</option>
                  <option value="shipped">Απεστάλη</option>
                  <option value="delivered">Παραδόθηκε</option>
                </select>

                <div>
                  <label className="block text-sm font-medium mb-1">Αριθμός Παρακολούθησης</label>
                  <Input 
                    value={order.trackingNumber || ''}
                    onChange={(e) => onTrackingUpdate(e.target.value)}
                    placeholder="Εισάγετε αριθμό παρακολούθησης..."
                  />
                </div>

                {order.trackingNumber && (
                  <OrderTracking 
                    orderId={order.id}
                    trackingNumber={order.trackingNumber}
                    carrier="speedex"
                  />
                )}
              </div>
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="invoice">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Τιμολόγια</h3>
              <Button variant="outline" size="sm">
                Δημιουργία Νέου Τιμολογίου
              </Button>
            </div>

            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Αριθμός</th>
                  <th className="text-left py-3">Ημερομηνία</th>
                  <th className="text-right py-3">Ποσό</th>
                  <th className="text-right py-3">Ενέργειες</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4">INV-2024-001</td>
                  <td className="py-4">{new Date().toLocaleDateString('el-GR')}</td>
                  <td className="py-4 text-right">{order.total.toFixed(2)}€</td>
                  <td className="py-4 text-right">
                    <Button variant="ghost" size="sm">Λήψη PDF</Button>
                    <Button variant="ghost" size="sm">Αποστολή</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Tabs.Content>

        <Tabs.Content value="communication">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Ιστορικό Επικοινωνίας</h3>
              <Button variant="outline" size="sm">
                Νέο Μήνυμα
              </Button>
            </div>

            <div className="space-y-4">
              {order.notes?.map((note) => (
                <div key={note.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-medium">{note.type === 'customer' ? 'Πελάτης' : 'Εσωτερικό'}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        {new Date(note.createdAt).toLocaleString('el-GR')}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">{note.createdBy}</span>
                  </div>
                  <p className="text-gray-700">{note.message}</p>
                </div>
              ))}

              <div className="mt-4">
                <textarea 
                  className="w-full p-3 border rounded-lg"
                  rows={4}
                  placeholder="Προσθήκη νέου μηνύματος..."
                />
                <div className="mt-2 flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    Εσωτερική Σημείωση
                  </Button>
                  <Button variant="solid" size="sm">
                    Αποστολή στον Πελάτη
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Tabs.Content>
      </Tabs>
    </div>
  );
} 