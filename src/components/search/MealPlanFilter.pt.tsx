
import React from "react";
import { CheckboxFilter } from "./CheckboxFilter";

interface MealPlanFilterPTProps {
  activeMealPlans: string[];
  onChange: (value: string, isChecked: boolean) => void;
}

export function MealPlanFilterPT({ activeMealPlans, onChange }: MealPlanFilterPTProps) {
  const mealPlanOptions = [
    { value: "breakfast", label: "Café da Manhã" },
    { value: "halfBoard", label: "Meia Pensão" },
    { value: "fullBoard", label: "Pensão Completa" },
    { value: "allInclusive", label: "Tudo Incluído" },
    { value: "laundryIncluded", label: "Lavanderia Incluída" }
  ];

  return (
    <CheckboxFilter
      title="REFEIÇÕES"
      options={mealPlanOptions}
      selectedOptions={activeMealPlans}
      onChange={onChange}
    />
  );
}
