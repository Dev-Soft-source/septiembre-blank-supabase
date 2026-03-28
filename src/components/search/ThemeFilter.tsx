
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { SimpleAffinityFilter } from "./SimpleAffinityFilter";
import { Theme } from "@/utils/themes";

interface ThemeFilterProps {
  activeTheme: string[] | null;
  onChange: (value: string, isChecked: boolean) => void;
}

export function ThemeFilter({ activeTheme, onChange }: ThemeFilterProps) {
  const { t } = useTranslation('filters');

  const handleAffinityChange = (value: string, isChecked: boolean) => {
    onChange(value, isChecked);
  };

  // Safely convert activeTheme to string array, handling null and non-array cases
  const activeAffinityNames = React.useMemo(() => {
    if (!activeTheme) return [];
    if (Array.isArray(activeTheme)) {
      return activeTheme;
    }
    return [];
  }, [activeTheme]);

  return (
    <SimpleAffinityFilter
      activeAffinities={activeAffinityNames}
      onChange={handleAffinityChange}
      title={t("filters.affinity")}
    />
  );
}
