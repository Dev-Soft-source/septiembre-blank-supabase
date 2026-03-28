
import React from "react";
import { SimpleActivityFilter } from "./SimpleActivityFilter";

interface ActivityFilterENProps {
  activeActivities: string[];
  onChange: (value: string, isChecked: boolean) => void;
}

export function ActivityFilterEN({ 
  activeActivities, 
  onChange 
}: ActivityFilterENProps) {
  return (
    <SimpleActivityFilter
      activeActivities={activeActivities}
      onChange={onChange}
      title="ACTIVITIES"
    />
  );
}
