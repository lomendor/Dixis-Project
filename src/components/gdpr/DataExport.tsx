import React from 'react';
import { toast } from 'react-hot-toast';
import { Download } from 'lucide-react';
import api from '../../utils/api';

function DataExport() {
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await api.get('/user/data-export', {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'my-data.json');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Τα δεδομένα σας έχουν εξαχθεί επιτυχώς');
    } catch (error) {
      toast.error('Σφάλμα κατά την εξαγωγή των δεδομένων');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
    >
      <Download className="h-5 w-5" />
      {isExporting ? 'Εξαγωγή...' : 'Εξαγωγή Δεδομένων'}
    </button>
  );
}