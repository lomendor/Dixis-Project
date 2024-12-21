import { Link } from 'react-router-dom';
import { Users, Layers, Leaf, Heart } from 'lucide-react';
import { ProductShowcase } from '@/components/home/ProductShowcase';
import { Hero } from '@/components/home/Hero';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { ProducerShowcase } from '@/components/home/ProducerShowcase';

const features = [
  {
    icon: <Users className="w-12 h-12 text-white" />,
    title: 'Διαφάνεια & Σύνδεση',
    description: 'Γνωρίστε τους ανθρώπους πίσω από κάθε προϊόν. Περπατήστε νοερά στα μονοπάτια όπου γεννιέται η ποιότητα. Κάθε επιλογή σας είναι μια χειραψία εμπιστοσύνης με τον δημιουργό της.',
    rotation: '-rotate-6'
  },
  {
    icon: <Layers className="w-12 h-12 text-white" />,
    title: 'Κοινότητα & Ανάπτυξη',
    description: 'Χτίζουμε μαζί έναν κόσμο όπου η ποιότητα ανταμείβεται και η αυθεντικότητα αναγνωρίζεται. Κάθε αγορά σας ενισχύει τις τοπικές κοινότητες και στηρίζει τη βιώσιμη ανάπτυξη.',
    rotation: 'rotate-6'
  },
  {
    icon: <Leaf className="w-12 h-12 text-white" />,
    title: 'Ποιότητα & Παράδοση',
    description: 'Εδώ, η παράδοση συναντά το μέλλον. Κάθε προϊόν είναι καρπός γνώσης που πέρασε από γενιά σε γενιά, εμπλουτισμένη με σύγχρονη τεχνογνωσία και αγάπη για την αριστεία.',
    rotation: '-rotate-3'
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero />

      {/* Product Showcase */}
      <ProductShowcase />
      
      {/* Featured Products */}
      <FeaturedProducts />

      {/* Producer Showcase */}
      <ProducerShowcase />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1800px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-[0_2px_20px_rgba(0,0,0,0.08)] 
                          border border-gray-100 relative"
              >
                <div className="flex flex-col">
                  {/* Icon Container */}
                  <div className="h-[100px] flex items-center justify-center mb-8">
                    <div className={`w-20 h-20 bg-gradient-to-br from-[#1a472a] to-[#2a5738] 
                                  rounded-2xl flex items-center justify-center
                                  shadow-lg shadow-[#1a472a]/10 ${feature.rotation}`}
                    >
                      {feature.icon}
                    </div>
                  </div>

                  {/* Title Container */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-[#1a472a] text-center">
                      {feature.title}
                    </h3>
                  </div>

                  {/* Text Container */}
                  <div>
                    <p className="text-lg text-gray-600 leading-relaxed text-center">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="relative py-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://source.unsplash.com/1920x1080/?greek,field" 
            alt="Greek field background" 
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a472a]/60 to-[#143d23]/65" />
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[800px] h-[800px] -top-[400px] -right-[400px] 
                          bg-[#235c36] rounded-full opacity-20 blur-3xl mix-blend-overlay" />
          <div className="absolute w-[600px] h-[600px] -bottom-[300px] -left-[300px] 
                          bg-[#235c36] rounded-full opacity-20 blur-3xl mix-blend-overlay" />
        </div>

        <div className="relative max-w-[1800px] mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Icon Container */}
            <div className="relative mb-12">
              <div className="group relative w-28 h-28 mx-auto">
                <div className="absolute inset-0 bg-white/10 rounded-[24px]
                              backdrop-blur-[12px] border border-white/20
                              shadow-[0_8px_32px_rgba(0,0,0,0.3)]
                              transform -rotate-6 transition-all duration-300
                              group-hover:rotate-0 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent
                              rounded-[24px] opacity-50" />
                <div className="relative w-full h-full flex items-center justify-center
                              transform -rotate-6 transition-all duration-300
                              group-hover:rotate-0">
                  <Heart className="w-12 h-12 text-white 
                                 drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)]
                                 transform transition-all duration-300
                                 group-hover:scale-110" />
                </div>
              </div>
            </div>

            {/* Vision Text */}
            <div className="relative space-y-8 text-center">
              <h2 className="text-4xl md:text-5xl text-white font-serif leading-tight">
                Στη Dixis, χτίζουμε μια κοινότητα όπου η ποιότητα βρίσκει τον δρόμο της.
              </h2>

              {/* Διακοσμητική γραμμή */}
              <div className="w-24 h-0.5 mx-auto bg-gradient-to-r from-transparent via-white/30 to-transparent" />

              <div className="space-y-6 max-w-4xl mx-auto">
                <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed">
                  Όπου κάθε παραγωγός μπορεί να μοιραστεί την ιστορία του
                  και κάθε καταναλωτής να γνωρίζει την προέλευση των επιλογών του.
                </p>
                <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed">
                  Δημιουργούμε έναν κόσμο όπου η εμπιστοσύνη χτίζεται στη διαφάνεια
                  και η αξία αναγνωρίζεται στην πηγή της.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50/20 to-white" />

        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] 
                          bg-gradient-to-br from-emerald-50 to-transparent 
                          rounded-full opacity-50 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] 
                          bg-gradient-to-br from-emerald-50 to-transparent 
                          rounded-full opacity-50 blur-3xl" />
        </div>

        <div className="relative max-w-[1800px] mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Title */}
            <div className="mb-16">
              <h2 className="text-5xl md:text-7xl text-gray-900 font-serif mb-4 leading-tight">
                Ελάτε να Χτίσουμε
              </h2>
              <div className="relative">
                <h2 className="text-5xl md:text-7xl text-[#1a472a] font-serif leading-tight">
                  Μαζί το Αύριο
                </h2>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 
                              w-48 h-1 bg-gradient-to-r from-transparent 
                              via-emerald-600/30 to-transparent" />
              </div>
            </div>

            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light
                       max-w-3xl mx-auto mb-16">
              Είτε είστε δημιουργός που αφήνει το αποτύπωμά του στον κόσμο, 
              είτε αναζητάτε προϊόντα με ιστορία και ψυχή, εδώ είναι ο χώρος σας.
            </p>

            {/* Διακριτικό διαχωριστικό */}
            <div className="w-16 h-0.5 mx-auto mb-12 bg-gradient-to-r 
                          from-transparent via-emerald-600/30 to-transparent" />

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link
                to="/become-producer"
                className="min-w-[220px] px-8 py-4 bg-[#1a472a] text-white text-lg
                         rounded-xl border border-[#1a472a] shadow-lg
                         transition-all duration-300
                         hover:bg-[#143d23] hover:scale-105
                         hover:shadow-xl hover:shadow-[#1a472a]/10"
              >
                Συνεργαστείτε μαζί μας
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}