
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { GroupedFilters, UseFiltersResult } from "./types";
import { 
  fetchFiltersFromAPI, 
  addFilterToAPI, 
  updateFilterInAPI, 
  deleteFilterFromAPI 
} from "./api";

export const useFilters = (): UseFiltersResult => {
  const [filters, setFilters] = useState<GroupedFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch all filters from Supabase
  const fetchFilters = async () => {
    setLoading(true);
    setError(null);

    try {
      const groupedFilters = await fetchFiltersFromAPI();
      setFilters(groupedFilters);
    } catch (err: any) {
      console.error('Error fetching filters:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: `Failed to load filters: ${err.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Add a new filter
  const addFilter = async (category: string, value: string) => {
    if (!value.trim()) return false;

    try {
      const newFilter = await addFilterToAPI(category, value);
      
      if (newFilter) {
        // Update local state
        setFilters(prevFilters => ({
          ...prevFilters,
          [category]: [...(prevFilters[category] || []), { id: newFilter.id, value: newFilter.value }]
        }));

        toast({
          title: "Success",
          description: "Filter added successfully",
        });
        return true;
      }
    } catch (err: any) {
      console.error('Error adding filter:', err);
      toast({
        title: "Error",
        description: `Failed to add filter: ${err.message}`,
        variant: "destructive"
      });
    }
    return false;
  };

  // Update an existing filter
  const updateFilter = async (category: string, id: string, newValue: string) => {
    if (!newValue.trim()) return false;

    try {
      await updateFilterInAPI(id, category, newValue);

      // Update local state
      setFilters(prevFilters => {
        const updatedCategory = prevFilters[category].map(filter =>
          filter.id === id ? { ...filter, value: newValue } : filter
        );
        return {
          ...prevFilters,
          [category]: updatedCategory
        };
      });

      toast({
        title: "Success",
        description: "Filter updated successfully",
      });
      return true;
    } catch (err: any) {
      console.error('Error updating filter:', err);
      toast({
        title: "Error",
        description: `Failed to update filter: ${err.message}`,
        variant: "destructive"
      });
    }
    return false;
  };

  // Delete a filter
  const deleteFilter = async (category: string, id: string) => {
    try {
      await deleteFilterFromAPI(id, category);

      // Update local state
      setFilters(prevFilters => {
        const updatedCategory = prevFilters[category].filter(filter => filter.id !== id);
        return {
          ...prevFilters,
          [category]: updatedCategory
        };
      });

      toast({
        title: "Success",
        description: "Filter deleted successfully",
      });
      return true;
    } catch (err: any) {
      console.error('Error deleting filter:', err);
      toast({
        title: "Error",
        description: `Failed to delete filter: ${err.message}`,
        variant: "destructive"
      });
    }
    return false;
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  return {
    filters,
    loading,
    error,
    fetchFilters,
    addFilter,
    updateFilter,
    deleteFilter
  };
};
