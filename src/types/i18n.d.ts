import 'react-i18next';

// Ορισμός τύπων για τις μεταφράσεις
declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof import('../public/locales/el/common.json');
      footer: typeof import('../public/locales/el/footer.json');
      navigation: typeof import('../public/locales/el/navigation.json');
    };
  }
} 