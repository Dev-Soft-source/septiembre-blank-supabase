
import { FilterItem } from "./FilterItem";

interface LengthOfStayFilterENProps {
  activeLength: string | null;
  onChange: (value: string | null) => void;
}

export function LengthOfStayFilterEN({ activeLength, onChange }: LengthOfStayFilterENProps) {
  const lengthOfStayOptions = [
    { value: "8 days", label: "8 days" },
    { value: "15 days", label: "15 days" },
    { value: "22 days", label: "22 days" },
    { value: "29 days", label: "29 days" }
  ];

  const handleLengthClick = (lengthValue: string) => {
    // Toggle selection: if already selected, deselect; otherwise select
    const newValue = activeLength === lengthValue ? null : lengthValue;
    console.log("LengthOfStayFilter - Length toggled:", lengthValue, "->", newValue);
    onChange(newValue);
  };

  return (
    <FilterItem title="NUMBER OF DAYS">
      <div className="space-y-1">
        {lengthOfStayOptions.map(option => (
          <div key={option.value} className="flex items-center space-x-2 p-1 hover:bg-fuchsia-900/20 rounded cursor-pointer" onClick={() => handleLengthClick(option.value)}>
            <input 
              type="checkbox" 
              checked={activeLength === option.value}
              onChange={() => handleLengthClick(option.value)}
              className="h-3 w-3 text-fuchsia-600 focus:ring-0"
            />
            <span className="text-sm text-white">{option.label}</span>
          </div>
        ))}
      </div>
    </FilterItem>
  );
}
