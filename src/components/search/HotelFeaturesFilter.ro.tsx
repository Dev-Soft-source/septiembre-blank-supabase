
import React from "react";
import { CheckboxFilter } from "./CheckboxFilter";

interface HotelFeaturesFilterROProps {
  activeHotelFeatures: string[];
  onChange: (value: string, isChecked: boolean) => void;
}

export function HotelFeaturesFilterRO({ activeHotelFeatures, onChange }: HotelFeaturesFilterROProps) {
  const hotelFeatureOptions = [
    { value: "pool", label: "Piscină" },
    { value: "gym", label: "Sală de Sport" },
    { value: "spa", label: "Spa" },
    { value: "restaurant", label: "Restaurant" },
    { value: "bar", label: "Bar" },
    { value: "wifi", label: "WiFi" },
    { value: "parking", label: "Parcare" }
  ];

  return (
    <CheckboxFilter
      title="FACILITĂȚI HOTEL"
      options={hotelFeatureOptions}
      selectedOptions={activeHotelFeatures}
      onChange={onChange}
    />
  );
}
