
import React from "react";
import { FilterState } from "../FilterTypes";
import { ThemeOptions } from "../ThemeOptions";
import { SimpleThemeOptions } from "./SimpleThemeOptions";

interface ThemeOptionsWrapperProps {
  props?: {
    filters: FilterState;
    updateFilter: (key: keyof FilterState, value: any) => void;
    themeQuery: string;
    setThemeQuery: (query: string) => void;
    useCollapsibleThemes: boolean;
    openThemeCategory: string | null;
    toggleThemeCategory: (category: string) => void;
    useLargerMobileText?: boolean;
  };
  type: keyof FilterState;
  fontSize: string;
}

export const ThemeOptionsWrapper: React.FC<ThemeOptionsWrapperProps> = ({ props, type, fontSize }) => {
  if (!props?.useCollapsibleThemes) {
    return <SimpleThemeOptions type={type} fontSize={fontSize} />;
  }
  
  return (
    <ThemeOptions
      themeQuery={props.themeQuery}
      setThemeQuery={props.setThemeQuery}
      activeTheme={props.filters.theme}
      updateFilter={props.updateFilter}
      useCollapsibleThemes={props.useCollapsibleThemes}
      openThemeCategory={props.openThemeCategory}
      toggleThemeCategory={props.toggleThemeCategory}
      useLargerMobileText={props.useLargerMobileText}
    />
  );
};
