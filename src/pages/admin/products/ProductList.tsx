import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Plus, MoreVertical, Package, Tag } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  producer: {
    id: string;
    name: string;
  };
  category: string;
  price: number;
  stock: number;
  unit: string;
  status: 'active' | 'draft' | 'out_of_stock';
  image: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Εξαιρετικό Παρθένο Ελαιόλαδο',
    producer: {
      id: '1',
      name: 'Ελαιώνες Καλαμάτας'
    },
    category: 'Ελαιόλαδο',
    price: 28.50,
    stock: 150,
    unit: 'λίτρο',
    status: 'active',
    image: '/images/olive-oil.jpg'
  },
  {
    id: '2',
    name: 'Θυμαρίσιο Μέλι',
    producer: {
      id: '2',
      name: 'Μελισσοκομία Κρήτης'
    },
    category: 'Μέλι',
    price: 12.90,
    stock: 85,
    unit: 'κιλό',
    status: 'active',
    image: '/images/honey.jpg'
  },
  {
    id: '3',
    name: 'Γραβιέρα ΠΟΠ',
    producer: {
      id: '3',
      name: 'Τυροκομείο Ηπείρου'
    },
    category: 'Τυριά',
    price: 22.00,
    stock: 0,
    unit: 'κιλό',
    status: 'out_of_stock',
    image: '/images/graviera.jpg'
  }
];

export default function ProductList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.producer.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-emerald-600 bg-emerald-50';
      case 'draft':
        return 'text-yellow-600 bg-yellow-50';
      case 'out_of_stock':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ενεργό';
      case 'draft':
        return 'Πρόχειρο';
      case 'out_of_stock':
        return 'Εκτός αποθέματος';
      default:
        return status;
    }
  };

  const categories = Array.from(new Set(mockProducts.map(p => p.category)));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Προϊόντα</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Νέο Προϊόν
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Αναζήτηση προϊόντων..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            className="border rounded-md px-3 py-2"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Όλες οι κατηγορίες</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            className="border rounded-md px-3 py-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Όλες οι καταστάσεις</option>
            <option value="active">Ενεργά</option>
            <option value="draft">Πρόχειρα</option>
            <option value="out_of_stock">Εκτός αποθέματος</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Προϊόν</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Παραγωγός</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Κατηγορία</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Τιμή</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Απόθεμα</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Κατάσταση</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Ενέργειες</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover mr-3"
                      />
                      <div className="font-medium text-gray-900">{product.name}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{product.producer.name}</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      <Tag className="w-3 h-3 mr-1" />
                      {product.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{formatCurrency(product.price)}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <Package className="w-4 h-4 mr-1 text-gray-400" />
                      <span className="text-gray-600">
                        {product.stock} {product.unit}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                      {getStatusText(product.status)}
                    </span>
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