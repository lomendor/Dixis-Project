import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// StorySection Component
const StorySection = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    className={`max-w-4xl mx-auto px-6 py-24 ${className}`}
  >
    {children}
  </motion.div>
);

export default function OurStory() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - αυξάνουμε το ελάχιστο ύψος */}
      <div className="relative min-h-[100vh] overflow-hidden">
        {/* Background Image - βελτιωμένο positioning */}
        <motion.div 
          className="absolute inset-0"
          animate={{ scale: 1.1 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
        >
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundImage: 'url("/oldmanvision.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center 30%', // Προσαρμογή του κέντρου της εικόνας
            }}
          />
        </motion.div>
        
        {/* Πιο ελαφριά overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 via-gray-800/40 to-gray-700/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 via-transparent to-gray-900/30" />
        
        {/* Main content - καλύτερο padding */}
        <div className="relative min-h-screen flex items-center justify-center text-center py-32">
          <div className="max-w-5xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="space-y-20"
            >
              <motion.h1 
                className="text-6xl md:text-7xl lg:text-8xl font-serif text-white
                          tracking-wide leading-tight font-medium
                          drop-shadow-[0_4px_60px_rgba(0,0,0,0.7)]
                          [text-shadow:_0_2px_10px_rgba(0,0,0,0.7)]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                Η Ιστορία μας
              </motion.h1>

              <motion.div 
                className="space-y-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.7 }}
              >
                <p className="text-3xl md:text-4xl lg:text-5xl text-white/95
                             font-light leading-relaxed tracking-wide
                             drop-shadow-[0_4px_60px_rgba(0,0,0,0.7)]
                             [text-shadow:_0_2px_10px_rgba(0,0,0,0.7)]">
                  Το ταξίδι μας ξεκίνησε από μια απλή πεποίθηση:
                </p>
                <p className="text-3xl md:text-4xl lg:text-5xl text-white 
                             font-normal leading-relaxed tracking-wide
                             drop-shadow-[0_4px_60px_rgba(0,0,0,0.7)]
                             [text-shadow:_0_2px_10px_rgba(0,0,0,0.7)]
                             max-w-4xl mx-auto">
                  ότι η ποιότητα και η αυθεντικότητα 
                  <span className="block mt-6">
                    αξίζουν να αναγνωρίζονται
                  </span>
                  <span className="block mt-6">
                    και να ανταμείβονται.
                  </span>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Τ Πορεία μας */}
      <StorySection>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-medium mb-6">Η Πορεία μας</h2>
          <p className="text-gray-600 leading-relaxed">
            Κάθε βήμα μας είναι μια νέα ιστορία. Μια ιστορία που γράφεται με τη βοήθεια των παραγωγών, 
            των καταναλωτών και όλων όσοι πιστεύουν στο όραμά μας.
          </p>
        </div>
        <div className="space-y-12">
          <div className="flex gap-8 items-center">
            <div className="w-32 h-32 flex-shrink-0 bg-[#1a472a]/5 rounded-lg border border-[#1a472a]/10">
              <img 
                src="https://source.unsplash.com/400x400/?greek,farm" 
                alt="Journey milestone" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Η Αρχή</h3>
              <p className="text-gray-600 leading-relaxed">
                Ξεκινήσαμε με ένα όνειρο: να δημιουργήσουμε μια πλατφόρμα που θα έφερνε τους καταναλωτές 
                πιο κοντά στην πηγή των προϊόντων τους.
              </p>
            </div>
          </div>
          <div className="flex gap-8 items-center">
            <div className="w-32 h-32 flex-shrink-0 bg-[#1a472a]/5 rounded-lg border border-[#1a472a]/10">
              <img 
                src="https://source.unsplash.com/400x400/?greek,market" 
                alt="Journey milestone" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Η Ανάπτυξη</h3>
              <p className="text-gray-600 leading-relaxed">
                Χτίσαμε μια κοινότητα βασισμένη στην εμπιστοσύνη, τη διαφάνεια και την αμοιβαία εκτίμηση.
              </p>
            </div>
          </div>
          <div className="flex gap-8 items-center">
            <div className="w-32 h-32 flex-shrink-0 bg-[#1a472a]/5 rounded-lg border border-[#1a472a]/10">
              <img 
                src="/journey3.jpg" 
                alt="Journey milestone" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Το Μέλλον</h3>
              <p className="text-gray-600 leading-relaxed">
                Συνεχίζουμε να χτίζουμε ένα καλύτερο μέλλον για την ελληνική παραγωγή, ένα προϊόν τη φορά.
              </p>
            </div>
          </div>
        </div>
      </StorySection>

      {/* Το Όραμά μας */}
      <section className="py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          {/* Section Title */}
          <motion.div 
            className="text-center mb-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-[#1a472a] to-[#2a5738] 
                          rounded-3xl flex items-center justify-center mb-8 mx-auto
                          shadow-lg shadow-[#1a472a]/10 rotate-3">
              <svg 
                className="w-12 h-12 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-[#1a472a] mb-8">Το Όραμά μας</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#1a472a]/30 to-transparent mx-auto" />
          </motion.div>

          {/* Μετά το section title, προσθέτουμε το κείμενο: */}
          <motion.div 
            className="text-center mb-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.p 
              className="mt-16 text-2xl md:text-3xl text-gray-600 leading-relaxed max-w-5xl mx-auto font-light"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Οραματιζόμαστε έναν κόσμο όπου η τεχνολογία γίνεται γέφυρα ανάμεσα στην παράδοση και το μέλλον. 
              <span className="block mt-6">
                Όπου κάθε προϊόν έχει ένα πρόσωπο, μια ιστορία, μια ταυτότητα.
              </span>
              <span className="block mt-6">
                Όπου η ποιότητα και η αυθεντικότητα δεν είναι απλώς λέξεις του μάρκετινγκ, αλλά αξίες που καθοδηγούν κάθε μας βήμα.
              </span>
            </motion.p>
          </motion.div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-3 gap-12">
            {/* Κοινή δομή για όλες τις κάρτες */}
            <motion.div 
              className="bg-white rounded-3xl p-12 lg:p-16 shadow-lg border border-gray-100
                        hover:border-[#1a472a]/20 transition-all duration-500
                        group relative overflow-hidden min-h-[700px]
                        hover:shadow-xl hover:-translate-y-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="h-full flex flex-col">
                {/* Icon Container - σταθερό ύψος */}
                <div className="h-[120px] flex items-center justify-center mb-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#1a472a] to-[#2a5738] 
                                rounded-3xl flex items-center justify-center
                                shadow-lg shadow-[#1a472a]/10 rotate-3
                                group-hover:rotate-6 transition-transform duration-500">
                    <svg 
                      className="w-12 h-12 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                    </svg>
                  </div>
                </div>

                {/* Title Container - σταθερό ύψος */}
                <div className="h-[100px] flex items-center justify-center">
                  <h3 className="text-3xl lg:text-4xl font-bold text-[#1a472a] text-center">
                    Η Αποστολή μας
                  </h3>
                </div>

                {/* Text Container - υπόλοιπο ύψος */}
                <div className="flex-grow flex items-center">
                  <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed text-center font-light">
                    Δημιουργούμε έναν κόσμο όπου κάθε μικροπαραγωγός μπορεί να ευδοκιμήσει, 
                    διατηρώντας την αυθεντικότητα και την ταυτότητά του. Πιστεύουμε ότι η αξία 
                    πρέπει να ανταμείβεται στην πηγή της.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Ε Δέσμευσή μας */}
            <motion.div 
              className="bg-white rounded-3xl p-12 lg:p-16 shadow-lg border border-gray-100
                        hover:border-[#1a472a]/20 transition-all duration-500
                        group relative overflow-hidden min-h-[700px]
                        hover:shadow-xl hover:-translate-y-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="h-full flex flex-col">
                <div className="h-[120px] flex items-center justify-center mb-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#1a472a] to-[#2a5738] 
                                rounded-3xl flex items-center justify-center
                                shadow-lg shadow-[#1a472a]/10 -rotate-3
                                group-hover:rotate-0 transition-transform duration-500">
                    <svg 
                      className="w-12 h-12 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>

                <div className="h-[100px] flex items-center justify-center">
                  <h3 className="text-3xl lg:text-4xl font-bold text-[#1a472a] text-center">
                    Η Δέσμευσή μας
                  </h3>
                </div>

                <div className="flex-grow flex items-center">
                  <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed text-center font-light">
                    Είμαστε αφοσιωμένοι στη δημιουργία μιας πλατφόρμας που προάγει τη διαφάνεια 
                    και την εμπιστοσύνη. Κάθε προϊόν έχει μια ιστορία που αξίζει να ακουστεί, 
                    κάθε παραγωγός ένα όραμα που αξίζει να υποστηριχθεί.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Το Μέλλον μας */}
            <motion.div 
              className="bg-white rounded-3xl p-12 lg:p-16 shadow-lg border border-gray-100
                        hover:border-[#1a472a]/20 transition-all duration-500
                        group relative overflow-hidden min-h-[700px]
                        hover:shadow-xl hover:-translate-y-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="h-full flex flex-col">
                <div className="h-[120px] flex items-center justify-center mb-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#1a472a] to-[#2a5738] 
                                rounded-3xl flex items-center justify-center
                                shadow-lg shadow-[#1a472a]/10 rotate-6
                                group-hover:rotate-0 transition-transform duration-500">
                    <svg 
                      className="w-12 h-12 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                </div>

                <div className="h-[100px] flex items-center justify-center">
                  <h3 className="text-3xl lg:text-4xl font-bold text-[#1a472a] text-center">
                    Το Μέλλον μας
                  </h3>
                </div>

                <div className="flex-grow flex items-center">
                  <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed text-center font-light">
                    Χτίζουμε μια κοινότητα που θα αλλάξει τον τρόπο που παράγουμε και καταναλώνουμε. 
                    Όπου η τεχνολογία γίνεται το μέσο για να αναδείξουμε την παράδοση, όχι να την 
                    αντικαταστήσουμε.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Join Us CTA - τώρα στο τέλος */}
      <div className="bg-[#1a472a] text-white">
        <StorySection className="text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-8">
            Γίνετε Μέρος της Ιστορίας μας
          </h2>
          <p className="text-xl md:text-2xl text-gray-200 mb-16 max-w-3xl mx-auto font-light">
            Είτε είστε παραγωγός που θέλει να μοιραστεί τα προϊόντα του, είτε καταναλωτής που αναζητά 
            το αυθεντικό, σας καλωσορίζουμε στην κοινότητά μας.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/become-producer"
              className="bg-white text-[#1a472a] px-12 py-6 rounded-2xl font-medium 
                        hover:bg-gray-100 transition-all duration-300
                        shadow-lg hover:shadow-white/20
                        text-xl"
            >
              Γίνετε Παραγωγός
            </Link>
            <Link 
              to="/products"
              className="border-2 border-white px-12 py-6 rounded-2xl font-medium 
                        hover:bg-white/10 transition-all duration-300
                        text-xl"
            >
              Εξερευνήστε Προϊόντα
            </Link>
          </div>
        </StorySection>
      </div>
    </div>
  );
} 