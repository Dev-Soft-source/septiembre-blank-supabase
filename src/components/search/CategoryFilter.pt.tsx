
import { FilterItem } from "./FilterItem";
import { Star } from "lucide-react";

interface CategoryFilterPTProps {
  activeCategory: string | null;
  onChange: (value: string | null) => void;
}

export function CategoryFilterPT({ activeCategory, onChange }: CategoryFilterPTProps) {
  const categories = [
    { value: "3", label: "3 Estrelas" },
    { value: "4", label: "4 Estrelas" },
    { value: "5", label: "5 Estrelas" }
  ];

  const handleCategoryClick = (categoryValue: string) => {
    // Toggle selection: if already selected, deselect; otherwise select
    const newValue = activeCategory === categoryValue ? null : categoryValue;
    console.log("CategoryFilter - Category toggled:", categoryValue, "->", newValue);
    onChange(newValue);
  };

  return (
    <FilterItem title="CATEGORIA">
      <div className="space-y-1">
        {categories.map(category => (
          <div key={category.value} className="flex items-center space-x-2 p-1 hover:bg-fuchsia-900/20 rounded cursor-pointer" onClick={() => handleCategoryClick(category.value)}>
            <input 
              type="checkbox" 
              checked={activeCategory === category.value}
              onChange={() => handleCategoryClick(category.value)}
              className="h-3 w-3 text-fuchsia-600 focus:ring-0"
            />
            <span className="text-sm flex items-center text-white">
              {[...Array(parseInt(category.value))].map((_, i) => (
                <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              ))}
            </span>
          </div>
        ))}
      </div>
    </FilterItem>
  );
}
