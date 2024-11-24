import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Truck, Shield } from 'lucide-react';
import { sampleProducts } from '../data/sampleProducts';
import { formatCurrency } from '../utils/format';
import { Button } from '../components/ui/Button';
import { BackButton } from '../components/navigation/BackButton';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs';

function ProductDetails() {
  const { id } = useParams();
  const product = sampleProducts.find(p => p.id === id);
  const [selectedImage, setSelectedImage] = React.useState(0);

  if (!product) {
    return <div>Το προϊόν δεν βρέθηκε</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6 space-y-4">
        <BackButton />
        <Breadcrumbs />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                  selectedImage === index ? 'border-primary-600' : 'border-transparent'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} - Εικόνα ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Link
              to={`/producers/${product.producer.id}`}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              {product.producer.name}
            </Link>
            <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({product.reviews} κριτικές)
              </span>
            </div>
          </div>

          <p className="text-gray-600">{product.description}</p>

          <div className="border-t border-b py-4">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold">
                {formatCurrency(product.price)}
              </span>
              <span className="text-sm text-gray-500">
                {product.stock > 0 ? 'Διαθέσιμο' : 'Εξαντλημένο'}
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              className="flex-1"
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Προσθήκη στο Καλάθι
            </Button>
            <Button variant="outline">
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          {/* Shipping & Returns */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-gray-400" />
              <div>
                <h3 className="font-medium">Δωρεάν Αποστολή</h3>
                <p className="text-sm text-gray-500">
                  Για παραγγελίες άνω των €50
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-gray-400" />
              <div>
                <h3 className="font-medium">Εγγύηση Ποιότητας</h3>
                <p className="text-sm text-gray-500">
                  30 ημέρες εγγύηση επιστροφής χρημάτων
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;