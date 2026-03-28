import React, { useState } from "react";
import { FilterItem } from "./FilterItem";
import { useActivitiesDataWithLanguage } from "@/hooks/useActivitiesDataWithLanguage";
import { Search } from "lucide-react";

interface SimpleActivityFilterProps {
  activeActivities: string[];
  onChange: (value: string, isChecked: boolean) => void;
  title: string;
}

export function SimpleActivityFilter({ 
  activeActivities, 
  onChange,
  title
}: SimpleActivityFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { data: activities = [], isLoading } = useActivitiesDataWithLanguage();

  console.log('🎯 SimpleActivityFilter - Current state:', {
    activeActivities,
    activitiesCount: activities.length,
    isLoading,
    activities: activities.map(a => ({ id: a.id, name: a.name }))
  });

  // Filter activities based on search query
  const filteredActivities = activities.filter(activity =>
    activity.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleActivityToggle = (activityName: string) => {
    console.log('🎯 SimpleActivityFilter - Activity toggle:', { activityName, activeActivities });
    
    // Send the Spanish database name directly to the backend
    const isChecked = activeActivities.includes(activityName);
    console.log('🎯 Sending activity name to onChange:', { activityName, willBeChecked: !isChecked });
    onChange(activityName, !isChecked);
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setSearchQuery(e.target.value);
  };

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Get selected activities display value using the actual activity names
  const selectedDisplayValue = activeActivities.length > 1 
    ? `${activeActivities.length} seleccionadas`
    : activeActivities.length === 1 
      ? activeActivities[0]
      : null;

  return (
    <FilterItem 
      title={title}
      isOpen={isOpen} 
      onOpenChange={setIsOpen}
      selectedValue={selectedDisplayValue}
    >
      <div 
        className="bg-fuchsia-950/30 rounded-lg max-h-96 overflow-y-auto" 
        onClick={handleContainerClick}
      >
        {/* Search Input */}
        <div className="p-2 border-b border-fuchsia-800/30" onClick={handleSearchClick}>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-fuchsia-300" />
            <input
              type="text"
              placeholder="Buscar"
              value={searchQuery}
              onChange={handleSearchChange}
              onClick={handleSearchClick}
              className="w-full pl-8 pr-3 py-1.5 bg-fuchsia-900/30 border border-fuchsia-700/50 rounded-md text-sm text-white placeholder:text-fuchsia-300/70 focus:outline-none focus:border-fuchsia-500"
            />
          </div>
        </div>
        
        {/* Activities List */}
        <div className="p-2 space-y-1">
          {isLoading ? (
            <div className="text-center py-4 text-fuchsia-300">Cargando...</div>
          ) : filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-2 p-1 hover:bg-fuchsia-900/20 rounded cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleActivityToggle(activity.name);
                }}
              >
                <input
                  type="checkbox"
                  checked={activeActivities.includes(activity.name)}
                  onChange={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleActivityToggle(activity.name);
                  }}
                  className="h-3 w-3 text-fuchsia-600 focus:ring-0"
                />
                <span className="text-sm text-white">{activity.name}</span>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-fuchsia-300">
              {searchQuery ? "No se encontraron actividades" : "No hay actividades disponibles"}
            </div>
          )}
        </div>
      </div>
    </FilterItem>
  );
}