import React from "react";
import { useSortingStore, NameSortOption } from "@/store/sortingStore";
import { useTranslation } from "@/hooks/useTranslation";

interface NameSortingDropdownProps {
  onChange?: (order: "asc" | "desc" | null) => void;
}

export const NameSortingDropdown: React.FC<NameSortingDropdownProps> = ({ onChange }) => {
  // ✅ Always call hooks at the top
  const { nameSortOption, setNameSortOption } = useSortingStore();
  const { language } = useTranslation();

  const getPlaceholderText = () => {
    switch (language) {
      case "es": return "Nombre";
      case "pt": return "Nome";
      case "ro": return "Nume";
      default: return "Name";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as NameSortOption | "";
    if (value === "") {
      setNameSortOption(null);
      onChange?.(null);
    } else {
      setNameSortOption(value);
      onChange?.(value === "name_asc" ? "asc" : "desc");
    }
  };

  return (
    <div className="w-full sm:w-40">
      <select
        value={nameSortOption || ""}
        onChange={handleChange}
        className="w-full h-12 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">{getPlaceholderText()}</option>
        <option value="name_asc">A–Z</option>
        <option value="name_desc">Z–A</option>
      </select>
    </div>
  );
};
