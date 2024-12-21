import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Search, MapPin, Star } from 'lucide-react';
import { mockProducers } from '@/data/mockProducers';

export default function ProducersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducers = mockProducers.filter(producer =>
    producer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producer.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Παραγωγοί</h1>
      
      {/* Αναζήτηση */}
      <div className="mb-8">
        <div className="relative">
          <Input
            type="text"
            placeholder="Αναζήτηση παραγωγών..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Λίστα Παραγωγών */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducers.map((producer) => (
          <Card 
            key={producer.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img 
              src={producer.image}
              alt={producer.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold">{producer.name}</h3>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{producer.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-gray-600 mt-1">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{producer.location}</span>
              </div>
              <p className="mt-2 text-gray-600 line-clamp-2">{producer.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {producer.categories.map(category => (
                  <span 
                    key={category}
                    className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
              <button 
                className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
                onClick={() => window.location.href = `/producers/${producer.id}/products`}
              >
                Προβολή Προϊόντων ({producer.productsCount})
              </button>
            </div>
          </Card>
        ))}
      </div>

      {filteredProducers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">Δεν βρέθηκαν παραγωγοί</p>
        </div>
      )}
    </div>
  );
} 