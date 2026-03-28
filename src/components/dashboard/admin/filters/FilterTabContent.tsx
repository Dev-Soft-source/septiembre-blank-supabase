
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { FilterItemList } from "./FilterItemList";
import { FilterItem, GroupedFilters } from "@/hooks/filters";

interface FilterTabContentProps {
  category: string;
  filters: GroupedFilters;
  loading: boolean;
  editingItem: { id: string, value: string } | null;
  onStartEdit: (id: string, value: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onConfirmDelete: (id: string) => void;
  setEditingItem: (item: { id: string, value: string } | null) => void;
}

export const FilterTabContent: React.FC<FilterTabContentProps> = ({
  category,
  filters,
  loading,
  editingItem,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onConfirmDelete,
  setEditingItem
}) => {
  const items: FilterItem[] = filters[category] || [];

  return (
    <TabsContent value={category} className="p-4">
      <FilterItemList
        category={category}
        loading={loading}
        items={items}
        editingItem={editingItem}
        onStartEdit={onStartEdit}
        onSaveEdit={onSaveEdit}
        onCancelEdit={onCancelEdit}
        onConfirmDelete={onConfirmDelete}
        setEditingItem={setEditingItem}
      />
    </TabsContent>
  );
};
