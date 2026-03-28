
import { useState, useEffect } from "react";
import { Theme } from "@/utils/themes";
import { ThemeButton } from "./ThemeButton";
import { useTranslation } from "@/hooks/useTranslation";

interface AlphabeticalThemeListProps {
  activeTheme: Theme | null;
  onChange: (value: Theme) => void;
  themeQuery: string;
}

export function AlphabeticalThemeList({ 
  activeTheme, 
  onChange, 
  themeQuery 
}: AlphabeticalThemeListProps) {
  const { t } = useTranslation('filters');
  
  // These are the affinity categories with their translation keys from backup
  const affinityCategories = [
    { key: "Amistad y Socialización", translationKey: "Amistad y Socialización" },
    { key: "Antigüedades y Coleccionables", translationKey: "Antigüedades y Coleccionables" },
    { key: "Aprendizaje Académico", translationKey: "Aprendizaje Académico" },
    { key: "Arquitectura y Diseño", translationKey: "Arquitectura y Diseño" },
    { key: "Artistas y Creatividad", translationKey: "Artistas y Creatividad" },
    { key: "Astronomía", translationKey: "Astronomía" },
    { key: "Beaches & Coastlines", translationKey: "Beaches & Coastlines" },
    { key: "Beer & Brewing Culture", translationKey: "Beer & Brewing Culture" },
    { key: "Beverages & Tastings", translationKey: "Beverages & Tastings" },
    { key: "Biology", translationKey: "Biology" },
    { key: "Board Games & Strategy", translationKey: "Board Games & Strategy" },
    { key: "Botanical Interest", translationKey: "Botanical Interest" },
    { key: "Business Innovation", translationKey: "Business Innovation" },
    { key: "Ceramics & Pottery", translationKey: "Ceramics & Pottery" },
    { key: "Chemistry", translationKey: "Chemistry" },
    { key: "Chinese Culture & Language", translationKey: "Chinese Culture & Language" },
    { key: "Cine y Apreciación Cinematográfica", translationKey: "Cine y Apreciación Cinematográfica" },
    { key: "Collecting & Games", translationKey: "Collecting & Games" },
    { key: "Conferences & Seminars", translationKey: "Conferences & Seminars" },
    { key: "Confidence Building", translationKey: "Confidence Building" },
    { key: "Contemporary & Pop Music", translationKey: "Contemporary & Pop Music" },
    { key: "Courses & Workshops", translationKey: "Courses & Workshops" },
    { key: "Desserts & Sweets Culture", translationKey: "Desserts & Sweets Culture" },
    { key: "Engineering & Technology", translationKey: "Engineering & Technology" },
    { key: "English Language & Culture", translationKey: "English Language & Culture" },
    { key: "Finance & Investment", translationKey: "Finance & Investment" },
    { key: "Folk & Traditional Music", translationKey: "Folk & Traditional Music" },
    { key: "Forests & Greenery", translationKey: "Forests & Greenery" },
    { key: "Fotografía", translationKey: "Fotografía" },
    { key: "French Cuisine & Gastronomy", translationKey: "French Cuisine & Gastronomy" },
    { key: "Gardening & Horticulture", translationKey: "Gardening & Horticulture" },
    { key: "Gourmet Experiences", translationKey: "Gourmet Experiences" },
    { key: "Historia del Arte y Movimientos", translationKey: "Historia del Arte y Movimientos" },
    { key: "Holistic Therapies", translationKey: "Holistic Therapies" },
    { key: "Illustration & Comics", translationKey: "Illustration & Comics" },
    { key: "Innovation & Future Trends", translationKey: "Innovation & Future Trends" },
    { key: "Inteligencia Artificial", translationKey: "Inteligencia Artificial" },
    { key: "Italian Cuisine & Pasta Culture", translationKey: "Italian Cuisine & Pasta Culture" },
    { key: "Jazz & Blues", translationKey: "Jazz & Blues" },
    { key: "Language Exchange", translationKey: "Language Exchange" },
    { key: "Latin Music", translationKey: "Latin Music" },
    { key: "Leadership & Strategy", translationKey: "Leadership & Strategy" },
    { key: "Live Entertainment", translationKey: "Live Entertainment" },
    { key: "Marine Life & Oceans", translationKey: "Marine Life & Oceans" },
    { key: "Marketing & Branding", translationKey: "Marketing & Branding" },
    { key: "Mathematics", translationKey: "Mathematics" },
    { key: "Media & Digital Culture", translationKey: "Media & Digital Culture" },
    { key: "Meditation & Mindfulness", translationKey: "Meditation & Mindfulness" },
    { key: "Mediterranean Cuisine", translationKey: "Mediterranean Cuisine" },
    { key: "Mental Skills Development", translationKey: "Mental Skills Development" },
    { key: "Mountains & Scenic Views", translationKey: "Mountains & Scenic Views" },
    { key: "Music Appreciation & History", translationKey: "Music Appreciation & History" },
    { key: "Música Clásica", translationKey: "Música Clásica" },
    { key: "Musical Icons", translationKey: "Musical Icons" },
    { key: "Natural Environments", translationKey: "Natural Environments" },
    { key: "Nomadismo Digital", translationKey: "Nomadismo Digital" },
    { key: "Nutrition & Wellness", translationKey: "Nutrition & Wellness" },
    { key: "Opera & Vocal Arts", translationKey: "Opera & Vocal Arts" },
    { key: "Painting & Fine Arts", translationKey: "Painting & Fine Arts" },
    { key: "Performance Art", translationKey: "Performance Art" },
    { key: "Personal Development & Growth", translationKey: "Personal Development & Growth" },
    { key: "Philosophy", translationKey: "Philosophy" },
    { key: "Photography", translationKey: "Photography" },
    { key: "Psychology & Human Behavior", translationKey: "Psychology & Human Behavior" },
    { key: "Public Speaking", translationKey: "Public Speaking" }
  ];
  
  // Filter affinities based on search query
  const [filteredAffinities, setFilteredAffinities] = useState(affinityCategories);
  
  useEffect(() => {
    if (!themeQuery) {
      setFilteredAffinities(affinityCategories);
      return;
    }
    
    const query = themeQuery.toLowerCase();
    const filtered = affinityCategories.filter(
      affinity => affinity.key.toLowerCase().includes(query)
    );
    
    setFilteredAffinities(filtered);
  }, [themeQuery, t]);
  
  // Handle theme selection
  const handleThemeClick = (affinity: typeof affinityCategories[0]) => {
    const themeData = {
      id: affinity.key.toLowerCase(), 
      name: affinity.key,
      category: "GENERAL" as const,
      level: 1 as const
    };
    onChange(themeData);
  };
  
  if (filteredAffinities.length === 0) {
    return (
      <div className="text-center py-2 text-sm text-fuchsia-300">
        No affinities match your search
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 gap-1 mt-2">
      {filteredAffinities.map(affinity => (
        <ThemeButton
          key={affinity.key}
          theme={{ 
            id: affinity.key.toLowerCase(), 
            name: affinity.key, 
            category: "GENERAL" as const,
            level: 1 as const
          }}
          isActive={activeTheme?.name === affinity.key}
          onClick={() => handleThemeClick(affinity)}
        />
      ))}
    </div>
  );
}
