
import { FilterItem } from "./FilterItem";
import { useTranslation } from "@/hooks/useTranslation";

interface PropertyTypeFilterENProps {
  activePropertyType: string | null;
  onChange: (value: string | null) => void;
}

export function PropertyTypeFilterEN({ activePropertyType, onChange }: PropertyTypeFilterENProps) {
  const { t } = useTranslation('filters');
  
  const propertyTypes = [
    { value: "hotel", label: t("filters.propertyTypes.hotel") },
    { value: "resort", label: t("filters.propertyTypes.resort") },
    { value: "boutiqueHotel", label: t("filters.propertyTypes.boutiqueHotel") },
    { value: "countryHouse", label: t("filters.propertyTypes.countryHouse") },
    { value: "roadsideMotel", label: t("filters.propertyTypes.roadsideMotel") }
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
