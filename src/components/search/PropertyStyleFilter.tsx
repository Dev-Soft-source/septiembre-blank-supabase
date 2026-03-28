
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { SquareFilter } from "./SquareFilter";

interface PropertyStyleFilterProps {
  activePropertyStyle: string | null;
  onChange: (value: string | null) => void;
}

export function PropertyStyleFilter({ activePropertyStyle, onChange }: PropertyStyleFilterProps) {
  const { t, isReady } = useTranslation('filters');

  // Static property style options matching the Add Property form - SOURCE OF TRUTH
  const PROPERTY_STYLE_OPTIONS = [
    "classic",
    "classicElegant",
    "modern", 
    "fusion",
    "urban",
    "rural",
    "minimalist",
    "luxury"
  ];

  // Wait for translations to be ready
  if (!isReady) {
    return (
      <SquareFilter
        title="ESTILO DE PROPIEDAD"
        options={[]}
        selectedOptions={activePropertyStyle ? [activePropertyStyle] : []}
        onChange={() => {}}
        loading={true}
        singleSelect={true}
      />
    );
  }

  // Transform to the format expected by SquareFilter with proper translations
  const formattedOptions = PROPERTY_STYLE_OPTIONS.map(option => ({
    value: option,
    label: t(`filters.propertyStyles.${option}`)
  }));

  // Convert single selection to array format for SquareFilter compatibility
  const selectedStyles = activePropertyStyle ? [activePropertyStyle] : [];

  const handleStyleChange = (value: string, isChecked: boolean) => {
    onChange(isChecked ? value : null);
  };

  return (
    <SquareFilter
      title={t("filters.propertyStyle")}
      options={formattedOptions}
      selectedOptions={selectedStyles}
      onChange={handleStyleChange}
      loading={false}
      singleSelect={true}
    />
  );
}
