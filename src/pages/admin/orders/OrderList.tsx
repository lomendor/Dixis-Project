import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Search, Filter, Download, Printer, ChevronDown } from 'lucide-react';
import { Order } from '@/types/order';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';

interface OrderListProps {
  orders: Order[];
  onViewDetails: (orderId: string) => void;
  onStatusUpdate: (orderIds: string[], status: string) => void;
  onExportCSV: () => void;
  onPrintInvoices: (orderIds: string[]) => void;
}

export function OrderList({ 
  orders, 
  onViewDetails, 
  onStatusUpdate,
  onExportCSV,
  onPrintInvoices 
}: OrderListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    const matchesDate = (!dateRange.start || new Date(order.createdAt) >= new Date(dateRange.start)) &&
                       (!dateRange.end || new Date(order.createdAt) <= new Date(dateRange.end));
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleSelectAll = (checked: boolean) => {
    setSelectedOrders(checked ? filteredOrders.map(order => order.id) : []);
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    setSelectedOrders(prev => 
      checked ? [...prev, orderId] : prev.filter(id => id !== orderId)
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'processing':
        return 'text-blue-600 bg-blue-50';
      case 'shipped':
        return 'text-purple-600 bg-purple-50';
      case 'delivered':
        return 'text-emerald-600 bg-emerald-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Σε αναμονή';
      case 'processing':
        return 'Σε επεξεργασία';
      case 'shipped':
        return 'Απεστάλη';
      case 'delivered':
        return 'Παραδόθηκε';
      case 'cancelled':
        return 'Ακυρώθηκε';
      default:
        return status;
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header & Actions */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Αναζήτηση παραγγελιών..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Φίλτρα
            </Button>
            
            {selectedOrders.length > 0 && (
              <>
                <Button 
                  variant="outline"
                  onClick={() => onPrintInvoices(selectedOrders)}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Εκτύπωση
                </Button>
                <Button 
                  variant="outline"
                  onClick={onExportCSV}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Εξαγωγή
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium mb-1">Κατάσταση</label>
              <select
                className="w-full border rounded-md px-3 py-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Όλες</option>
                <option value="pending">Σε αναμονή</option>
                <option value="processing">Σε επεξεργασία</option>
                <option value="shipped">Απεστάλη</option>
                <option value="delivered">Παραδόθηκε</option>
                <option value="cancelled">Ακυρώθηκε</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Από</label>
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Έως</label>
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedOrders.length > 0 && (
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
            <span className="text-sm text-blue-600">
              {selectedOrders.length} επιλεγμένες παραγγελίες
            </span>
            <select
              className="border rounded-md px-3 py-1.5 text-sm"
              onChange={(e) => {
                if (e.target.value) {
                  onStatusUpdate(selectedOrders, e.target.value);
                  e.target.value = '';
                }
              }}
            >
              <option value="">Αλλαγή κατάστασης</option>
              <option value="processing">Σε επεξεργασία</option>
              <option value="shipped">Απεστάλη</option>
              <option value="delivered">Παραδόθηκε</option>
              <option value="cancelled">Ακυρώθηκε</option>
            </select>
          </div>
        )}

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Αριθμός</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Πμερομηνία</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Πελάτης</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Σύνολο</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Ηατάσταση</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Πληρωμή</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Αποστολή</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr 
                  key={order.id} 
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => onViewDetails(order.id)}
                >
                  <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">{order.orderNumber}</div>
                    <div className="text-sm text-gray-500">{order.items.length} προϊόντα</div>
                  </td>
                  <td className="py-4 px-4 text-gray-500">
                    {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">{order.customerName}</div>
                    <div className="text-sm text-gray-500">{order.customerEmail}</div>
                  </td>
                  <td className="py-4 px-4 text-right font-medium text-gray-900">
                    {order.total.toFixed(2)}€
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.paymentStatus)}`}>
                      {getStatusText(order.paymentStatus)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.shippingStatus)}`}>
                      {getStatusText(order.shippingStatus)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Δεν βρέθηκαν παραγγελίες</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
} 