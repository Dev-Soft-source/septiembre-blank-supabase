import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface HotelContentTranslations {
  ideal_guests?: string;
  atmosphere?: string; 
  perfect_location?: string;
  description?: string;
}

interface TranslatedHotelContent {
  ideal_guests: string;
  atmosphere: string;
  perfect_location: string; 
  description: string;
}

/**
 * Hook to automatically translate hotel content fields
 * Uses browser translation or fallback to original content
 */
export function useHotelContentTranslation(hotelContent: HotelContentTranslations): TranslatedHotelContent {
  const { language } = useTranslation();
  const [translatedContent, setTranslatedContent] = useState<TranslatedHotelContent>({
    ideal_guests: hotelContent.ideal_guests || '',
    atmosphere: hotelContent.atmosphere || '',
    perfect_location: hotelContent.perfect_location || '', 
    description: hotelContent.description || ''
  });

  // Static translations for common hotel content patterns
  const getStaticTranslations = (text: string, targetLanguage: string): string => {
    if (!text) return '';
    
    const translations: Record<string, Record<string, string>> = {
      // Common hotel atmosphere descriptions
      'Wilderness Lodge atmosphere with authentic Alaska character': {
        es: 'Ambiente de Lodge de Naturaleza con auténtico carácter de Alaska',
        pt: 'Ambiente de Lodge Selvagem com caráter autêntico do Alasca', 
        ro: 'Atmosferă de Lodge Sălbatic cu caracter autentic Alaska'
      },
      'Perfect for travelers seeking wildlife and nature and unique natural phenomena experiences': {
        es: 'Perfecto para viajeros que buscan vida silvestre, naturaleza y experiencias únicas de fenómenos naturales',
        pt: 'Perfeito para viajantes que procuram vida selvagem, natureza e experiências únicas de fenômenos naturais',
        ro: 'Perfect pentru călătorii care caută viața sălbatică, natura și experiențe unice ale fenomenelor naturale'
      },
      'Strategic location in Anchorage, Alaska': {
        es: 'Ubicación estratégica en Anchorage, Alaska',
        pt: 'Localização estratégica em Anchorage, Alasca',
        ro: 'Locație strategică în Anchorage, Alaska'
      },
      'Alaska-themed hotel with mountain views. Perfect base for exploring Alaska\'s wilderness and experiencing the midnight sun.': {
        es: 'Hotel temático de Alaska con vistas a las montañas. Base perfecta para explorar la naturaleza salvaje de Alaska y experimentar el sol de medianoche.',
        pt: 'Hotel temático do Alasca com vista para as montanhas. Base perfeita para explorar a natureza selvagem do Alasca e experimentar o sol da meia-noite.',
        ro: 'Hotel cu temă Alaska cu vedere la munți. Bază perfectă pentru a explora sălbăticia Alaska și pentru a experimenta soarele de la miezul nopții.'
      }
    };

    // Check if we have a direct translation
    if (translations[text] && translations[text][targetLanguage]) {
      return translations[text][targetLanguage];
    }

    // Pattern-based translations for dynamic content
    const patterns = [
      {
        pattern: /^(.+)-themed hotel with (.+)\. Perfect base for (.+)\.$/i,
        translations: {
          es: (matches: RegExpMatchArray) => `Hotel temático de ${matches[1]} con ${matches[2]}. Base perfecta para ${matches[3]}.`,
          pt: (matches: RegExpMatchArray) => `Hotel temático de ${matches[1]} com ${matches[2]}. Base perfeita para ${matches[3]}.`,
          ro: (matches: RegExpMatchArray) => `Hotel cu temă ${matches[1]} cu ${matches[2]}. Bază perfectă pentru ${matches[3]}.`
        }
      },
      {
        pattern: /^(.+) atmosphere with (.+)$/i,
        translations: {
          es: (matches: RegExpMatchArray) => `Ambiente ${matches[1]} con ${matches[2]}`,
          pt: (matches: RegExpMatchArray) => `Ambiente ${matches[1]} com ${matches[2]}`,
          ro: (matches: RegExpMatchArray) => `Atmosferă ${matches[1]} cu ${matches[2]}`
        }
      },
      {
        pattern: /^Perfect for (.+)$/i,
        translations: {
          es: (matches: RegExpMatchArray) => `Perfecto para ${matches[1]}`,
          pt: (matches: RegExpMatchArray) => `Perfeito para ${matches[1]}`,
          ro: (matches: RegExpMatchArray) => `Perfect pentru ${matches[1]}`
        }
      },
      {
        pattern: /^Strategic location in (.+)$/i,
        translations: {
          es: (matches: RegExpMatchArray) => `Ubicación estratégica en ${matches[1]}`,
          pt: (matches: RegExpMatchArray) => `Localização estratégica em ${matches[1]}`,
          ro: (matches: RegExpMatchArray) => `Locație strategică în ${matches[1]}`
        }
      }
    ];

    // Try pattern-based translations
    for (const { pattern, translations: patternTranslations } of patterns) {
      const matches = text.match(pattern);
      if (matches && patternTranslations[targetLanguage as keyof typeof patternTranslations]) {
        const translateFn = patternTranslations[targetLanguage as keyof typeof patternTranslations] as (matches: RegExpMatchArray) => string;
        return translateFn(matches);
      }
    }

    // Basic word replacements for common terms
    if (targetLanguage === 'es') {
      return text
        .replace(/\bhotel\b/gi, 'hotel')
        .replace(/\bwith\b/gi, 'con')
        .replace(/\bperfect\b/gi, 'perfecto')
        .replace(/\bfor\b/gi, 'para')
        .replace(/\batmosphere\b/gi, 'ambiente')
        .replace(/\blocation\b/gi, 'ubicación')
        .replace(/\bstrategic\b/gi, 'estratégica')
        .replace(/\bmountain\b/gi, 'montaña')
        .replace(/\bviews\b/gi, 'vistas')
        .replace(/\bbase\b/gi, 'base')
        .replace(/\bexploring\b/gi, 'explorar')
        .replace(/\bwilderness\b/gi, 'naturaleza salvaje')
        .replace(/\bexperiencing\b/gi, 'experimentar');
    } else if (targetLanguage === 'pt') {
      return text
        .replace(/\bhotel\b/gi, 'hotel')
        .replace(/\bwith\b/gi, 'com')
        .replace(/\bperfect\b/gi, 'perfeito')
        .replace(/\bfor\b/gi, 'para')
        .replace(/\batmosphere\b/gi, 'ambiente')
        .replace(/\blocation\b/gi, 'localização')
        .replace(/\bstrategic\b/gi, 'estratégica')
        .replace(/\bmountain\b/gi, 'montanha')
        .replace(/\bviews\b/gi, 'vistas')
        .replace(/\bbase\b/gi, 'base')
        .replace(/\bexploring\b/gi, 'explorar')
        .replace(/\bwilderness\b/gi, 'natureza selvagem')
        .replace(/\bexperiencing\b/gi, 'experimentar');
    } else if (targetLanguage === 'ro') {
      return text
        .replace(/\bhotel\b/gi, 'hotel')
        .replace(/\bwith\b/gi, 'cu')
        .replace(/\bperfect\b/gi, 'perfect')
        .replace(/\bfor\b/gi, 'pentru')
        .replace(/\batmosphere\b/gi, 'atmosferă')
        .replace(/\blocation\b/gi, 'locație')
        .replace(/\bstrategic\b/gi, 'strategică')
        .replace(/\bmountain\b/gi, 'munte')
        .replace(/\bviews\b/gi, 'vedere')
        .replace(/\bbase\b/gi, 'bază')
        .replace(/\bexploring\b/gi, 'a explora')
        .replace(/\bwilderness\b/gi, 'sălbăticia')
        .replace(/\bexperiencing\b/gi, 'a experimenta');
    }

    return text; // Return original if no translation found
  };

  useEffect(() => {
    if (language === 'en') {
      // For English, use original content
      setTranslatedContent({
        ideal_guests: hotelContent.ideal_guests || '',
        atmosphere: hotelContent.atmosphere || '',
        perfect_location: hotelContent.perfect_location || '',
        description: hotelContent.description || ''
      });
      return;
    }

    // For other languages, apply translations
    setTranslatedContent({
      ideal_guests: getStaticTranslations(hotelContent.ideal_guests || '', language),
      atmosphere: getStaticTranslations(hotelContent.atmosphere || '', language),
      perfect_location: getStaticTranslations(hotelContent.perfect_location || '', language),
      description: getStaticTranslations(hotelContent.description || '', language)
    });
  }, [hotelContent.ideal_guests,     // This way React only reruns when one of the actual values changes, not when a new object reference is created.
      hotelContent.atmosphere,       //
      hotelContent.perfect_location, //
      hotelContent.description,      //
      language]);
    
  return translatedContent;
}