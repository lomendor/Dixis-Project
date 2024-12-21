import React from 'react';
import { useTranslation } from 'react-i18next';

const Producers: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('producers.title')}</h1>
      {/* Producers list will go here */}
    </div>
  );
};

export default Producers;