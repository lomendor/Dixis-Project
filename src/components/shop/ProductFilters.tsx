import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { sampleProducers } from '../../data/sampleProducers';

const categories = [
  { id: 'olive-oil', name: 'Ελαιόλαδο' },
  { id: 'honey', name: 'Μέλι' },
  { id: 'wine', name: 'Κρασί' },
  { id: 'cheese', name: 'Τυρί' },
  { id: 'herbs', name: 'Βότανα' },
];

const priceRanges = [
  { id: '0-20', name: 'Έως €20' },
  { id: '20-50', name: '€20 - €50' },
  { id: '50-100', name: '€50 - €100' },
  { id: '100+', name: 'Άνω των €100' },
];

export function ProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategories = searchParams.getAll('category');
  const selectedProducer = searchParams.get('producer');
  const selectedPriceRange = searchParams.get('price');
  const inStock = searchParams.get('inStock') === 'true';

  const handleCategoryChange = (categoryId: string) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    const params = new URLSearchParams(searchParams);
    params.delete('category');
    newCategories.forEach(id => params.append('category', id));
    setSearchParams(params);
  };

  const handleProducerChange = (producerId: string) => {
    const params = new URLSearchParams(searchParams);
    if (selectedProducer === producerId) {
      params.delete('producer');
    } else {
      params.set('producer', producerId);
    }
    setSearchParams(params);
  };

  const handlePriceChange = (range: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('price', range);
    setSearchParams(params);
  };

  const handleInStockChange = (checked: boolean) => {
    const params = new URLSearchParams(searchParams);
    params.set('inStock', checked.toString());
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedProducer || selectedPriceRange || inStock;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4" role="complementary" aria-label="Φίλτρα προϊόντων">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5" aria-hidden="true" />
          Φίλτρα
        </h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-red-600 hover:text-red-700"
            aria-label="Καθαρισμός όλων των φίλτρων"
          >
            <X className="h-4 w-4 mr-1" aria-hidden="true" />
            Καθαρισμός
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Κατηγορίες */}
        <fieldset>
          <legend className="font-medium mb-2">Κατηγορίες</legend>
          <div className="space-y-2" role="group" aria-label="Κατηγορίες προϊόντων">
            {categories.map(category => (
              <label key={category.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  aria-label={`Φιλτράρισμα κατηγορίας ${category.name}`}
                />
                <span className="ml-2 text-gray-700">{category.name}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Παραγωγοί */}
        <fieldset>
          <legend className="font-medium mb-2">Παραγωγοί</legend>
          <div className="space-y-2" role="group" aria-label="Παραγωγοί">
            {sampleProducers.map(producer => (
              <label key={producer.id} className="flex items-center">
                <input
                  type="radio"
                  name="producer"
                  value={producer.id}
                  checked={selectedProducer === producer.id}
                  onChange={() => handleProducerChange(producer.id)}
                  className="border-gray-300 text-primary-600 focus:ring-primary-500"
                  aria-label={`Φιλτράρισμα παραγωγού ${producer.name}`}
                />
                <span className="ml-2 text-gray-700">{producer.name}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Εύρος Τιμής */}
        <fieldset>
          <legend className="font-medium mb-2">Εύρος Τιμής</legend>
          <div className="space-y-2" role="radiogroup" aria-label="Εύρος τιμής">
            {priceRanges.map(range => (
              <label key={range.id} className="flex items-center">
                <input
                  type="radio"
                  name="price"
                  value={range.id}
                  checked={selectedPriceRange === range.id}
                  onChange={() => handlePriceChange(range.id)}
                  className="border-gray-300 text-primary-600 focus:ring-primary-500"
                  aria-label={`Φιλτράρισμα τιμής ${range.name}`}
                />
                <span className="ml-2 text-gray-700">{range.name}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Διαθεσιμότητα */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => handleInStockChange(e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              aria-label="Εμφάνιση μόνο διαθέσιμων προϊόντων"
            />
            <span className="ml-2 text-gray-700">Μόνο Διαθέσιμα</span>
          </label>
        </div>
      </div>
    </div>
  );
}