import { useConsultantStore } from '@/store/consultantStore';
import { en } from './en';
import { it } from './it';

const dictionaries = {
  en,
  it,
};

type Dictionary = typeof en;

// Utility to get nested object property by string path
function getNestedValue(obj: any, path: string): string | undefined {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export function useTranslation() {
  const language = useConsultantStore((state) => state.language) || 'en';
  const dictionary = dictionaries[language] as Dictionary;

  const t = (key: string, params?: Record<string, string | number>): string => {
    let value = getNestedValue(dictionary, key);
    if (typeof value === 'string' && params) {
      Object.entries(params).forEach(([k, v]) => {
        value = (value as string).replace(new RegExp(`{{${k}}}`, 'g'), String(v));
      });
    }
    return (value as string) || key; // Fallback to key if translation is missing
  };

  return { t, language };
}
