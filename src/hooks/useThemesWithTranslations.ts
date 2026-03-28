
import { useTranslation } from "@/hooks/useTranslation";
import { useThemesWithTranslationsEN } from "./useThemesWithTranslations.en";
import { useThemesWithTranslationsES } from "./useThemesWithTranslations.es";
import { useThemesWithTranslationsPT } from "./useThemesWithTranslations.pt";
import { useThemesWithTranslationsRO } from "./useThemesWithTranslations.ro";

export const useThemesWithTranslations = () => {
  const { language } = useTranslation();
  
  if (language === 'en') return useThemesWithTranslationsEN();
  if (language === 'es') return useThemesWithTranslationsES();
  if (language === 'pt') return useThemesWithTranslationsPT();
  if (language === 'ro') return useThemesWithTranslationsRO();
  
  // Default fallback to English
  return useThemesWithTranslationsEN();
};
