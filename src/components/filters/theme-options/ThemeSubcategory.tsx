
import React from "react";
import { ChevronDown } from "lucide-react";
import { Theme } from "@/utils/themes";
import { ThemeSubmenu } from "./ThemeSubmenu";
import { ThemeButton } from "./ThemeButton";

interface ThemeSubcategoryProps {
  subcategory: any;
  activeTheme: Theme | null;
  updateFilter: (key: string, value: any) => void;
  isOpen: boolean;
  toggleSubcategory: (e: React.MouseEvent) => void;
  openSubmenus: Record<string, boolean>;
  toggleSubmenu: (submenu: string, e: React.MouseEvent) => void;
  useLargerMobileText?: boolean; // Added property
}

export const ThemeSubcategory: React.FC<ThemeSubcategoryProps> = ({
  subcategory,
  activeTheme,
  updateFilter,
  isOpen,
  toggleSubcategory,
  openSubmenus,
  toggleSubmenu,
  useLargerMobileText = false // Added default value
}) => {
  return (
    <div className="border border-fuchsia-800/20 rounded-md overflow-hidden">
      <button
        onClick={toggleSubcategory}
        className={`w-full flex items-center justify-between px-3 py-1.5 ${useLargerMobileText ? 'text-base' : 'text-sm'} font-medium transition-colors hover:bg-fuchsia-900/40`}
      >
        <span>{subcategory.name}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      
      {isOpen && (
        <div className="p-1.5 space-y-1.5 bg-fuchsia-950/20">
          {subcategory.themes && subcategory.themes.length > 0 && (
            <div className="space-y-1">
              {subcategory.themes.map((theme: Theme) => (
                <ThemeButton
                  key={theme.id}
                  theme={theme}
                  isActive={activeTheme?.id === theme.id}
                  onClick={() => updateFilter("theme", theme)}
                />
              ))}
            </div>
          )}
          
          {subcategory.submenus && subcategory.submenus.length > 0 && (
            <div className="space-y-1.5">
              {subcategory.submenus.map((submenu: any) => (
                <ThemeSubmenu
                  key={submenu.name}
                  submenu={submenu}
                  activeTheme={activeTheme}
                  updateFilter={updateFilter}
                  isOpen={openSubmenus[submenu.name] || false}
                  toggleSubmenu={(e) => toggleSubmenu(submenu.name, e)}
                  useLargerMobileText={useLargerMobileText} // Pass to submenu
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
