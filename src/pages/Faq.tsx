import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const Faq: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-12">
      <Helmet>
        <title>{t('faq.title')} - Dixis</title>
      </Helmet>
      <h1 className="text-3xl font-bold mb-8">{t('faq.title')}</h1>
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-bold mb-4">{t('faq.question1')}</h2>
          <p>{t('faq.answer1')}</p>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">{t('faq.question2')}</h2>
          <p>{t('faq.answer2')}</p>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">{t('faq.question3')}</h2>
          <p>{t('faq.answer3')}</p>
        </div>
      </div>
    </div>
  );
};

export default Faq; 