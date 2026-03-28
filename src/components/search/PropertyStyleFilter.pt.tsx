
import { FilterItem } from "./FilterItem";
import { useTranslation } from "@/hooks/useTranslation";

interface PropertyStyleFilterPTProps {
  activePropertyStyle: string | null;
  onChange: (value: string | null) => void;
}

export function PropertyStyleFilterPT({ activePropertyStyle, onChange }: PropertyStyleFilterPTProps) {
  const { t } = useTranslation('filters');
  
  const propertyStyles = [
    { value: "classic", label: t("filters.propertyStyles.classic") },
    { value: "classicElegant", label: t("filters.propertyStyles.classicElegant") },
    { value: "modern", label: t("filters.propertyStyles.modern") },
    { value: "fusion", label: t("filters.propertyStyles.fusion") },
    { value: "urban", label: t("filters.propertyStyles.urban") },
    { value: "rural", label: t("filters.propertyStyles.rural") },
    { value: "minimalist", label: t("filters.propertyStyles.minimalist") },
    { value: "luxury", label: t("filters.propertyStyles.luxury") }
  ];

  const handlePropertyStyleClick = (styleValue: string) => {
    // Toggle selection: if already selected, deselect; otherwise select
    const newValue = activePropertyStyle === styleValue ? null : styleValue;
    console.log("PropertyStyleFilter - Style toggled:", styleValue, "->", newValue);
    onChange(newValue);
  };

  return (
    <FilterItem title={t("filters.propertyStyle")}>
      {propertyStyles.map(style => (
        <label key={style.value} className="flex items-start cursor-pointer hover:bg-fuchsia-800/30 p-1 rounded">
          <input 
            type="checkbox" 
            checked={activePropertyStyle === style.value}
            onChange={() => handlePropertyStyleClick(style.value)}
            className="rounded border-fuchsia-800/50 text-fuchsia-600 focus:ring-fuchsia-500/50 bg-fuchsia-950/50 h-4 w-4 mr-2 mt-0.5" 
          />
          <span className="text-sm text-white">{style.label}</span>
        </label>
      ))}
    </FilterItem>
  );
}
