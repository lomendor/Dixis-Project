import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Dialog } from '@headlessui/react';
import { AlertTriangle } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function AccountDeletion() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete('/user/account');
      logout();
      toast.success('Ο λογαριασμός σας διαγράφηκε επιτυχώς');
      navigate('/');
    } catch (error) {
      toast.error('Σφάλμα κατά τη διαγραφή του λογαριασμού');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-red-600 hover:text-red-800"
      >
        Διαγραφή Λογαριασμού
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md w-full bg-white rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <Dialog.Title className="text-lg font-semibold">
                Διαγραφή Λογαριασμού
              </Dialog.Title>
            </div>

            <p className="text-gray-600 mb-6">
              Είστε βέβαιοι ότι θέλετε να διαγράψετε τον λογαριασμό σας; 
              Αυτή η ενέργεια είναι μη αναστρέψιμη και θα διαγράψει όλα τα δεδομένα σας.
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Ακύρωση
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Διαγραφή...' : 'Διαγραφή Λογαριασμού'}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}