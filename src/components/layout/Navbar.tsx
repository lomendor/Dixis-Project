import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, Heart, Store } from 'lucide-react';
import { useAuth } from '../../stores/authStore';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isAuthenticated, user } = useAuth();
  const { t } = useTranslation();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50" role="navigation" aria-label={t('nav.mainNavigation')}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center"
              aria-label={t('nav.home')}
            >
              <Store className="h-8 w-8 text-primary-600" aria-hidden="true" />
              <span className="ml-2 text-2xl font-bold text-primary-900">Dixis</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center ml-8 space-x-8">
              <Link
                to="/products"
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                Προϊόντα
              </Link>
              <Link
                to="/producers"
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                Παραγωγοί
              </Link>
            </div>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/wishlist"
              className="text-gray-600 hover:text-primary-600 transition-colors"
              aria-label={t('nav.wishlist')}
            >
              <Heart className="h-6 w-6" aria-hidden="true" />
              <span className="sr-only">{t('nav.wishlist')}</span>
            </Link>
            <Link
              to="/cart"
              className="text-gray-600 hover:text-primary-600 transition-colors"
              aria-label={t('nav.cart')}
            >
              <ShoppingCart className="h-6 w-6" aria-hidden="true" />
              <span className="sr-only">{t('nav.cart')}</span>
            </Link>
            <LanguageSwitcher />

            {isAuthenticated ? (
              <div className="relative group">
                <button 
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary-600"
                  aria-label={t('nav.userMenu')}
                  aria-expanded={isMenuOpen}
                  aria-haspopup="true"
                  aria-controls="user-menu"
                >
                  <User className="h-6 w-6" aria-hidden="true" />
                  <span>{user?.name}</span>
                </button>
                
                <div 
                  id="user-menu"
                  role="menu"
                  className="absolute right-0 w-48 mt-2 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                >
                  {user?.role === 'producer' && (
                    <Link
                      to="/producer/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      {t('nav.dashboard')}
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    {t('nav.profile')}
                  </Link>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    onClick={() => {/* Handle logout */}}
                    role="menuitem"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                {t('nav.login')}
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-600"
            aria-expanded={isMenuOpen}
            aria-label={t('nav.toggleMenu')}
            aria-controls="mobile-menu"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden py-4 border-t"
            role="menu"
            aria-orientation="vertical"
            aria-label={t('nav.mobileNavigation')}
          >
            <div className="flex flex-col space-y-4">
              <Link
                to="/products"
                className="text-gray-600 hover:text-primary-600"
                role="menuitem"
              >
                Προϊόντα
              </Link>
              <Link
                to="/producers"
                className="text-gray-600 hover:text-primary-600"
                role="menuitem"
              >
                Παραγωγοί
              </Link>
              <Link
                to="/cart"
                className="text-gray-600 hover:text-primary-600"
                role="menuitem"
              >
                <ShoppingCart className="h-6 w-6 inline-block mr-2" aria-hidden="true" />
                <span>{t('nav.cart')}</span>
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/auth"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 text-center"
                  role="menuitem"
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