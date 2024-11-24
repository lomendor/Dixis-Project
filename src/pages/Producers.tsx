import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { sampleProducers } from '../data/sampleProducers';
import { ProducerCard } from '../components/ui/ProducerCard';
import { Input } from '../components/ui/Input';

function Producers() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = React.useState('');

  const category = searchParams.get('category');

  const filteredProducers = sampleProducers.filter(producer => {
    if (searchQuery && !producer.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Παραγωγοί</h1>
          <p className="text-gray-600">
            Ανακαλύψτε τους καλύτερους Έλληνες παραγωγούς και τα μοναδικά προϊόντα τους
          </p>
        </div>

        <div className="mb-6">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Αναζήτηση παραγωγών..."
            icon={<Search className="h-5 w-5 text-gray-400" />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducers.map((producer) => (
            <ProducerCard key={producer.id} producer={producer} />
          ))}
        </div>

        {filteredProducers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              Δεν βρέθηκαν παραγωγοί με τα επιλεγμένα κριτήρια.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Producers;