import React from 'react';
import { useTranslation } from 'react-i18next';

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('about.title')}</h1>
      <div className="prose max-w-none">
        {/* About content will go here */}
      </div>
    </div>
  );
};

export default About;