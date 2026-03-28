
import React from "react";
import { CheckboxFilter } from "./CheckboxFilter";

interface HotelFeaturesFilterENProps {
  activeHotelFeatures: string[];
  onChange: (value: string, isChecked: boolean) => void;
}

export function HotelFeaturesFilterEN({ activeHotelFeatures, onChange }: HotelFeaturesFilterENProps) {
  const hotelFeatureOptions = [
    { value: "pool", label: "Pool" },
    { value: "gym", label: "Gym" },
    { value: "spa", label: "Spa" },
    { value: "restaurant", label: "Restaurant" },
    { value: "bar", label: "Bar" },
    { value: "wifi", label: "WiFi" },
    { value: "parking", label: "Parking" }
  ];

  return (
    <CheckboxFilter
      title="HOTEL FEATURES"
      options={hotelFeatureOptions}
      selectedOptions={activeHotelFeatures}
      onChange={onChange}
    />
  );
}
