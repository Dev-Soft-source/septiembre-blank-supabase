
import React from "react";
import { CheckboxFilter } from "./CheckboxFilter";

interface HotelFeaturesFilterPTProps {
  activeHotelFeatures: string[];
  onChange: (value: string, isChecked: boolean) => void;
}

export function HotelFeaturesFilterPT({ activeHotelFeatures, onChange }: HotelFeaturesFilterPTProps) {
  const hotelFeatureOptions = [
    { value: "pool", label: "Piscina" },
    { value: "gym", label: "Academia" },
    { value: "spa", label: "Spa" },
    { value: "restaurant", label: "Restaurante" },
    { value: "bar", label: "Bar" },
    { value: "wifi", label: "WiFi" },
    { value: "parking", label: "Estacionamento" }
  ];

  return (
    <CheckboxFilter
      title="SERVIÇOS HOTEL"
      options={hotelFeatureOptions}
      selectedOptions={activeHotelFeatures}
      onChange={onChange}
    />
  );
}
