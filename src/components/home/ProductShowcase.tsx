import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const images = [
  {
    url: 'https://source.unsplash.com/800x600/?olive,oil',
    title: 'Ελαιόλαδο'
  },
  {
    url: 'https://source.unsplash.com/800x600/?honey',
    title: 'Μέλι'
  },
  {
    url: 'https://source.unsplash.com/800x600/?wine',
    title: 'Κρασί'
  },
  {
    url: 'https://source.unsplash.com/800x600/?nuts',
    title: 'Ξηροί Καρποί'
  }
];

export function ProductShowcase() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[700px] overflow-hidden bg-black">
      {/* Background Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 w-full h-full"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50 z-10" />
          <img
            src={images[currentImageIndex].url}
            alt={images[currentImageIndex].title}
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-20 max-w-[1800px] mx-auto px-6 h-full flex items-center">
        <div className="w-full md:w-1/2 space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-white leading-tight"
          >
            Γεύσεις από την 
            <span className="block text-emerald-400">Ελληνική Γη</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-200 leading-relaxed"
          >
            Ανακαλύψτε επιλεγμένα προϊόντα από παραγωγούς 
            που σέβονται την παράδοση και αγαπούν τη γη τους.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link 
              to="/products"
              className="px-8 py-4 bg-emerald-600 text-white rounded-full text-lg font-medium 
                       hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20
                       transform hover:scale-105 duration-300 text-center"
            >
              Προϊόντα
            </Link>
            <Link 
              to="/our-story"
              className="px-8 py-4 border-2 border-white text-white rounded-full text-lg 
                      font-medium hover:bg-white/10 transition-colors transform hover:scale-105 
                      duration-300 text-center"
            >
              Μάθετε Περισσότερα
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentImageIndex === index 
                ? 'bg-white w-6' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Προβολή ${images[index].title}`}
          />
        ))}
      </div>
    </section>
  );
} 