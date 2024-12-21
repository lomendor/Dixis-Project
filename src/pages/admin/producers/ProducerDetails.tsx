import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  FileText, 
  CheckCircle, 
  XCircle,
  BarChart2,
  Clock,
  Facebook,
  Instagram,
  MessageCircle,
  Plus,
  PieChart,
  TrendingUp,
  MoreVertical
} from 'lucide-react';

interface Producer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  description: string;
  documents: {
    id: string;
    name: string;
    type: string;
    status: 'pending' | 'approved' | 'rejected';
    comment?: string;
    date: string;
  }[];
  products: {
    id: string;
    name: string;
    category: string;
    status: 'active' | 'inactive';
    price: number;
    stock: number;
  }[];
  statistics: {
    totalSales: number;
    averageRating: number;
    averageOrderValue: number;
    totalRevenue: number;
  };
  transactions: {
    id: string;
    date: string;
    amount: number;
    status: 'completed' | 'pending' | 'cancelled';
    customer: string;
  }[];
}

const mockProducer: Producer = {
  id: '1',
  name: 'Ελαιώνες Καλαμάτας',
  email: 'info@kalamata-olive.gr',
  phone: '+30 2721012345',
  location: 'Καλαμάτα, Μεσσηνία',
  website: 'https://kalamata-olive.gr',
  facebook: 'kalamata.olive',
  instagram: 'kalamata_olive',
  description: 'Παραγωγή εξαιρετικά παρθένου ελαιόλαδου από τους ελαιώνες της Καλαμάτας...',
  documents: [
    {
      id: 'd1',
      name: 'Πιστοποίηση Βιολογικής Καλλιέργειας',
      type: 'certification',
      status: 'approved',
      date: '2023-05-15'
    },
    {
      id: 'd2',
      name: 'Άδεια Λειτουργίας',
      type: 'license',
      status: 'pending',
      date: '2024-01-10'
    }
  ],
  products: [
    {
      id: 'p1',
      name: 'Εξαιρετικό Παρθένο Ελαιόλαδο',
      category: 'Ελαιόλαδα',
      status: 'active',
      price: 12.50,
      stock: 150
    },
    {
      id: 'p2',
      name: 'Ελιές Καλαμών',
      category: 'Ελιές',
      status: 'active',
      price: 8.90,
      stock: 200
    }
  ],
  statistics: {
    totalSales: 1250,
    averageRating: 4.8,
    averageOrderValue: 45.60,
    totalRevenue: 57000
  },
  transactions: [
    {
      id: 't1',
      date: '2024-03-15',
      amount: 156.50,
      status: 'completed',
      customer: 'Γιώργος Π.'
    },
    {
      id: 't2',
      date: '2024-03-14',
      amount: 89.90,
      status: 'pending',
      customer: 'Μαρία Κ.'
    }
  ]
};

export default function ProducerDetails() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Στοιχεία Παραγωγού</h1>
        <div className="flex gap-2">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <CheckCircle className="w-4 h-4 mr-2" />
            Έγκριση
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            <XCircle className="w-4 h-4 mr-2" />
            Απενεργοποίηση
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'profile', name: 'Προφίλ', icon: User },
            { id: 'documents', name: 'Έγγραφα & Πιστοποιήσεις', icon: FileText },
            { id: 'products', name: 'Προϊόντα', icon: Globe },
            { id: 'statistics', name: 'Στατιστικά', icon: BarChart2 },
            { id: 'transactions', name: 'Ιστορικό Συναλλαγών', icon: Clock }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                border-b-2 py-4 px-1 inline-flex items-center text-sm font-medium
                ${activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Βασικές Πληροφορίες */}
            <Card className="lg:col-span-2 p-6 space-y-6">
              <h2 className="text-lg font-semibold">Βασικές Πληροφορίες</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Όνομα</label>
                  <div className="mt-1 flex items-center">
                    <User className="w-5 h-5 text-gray-400 mr-2" />
                    <span>{mockProducer.name}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="mt-1 flex items-center">
                    <Mail className="w-5 h-5 text-gray-400 mr-2" />
                    <span>{mockProducer.email}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Τηλέφωνο</label>
                  <div className="mt-1 flex items-center">
                    <Phone className="w-5 h-5 text-gray-400 mr-2" />
                    <span>{mockProducer.phone}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Τοποθεσία</label>
                  <div className="mt-1 flex items-center">
                    <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                    <span>{mockProducer.location}</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Περιγραφή</label>
                <p className="mt-1 text-gray-600">{mockProducer.description}</p>
              </div>
            </Card>

            {/* Social Links */}
            <Card className="p-6 space-y-6">
              <h2 className="text-lg font-semibold">Social Media</h2>
              <div className="space-y-4">
                <a href={mockProducer.website} className="flex items-center text-gray-600 hover:text-emerald-600">
                  <Globe className="w-5 h-5 mr-2" />
                  Website
                </a>
                <a href={`https://facebook.com/${mockProducer.facebook}`} className="flex items-center text-gray-600 hover:text-emerald-600">
                  <Facebook className="w-5 h-5 mr-2" />
                  Facebook
                </a>
                <a href={`https://instagram.com/${mockProducer.instagram}`} className="flex items-center text-gray-600 hover:text-emerald-600">
                  <Instagram className="w-5 h-5 mr-2" />
                  Instagram
                </a>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'documents' && (
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Έγγραφα & Πιστοποιήσεις</h2>
                <Button>
                  <FileText className="w-4 h-4 mr-2" />
                  Προσθήκη Εγγράφου
                </Button>
              </div>
              
              <div className="space-y-4">
                {mockProducer.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium">{doc.name}</div>
                        <div className="text-sm text-gray-500">
                          Ημερομηνία: {new Date(doc.date).toLocaleDateString('el-GR')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${doc.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {doc.status === 'approved' ? 'Εγκεκριμένο' :
                         doc.status === 'rejected' ? 'Απορριφθέν' : 'Σε αναμονή'}
                      </span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MessageCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'products' && (
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Προϊόντα</h2>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Νέο Προϊόν
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Προϊόν</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Κατηγορία</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Τιμή</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Απόθεμα</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Κατάσταση</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Ενέργειες</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockProducer.products.map((product) => (
                      <tr key={product.id} className="border-b border-gray-100">
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900">{product.name}</div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{product.category}</td>
                        <td className="py-4 px-4 text-gray-600">€{product.price.toFixed(2)}</td>
                        <td className="py-4 px-4 text-gray-600">{product.stock}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${product.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}
                          `}>
                            {product.status === 'active' ? 'Ενεργό' : 'Ανενεργό'}
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
            </div>
          </Card>
        )}

        {activeTab === 'statistics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Βασικά Στατιστικά */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-6">Συνολικά Στατιστικά</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-500">Συνολικές Πωλήσεις</div>
                  <div className="text-2xl font-bold text-gray-900">{mockProducer.statistics.totalSales}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Μέση Αξιολόγηση</div>
                  <div className="text-2xl font-bold text-gray-900">{mockProducer.statistics.averageRating}/5</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Μέση Αξία Παραγγελίας</div>
                  <div className="text-2xl font-bold text-gray-900">€{mockProducer.statistics.averageOrderValue.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Συνολικά Έσοδα</div>
                  <div className="text-2xl font-bold text-gray-900">€{mockProducer.statistics.totalRevenue.toFixed(2)}</div>
                </div>
              </div>
            </Card>

            {/* Γράφημα Πωλήσεων */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-6">Γράφημα Πωλήσεων</h2>
              <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                <BarChart2 className="w-8 h-8 text-gray-400" />
                <span className="ml-2 text-gray-500">Προσεχώς: Γράφημα Πωλήσεων</span>
              </div>
            </Card>

            {/* Αξιολογήσεις */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-6">Κατανομή Αξιολογήσεων</h2>
              <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                <PieChart className="w-8 h-8 text-gray-400" />
                <span className="ml-2 text-gray-500">Προσεχώς: Γράφημα Αξιολογήσεων</span>
              </div>
            </Card>

            {/* Τάσεις */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-6">Τάσεις</h2>
              <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                <TrendingUp className="w-8 h-8 text-gray-400" />
                <span className="ml-2 text-gray-500">Προσεχώς: Γράφημα Τάσεων</span>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'transactions' && (
          <Card className="p-6">
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Ιστορικό Συναλλαγών</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Ημερομηνία</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Πελάτης</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Ποσό</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Κατάσταση</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockProducer.transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-gray-100">
                        <td className="py-4 px-4 text-gray-600">
                          {new Date(transaction.date).toLocaleDateString('el-GR')}
                        </td>
                        <td className="py-4 px-4 text-gray-900">{transaction.customer}</td>
                        <td className="py-4 px-4 text-gray-600">€{transaction.amount.toFixed(2)}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${transaction.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                              transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}
                          >
                            {transaction.status === 'completed' ? 'Ολοκληρώθηκε' :
                             transaction.status === 'pending' ? 'Σε εξέλιξη' : 'Ακυρώθηκε'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}