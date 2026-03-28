
import React from "react";
import { SimpleActivityFilter } from "./SimpleActivityFilter";

interface ActivityFilterROProps {
  activeActivities: string[];
  onChange: (value: string, isChecked: boolean) => void;
}

export function ActivityFilterRO({ 
  activeActivities, 
  onChange 
}: ActivityFilterROProps) {
  return (
    <SimpleActivityFilter
      activeActivities={activeActivities}
      onChange={onChange}
      title="ACTIVITĂȚI"
    />
  );
}
