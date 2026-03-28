
import React from "react";
import { CheckboxFilter } from "./CheckboxFilter";

interface RoomFeaturesFilterESProps {
  activeRoomFeatures: string[];
  onChange: (value: string, isChecked: boolean) => void;
}

export function RoomFeaturesFilterES({ activeRoomFeatures, onChange }: RoomFeaturesFilterESProps) {
  const roomFeatureOptions = [
    { value: "airConditioning", label: "Aire Acondicionado" },
    { value: "balcony", label: "Balcón" },
    { value: "kitchen", label: "Cocina" },
    { value: "workspace", label: "Espacio de Trabajo" },
    { value: "tv", label: "TV" },
    { value: "minibar", label: "Minibar" }
  ];

  return (
    <CheckboxFilter
      title="SERVICIOS"
      options={roomFeatureOptions}
      selectedOptions={activeRoomFeatures}
      onChange={onChange}
    />
  );
}
