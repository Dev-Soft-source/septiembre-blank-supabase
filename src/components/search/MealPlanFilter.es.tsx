
import React from "react";
import { CheckboxFilter } from "./CheckboxFilter";

interface MealPlanFilterESProps {
  activeMealPlans: string[];
  onChange: (value: string, isChecked: boolean) => void;
}

export function MealPlanFilterES({ activeMealPlans, onChange }: MealPlanFilterESProps) {
  const mealPlanOptions = [
    { value: "breakfast", label: "Desayuno" },
    { value: "halfBoard", label: "Media Pensión" },
    { value: "fullBoard", label: "Pensión Completa" },
    { value: "allInclusive", label: "Todo Incluido" },
    { value: "laundryIncluded", label: "Lavandería Incluída" }
  ];

  return (
    <CheckboxFilter
      title="PLANES DE COMIDAS"
      options={mealPlanOptions}
      selectedOptions={activeMealPlans}
      onChange={onChange}
    />
  );
}
