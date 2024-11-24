import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'el', name: 'Ελληνικά' },
    { code: 'en', name: 'English' },
  ];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    document.documentElement.lang = languageCode;
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language);

  return (
    <div className="relative group">
      <button 
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        aria-label="Select language"
        aria-expanded="false"
        aria-haspopup="listbox"
      >
        <Globe className="h-5 w-5" aria-hidden="true" />
        <span className="hidden md:inline">
          {currentLanguage?.name}
        </span>
      </button>
      
      <div 
        className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
        role="listbox"
        aria-label="Language selection"
      >
        <div className="py-1">
          {languages.map(language => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`block w-full text-left px-4 py-2 text-sm ${
                i18n.language === language.code
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              role="option"
              aria-selected={i18n.language === language.code}
            >
              {language.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}