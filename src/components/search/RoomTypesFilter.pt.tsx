
import React from "react";
import { CheckboxFilter } from "./CheckboxFilter";

interface RoomTypesFilterPTProps {
  activeRoomTypes: string[];
  onChange: (value: string, isChecked: boolean) => void;
}

export function RoomTypesFilterPT({ activeRoomTypes, onChange }: RoomTypesFilterPTProps) {
  const roomTypeOptions = [
    { value: "singleRoom", label: "Quarto Individual" },
    { value: "doubleRoom", label: "Quarto Duplo" },
    { value: "suite", label: "Suíte" },
    { value: "apartment", label: "Apartamento" }
  ];

  return (
    <CheckboxFilter
      title="TIPOS DE QUARTO"
      options={roomTypeOptions}
      selectedOptions={activeRoomTypes}
      onChange={onChange}
    />
  );
}
