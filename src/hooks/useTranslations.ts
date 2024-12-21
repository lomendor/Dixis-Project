import { useTranslation } from 'react-i18next';

export const usePageTranslations = (namespace: string) => {
  const { t, i18n } = useTranslation(namespace, {
    useSuspense: false,
  });

  return { t, i18n };
}; 