
import { FilterItem } from "./FilterItem";

interface RadioFilterProps {
  title: string;
  options: Array<{ value: string; label: string }>;
  selectedOption: string | null;
  onChange: (value: string | null) => void;
}

export function RadioFilter({ title, options, selectedOption, onChange }: RadioFilterProps) {
  return (
    <FilterItem title={title}>
      {options.map(option => (
        <label key={option.value} className="flex items-start">
          <input 
            type="radio" 
            name={title}
            checked={selectedOption === option.value}
            onChange={() => onChange(option.value)}
            className="rounded border-fuchsia-800/50 text-fuchsia-600 focus:ring-fuchsia-500/50 bg-fuchsia-950/50 h-4 w-4 mr-2 mt-0.5" 
          />
          <span className="text-sm">{option.label}</span>
        </label>
      ))}
      {selectedOption && (
        <button
          onClick={() => onChange(null)}
          className="text-xs text-white/70 hover:text-white underline mt-2"
        >
          Clear selection
        </button>
      )}
    </FilterItem>
  );
}
