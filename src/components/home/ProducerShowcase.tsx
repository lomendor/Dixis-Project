import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const FEATURED_PRODUCERS = [
  {
    id: '1',
    name: 'Ελαιώνες Καλαμάτας',
    location: 'Καλαμάτα',
    description: 'Παραγωγή εξαιρετικού παρθένου ελαιολάδου με παραδοσιακές μεθόδους',
    image: '/images/olive-grove.jpg'
  },
  {
    id: '2',
    name: 'Μελισσοκομία Κρήτης',
    location: 'Ηράκλειο',
    description: 'Αγνό μέλι από τα βότανα και τα λουλούδια της Κρήτης',
    image: '/images/apiary.jpg'
  },
  {
    id: '3',
    name: 'Τυροκομείο Ηπείρου',
    location: 'Ιωάννινα',
    description: 'Παραδοσιακά τυριά ΠΟΠ από αγνό γάλα της Ηπείρου',
    image: '/images/dairy.jpg'
  }
];

export function ProducerShowcase() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Οι Παραγωγοί μας</h2>
        <p className="mt-4 text-lg text-gray-600">
          Γνωρίστε τους ανθρώπους πίσω από τα προϊόντα
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {FEATURED_PRODUCERS.map((producer) => (
          <Card key={producer.id} className="overflow-hidden">
            <img
              src={producer.image}
              alt={producer.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{producer.name}</h3>
                  <p className="text-sm text-gray-600">{producer.location}</p>
                </div>
              </div>
              <p className="mt-4 text-gray-600">{producer.description}</p>
              <Button className="mt-4 w-full">
                Δείτε τα προϊόντα
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
} 