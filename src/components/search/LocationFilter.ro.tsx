
import { FilterItem } from "./FilterItem";
import { useFilterData } from "@/hooks/useFilterData";

interface LocationFilterROProps {
  activeLocation: string | null;
  onChange: (value: string | null) => void;
}

export function LocationFilterRO({ activeLocation, onChange }: LocationFilterROProps) {
  const { cities, loading, error } = useFilterData();

  const handleLocationClick = (city: string) => {
    // Toggle selection: if already selected, deselect; otherwise select
    const newValue = activeLocation === city ? null : city;
    console.log("LocationFilter - Location toggled:", city, "->", newValue);
    onChange(newValue);
  };

  return (
    <FilterItem title="LOCAȚIE">
      {loading ? (
        <div className="text-sm text-fuchsia-300/70 italic">Se încarcă orașele...</div>
      ) : error ? (
        <div className="text-sm text-fuchsia-300/70 italic">Eroare la încărcarea orașelor</div>
      ) : cities.length === 0 ? (
        <div className="text-sm text-fuchsia-300/70 italic">Nu sunt orașe disponibile</div>
      ) : (
        cities.map(city => (
          <label key={city} className="flex items-start cursor-pointer hover:bg-fuchsia-800/30 p-1 rounded">
            <input 
              type="checkbox" 
              checked={activeLocation === city}
              onChange={() => handleLocationClick(city)}
              className="rounded border-fuchsia-800/50 text-fuchsia-600 focus:ring-fuchsia-500/50 bg-fuchsia-950/50 h-4 w-4 mr-2 mt-0.5" 
            />
            <span className="text-sm text-white">{city}</span>
          </label>
        ))
      )}
    </FilterItem>
  );
}
