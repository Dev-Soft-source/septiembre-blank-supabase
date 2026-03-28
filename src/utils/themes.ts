
import { Theme, ThemeCategory } from './theme-types';
import { useThemesWithTranslations } from '@/hooks/useThemesWithTranslations';
import { useHierarchicalThemesWithTranslations } from '@/hooks/useHierarchicalThemesWithTranslations';

// Re-export the new hooks that include translations
export { useThemesWithTranslations as useThemes };
export { useHierarchicalThemesWithTranslations as useHierarchicalThemes };

// Function to organize flat themes into hierarchical structure
export const organizeThemesHierarchically = (flatThemes: Theme[]): ThemeCategory[] => {
  const themeMap = new Map<string, Theme>();
  
  // Initialize all themes in the map
  flatThemes.forEach(theme => {
    themeMap.set(theme.id, {
      ...theme,
      children: []
    });
  });

  const rootThemes: ThemeCategory[] = [];

  // Build the hierarchy
  flatThemes.forEach(theme => {
    const themeNode = themeMap.get(theme.id)!;
    
    if (theme.parent_id && themeMap.has(theme.parent_id)) {
      // Add to parent's children
      const parent = themeMap.get(theme.parent_id)!;
      if (!parent.children) parent.children = [];
      parent.children.push(themeNode);
    } else if (theme.level === 1) {
      // Root level theme (category)
      rootThemes.push(themeNode as ThemeCategory);
    }
  });

  return rootThemes;
};

// Empty arrays for backward compatibility - these will be populated from database
export const allThemes: Theme[] = [];
export const themeCategories: ThemeCategory[] = [];

// Re-export types
export type { Theme, ThemeCategory } from './theme-types';
