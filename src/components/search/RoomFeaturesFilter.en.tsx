
import React from "react";
import { CheckboxFilter } from "./CheckboxFilter";

interface RoomFeaturesFilterENProps {
  activeRoomFeatures: string[];
  onChange: (value: string, isChecked: boolean) => void;
}

export function RoomFeaturesFilterEN({ activeRoomFeatures, onChange }: RoomFeaturesFilterENProps) {
  const roomFeatureOptions = [
    { value: "airConditioning", label: "Air Conditioning" },
    { value: "balcony", label: "Balcony" },
    { value: "kitchen", label: "Kitchen" },
    { value: "workspace", label: "Workspace" },
    { value: "tv", label: "TV" },
    { value: "minibar", label: "Minibar" }
  ];

  return (
    <CheckboxFilter
      title="ROOM FEATURES"
      options={roomFeatureOptions}
      selectedOptions={activeRoomFeatures}
      onChange={onChange}
    />
  );
}
