
import React from "react";
import { CheckboxFilter } from "./CheckboxFilter";

interface RoomTypesFilterROProps {
  activeRoomTypes: string[];
  onChange: (value: string, isChecked: boolean) => void;
}

export function RoomTypesFilterRO({ activeRoomTypes, onChange }: RoomTypesFilterROProps) {
  const roomTypeOptions = [
    { value: "singleRoom", label: "Cameră Single" },
    { value: "doubleRoom", label: "Cameră Dublă" },
    { value: "suite", label: "Suită" },
    { value: "apartment", label: "Apartament" }
  ];

  return (
    <CheckboxFilter
      title="TIPURI DE CAMERĂ"
      options={roomTypeOptions}
      selectedOptions={activeRoomTypes}
      onChange={onChange}
    />
  );
}
