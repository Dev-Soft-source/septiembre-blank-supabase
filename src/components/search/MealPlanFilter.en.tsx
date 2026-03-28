
import React from "react";
import { CheckboxFilter } from "./CheckboxFilter";

interface MealPlanFilterENProps {
  activeMealPlans: string[];
  onChange: (value: string, isChecked: boolean) => void;
}

export function MealPlanFilterEN({ activeMealPlans, onChange }: MealPlanFilterENProps) {
  const mealPlanOptions = [
    { value: "breakfast", label: "Breakfast" },
    { value: "halfBoard", label: "Half Board" },
    { value: "fullBoard", label: "Full Board" },
    { value: "allInclusive", label: "All Inclusive" },
    { value: "laundryIncluded", label: "Laundry Included" }
  ];

  return (
    <CheckboxFilter
      title="MEAL PLAN"
      options={mealPlanOptions}
      selectedOptions={activeMealPlans}
      onChange={onChange}
    />
  );
}
