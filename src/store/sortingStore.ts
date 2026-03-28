import { create } from 'zustand';

export type NameSortOption = 'name_asc' | 'name_desc';
export type PriceSortOption = 'price_asc' | 'price_desc';

interface SortingState {
  nameSortOption: NameSortOption | null;
  priceSortOption: PriceSortOption | null;
  setNameSortOption: (option: NameSortOption | null) => void;
  setPriceSortOption: (option: PriceSortOption | null) => void;
  resetSorting: () => void;
}

export const useSortingStore = create<SortingState>((set) => ({
  nameSortOption: null,
  priceSortOption: null,
  setNameSortOption: (option) => {
    console.log('🚨 STORE: setNameSortOption called with:', option);
    set({ nameSortOption: option, priceSortOption: null });
    console.log('🚨 STORE: setNameSortOption completed');
  },
  setPriceSortOption: (option) => {
    console.log('🚨 STORE: setPriceSortOption called with:', option);
    set({ priceSortOption: option, nameSortOption: null });
    console.log('🚨 STORE: setPriceSortOption completed');
  },
  resetSorting: () => {
    console.log('🚨 STORE: resetSorting called');
    set({ nameSortOption: null, priceSortOption: null });
  },
}));