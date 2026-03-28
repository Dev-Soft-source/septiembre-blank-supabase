
import React from "react";
import { CheckboxFilter } from "./CheckboxFilter";

interface RoomTypesFilterESProps {
  activeRoomTypes: string[];
  onChange: (value: string, isChecked: boolean) => void;
}

export function RoomTypesFilterES({ activeRoomTypes, onChange }: RoomTypesFilterESProps) {
  const roomTypeOptions = [
    { value: "singleRoom", label: "Habitación Individual" },
    { value: "doubleRoom", label: "Habitación Doble" },
    { value: "suite", label: "Suite" },
    { value: "apartment", label: "Apartamento" }
  ];

  return (
    <CheckboxFilter
      title="TIPO HABITACIÓN"
      options={roomTypeOptions}
      selectedOptions={activeRoomTypes}
      onChange={onChange}
    />
  );
}
