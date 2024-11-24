import React from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export default function CookieConsent() {
  const [cookieConsent, setCookieConsent] = useLocalStorage('cookie-consent', false);
  const [showBanner, setShowBanner] = React.useState(!cookieConsent);

  if (!showBanner) return null;

  const handleAccept = () => {
    setCookieConsent(true);
    setShowBanner(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600">
          <p>
            Χρησιμοποιούμε cookies για να βελτιώσουμε την εμπειρία σας στην ιστοσελίδα μας.
            Διαβάστε την{' '}
            <a href="/privacy" className="text-blue-600 hover:text-blue-800">
              Πολιτική Απορρήτου
            </a>{' '}
            μας για περισσότερες πληροφορίες.
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleAccept}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Αποδοχή
          </button>
          <a
            href="/privacy"
            className="text-gray-600 hover:text-gray-800 px-6 py-2"
          >
            Περισσότερα
          </a>
        </div>
      </div>
    </div>
  );
}