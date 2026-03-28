
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { SquareFilter } from "./SquareFilter";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface ActivityFilterProps {
  activeActivities: string[];
  onChange: (value: string, isChecked: boolean) => void;
}

export function ActivityFilter({ activeActivities, onChange }: ActivityFilterProps) {
  const { t, language, isReady } = useTranslation('filters');

  // Query activities from database with error handling
  const { data: activities = [], isLoading, error } = useQuery({
    queryKey: ['activities', language],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('activities')
          .select('name_en, name_es, name_pt, name_ro')
          .order('name_en');

        if (error) {
          console.error('Error fetching activities:', error);
          return [];
        }

        return data.map(item => {
          let label: string;
          switch (language) {
            case 'es':
              label = item.name_es || item.name_en;
              break;
            case 'pt':
              label = item.name_pt || item.name_en;
              break;
            case 'ro':
              label = item.name_ro || item.name_en;
              break;
            default:
              label = item.name_en;
          }

          return {
            value: item.name_en, // Use English name as value for consistency
            label: label
          };
        }).sort((a, b) => a.label.localeCompare(b.label, language));
      } catch (error) {
        console.error('Failed to fetch activities:', error);
        return [];
      }
    },
    enabled: isReady,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // Show loading state
  if (!isReady || isLoading) {
    return (
      <SquareFilter
        title="ACTIVIDADES"
        options={[]}
        selectedOptions={activeActivities}
        onChange={onChange}
        loading={true}
      />
    );
  }

  // Show error state
  if (error) {
    return (
      <SquareFilter
        title={isReady ? t("filters.activities") : "ACTIVIDADES"}
        options={[]}
        selectedOptions={activeActivities}
        onChange={onChange}
        loading={false}
      />
    );
  }

  return (
    <SquareFilter
      title={t("filters.activities")}
      options={activities}
      selectedOptions={activeActivities}
      onChange={onChange}
      loading={false}
    />
  );
}
