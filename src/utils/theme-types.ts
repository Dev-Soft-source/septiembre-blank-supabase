
export interface Theme {
  id: string;
  name: string;
  description?: string;
  category?: string;
  parent_id?: string | null;
  level: 1 | 2 | 3; // 1=Category, 2=Subcategory, 3=Item
  sort_order?: number;
  created_at?: string;
  children?: Theme[]; // For hierarchical display
}

export interface HierarchicalTheme {
  id: string;
  name: string;
  description?: string;
  level: 1 | 2 | 3;
  sort_order?: number;
  children: HierarchicalTheme[];
}

export interface ThemeCategory extends Theme {
  level: 1;
  subcategories?: ThemeSubcategory[];
}

export interface ThemeSubcategory extends Theme {
  level: 2;
  items?: ThemeItem[];
}

export interface ThemeItem extends Theme {
  level: 3;
}

// Legacy interfaces for backward compatibility
export interface ThemeOption {
  id: string;
  name: string;
  suboptions?: string[];
  isAddOption?: boolean;
}

export interface ThemeSubmenu {
  name: string;
  options: ThemeOption[];
}

export interface ThemeSubcategory_Legacy {
  name: string;
  themes?: LegacyTheme[];
  submenus?: ThemeSubmenu[];
}

export interface ThemeCategory_Legacy {
  category: string;
  themes?: LegacyTheme[];
  subcategories?: ThemeSubcategory_Legacy[];
}

// Legacy theme interface without level requirement
export interface LegacyTheme {
  id: string;
  name: string;
  category?: string;
  isAddOption?: boolean;
}
