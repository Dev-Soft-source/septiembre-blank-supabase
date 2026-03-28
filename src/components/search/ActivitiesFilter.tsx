import React from "react";
import { useTranslationWithFallback } from "@/hooks/useTranslationWithFallback";
import { SquareFilter } from "./SquareFilter";
import { useUnifiedActivities } from "@/hooks/useUnifiedTranslations";

interface ActivitiesFilterProps {
  activeActivities: string[];
  onChange: (value: string, isChecked: boolean) => void;
}

export function ActivitiesFilter({ activeActivities, onChange }: ActivitiesFilterProps) {
  const { t } = useTranslationWithFallback('filters');
  const { data: activityOptions = [], isLoading } = useUnifiedActivities();

  return (
    <SquareFilter
      title={t("filters.activities")}
      options={activityOptions}
      selectedOptions={activeActivities}
      onChange={onChange}
      loading={isLoading}
    />
  );
}