
import React from "react";
import { SimpleActivityFilter } from "./SimpleActivityFilter";

interface ActivityFilterPTProps {
  activeActivities: string[];
  onChange: (value: string, isChecked: boolean) => void;
}

export function ActivityFilterPT({ 
  activeActivities, 
  onChange 
}: ActivityFilterPTProps) {
  return (
    <SimpleActivityFilter
      activeActivities={activeActivities}
      onChange={onChange}
      title="ATIVIDADES"
    />
  );
}
