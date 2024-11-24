import React from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Star, Award, Calendar, Mail, Phone, Globe } from 'lucide-react';
import { sampleProducers } from '../data/sampleProducers';
import { sampleProducts } from '../data/sampleProducts';
import { ProductCard } from '../components/ui/ProductCard';
import { BackButton } from '../components/navigation/BackButton';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs';

function ProducerProfile() {
  const { id } = useParams();
  const producer = sampleProducers.find(p => p.id === id);
  const producerProducts = sampleProducts.filter(product => 
    producer?.products.includes(product.id)
  );

  if (!producer) {
    return <div>Ο παραγωγός δεν βρέθηκε</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6 space-y-4">
        <BackButton />
        <Breadcrumbs />
      </div>

      {/* Hero Section */}
      <div className="relative h-80 rounded-xl overflow-hidden mb-8">
        <img
          src={producer.coverImage}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="flex items-center gap-4">
            <img
              src={producer.image}
              alt={producer.name}
              className="w-24 h-24 rounded-lg object-cover border-4 border-white"
            />
            <div>
              <h1 className="text-3xl font-bold">{producer.name}</h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <MapPin className="h-5 w-5" />
                  <span>{producer.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span>{producer.rating} ({producer.reviews} κριτικές)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Producer Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">Σχετικά με εμάς</h2>
            <p className="text-gray-600">{producer.description}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Πιστοποιήσεις</h2>
            <div className="flex flex-wrap gap-2">
              {producer.certifications.map((cert) => (
                <div
                  key={cert}
                  className="flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-full"
                >
                  <Award className="h-4 w-4" />
                  <span className="text-sm">{cert}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm h-fit space-y-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <h3 className="font-medium">Έτος Ίδρυσης</h3>
              <p className="text-gray-600">{producer.foundedYear}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-gray-400" />
            <div>
              <h3 className="font-medium">Email</h3>
              <a
                href={`mailto:${producer.contactInfo.email}`}
                className="text-primary-600 hover:text-primary-700"
              >
                {producer.contactInfo.email}
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-gray-400" />
            <div>
              <h3 className="font-medium">Τηλέφωνο</h3>
              <a
                href={`tel:${producer.contactInfo.phone}`}
                className="text-primary-600 hover:text-primary-700"
              >
                {producer.contactInfo.phone}
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-gray-400" />
            <div>
              <h3 className="font-medium">Ιστοσελίδα</h3>
              <a
                href={`https://${producer.contactInfo.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700"
              >
                {producer.contactInfo.website}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Producer Products */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Τα Προϊόντα μας</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {producerProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => {}}
              onToggleWishlist={() => {}}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProducerProfile;