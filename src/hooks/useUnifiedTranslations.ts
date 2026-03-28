import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/hooks/useTranslation';

interface UnifiedTranslation {
  value: string;
  label: string;
}

interface FilterValueMapping {
  id: string;
  category: string;
  english_value: string;
  spanish_value: string;
  portuguese_value: string;
  romanian_value: string;
  is_active: boolean;
}

/**
 * Unified hook for all dynamic category translations
 * Combines database translations with fallback to frontend i18n
 * No raw keys or Spanish-based identifiers exposed to users
 * Includes alphabetical sorting per language
 */
export function useUnifiedTranslations(category: 'hotel_features' | 'room_features' | 'property_styles' | 'meal_plans' | 'room_types') {
  const { language } = useTranslation();
  
  return useQuery({
    queryKey: ['unified-translations', category, language],
    queryFn: async (): Promise<UnifiedTranslation[]> => {
      console.log(`📡 Making API call for ${category} translations`);
      
      const { data, error } = await supabase
        .from('filter_value_mappings')
        .select('*')
        .eq('category', category)
        .eq('is_active', true);

      if (error) {
        console.error(`❌ Error fetching ${category} translations:`, error);
        return [];
      }

      const translatedItems = (data as FilterValueMapping[]).map(item => {
        let label: string;
        
        // Get translation based on current language
        switch (language) {
          case 'es':
            label = item.spanish_value || item.english_value;
            break;
          case 'pt':
            label = item.portuguese_value || item.english_value;
            break;
          case 'ro':
            label = item.romanian_value || item.english_value;
            break;
          default:
            label = item.english_value;
        }

        // Create English-based key from the English value
        const englishKey = item.english_value
          .toLowerCase()
          .replace(/[^a-zA-Z0-9\s]/g, '')
          .replace(/\s+/g, '_')
          .replace(/^_+|_+$/g, '');

        return {
          value: englishKey, // English-based identifier
          label: label // Translated display text
        };
      });

      // Sort alphabetically by label in the current language
      const sortedItems = translatedItems.sort((a, b) => 
        a.label.localeCompare(b.label, language, { sensitivity: 'base' })
      );

      return sortedItems;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * Unified hook for activities with translation support
 * Activities are stored in Spanish in the database, need conversion to English keys
 */
export function useUnifiedActivities() {
  const { language } = useTranslation();
  
  return useQuery({
    queryKey: ['unified-activities', language],
    queryFn: async (): Promise<UnifiedTranslation[]> => {
      const { data, error } = await supabase
        .from('activities')
        .select('name_en as value')
        .order('name_en');

      if (error) {
        console.error('Error fetching activities:', error);
        return [];
      }

      // Activity translations mapping (Spanish DB -> English key -> 4 languages)
      const activityTranslations: Record<string, Record<string, string>> = {
        'Baile Bachata': {
          en: 'Bachata Dancing',
          es: 'Baile Bachata',
          pt: 'Dança Bachata',
          ro: 'Dans Bachata'
        },
        'Baile Clásico': {
          en: 'Classical Dancing',
          es: 'Baile Clásico', 
          pt: 'Dança Clássica',
          ro: 'Dans Clasic'
        },
        'Yoga Relax': {
          en: 'Relaxing Yoga',
          es: 'Yoga Relax',
          pt: 'Yoga Relaxante',
          ro: 'Yoga Relaxant'
        },
        'Taller Cocina Española': {
          en: 'Spanish Cooking Workshop',
          es: 'Taller Cocina Española',
          pt: 'Oficina de Culinária Espanhola',
          ro: 'Atelier de Gătit Spaniol'
        },
        'Senderismo': {
          en: 'Hiking',
          es: 'Senderismo',
          pt: 'Trilha',
          ro: 'Drumeție'
        },
        'Spa & Masaje': {
          en: 'Spa & Massage',
          es: 'Spa & Masaje',
          pt: 'Spa & Massagem', 
          ro: 'Spa & Masaj'
        },
        'Cata de Vinos': {
          en: 'Wine Tasting',
          es: 'Cata de Vinos',
          pt: 'Degustação de Vinhos',
          ro: 'Degustare de Vinuri'
        },
        'Fitness': {
          en: 'Fitness',
          es: 'Fitness',
          pt: 'Fitness',
          ro: 'Fitness'
        },
        'Meditación': {
          en: 'Meditation',
          es: 'Meditación',
          pt: 'Meditação',
          ro: 'Meditație'
        },
        'Música en Vivo': {
          en: 'Live Music',
          es: 'Música en Vivo',
          pt: 'Música ao Vivo',
          ro: 'Muzică Live'
        }
      };

      // Sort alphabetically by label in the current language  
      const sortedData = data.map(item => {
        const spanishValue = item.value;
        const translations = activityTranslations[spanishValue];
        
        if (translations) {
          const englishKey = translations.en
            .toLowerCase()
            .replace(/[^a-zA-Z0-9\s]/g, '')
            .replace(/\s+/g, '_');
            
          const currentLang = language as keyof typeof translations;
          const label = translations[currentLang] || translations.en || spanishValue;
          
          return {
            value: englishKey,
            label: label
          };
        }

        // Fallback: convert Spanish to English key and use as-is for display
        const englishKey = spanishValue
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove accents
          .replace(/[^a-zA-Z0-9\s]/g, '')
          .replace(/\s+/g, '_');

        return {
          value: englishKey,
          label: spanishValue // Keep original until proper translation is added
        };
      }).sort((a, b) => 
        a.label.localeCompare(b.label, language, { sensitivity: 'base' })
      );

      return sortedData;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

/**
 * Unified hook for affinities/themes with translation support
 * Includes comprehensive translations and alphabetical sorting per language
 */
export function useUnifiedAffinities() {
  const { language } = useTranslation();
  
  return useQuery({
    queryKey: ['unified-affinities', language],
    queryFn: async (): Promise<UnifiedTranslation[]> => {
      const { data, error } = await supabase
        .from('affinities')
        .select('name_en as value')
        .order('name_en');

      if (error) {
        console.error('Error fetching affinities:', error);
        return [];
      }

      // Comprehensive translations for affinities - all categories covered
      const affinityTranslations: Record<string, Record<string, string>> = {
        'Academic Learning': {
          en: 'Academic Learning',
          es: 'Aprendizaje Académico',
          pt: 'Aprendizagem Acadêmica',
          ro: 'Învățare Academică'
        },
        'Antiques & Collectibles': {
          en: 'Antiques & Collectibles',
          es: 'Antigüedades y Coleccionables',
          pt: 'Antiguidades e Colecionáveis',
          ro: 'Antichități și Obiecte de Colecție'
        },
        'Architecture & Design': {
          en: 'Architecture & Design',
          es: 'Arquitectura y Diseño',
          pt: 'Arquitetura e Design',
          ro: 'Arhitectură și Design'
        },
        'Art History & Movements': {
          en: 'Art History & Movements',
          es: 'Historia del Arte y Movimientos',
          pt: 'História da Arte e Movimentos',
          ro: 'Istoria Artei și Mișcări'
        },
        'Artificial Intelligence': {
          en: 'Artificial Intelligence',
          es: 'Inteligencia Artificial',
          pt: 'Inteligência Artificial',
          ro: 'Inteligență Artificială'
        },
        'Artists & Creativity': {
          en: 'Artists & Creativity',
          es: 'Artistas y Creatividad',
          pt: 'Artistas e Criatividade',
          ro: 'Artiști și Creativitate'
        },
        'Astronomy': {
          en: 'Astronomy',
          es: 'Astronomía',
          pt: 'Astronomia',
          ro: 'Astronomie'
        },
        'Cinema & Film Appreciation': {
          en: 'Cinema & Film Appreciation',
          es: 'Cine y Apreciación Cinematográfica',
          pt: 'Cinema e Apreciação Cinematográfica',
          ro: 'Cinema și Aprecierea Filmului'
        },
        'Classical Music': {
          en: 'Classical Music',
          es: 'Música Clásica',
          pt: 'Música Clássica',
          ro: 'Muzică Clasică'
        },
        'Digital Nomadism': {
          en: 'Digital Nomadism',
          es: 'Nomadismo Digital',
          pt: 'Nomadismo Digital',
          ro: 'Nomadism Digital'
        },
        'Friendship & Socializing': {
          en: 'Friendship & Socializing',
          es: 'Amistad y Socialización',
          pt: 'Amizade e Socialização',
          ro: 'Prietenie și Socializare'
        },
        'Gourmet Cuisine': {
          en: 'Gourmet Cuisine',
          es: 'Cocina Gourmet',
          pt: 'Culinária Gourmet',
          ro: 'Bucătărie Gourmet'
        },
        'Health & Wellness': {
          en: 'Health & Wellness',
          es: 'Salud y Bienestar',
          pt: 'Saúde e Bem-estar',
          ro: 'Sănătate și Bunăstare'
        },
        'Local Culture Immersion': {
          en: 'Local Culture Immersion',
          es: 'Inmersión Cultural Local',
          pt: 'Imersão Cultural Local',
          ro: 'Imersiune în Cultura Locală'
        },
        'Mindfulness & Meditation': {
          en: 'Mindfulness & Meditation',
          es: 'Atención Plena y Meditación',
          pt: 'Atenção Plena e Meditação',
          ro: 'Atenție și Meditație'
        },
        'Nature & Eco-Tourism': {
          en: 'Nature & Eco-Tourism',
          es: 'Naturaleza y Ecoturismo',
          pt: 'Natureza e Ecoturismo',
          ro: 'Natură și Eco-Turism'
        },
        'Photography': {
          en: 'Photography',
          es: 'Fotografía',
          pt: 'Fotografia',
          ro: 'Fotografie'
        },
        'Sports & Fitness': {
          en: 'Sports & Fitness',
          es: 'Deportes y Fitness',
          pt: 'Esportes e Fitness',
          ro: 'Sport și Fitness'
        },
        'Wine & Gastronomy': {
          en: 'Wine & Gastronomy',
          es: 'Vino y Gastronomía',
          pt: 'Vinho e Gastronomia',
          ro: 'Vin și Gastronomie'
        }
      };

      // Process and translate each affinity
      const translatedAffinities = data.map(item => {
        const translations = affinityTranslations[item.value];
        const currentLang = language as keyof typeof translations;
        const label = translations?.[currentLang] || item.value;

        return {
          value: item.value, // Use original database value for filtering
          label: label
        };
      });

      // Sort alphabetically by label in the current language
      const sortedAffinities = translatedAffinities.sort((a, b) => 
        a.label.localeCompare(b.label, language, { sensitivity: 'base' })
      );

      return sortedAffinities;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}