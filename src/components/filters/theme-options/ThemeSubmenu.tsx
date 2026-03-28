
import React from "react";
import { ChevronDown } from "lucide-react";
import { Theme } from "@/utils/themes";
import { ThemeSubmenuOption } from "./ThemeSubmenuOption";

interface ThemeSubmenuProps {
  submenu: any;
  activeTheme: Theme | null;
  updateFilter: (key: string, value: any) => void;
  isOpen: boolean;
  toggleSubmenu: (e: React.MouseEvent) => void;
  useLargerMobileText?: boolean; // Added property
}

export const ThemeSubmenu: React.FC<ThemeSubmenuProps> = ({
  submenu,
  activeTheme,
  updateFilter,
  isOpen,
  toggleSubmenu,
  useLargerMobileText = false // Added default value
}) => {
  return (
    <div className="border border-fuchsia-800/20 rounded-md overflow-hidden">
      <button
        onClick={toggleSubmenu}
        className={`w-full flex items-center justify-between px-2.5 py-1 ${useLargerMobileText ? 'text-sm' : 'text-xs'} font-medium transition-colors hover:bg-fuchsia-900/40`}
      >
        <span>{submenu.name}</span>
        <ChevronDown
          className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      
      {isOpen && (
        <div className="p-1 space-y-1 bg-fuchsia-950/10">
          {submenu.options && submenu.options.length > 0 && (
            <div className="space-y-0.5">
              {submenu.options.map((option: any) => (
                <ThemeSubmenuOption
                  key={option.id}
                  option={option}
                  activeTheme={activeTheme}
                  updateFilter={updateFilter}
                  useLargerMobileText={useLargerMobileText} // Pass to option
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
