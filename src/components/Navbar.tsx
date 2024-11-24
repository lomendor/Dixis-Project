import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { useAuth } from '../stores/authStore';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isAuthenticated, user } = useAuth();
  const { t } = useTranslation();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="https://source.unsplash.com/random/40x40?greek,logo"
              alt="Logo"
              className="h-8 w-8 rounded"
            />
            <span className="text-2xl font-bold text-primary-700">Dixis</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-greek-600 hover:text-primary-600 transition">
              {t('nav.products')}
            </Link>
            {isAuthenticated && user?.role === 'producer' && (
              <Link to="/producer/dashboard" className="text-greek-600 hover:text-primary-600 transition">
                {t('nav.dashboard')}
              </Link>
            )}
            <Link to="/cart" className="text-greek-600 hover:text-primary-600 transition">
              <ShoppingCart className="h-6 w-6" />
            </Link>
            <LanguageSwitcher />
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-greek-600">{user?.name}</span>
                <User className="h-6 w-6 text-greek-600" />
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition"
              >
                {t('nav.login')}
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-greek-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <Link to="/products" className="text-greek-600 hover:text-primary-600 transition">
                {t('nav.products')}
              </Link>
              {isAuthenticated && user?.role === 'producer' && (
                <Link to="/producer/dashboard" className="text-greek-600 hover:text-primary-600 transition">
                  {t('nav.dashboard')}
                </Link>
              )}
              <Link to="/cart" className="text-greek-600 hover:text-primary-600 transition">
                {t('nav.cart')}
              </Link>
              <LanguageSwitcher />
              {!isAuthenticated && (
                <Link
                  to="/auth"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition text-center"
                >
                  {t('nav.login')}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;