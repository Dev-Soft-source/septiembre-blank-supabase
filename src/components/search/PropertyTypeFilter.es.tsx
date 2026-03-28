
import { FilterItem } from "./FilterItem";
import { useTranslation } from "@/hooks/useTranslation";

interface PropertyTypeFilterESProps {
  activePropertyType: string | null;
  onChange: (value: string | null) => void;
}

export function PropertyTypeFilterES({ activePropertyType, onChange }: PropertyTypeFilterESProps) {
  const { t, isReady } = useTranslation('filters');
  
  // Static property types with fallback labels
  const propertyTypes = [
    { value: "hotel", label: isReady ? t("filters.propertyTypes.hotel") : "Hotel" },
    { value: "resort", label: isReady ? t("filters.propertyTypes.resort") : "Resort" },
    { value: "boutiqueHotel", label: isReady ? t("filters.propertyTypes.boutiqueHotel") : "Hotel Boutique" },
    { value: "countryHouse", label: isReady ? t("filters.propertyTypes.countryHouse") : "Casa Rural" },
    { value: "roadsideMotel", label: isReady ? t("filters.propertyTypes.roadsideMotel") : "Hostal" }
  ];

  const handlePropertyTypeClick = (typeValue: string) => {
    // Toggle selection: if already selected, deselect; otherwise select
    const newValue = activePropertyType === typeValue ? null : typeValue;
    console.log("PropertyTypeFilter - Type toggled:", typeValue, "->", newValue);
    onChange(newValue);
  };

  return (
    <FilterItem title={t("filters.propertyType")}>
      <div className="space-y-1">
        {propertyTypes.map(type => (
          <div key={type.value} className="flex items-center space-x-2 p-1 hover:bg-fuchsia-900/20 rounded cursor-pointer" onClick={() => handlePropertyTypeClick(type.value)}>
            <input 
              type="checkbox" 
              checked={activePropertyType === type.value}
              onChange={() => handlePropertyTypeClick(type.value)}
              className="h-3 w-3 text-fuchsia-600 focus:ring-0"
            />
            <span className="text-sm text-white">{type.label}</span>
          </div>
        ))}
      </div>
    </FilterItem>
  );
}
