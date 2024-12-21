import React from 'react';
import { useTranslation } from 'react-i18next';

const Auth: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('auth.title')}</h1>
      {/* Auth form will go here */}
    </div>
  );
};

export default Auth;