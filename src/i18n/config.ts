import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { format as formatDate, formatRelative, formatDistance } from 'date-fns';
import { el, enUS } from 'date-fns/locale';

const dateLocales = {
  el,
  en: enUS,
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'el',
    supportedLngs: ['el', 'en'],
    defaultNS: 'common',
    ns: ['common'],
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
      format: (value, format, lng) => {
        if (value instanceof Date) {
          const locale = dateLocales[lng] || dateLocales.el;
          
          switch (format) {
            case 'relative':
              return formatRelative(value, new Date(), { locale });
            case 'distance':
              return formatDistance(value, new Date(), { locale, addSuffix: true });
            default:
              return formatDate(value, format || 'PPP', { locale });
          }
        }
        
        if (format === 'number') {
          return new Intl.NumberFormat(lng).format(value);
        }
        
        if (format === 'currency') {
          return new Intl.NumberFormat(lng, {
            style: 'currency',
            currency: 'EUR',
          }).format(value);
        }
        
        return value;
      },
    },
  });

export default i18n;