
import React from "react";
import { CheckboxFilter } from "./CheckboxFilter";

interface HotelFeaturesFilterESProps {
  activeHotelFeatures: string[];
  onChange: (value: string, isChecked: boolean) => void;
}

export function HotelFeaturesFilterES({ activeHotelFeatures, onChange }: HotelFeaturesFilterESProps) {
  const hotelFeatureOptions = [
    { value: "pool", label: "Piscina" },
    { value: "gym", label: "Gimnasio" },
    { value: "spa", label: "Spa" },
    { value: "restaurant", label: "Restaurante" },
    { value: "bar", label: "Bar" },
    { value: "wifi", label: "WiFi" },
    { value: "parking", label: "Aparcamiento" }
  ];

  return (
    <CheckboxFilter
      title="SERVICIOS HOTEL"
      options={hotelFeatureOptions}
      selectedOptions={activeHotelFeatures}
      onChange={onChange}
    />
  );
}
