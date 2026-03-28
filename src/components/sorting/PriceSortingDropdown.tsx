import React from "react";
import { useSortingStore, PriceSortOption } from "@/store/sortingStore";
import { useTranslation } from "@/hooks/useTranslation";

interface PriceSortingDropdownProps {
  onChange?: (value: "asc" | "desc" | null) => void;
}

export function PriceSortingDropdown({ onChange }: PriceSortingDropdownProps) {
  const {priceSortOption, setPriceSortOption} = useSortingStore();
  const { language } = useTranslation();

  const getPlaceholderText = () => {
    switch (language) {
      case "es": return "Precio";
      case "pt": return "Preço";
      case "ro": return "Preț";
      default: return "Price";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as PriceSortOption | "";
    if (value === "") {
      setPriceSortOption(null);
      onChange?.(null);
    } else {
      setPriceSortOption(value);
      onChange?.(value === "price_asc" ? "asc" : "desc");
    }
  };

  return (
    <div className="w-full sm:w-44">
      <select
        value={priceSortOption || ""}
        onChange={handleChange}
        className="w-full h-12 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">{getPlaceholderText()}</option>
        <option value="price_asc">
          {language === "es" ? "Menor a mayor" :
           language === "pt" ? "Menor para maior" :
           language === "ro" ? "Mic–mare" : "Low to high"}
        </option>
        <option value="price_desc">
          {language === "es" ? "Mayor a menor" :
           language === "pt" ? "Maior para menor" :
           language === "ro" ? "Mare–mic" : "High to low"}
        </option>
      </select>
    </div>
  );
}
