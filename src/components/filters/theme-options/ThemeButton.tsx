
import React from "react";
import { cn } from "@/lib/utils";
import { Theme } from "@/utils/themes";

interface ThemeButtonProps {
  theme: Theme;
  isActive: boolean;
  onClick: (e?: React.MouseEvent) => void;
  variant?: "default" | "submenu";
}

export const ThemeButton: React.FC<ThemeButtonProps> = ({
  theme,
  isActive,
  onClick,
  variant = "default"
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-md transition-colors",
        variant === "default" ? "px-3 py-2 text-sm" : "px-2 py-1 text-xs",
        isActive
          ? "bg-fuchsia-700/60 text-white font-medium"
          : "hover:bg-fuchsia-900/40"
      )}
    >
      {theme.name}
    </button>
  );
};
