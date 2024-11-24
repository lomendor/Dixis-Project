import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Dialog } from '@headlessui/react';
import { Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ProducerForm } from '../../components/admin/ProducerForm';
import api from '../../utils/api';

function AdminProducers() {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedProducer, setSelectedProducer] = React.useState<any>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const queryClient = useQueryClient();

  const { data: producers, isLoading } = useQuery({
    queryKey: ['admin-producers'],
    queryFn: async () => {
      const response = await api.get('/admin/producers');
      return response.data;
    },
  });

  const updateProducerStatus = useMutation({
    mutationFn: async ({ producerId, active }: { producerId: string; active: boolean }) => {
      await api.put(`/admin/producers/${producerId}/status`, { active });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-producers'] });
      toast.success('Η κατάσταση του παραγωγού ενημερώθηκε');
    },
    onError: () => {
      toast.error('Σφάλμα κατά την ενημέρωση της κατάστασης');
    },
  });

  const deleteProducer = useMutation({
    mutationFn: async (producerId: string) => {
      await api.delete(`/admin/producers/${producerId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-producers'] });
      toast.success('Ο παραγωγός διαγράφηκε επιτυχώς');
    },
    onError: () => {
      toast.error('Σφάλμα κατά τη διαγραφή του παραγωγού');
    },
  });

  const handleDelete = async (producerId: string) => {
    if (window.confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτόν τον παραγωγό;')) {
      await deleteProducer.mutateAsync(producerId);
    }
  };

  const filteredProducers = producers?.filter((producer: any) =>
    producer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Διαχείριση Παραγωγών</h1>
        <Button
          onClick={() => {
            setSelectedProducer(null);
            setIsFormOpen(true);
          }}
        >
          Νέος Παραγωγός
        </Button>
      </div>

      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Αναζήτηση παραγωγών..."
      />

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Παραγωγός
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Τοποθεσία
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Προϊόντα
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Κατάσταση
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ενέργειες
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducers?.map((producer: any) => (
              <tr key={producer.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={producer.image}
                      alt={producer.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {producer.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {producer.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{producer.location}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {producer.products?.length || 0} προϊόντα
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => updateProducerStatus.mutate({
                      producerId: producer.id,
                      active: !producer.active
                    })}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      producer.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {producer.active ? (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-1" />
                    )}
                    {producer.active ? 'Ενεργός' : 'Ανενεργός'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedProducer(producer);
                      setIsFormOpen(true);
                    }}
                    className="mr-2"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(producer.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-lg p-6">
            <Dialog.Title className="text-lg font-semibold mb-4">
              {selectedProducer ? 'Επεξεργασία' : 'Νέος'} Παραγωγός
            </Dialog.Title>
            
            <ProducerForm
              producer={selectedProducer}
              onClose={() => setIsFormOpen(false)}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

export default AdminProducers;