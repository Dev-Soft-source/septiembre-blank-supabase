import React, { useState } from "react";
import { FilterItem } from "./FilterItem";
import { useTranslation } from "@/hooks/useTranslation";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface SimpleAffinityFilterProps {
  activeAffinities: string[];
  onChange: (value: string, isChecked: boolean) => void;
  title: string;
}

export function SimpleAffinityFilter({ 
  activeAffinities, 
  onChange,
  title
}: SimpleAffinityFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { t, language, isReady } = useTranslation('filters');

  // Direct query to affinities table with error handling
  const { data: affinities = [], isLoading, error } = useQuery({
    queryKey: ['affinities', language],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('themes')
          .select('name, category')
          .order('name');

        if (error) {
          console.error('Error fetching affinities:', error);
          return [];
        }

        // Static translations for affinities based on your existing translation files
        const translations: Record<string, Record<string, string>> = {
          'Art History & Movements': { en: 'Art History & Movements', es: 'Historia del Arte y Movimientos', pt: 'História da Arte e Movimentos', ro: 'Istoria Artei și Mișcări' },
          'Artists & Creativity': { en: 'Artists & Creativity', es: 'Artistas y Creatividad', pt: 'Artistas e Criatividade', ro: 'Artiști și Creativitate' },
          'Health & Wellness': { en: 'Health & Wellness', es: 'Salud y Bienestar', pt: 'Saúde e Bem-estar', ro: 'Sănătate și Bunăstare' },
          'Nature & Eco-Tourism': { en: 'Nature & Eco-Tourism', es: 'Naturaleza y Ecoturismo', pt: 'Natureza e Ecoturismo', ro: 'Natură și Eco-Turism' },
          'Sports & Fitness': { en: 'Sports & Fitness', es: 'Deportes y Fitness', pt: 'Esportes e Fitness', ro: 'Sport și Fitness' },
          'Wine & Gastronomy': { en: 'Wine & Gastronomy', es: 'Vino y Gastronomía', pt: 'Vinho e Gastronomia', ro: 'Vin și Gastronomie' },
          'Classical Music': { en: 'Classical Music', es: 'Música Clásica', pt: 'Música Clássica', ro: 'Muzică Clasică' },
          'Photography': { en: 'Photography', es: 'Fotografía', pt: 'Fotografia', ro: 'Fotografie' },
          'Local Culture Immersion': { en: 'Local Culture Immersion', es: 'Inmersión Cultural Local', pt: 'Imersão Cultural Local', ro: 'Imersiune în Cultura Locală' }
        };

        return data.map(item => {
          const translationMap = translations[item.name];
          const label = translationMap ? translationMap[language] || translationMap.en || item.name : item.name;
          
          return {
            value: item.name,
            label: label
          };
        }).sort((a, b) => a.label.localeCompare(b.label, language));
      } catch (error) {
        console.error('Failed to fetch affinities:', error);
        return [];
      }
    },
    enabled: isReady,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // Filter affinities based on search query
  const filteredAffinities = affinities.filter(affinity =>
    affinity.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContainerClick = (e: React.MouseEvent) => {
    // Allow events to bubble up for checkbox interactions
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleAffinitySelect = (affinityValue: string) => {
    console.log('🎭 SimpleAffinityFilter - Affinity select:', { affinityValue, activeAffinities });
    
    // Send the English theme name directly to the backend
    const isCurrentlySelected = activeAffinities.includes(affinityValue);
    console.log('🎭 Sending affinity name to onChange:', { affinityValue, willBeSelected: !isCurrentlySelected });
    onChange(affinityValue, !isCurrentlySelected);
  };

  // Get selected affinities display value
  const selectedDisplayValue = activeAffinities.length > 1 
    ? `${activeAffinities.length} selected`
    : activeAffinities.length === 1 
      ? affinities.find(a => a.value === activeAffinities[0])?.label || activeAffinities[0]
      : null;

  return (
    <FilterItem 
      title={title} 
      isOpen={isOpen} 
      onOpenChange={setIsOpen}
      selectedValue={selectedDisplayValue}
    >
      <div 
        className="bg-fuchsia-950/30 rounded-lg max-h-96 overflow-y-auto" 
        onClick={handleContainerClick}
      >
        {/* Search Input */}
        <div className="p-2 border-b border-fuchsia-800/30">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-fuchsia-300" />
            <input
              type="text"
              placeholder={t("filters.search")}
              value={searchQuery}
              onChange={handleSearchChange}
              onClick={handleSearchClick}
              className="w-full pl-8 pr-3 py-1.5 bg-fuchsia-900/30 border border-fuchsia-700/50 rounded-md text-sm text-white placeholder:text-fuchsia-300/70 focus:outline-none focus:border-fuchsia-500"
            />
          </div>
        </div>
        
        {/* Affinities List */}
        <div className="p-2 space-y-1">
          {isLoading ? (
            <div className="text-center py-4 text-fuchsia-300">{isReady ? t("filters.loading") : "Loading..."}</div>
          ) : error ? (
            <div className="text-center py-4 text-fuchsia-300">No hay afinidades disponibles</div>
          ) : filteredAffinities.length > 0 ? (
            filteredAffinities.map((affinity) => (
              <label
                key={affinity.value}
                className="flex items-center p-2 hover:bg-fuchsia-800/20 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={activeAffinities.includes(affinity.value)}
                  onChange={() => handleAffinitySelect(affinity.value)}
                  className="mr-2 rounded border-fuchsia-800/50 text-fuchsia-600 focus:ring-fuchsia-500/50 bg-fuchsia-950/50 h-4 w-4"
                />
                <span className="text-sm text-white">{affinity.label}</span>
              </label>
            ))
          ) : (
            <div className="text-center py-4 text-fuchsia-300">
              {searchQuery ? (isReady ? t("filters.noAffinitiesFound") : "No se encontraron afinidades") : (isReady ? t("filters.noAffinitiesAvailable") : "No hay afinidades disponibles")}
            </div>
          )}
        </div>
      </div>
    </FilterItem>
  );
}