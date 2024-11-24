import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Users, TrendingUp, Shield } from 'lucide-react';
import { ProductCard } from '../components/ui/ProductCard';
import { sampleProducts } from '../data/sampleProducts';

function Home() {
  const featuredProducts = sampleProducts.slice(0, 3);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16 px-4 bg-gradient-to-r from-primary-800 to-primary-600 rounded-3xl text-white">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold">
            Dixis: Αυθεντικά Ελληνικά Προϊόντα
          </h1>
          <p className="text-xl text-gray-100">
            Ανακαλύψτε μοναδικά προϊόντα απευθείας από Έλληνες παραγωγούς
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/products"
              className="bg-white text-primary-800 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
            >
              Περιήγηση Προϊόντων
            </Link>
            <Link
              to="/producers"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-primary-800 transition"
            >
              Γνωρίστε τους Παραγωγούς
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          Χαρακτηριστικά
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-6 bg-white rounded-xl shadow-sm text-center">
            <ShoppingBag className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Ποιοτικά Προϊόντα
            </h3>
            <p className="text-gray-600">
              Επιλεγμένα ελληνικά προϊόντα υψηλής ποιότητας
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm text-center">
            <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Άμεση Επικοινωνία
            </h3>
            <p className="text-gray-600">
              Απευθείας σύνδεση με τους παραγωγούς
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm text-center">
            <TrendingUp className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Αναπτυσσόμενη Κοινότητα
            </h3>
            <p className="text-gray-600">
              Γίνετε μέλος της ελληνικής αγοράς μας
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm text-center">
            <Shield className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Ασφαλείς Συναλλαγές
            </h3>
            <p className="text-gray-600">
              Προστατευμένες και ασφαλείς πληρωμές
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">
            Προτεινόμενα Προϊόντα
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => {}}
                onToggleWishlist={() => {}}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;