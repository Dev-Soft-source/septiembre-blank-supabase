
import React from "react";
import { X, Edit, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { FilterItem } from "@/hooks/filters";

interface FilterItemListProps {
  category: string;
  loading: boolean;
  items: FilterItem[];
  editingItem: { id: string, value: string } | null;
  onStartEdit: (id: string, value: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onConfirmDelete: (id: string) => void;
  setEditingItem: (item: { id: string, value: string } | null) => void;
}

export const FilterItemList: React.FC<FilterItemListProps> = ({
  category,
  loading,
  items,
  editingItem,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onConfirmDelete,
  setEditingItem
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array(6).fill(0).map((_, index) => (
          <div key={`skeleton-${index}`} className="flex items-center gap-2 p-3 border rounded-lg justify-between">
            <Skeleton className="h-6 w-40" />
            <div className="flex gap-1">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item: FilterItem) => {
        const isEditing = editingItem?.id === item.id;
        
        return (
          <div key={item.id} className="flex items-center gap-2 p-3 border rounded-lg justify-between">
            {isEditing ? (
              <Input 
                value={editingItem.value}
                onChange={(e) => setEditingItem({ ...editingItem, value: e.target.value })}
                className="flex-grow"
              />
            ) : (
              <span>{item.value}</span>
            )}
            <div className="flex gap-1">
              {isEditing ? (
                <>
                  <Button onClick={onSaveEdit} size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button onClick={onCancelEdit} size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => onStartEdit(item.id, item.value)} size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => onConfirmDelete(item.id)} size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500">
                    <X className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
