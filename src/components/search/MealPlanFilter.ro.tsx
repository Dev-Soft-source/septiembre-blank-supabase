
import React from "react";
import { CheckboxFilter } from "./CheckboxFilter";

interface MealPlanFilterROProps {
  activeMealPlans: string[];
  onChange: (value: string, isChecked: boolean) => void;
}

export function MealPlanFilterRO({ activeMealPlans, onChange }: MealPlanFilterROProps) {
  const mealPlanOptions = [
    { value: "breakfast", label: "Mic Dejun" },
    { value: "halfBoard", label: "Demipensiune" },
    { value: "fullBoard", label: "Pensiune Completă" },
    { value: "allInclusive", label: "Totul Inclus" },
    { value: "laundryIncluded", label: "Spălătorie Inclusă" }
  ];

  return (
    <CheckboxFilter
      title="PLAN DE MASĂ"
      options={mealPlanOptions}
      selectedOptions={activeMealPlans}
      onChange={onChange}
    />
  );
}
