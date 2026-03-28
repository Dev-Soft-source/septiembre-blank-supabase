
import React, { useState, useMemo } from "react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useHierarchicalThemesWithTranslations } from "@/hooks/useHierarchicalThemesWithTranslations";
import { Checkbox } from "@/components/ui/checkbox";

interface HierarchicalThemeSelectorProps {
  selectedThemes: string[];
  onThemeSelect: (themeId: string, isSelected: boolean) => void;
  allowMultiple?: boolean;
  className?: string;
  searchQuery?: string;
}

export const HierarchicalThemeSelector: React.FC<HierarchicalThemeSelectorProps> = ({
  selectedThemes,
  onThemeSelect,
  allowMultiple = true,
  className = "",
  searchQuery = ""
}) => {
  const { themes, loading, error } = useHierarchicalThemesWithTranslations();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set());

  // Filter themes based on search query
  const filteredThemes = useMemo(() => {
    if (!searchQuery.trim()) {
      return themes;
    }

    const lowercaseQuery = searchQuery.toLowerCase();
    
    const themeMatches = (theme: any) => {
      return theme.name.toLowerCase().includes(lowercaseQuery);
    };

    const filterThemeHierarchy = (themeList: any[]): any[] => {
      return themeList
        .map(theme => {
          const hasMatchingChildren = theme.children && theme.children.length > 0;
          let filteredChildren: any[] = [];
          
          if (hasMatchingChildren) {
            filteredChildren = filterThemeHierarchy(theme.children);
          }
          
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

    return filterThemeHierarchy(themes);
  }, [searchQuery, themes]);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleSubcategory = (subcategoryId: string) => {
    const newExpanded = new Set(expandedSubcategories);
    if (newExpanded.has(subcategoryId)) {
      newExpanded.delete(subcategoryId);
    } else {
      newExpanded.add(subcategoryId);
    }
    setExpandedSubcategories(newExpanded);
  };

  const handleThemeSelect = (themeId: string) => {
    const isCurrentlySelected = selectedThemes.includes(themeId);
    
    if (!allowMultiple && !isCurrentlySelected) {
      selectedThemes.forEach(id => {
        if (id !== themeId) {
          onThemeSelect(id, false);
        }
      });
    }
    
    onThemeSelect(themeId, !isCurrentlySelected);
  };

  if (loading) {
    return (
      <div className="text-white p-4">
        Cargando afinidades...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 p-4">
        Error: {error}
      </div>
    );
  }

  if (!filteredThemes || filteredThemes.length === 0) {
    return (
      <div className="text-yellow-400 p-4">
        {searchQuery ? "No themes found matching your search." : "No se encontraron afinidades disponibles"}
      </div>
    );
  }

  const renderTheme = (theme: any, level: number = 1) => {
    const isExpanded = level === 1 ? expandedCategories.has(theme.id) : expandedSubcategories.has(theme.id);
    const isSelected = selectedThemes.includes(theme.id);
    const hasChildren = theme.children && theme.children.length > 0;
    
    const paddingLeft = level === 1 ? 0 : level === 2 ? 12 : 24;

    return (
      <div key={theme.id} className="w-full">
        <div 
          className={`flex items-center py-1.5 px-1 rounded-md cursor-pointer hover:bg-fuchsia-900/20 ${
            isSelected ? 'bg-fuchsia-700/30 text-white' : ''
          }`}
          style={{ paddingLeft: `${paddingLeft}px` }}
          onClick={() => {
            if (hasChildren && (level === 1 || level === 2)) {
              if (level === 1) {
                toggleCategory(theme.id);
              } else {
                toggleSubcategory(theme.id);
              }
            } else if (level === 3 || (!hasChildren && level >= 1)) {
              handleThemeSelect(theme.id);
            }
          }}
        >
          {hasChildren && (level === 1 || level === 2) && (
            <div className="mr-1.5">
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </div>
          )}
          
          {(!hasChildren || level === 3) && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleThemeSelect(theme.id)}
              className="mr-1.5 h-3 w-3 text-fuchsia-600 focus:ring-0"
              onClick={(e) => e.stopPropagation()}
            />
          )}
          
          <span className={`text-sm ${level === 1 ? 'font-medium uppercase' : level === 2 ? 'font-medium' : ''}`}>
            {theme.name}
          </span>
        </div>

        {hasChildren && (
          <div className="mt-1" style={{ display: isExpanded ? 'block' : 'none' }}>
            {theme.children.map((child: any) => renderTheme(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {filteredThemes.map(theme => renderTheme(theme, 1))}
    </div>
  );
};
