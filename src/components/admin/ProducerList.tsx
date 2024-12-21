import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

interface Producer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'pending' | 'disabled';
  registrationDate: string;
  lastLogin: string;
  productsCount: number;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const ProducerList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['producers', page, search, status],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(status && { status })
      });
      
      const response = await axios.get(`/api/producers?${params}`);
      return response.data;
    }
  });

  if (isLoading) return <div>Φόρτωση...</div>;
  if (error) return <div>Σφάλμα κατά τη φόρτωση των παραγωγών</div>;

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Αναζήτηση..."
          className="px-4 py-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="">Όλες οι καταστάσεις</option>
          <option value="active">Ενεργοί</option>
          <option value="pending">Σε αναμονή</option>
          <option value="disabled">Απενεργοποιημένοι</option>
        </select>
      </div>

      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 text-left">Όνομα</th>
            <th className="px-6 py-3 text-left">Email</th>
            <th className="px-6 py-3 text-left">Τηλέφωνο</th>
            <th className="px-6 py-3 text-left">Κατάσταση</th>
            <th className="px-6 py-3 text-left">Προϊόντα</th>
            <th className="px-6 py-3 text-left">Ημ. Εγγραφής</th>
            <th className="px-6 py-3 text-left">Τελευταίο Login</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((producer: Producer) => (
            <tr key={producer._id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4">{producer.name}</td>
              <td className="px-6 py-4">{producer.email}</td>
              <td className="px-6 py-4">{producer.phone}</td>
              <td className="px-6 py-4">{producer.status}</td>
              <td className="px-6 py-4">{producer.productsCount}</td>
              <td className="px-6 py-4">
                {new Date(producer.registrationDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                {producer.lastLogin ? 
                  new Date(producer.lastLogin).toLocaleDateString() : 
                  'Ποτέ'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between items-center">
        <div>
          Σύνολο: {data.pagination.total} παραγωγοί
        </div>
        <div className="flex gap-2">
          {Array.from({ length: data.pagination.pages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 border rounded ${
                page === i + 1 ? 'bg-blue-500 text-white' : ''
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProducerList; 