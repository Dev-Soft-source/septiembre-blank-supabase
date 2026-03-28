
import { useState } from "react";
import { useThemesData } from "./useThemesData";
import { useThemeEditing } from "./useThemeEditing";
import { useThemeAddition } from "./useThemeAddition";
import { useThemeDeletion } from "./useThemeDeletion";
import { usePagination } from "./usePagination";

export function useAffinities() {
  const [searchTerm, setSearchTerm] = useState("");
  const { pagination, handlePageChange, updateTotalCount } = usePagination();
  
  const { themes, loading, setThemes, fetchThemes } = useThemesData(searchTerm, pagination);
  const { editingTheme, setEditingTheme, handleEdit, handleSaveEdit, handleCancelEdit } = useThemeEditing(themes, setThemes);
  const { newTheme, setNewTheme, handleAddNewTheme } = useThemeAddition(themes, async () => {
    const { count } = await fetchThemes();
    updateTotalCount(count);
    return { count };
  });
  const { themeToDelete, setThemeToDelete, handleDelete } = useThemeDeletion(async () => {
    const { count } = await fetchThemes();
    updateTotalCount(count);
    return { count };
  });

  // Update total count when themes data changes
  const originalFetchThemes = fetchThemes;
  const enhancedFetchThemes = async () => {
    const { count } = await originalFetchThemes();
    updateTotalCount(count);
    return { count };
  };

  return {
    themes,
    loading,
    editingTheme,
    newTheme,
    themeToDelete,
    searchTerm,
    pagination,
    setSearchTerm,
    setEditingTheme,
    setNewTheme,
    setThemeToDelete,
    handlePageChange,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleAddNewTheme,
    handleDelete
  };
}
