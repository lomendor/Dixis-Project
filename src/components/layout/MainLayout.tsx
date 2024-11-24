import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';
import CookieConsent from '../gdpr/CookieConsent';
import { useTranslation } from 'react-i18next';
import SkipToContent from '../a11y/SkipToContent';

export default function MainLayout() {
  const { t } = useTranslation();
  const location = useLocation();

  // Get page metadata based on current route
  const getPageMetadata = () => {
    const path = location.pathname;
    const defaultTitle = 'Dixis - Αυθεντικά Ελληνικά Προϊόντα';
    const defaultDescription = t('meta.defaultDescription');

    const metadata = {
      '/': {
        title: defaultTitle,
        description: defaultDescription,
      },
      '/products': {
        title: `${t('nav.products')} | Dixis`,
        description: t('meta.productsDescription'),
      },
      '/producers': {
        title: `${t('nav.producers')} | Dixis`,
        description: t('meta.producersDescription'),
      },
    };

    return metadata[path] || { title: defaultTitle, description: defaultDescription };
  };

  const { title, description } = getPageMetadata();

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <link rel="canonical" href={`https://dixis.gr${location.pathname}`} />
      </Helmet>

      <SkipToContent />
      
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main id="main-content" className="flex-grow" role="main">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
        <Footer />
        <Toaster 
          position="top-right"
          toastOptions={{
            role: 'status',
            ariaLive: 'polite',
          }}
        />
        <CookieConsent />
      </div>
    </>
  );
}