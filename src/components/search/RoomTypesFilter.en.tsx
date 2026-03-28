
import React from "react";
import { CheckboxFilter } from "./CheckboxFilter";

interface RoomTypesFilterENProps {
  activeRoomTypes: string[];
  onChange: (value: string, isChecked: boolean) => void;
}

export function RoomTypesFilterEN({ activeRoomTypes, onChange }: RoomTypesFilterENProps) {
  const roomTypeOptions = [
    { value: "singleRoom", label: "Single Room" },
    { value: "doubleRoom", label: "Double Room" },
    { value: "suite", label: "Suite" },
    { value: "apartment", label: "Apartment" }
  ];

  return (
    <CheckboxFilter
      title="ROOM TYPES"
      options={roomTypeOptions}
      selectedOptions={activeRoomTypes}
      onChange={onChange}
    />
  );
}
