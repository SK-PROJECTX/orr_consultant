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

  const t = (key: string): string => {
    const value = getNestedValue(dictionary, key);
    return value || key; // Fallback to key if translation is missing
  };

  return { t, language };
}
