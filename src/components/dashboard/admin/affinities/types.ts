
export interface Theme {
  id: string;
  name: string;
  description?: string | null;
  category?: string;
  parent_id?: string | null;
  level: 1 | 2 | 3;
  sort_order?: number;
  created_at: string;
  parent?: {
    name: string;
  };
  children?: Array<{
    id: string;
    name: string;
    level: 1 | 2 | 3;
  }>;
}

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalCount: number;
}

export interface NewTheme {
  name: string;
  description: string;
  category: string;
  parent_id?: string | null;
  level: 1 | 2 | 3;
  sort_order?: number;
}

export interface EditingTheme {
  id: string;
  field: string;
  value: string;
}

export interface ThemeToDelete {
  id: string;
  name: string;
}
