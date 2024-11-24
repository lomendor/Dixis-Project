import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Store } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-gray-300" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Store className="h-8 w-8 text-primary-500" aria-hidden="true" />
              <span className="ml-2 text-2xl font-bold text-white">Dixis</span>
            </div>
            <p className="text-sm text-gray-400">
              {t('footer.companyDescription')}
            </p>
          </div>

          {/* Quick Links */}
          <nav className="space-y-4" aria-label={t('footer.quickLinks')}>
            <h2 className="text-lg font-semibold text-white">{t('footer.quickLinks')}</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="hover:text-primary-500 transition-colors">
                  {t('footer.products')}
                </Link>
              </li>
              <li>
                <Link to="/producers" className="hover:text-primary-500 transition-colors">
                  {t('footer.producers')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary-500 transition-colors">
                  {t('footer.about')}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Help & Support */}
          <nav className="space-y-4" aria-label={t('footer.support')}>
            <h2 className="text-lg font-semibold text-white">{t('footer.support')}</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="hover:text-primary-500 transition-colors">
                  {t('footer.faq')}
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-primary-500 transition-colors">
                  {t('footer.shipping')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-500 transition-colors">
                  {t('footer.contact')}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Newsletter & Social */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">{t('footer.stayConnected')}</h2>
            <form className="space-y-2" aria-label={t('footer.newsletter')}>
              <div className="flex flex-col space-y-2">
                <label htmlFor="newsletter-email" className="sr-only">
                  {t('footer.emailPlaceholder')}
                </label>
                <input
                  type="email"
                  id="newsletter-email"
                  placeholder={t('footer.emailPlaceholder')}
                  className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:border-primary-500"
                  aria-required="true"
                />
                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                >
                  {t('footer.subscribe')}
                </button>
              </div>
            </form>
            <div className="flex space-x-4 pt-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6" aria-hidden="true" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary-500 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-6 w-6" aria-hidden="true" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" aria-hidden="true" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary-500 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-6 w-6" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p>&copy; {new Date().getFullYear()} Dixis. {t('footer.rights')}</p>
            <nav aria-label={t('footer.legal')}>
              <ul className="flex space-x-6">
                <li>
                  <Link to="/privacy" className="hover:text-primary-500 transition-colors">
                    {t('footer.privacy')}
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-primary-500 transition-colors">
                    {t('footer.terms')}
                  </Link>
                </li>
                <li>
                  <Link to="/gdpr" className="hover:text-primary-500 transition-colors">
                    {t('footer.gdpr')}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;