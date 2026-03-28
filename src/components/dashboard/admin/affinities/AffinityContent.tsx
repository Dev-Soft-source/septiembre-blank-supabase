
import React from "react";
import { Theme, EditingTheme } from "./types";
import { ThemeTable } from "./ThemeTable";
import { ThemePagination } from "./ThemePagination";
import { PaginationState } from "./types";

interface AffinityContentProps {
  themes: Theme[];
  editingTheme: EditingTheme | null;
  pagination: PaginationState;
  handlePageChange: (page: number) => void;
  handleEdit: (id: string, field: string, value: string) => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
  openDeleteDialog: (id: string, name: string) => void;
  setEditingTheme: React.Dispatch<React.SetStateAction<EditingTheme | null>>;
  loading: boolean;
}

export const AffinityContent: React.FC<AffinityContentProps> = ({
  themes,
  editingTheme,
  pagination,
  handlePageChange,
  handleEdit,
  handleSaveEdit,
  handleCancelEdit,
  openDeleteDialog,
  setEditingTheme,
  loading
}) => {
  if (loading) {
    return <div className="p-4">Loading affinities...</div>;
  }

  return (
    <div className="glass-card rounded-xl p-6 bg-white/5 backdrop-blur-sm">
      <ThemeTable 
        themes={themes}
        editingTheme={editingTheme}
        handleEdit={handleEdit}
        handleSaveEdit={handleSaveEdit}
        handleCancelEdit={handleCancelEdit}
        openDeleteDialog={openDeleteDialog}
        setEditingTheme={setEditingTheme}
      />
      
      <ThemePagination 
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
