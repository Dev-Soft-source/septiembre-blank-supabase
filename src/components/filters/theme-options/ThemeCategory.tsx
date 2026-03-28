
import React from "react";
import { ChevronDown } from "lucide-react";
import { Theme } from "@/utils/themes";
import { ThemeSubcategory } from "./ThemeSubcategory";
import { ThemeButton } from "./ThemeButton";

interface ThemeCategoryProps {
  category: any;
  activeTheme: Theme | null;
  updateFilter: (key: string, value: any) => void;
  openCategory: string | null;
  toggleCategory: (category: string) => void;
  openSubcategories: Record<string, boolean>;
  toggleSubcategory: (subcategory: string, e: React.MouseEvent) => void;
  openSubmenus: Record<string, boolean>;
  toggleSubmenu: (submenu: string, e: React.MouseEvent) => void;
  useLargerMobileText?: boolean; // Added property
}

export const ThemeCategory: React.FC<ThemeCategoryProps> = ({
  category,
  activeTheme,
  updateFilter,
  openCategory,
  toggleCategory,
  openSubcategories,
  toggleSubcategory,
  openSubmenus,
  toggleSubmenu,
  useLargerMobileText = false // Added default value
}) => {
  const isOpen = openCategory === category.category;
  
  return (
    <div className="border border-fuchsia-800/30 rounded-md overflow-hidden">
      <button
        onClick={() => toggleCategory(category.category)}
        className={`w-full flex items-center justify-between px-3 py-2 ${useLargerMobileText ? 'text-base' : 'text-sm'} font-medium transition-colors hover:bg-fuchsia-900/40`}
      >
        <span>{category.category}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      
      {isOpen && (
        <div className="p-2 space-y-2 bg-fuchsia-950/30">
          {category.themes && category.themes.length > 0 && (
            <div className="space-y-1">
              {category.themes.map((theme: Theme) => (
                <ThemeButton
                  key={theme.id}
                  theme={theme}
                  isActive={activeTheme?.id === theme.id}
                  onClick={() => updateFilter("theme", theme)}
                />
              ))}
            </div>
          )}
          
          {category.subcategories && category.subcategories.length > 0 && (
            <div className="space-y-2">
              {category.subcategories.map((subcategory: any) => (
                <ThemeSubcategory
                  key={subcategory.name}
                  subcategory={subcategory}
                  activeTheme={activeTheme}
                  updateFilter={updateFilter}
                  isOpen={openSubcategories[subcategory.name] || false}
                  toggleSubcategory={(e) => toggleSubcategory(subcategory.name, e)}
                  openSubmenus={openSubmenus}
                  toggleSubmenu={toggleSubmenu}
                  useLargerMobileText={useLargerMobileText} // Pass to subcategory
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
