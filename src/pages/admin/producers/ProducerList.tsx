import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Search, 
  Plus, 
  Filter,
  CheckCircle, 
  XCircle,
  MapPin,
  Calendar,
  ChevronDown,
  MoreVertical
} from 'lucide-react';

interface Producer {
  id: string;
  name: string;
  email: string;
  location: string;
  status: 'active' | 'pending' | 'inactive';
  productsCount: number;
  joinedDate: string;
  selected?: boolean;
}

const mockProducers: Producer[] = [
  {
    id: '1',
    name: 'Ελαιώνες Καλαμάτας',
    email: 'info@kalamata-olive.gr',
    location: 'Καλαμάτα',
    status: 'active',
    productsCount: 12,
    joinedDate: '2023-01-15'
  },
  {
    id: '2',
    name: 'Μελισσοκομία Κρήτης',
    email: 'contact@cretan-honey.gr',
    location: 'Ηράκλειο',
    status: 'active',
    productsCount: 8,
    joinedDate: '2023-02-20'
  },
  {
    id: '3',
    name: 'Τυροκομείο Ηπείρου',
    email: 'info@epirus-cheese.gr',
    location: 'Ιωάννινα',
    status: 'pending',
    productsCount: 0,
    joinedDate: '2024-01-10'
  }
];

export default function ProducerList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedProducers, setSelectedProducers] = useState<string[]>([]);

  const filteredProducers = mockProducers.filter(producer => {
    const matchesSearch = producer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         producer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || producer.status === statusFilter;
    const matchesLocation = locationFilter === 'all' || producer.location === locationFilter;
    
    return matchesSearch && matchesStatus && matchesLocation;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-emerald-600 bg-emerald-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'inactive':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducers(filteredProducers.map(p => p.id));
    } else {
      setSelectedProducers([]);
    }
  };

  const handleSelectProducer = (id: string) => {
    if (selectedProducers.includes(id)) {
      setSelectedProducers(selectedProducers.filter(p => p !== id));
    } else {
      setSelectedProducers([...selectedProducers, id]);
    }
  };

  const handleBulkAction = (action: 'approve' | 'deactivate') => {
    // TODO: Implement bulk actions
    console.log(`Bulk ${action} for:`, selectedProducers);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Παραγωγοί</h1>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Νέος Παραγωγός
        </Button>
      </div>

      <Card className="p-6">
        {/* Φίλτρα & Αναζήτηση */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Αναζήτηση με όνομα ή email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <select
                className="appearance-none bg-white border rounded-lg pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Όλες οι καταστάσεις</option>
                <option value="active">Ενεργοί</option>
                <option value="pending">Σε αναμονή</option>
                <option value="inactive">Ανενεργοί</option>
              </select>
              <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            <div className="relative">
              <select
                className="appearance-none bg-white border rounded-lg pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="all">Όλες οι περιοχές</option>
                <option value="Καλαμάτα">Καλαμάτα</option>
                <option value="Ηράκλειο">Ηράκλειο</option>
                <option value="Ιωάννινα">Ιωάννινα</option>
              </select>
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            <div className="relative">
              <select
                className="appearance-none bg-white border rounded-lg pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">Όλες οι ημερομηνίες</option>
                <option value="today">Σήμερα</option>
                <option value="week">Τελευταία εβδομάδα</option>
                <option value="month">Τελευταίος μήνας</option>
              </select>
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            <button className="p-2 text-gray-600 hover:text-emerald-600 transition-colors rounded-lg hover:bg-gray-100">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Μαζικές Ενέργειες */}
        {selectedProducers.length > 0 && (
          <div className="bg-gray-50 border rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Επιλεγμένοι {selectedProducers.length} παραγωγοί
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleBulkAction('approve')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Έγκριση
              </Button>
              <Button
                onClick={() => handleBulkAction('deactivate')}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Απενεργοποίηση
              </Button>
            </div>
          </div>
        )}

        {/* Πίνακας Παραγωγών */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducers.length === filteredProducers.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Παραγωγός</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Τοποθεσία</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Κατάσταση</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Προϊόντα</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Ημ. Εγγραφής</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Ενέργειες</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducers.map((producer) => (
                <tr key={producer.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <input
                      type="checkbox"
                      checked={selectedProducers.includes(producer.id)}
                      onChange={() => handleSelectProducer(producer.id)}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{producer.name}</div>
                      <div className="text-sm text-gray-500">{producer.email}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{producer.location}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(producer.status)}`}>
                      {producer.status === 'active' && <CheckCircle className="w-4 h-4 mr-1" />}
                      {producer.status === 'inactive' && <XCircle className="w-4 h-4 mr-1" />}
                      {producer.status === 'active' ? 'Ενεργός' : 
                       producer.status === 'pending' ? 'Σε αναμονή' : 'Ανενεργός'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{producer.productsCount}</td>
                  <td className="py-4 px-4 text-gray-600">
                    {new Date(producer.joinedDate).toLocaleDateString('el-GR')}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
} 