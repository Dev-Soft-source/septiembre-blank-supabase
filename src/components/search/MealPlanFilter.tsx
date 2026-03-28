
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { SquareFilter } from "./SquareFilter";

interface MealPlanFilterProps {
  activeMealPlans: string[];
  onChange: (value: string, isChecked: boolean) => void;
}

export function MealPlanFilter({ activeMealPlans, onChange }: MealPlanFilterProps) {
  const { t, isReady } = useTranslation('filters');

  // Static meal plan options matching the Add Property form - SOURCE OF TRUTH
  // Includes both meal plans AND laundry services as they appear in the form
  const MEAL_PLAN_OPTIONS = [
    "Room Only",
    "Breakfast Included",
    "Half Board (Breakfast + Dinner)",
    "Full Board (All Meals)",
    "All Inclusive"
  ];

  // Wait for translations to be ready
  if (!isReady) {
    return (
      <SquareFilter
        title="PLAN DE COMIDAS"
        options={[]}
        selectedOptions={activeMealPlans}
        onChange={onChange}
        loading={true}
      />
    );
  }

  // Transform to the format expected by SquareFilter with proper translations
  const formattedOptions = MEAL_PLAN_OPTIONS.map(option => ({
    value: option,
    label: option
  }));

  return (
    <SquareFilter
      title={t("filters.mealPlan")}
      options={formattedOptions}
      selectedOptions={activeMealPlans}
      onChange={onChange}
      loading={false}
    />
  );
}
