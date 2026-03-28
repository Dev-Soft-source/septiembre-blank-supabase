import React from "react";
import { useTranslationWithFallback } from "@/hooks/useTranslationWithFallback";
import { useTranslation } from "@/hooks/useTranslation";

interface HotelCardAffinitiesProps {
  affinities: string[];
}

export const HotelCardAffinities: React.FC<HotelCardAffinitiesProps> = ({ affinities }) => {
  const { t } = useTranslationWithFallback();
  const { language } = useTranslation();

  const getTranslatedAffinity = (affinityName: string) => {
    const affinityTranslations: Record<string, Record<string, string>> = {
      'Performance Art': { en: 'Performance Art', es: 'Arte Escénico', pt: 'Arte Performática', ro: 'Artă Performativă' },
      'Personal Development & Growth': { en: 'Personal Development & Growth', es: 'Desarrollo Personal y Crecimiento', pt: 'Desenvolvimento Pessoal e Crescimento', ro: 'Dezvoltare Personală și Creștere' },
      'Beverages & Tastings': { en: 'Beverages & Tastings', es: 'Bebidas y Degustaciones', pt: 'Bebidas e Degustações', ro: 'Băuturi și Degustări' },
      'Gourmet Experiences': { en: 'Gourmet Experiences', es: 'Experiencias Gourmet', pt: 'Experiências Gourmet', ro: 'Experiențe Gourmet' }
    };

    const translation = affinityTranslations[affinityName];
    return translation?.[language] || affinityName;
  };

  return (
    <div className="mb-3 text-center min-h-[50px] flex flex-col justify-center">
      {affinities.length > 0 ? (
        <>
          <p className="text-xs text-white/90 mb-2 font-medium uppercase">
            {t('hotels.perfectForLovers', 'PERFECT FOR LOVERS OF:')}
          </p>
          <div className="flex flex-wrap justify-center gap-1">
            {affinities.map((affinity, index) => (
              <span
                key={`affinity-${index}`}
                className="bg-purple-600/60 text-xs px-2 py-1 rounded-full text-white border border-purple-400/30"
              >
                {getTranslatedAffinity(affinity)}
              </span>
            ))}
          </div>
        </>
      ) : (
        <div className="h-full"></div>
      )}
    </div>
  );
};