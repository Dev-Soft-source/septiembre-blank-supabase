
import { ToastAction } from "@/components/ui/toast";

export interface FilterItem {
  id: string;
  value: string;
}

export interface GroupedFilters {
  [category: string]: FilterItem[];
}

export interface UseFiltersResult {
  filters: GroupedFilters;
  loading: boolean;
  error: string | null;
  fetchFilters: () => Promise<void>;
  addFilter: (category: string, value: string) => Promise<boolean>;
  updateFilter: (category: string, id: string, newValue: string) => Promise<boolean>;
  deleteFilter: (category: string, id: string) => Promise<boolean>;
}
