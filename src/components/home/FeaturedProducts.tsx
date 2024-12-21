import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';

const FEATURED_PRODUCTS = [
  {
    id: '1',
    name: 'Εξαιρετικό Παρθένο Ελαιόλαδο',
    producer: 'Ελαιώνες Καλαμάτας',
    price: 28.50,
    image: '/images/olive-oil.jpg'
  },
  {
    id: '2',
    name: 'Θυμαρίσιο Μέλι',
    producer: 'Μελισσοκομία Κρήτης',
    price: 12.90,
    image: '/images/honey.jpg'
  },
  {
    id: '3',
    name: 'Γραβιέρα ΠΟΠ',
    producer: 'Τυροκομείο Ηπείρου',
    price: 22.00,
    image: '/images/graviera.jpg'
  }
];

export function FeaturedProducts() {
  return (
    <section className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Προτεινόμενα Προϊόντα</h2>
        <p className="mt-4 text-lg text-gray-600">
          Ανακαλύψτε τα καλύτερα προϊόντα από τους παραγωγούς μας
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {FEATURED_PRODUCTS.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.producer}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-medium text-gray-900">
                  {formatCurrency(product.price)}
                </span>
                <Button size="sm">
                  Προσθήκη στο καλάθι
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
} 