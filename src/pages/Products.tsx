import { useTranslation } from 'react-i18next';
import { ProductCard } from '@/components/products/ProductCard';
import { Spinner } from '@/components/ui/Spinner';
import type { PopulatedProduct } from '@/types/models/product.types';
import { ProductUnit, ProductCategory, ProductStatus } from '@/types/models/product.types';

// Προσωρινά θα χρησιμοποιήσουμε τα demo προϊόντα αντί για το useProducts
const demoProducts: PopulatedProduct[] = [
  {
    _id: '1',
    name: 'Ελαιόλαδο Εξαιρετικό Παρθένο',
    description: 'Εξαιρετικό παρθένο ελαιόλαδο από την Καλαμάτα, με χαμηλή οξύτητα και πλούσια γεύση.',
    price: 28.50,
    images: [{ id: '1', url: '/products/olive-oil.jpg', alt: 'Ελαιόλαδο' }],
    producer: {
      _id: 'prod1',
      name: 'Ελαιώνες Καλαμάτας',
      description: '',
      email: 'info@elaiones.gr',
      phone: '2721012345',
      location: 'Καλαμάτα',
      status: 'active',
      productsCount: 5,
      rating: 4.5,
      certifications: [],
      statusHistory: [],
      documents: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    category: ProductCategory.Oil,
    stock: 50,
    unit: ProductUnit.Liter,
    status: ProductStatus.Active,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 4.5,
    reviewsCount: 12
  },
  {
    _id: '2',
    name: 'Μέλι Θυμαρίσιο',
    description: 'Αγνό θυμαρίσιο μέλι από τα βουνά της Κρήτης, με έντονο άρωμα και γεύση.',
    price: 12.90,
    images: [{ id: '2', url: '/products/honey.jpg', alt: 'Μέλι' }],
    producer: {
      _id: 'prod2',
      name: 'Μελισσοκομία Κρήτης',
      description: '',
      email: 'info@melissokomia.gr',
      phone: '2810123456',
      location: 'Κρήτη',
      status: 'active',
      productsCount: 3,
      rating: 4.8,
      certifications: [],
      statusHistory: [],
      documents: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    category: ProductCategory.Honey,
    stock: 30,
    unit: ProductUnit.Kilo,
    status: ProductStatus.Active,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 4.8,
    reviewsCount: 8
  },
  {
    _id: '3',
    name: 'Φέτα ΠΟΠ',
    description: 'Παραδοσιακή φέτα ΠΟΠ από αιγοπρόβειο γάλα, ωριμασμένη σε ξύλινα βαρέλια.',
    price: 15.80,
    images: [{ id: '3', url: '/products/feta.jpg', alt: 'Φέτα' }],
    producer: {
      _id: 'prod3',
      name: 'Τυροκομείο Ηπείρου',
      description: '',
      email: 'info@tyrokomio.gr',
      phone: '2651012345',
      location: 'Ήπειρος',
      status: 'active',
      productsCount: 8,
      rating: 4.7,
      certifications: [],
      statusHistory: [],
      documents: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    category: ProductCategory.Dairy,
    stock: 25,
    unit: ProductUnit.Kilo,
    status: ProductStatus.Active,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 4.7,
    reviewsCount: 15
  }
];

export default function Products() {
  const { t } = useTranslation();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Τα Προϊόντα μας</h1>
        <p className="mt-2 text-lg text-gray-600">
          Ανακαλύψτε αυθεντικά ελληνικά προϊόντα από επιλεγμένους παραγωγούς
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {demoProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
} 