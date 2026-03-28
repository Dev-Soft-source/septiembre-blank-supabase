
import React from "react";
import { SimpleActivityFilter } from "./SimpleActivityFilter";

interface ActivityFilterESProps {
  activeActivities: string[];
  onChange: (value: string, isChecked: boolean) => void;
}

export function ActivityFilterES({ 
  activeActivities, 
  onChange 
}: ActivityFilterESProps) {
  return (
    <SimpleActivityFilter
      activeActivities={activeActivities}
      onChange={onChange}
      title="ACTIVIDADES"
    />
  );
}
