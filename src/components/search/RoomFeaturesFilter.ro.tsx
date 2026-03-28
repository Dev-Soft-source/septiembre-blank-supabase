
import React from "react";
import { CheckboxFilter } from "./CheckboxFilter";

interface RoomFeaturesFilterROProps {
  activeRoomFeatures: string[];
  onChange: (value: string, isChecked: boolean) => void;
}

export function RoomFeaturesFilterRO({ activeRoomFeatures, onChange }: RoomFeaturesFilterROProps) {
  const roomFeatureOptions = [
    { value: "airConditioning", label: "Aer Condiționat" },
    { value: "balcony", label: "Balcon" },
    { value: "kitchen", label: "Bucătărie" },
    { value: "workspace", label: "Spațiu de Lucru" },
    { value: "tv", label: "TV" },
    { value: "minibar", label: "Minibar" }
  ];

  return (
    <CheckboxFilter
      title="DOTĂRI CAMERĂ"
      options={roomFeatureOptions}
      selectedOptions={activeRoomFeatures}
      onChange={onChange}
    />
  );
}
