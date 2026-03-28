
import React, { useState, useEffect } from "react";
import { Theme } from "@/utils/themes";
import { useHierarchicalThemes } from "@/hooks/useHierarchicalThemes";
import { HierarchicalThemeSelector } from "../HierarchicalThemeSelector";

interface CollapsibleThemeOptionsProps {
  activeTheme: Theme[];
  updateFilter: (key: string, value: any) => void;
  openCategory: string | null;
  toggleCategory: (category: string) => void;
  themeQuery?: string;
  useLargerMobileText?: boolean;
  sortAlphabetically?: boolean;
}

export const CollapsibleThemeOptions: React.FC<CollapsibleThemeOptionsProps> = ({
  activeTheme,
  updateFilter,
  themeQuery = "",
  useLargerMobileText = false,
}) => {
  const { themes, loading, error } = useHierarchicalThemes();
  const [filteredThemes, setFilteredThemes] = useState(themes);

  // Filter themes based on search query
  useEffect(() => {
    if (!themeQuery.trim()) {
      setFilteredThemes(themes);
      return;
    }

    const lowercaseQuery = themeQuery.toLowerCase();
    
    // Function to check if a theme matches the query
    const themeMatches = (theme: any) => {
      return theme.name.toLowerCase().includes(lowercaseQuery);
    };

    // Recursively filter themes while maintaining hierarchy
    const filterThemeHierarchy = (themeList: any[]): any[] => {
      return themeList
        .map(theme => {
          const hasMatchingChildren = theme.children && theme.children.length > 0;
          let filteredChildren: any[] = [];
          
          if (hasMatchingChildren) {
            filteredChildren = filterThemeHierarchy(theme.children);
          }
          
          // Include theme if it matches or has matching children
          if (themeMatches(theme) || filteredChildren.length > 0) {
            return {
              ...theme,
              children: filteredChildren
            };
          }
          
          return null;
        })
        .filter(Boolean);
    };

    const filtered = filterThemeHierarchy(themes);
    setFilteredThemes(filtered);
  }, [themeQuery, themes]);

  const handleThemeSelect = (themeId: string, isSelected: boolean) => {
    if (isSelected) {
      // Find the theme by ID and add to array
      const findTheme = (themeList: any[]): any => {
        for (const theme of themeList) {
          if (theme.id === themeId) {
            return { id: theme.id, name: theme.name };
          }
          if (theme.children && theme.children.length > 0) {
            const found = findTheme(theme.children);
            if (found) return found;
          }
        }
        return null;
      };
      
      const selectedTheme = findTheme(themes);
      if (selectedTheme) {
        // Add to existing themes array
        const updatedThemes = [...(activeTheme || []), selectedTheme];
        updateFilter('theme', updatedThemes);
      }
    } else {
      // Remove from themes array
      const updatedThemes = (activeTheme || []).filter(theme => theme.id !== themeId);
      updateFilter('theme', updatedThemes);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <div className="text-sm text-foreground/70">Loading themes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm p-4">
        Error loading themes: {error}
      </div>
    );
  }

  if (!filteredThemes || filteredThemes.length === 0) {
    return (
      <div className="text-center py-2 text-sm text-foreground/70">
        {themeQuery ? "No themes found. Try a different search term." : "No themes available"}
      </div>
    );
  }

  const selectedThemes = activeTheme ? activeTheme.map(theme => theme.id) : [];

  return (
    <div className="space-y-2 max-h-[300px] overflow-y-auto">
        <HierarchicalThemeSelector
          selectedThemes={selectedThemes}
          onThemeSelect={handleThemeSelect}
          allowMultiple={true}
          className="space-y-1"
        />
    </div>
  );
};
