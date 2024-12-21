import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Filter } from 'lucide-react';
import { OrderReturn } from '@/types/order';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';

export function Returns() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const queryClient = useQueryClient();

  // Fetch returns
  const { data: returns, isLoading } = useQuery({
    queryKey: ['returns'],
    queryFn: async () => {
      const response = await api.get('/orders/returns');
      return response.data;
    },
  });

  // Update return status
  const updateReturnStatus = useMutation({
    mutationFn: async ({ returnId, status }: { returnId: string, status: string }) => {
      await api.put(`/orders/returns/${returnId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['returns'] });
      toast.success('Η κατάσταση της επιστροφής ενημερώθηκε');
    },
    onError: () => {
      toast.error('Σφάλμα κατά την ενημέρωση της κατάστασης');
    },
  });

  const filteredReturns = returns?.filter((returnItem: OrderReturn) => {
    const matchesSearch = 
      returnItem.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || returnItem.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'approved':
        return 'text-emerald-600 bg-emerald-50';
      case 'rejected':
        return 'text-red-600 bg-red-50';
      case 'completed':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Σε αναμονή';
      case 'approved':
        return 'Εγκρίθηκε';
      case 'rejected':
        return 'Απορρίφθηκε';
      case 'completed':
        return 'Ολοκληρώθηκε';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Επιστροφές & Ακυρώσεις</h1>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {/* Header & Actions */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Αναζήτηση επιστροφών..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Φίλτρα
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium mb-1">Κατάσταση</label>
                <select
                  className="w-full sm:w-48 border rounded-md px-3 py-2"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Όλες</option>
                  <option value="pending">Σε αναμονή</option>
                  <option value="approved">Εγκρίθηκε</option>
                  <option value="rejected">Απορρίφθηκε</option>
                  <option value="completed">Ολοκληρώθηκε</option>
                </select>
              </div>
            </div>
          )}

          {/* Returns Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">ID Επιστροφής</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Ημερομηνία</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Αιτία</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Προϊόντα</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Κατάσταση</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Ενέργειες</th>
                </tr>
              </thead>
              <tbody>
                {filteredReturns?.map((returnItem: OrderReturn) => (
                  <tr key={returnItem.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {returnItem.id}
                    </td>
                    <td className="py-4 px-4 text-gray-500">
                      {format(new Date(returnItem.createdAt), 'dd/MM/yyyy HH:mm')}
                    </td>
                    <td className="py-4 px-4 text-gray-900">
                      {returnItem.reason}
                    </td>
                    <td className="py-4 px-4">
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {returnItem.items.map((item, index) => (
                          <li key={index}>
                            {item.quantity}x - {item.reason}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(returnItem.status)}`}>
                        {getStatusText(returnItem.status)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {returnItem.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateReturnStatus.mutate({ 
                              returnId: returnItem.id, 
                              status: 'rejected' 
                            })}
                          >
                            Απόρριψη
                          </Button>
                          <Button
                            variant="solid"
                            size="sm"
                            onClick={() => updateReturnStatus.mutate({ 
                              returnId: returnItem.id, 
                              status: 'approved' 
                            })}
                          >
                            Έγκριση
                          </Button>
                        </div>
                      )}
                      {returnItem.status === 'approved' && (
                        <Button
                          variant="solid"
                          size="sm"
                          onClick={() => updateReturnStatus.mutate({ 
                            returnId: returnItem.id, 
                            status: 'completed' 
                          })}
                        >
                          Ολοκλήρωση
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredReturns?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Δεν βρέθηκαν επιστροφές</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
} 