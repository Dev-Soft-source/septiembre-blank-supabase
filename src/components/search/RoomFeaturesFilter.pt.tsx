
import React from "react";
import { CheckboxFilter } from "./CheckboxFilter";

interface RoomFeaturesFilterPTProps {
  activeRoomFeatures: string[];
  onChange: (value: string, isChecked: boolean) => void;
}

export function RoomFeaturesFilterPT({ activeRoomFeatures, onChange }: RoomFeaturesFilterPTProps) {
  const roomFeatureOptions = [
    { value: "airConditioning", label: "Ar Condicionado" },
    { value: "balcony", label: "Varanda" },
    { value: "kitchen", label: "Cozinha" },
    { value: "workspace", label: "Espaço de Trabalho" },
    { value: "tv", label: "TV" },
    { value: "minibar", label: "Frigobar" }
  ];

  return (
    <CheckboxFilter
      title="SERVIÇOS QUARTO"
      options={roomFeatureOptions}
      selectedOptions={activeRoomFeatures}
      onChange={onChange}
    />
  );
}
