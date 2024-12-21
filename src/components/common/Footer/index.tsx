import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#f4f8f4] to-[#edf2ed]">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Logo Section */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-block group">
            <div className="relative w-[100px] h-[100px] mx-auto mb-2">
              <div className="absolute inset-0 bg-white rounded-2xl shadow-sm transform transition-transform duration-500 group-hover:rotate-6" />
              <img 
                src="/logo.png" 
                alt="Dixis Logo" 
                className="relative w-full h-full p-4 object-contain transform transition-transform duration-500 group-hover:-rotate-3"
              />
            </div>
            <p className="text-sm text-[#1a472a]/80 font-medium">
              Συνδέουμε την παράδοση με το μέλλον
            </p>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-2 justify-items-center text-center mb-6">
          {/* Company Info */}
          <div>
            <h3 className="text-base font-semibold text-[#1a472a] mb-2">Η Εταιρεία</h3>
            <ul className="space-y-0.5">
              <li>
                <Link to="/about" className="text-xs text-gray-600 hover:text-[#1a472a]">
                  Σχετικά με εμάς
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-xs text-gray-600 hover:text-[#1a472a]">
                  Επικοινωνία
                </Link>
              </li>
              <li>
                <Link to="/our-story" className="text-xs text-gray-600 hover:text-[#1a472a]">
                  Η Ιστορία μας
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold text-[#1a472a] mb-2">Χρήσιμα</h3>
            <ul className="space-y-0.5">
              <li>
                <Link to="/products" className="text-xs text-gray-600 hover:text-[#1a472a]">
                  Προϊόντα
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-xs text-gray-600 hover:text-[#1a472a]">
                  Συχνές Ερωτήσεις
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-xs text-gray-600 hover:text-[#1a472a]">
                  Αποστολές
                </Link>
              </li>
            </ul>
          </div>

          {/* Producers */}
          <div>
            <h3 className="text-base font-semibold text-[#1a472a] mb-2">Παραγωγοί</h3>
            <ul className="space-y-0.5">
              <li>
                <Link to="/become-producer" className="text-xs text-gray-600 hover:text-[#1a472a]">
                  Γίνετε Παραγωγός
                </Link>
              </li>
              <li>
                <Link to="/producers" className="text-xs text-gray-600 hover:text-[#1a472a]">
                  Οι Παραγωγοί μας
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-xs text-gray-600 hover:text-[#1a472a]">
                  Πώς Λειτουργεί
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-base font-semibold text-[#1a472a] mb-2">Νομικά</h3>
            <ul className="space-y-0.5">
              <li>
                <Link to="/terms" className="text-xs text-gray-600 hover:text-[#1a472a]">
                  Όροι Χρήσης
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-xs text-gray-600 hover:text-[#1a472a]">
                  Πολιτική Απορρήτου
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-xs text-gray-600 hover:text-[#1a472a]">
                  Πολιτική Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="text-center border-t border-[#1a472a]/10 pt-4">
          <div className="flex justify-center gap-6 mb-3">
            {[
              { icon: <Facebook size={18} />, href: '#', label: 'Facebook' },
              { icon: <Instagram size={18} />, href: '#', label: 'Instagram' },
              { icon: <Twitter size={18} />, href: '#', label: 'Twitter' },
              { icon: <Youtube size={18} />, href: '#', label: 'Youtube' }
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-8 h-8 flex items-center justify-center rounded-full
                         bg-white text-gray-500 shadow-sm border border-gray-100
                         hover:scale-110 hover:rotate-6 hover:text-[#1a472a] hover:border-[#1a472a]/20
                         transition-all duration-300"
              >
                {social.icon}
              </a>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            © {currentYear} Dixis. Με επιφύλαξη όλων των δικαιωμάτων.
          </p>
        </div>
      </div>
    </footer>
  );
}; 