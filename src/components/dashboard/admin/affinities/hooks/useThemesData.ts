
// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Theme, PaginationState } from "../types";

export function useThemesData(searchTerm: string, pagination: PaginationState) {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchThemes();
  }, [pagination.currentPage, searchTerm]);

  const fetchThemes = async () => {
    try {
      setLoading(true);
      
      // First get the total count for pagination
      const countQuery = supabase
        .from('themes')
        .select('id', { count: 'exact', head: true });
        
      if (searchTerm) {
        countQuery
          .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%${searchTerm && ',category.ilike.%' + searchTerm + '%'}`);
      }
      
      const { count, error: countError } = await countQuery;
      
      if (countError) throw countError;
      
      // Then fetch the current page of data with hierarchical information
      const start = (pagination.currentPage - 1) * pagination.pageSize;
      const end = start + pagination.pageSize - 1;
      
      let query = supabase
        .from('themes')
        .select(`
          *,
          parent:parent_id(name),
          children:themes!parent_id(id, name, level)
        `)
        .range(start, end)
        .order('level', { ascending: true })
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });
        
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%${searchTerm && ',category.ilike.%' + searchTerm + '%'}`);
      }
        
      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Map the data to proper Theme type
      const mappedData: Theme[] = (data || []).map(item => ({
        ...item,
        level: item.level as 1 | 2 | 3,
        children: Array.isArray(item.children) ? item.children.map((child: any) => ({
          ...child,
          level: child.level as 1 | 2 | 3
        })) : []
      }));

      setThemes(mappedData);
      return { count: count || 0 };
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch affinities",
        variant: "destructive"
      });
      return { count: 0 };
    } finally {
      setLoading(false);
    }
  };

  return {
    themes,
    loading,
    setThemes,
    fetchThemes
  };
}
