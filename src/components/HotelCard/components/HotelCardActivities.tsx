import React from "react";
import { useTranslationWithFallback } from "@/hooks/useTranslationWithFallback";
import { useTranslation } from "@/hooks/useTranslation";

interface HotelCardActivitiesProps {
  activities: string[];
}

export const HotelCardActivities: React.FC<HotelCardActivitiesProps> = ({ activities }) => {
  const { t } = useTranslationWithFallback();
  const { language } = useTranslation();

  const getTranslatedActivity = (activityName: string) => {
    const activityTranslations: Record<string, Record<string, string>> = {
      'Taller Pintura': { en: 'Painting Workshop', es: 'Taller Pintura', pt: 'Oficina de Pintura', ro: 'Atelier de Pictură' },
      'Torneo Ajedrez': { en: 'Chess Tournament', es: 'Torneo Ajedrez', pt: 'Torneio de Xadrez', ro: 'Turneu de Șah' },
      'Trivia Quiz': { en: 'Trivia Quiz', es: 'Trivia Quiz', pt: 'Quiz de Trivia', ro: 'Quiz Trivia' },
      'Crecimiento Personal': { en: 'Personal Growth', es: 'Crecimiento Personal', pt: 'Crescimento Pessoal', ro: 'Dezvoltare Personală' },
      'Degustación Gourmet': { en: 'Gourmet Tasting', es: 'Degustación Gourmet', pt: 'Degustação Gourmet', ro: 'Degustare Gourmet' },
      'Espectáculo Comedia': { en: 'Comedy Show', es: 'Espectáculo Comedia', pt: 'Show de Comédia', ro: 'Spectacol de Comedie' }
    };

    const translation = activityTranslations[activityName];
    return translation?.[language] || activityName;
  };

  return (
    <div className="mb-3 text-center min-h-[50px] flex flex-col justify-center">
      {activities.length > 0 ? (
        <>
          <p className="text-xs text-white/90 mb-2 font-medium uppercase">
            {t('hotels.idealForActivities', 'IDEAL FOR THESE ACTIVITIES:')}
          </p>
          <div className="flex flex-wrap justify-center gap-1">
            {activities.map((activity, index) => (
              <span
                key={`activity-${index}`}
                className="text-xs px-2 py-1 rounded-full text-white border border-green-400/30"
                style={{ backgroundColor: '#68178D' }}
              >
                {getTranslatedActivity(activity)}
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