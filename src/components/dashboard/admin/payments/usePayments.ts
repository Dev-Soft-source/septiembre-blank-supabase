
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Payment, PaymentsState } from "./types";
import { format } from "date-fns";

export const usePayments = () => {
  const [state, setState] = useState<PaymentsState>({
    payments: [],
    loading: false,
    error: null,
    searchTerm: "",
    statusFilter: "all",
    dateFilter: undefined,
    sortField: "created_at",
    sortDirection: "desc",
    page: 1,
    totalCount: 0,
    limit: 10
  });

  // Extract values from state for easier usage
  const {
    searchTerm,
    statusFilter,
    dateFilter,
    sortField,
    sortDirection,
    page,
    limit
  } = state;

  // Fetch payments from Supabase - Feature discontinued
  const fetchPayments = async () => {
    setState(prev => ({
      ...prev,
      loading: false,
      payments: [],
      totalCount: 0,
      error: 'Payment tracking feature is currently discontinued.'
    }));
  };

  // Fetch payments when filters, sort, or pagination changes
  useEffect(() => {
    fetchPayments();
  }, [searchTerm, statusFilter, dateFilter, sortField, sortDirection, page, limit]);

  // Handle sort changes
  const handleSort = (field: string) => {
    setState(prev => ({
      ...prev,
      sortField: field,
      sortDirection: prev.sortField === field && prev.sortDirection === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle page changes
  const handlePageChange = (newPage: number) => {
    setState(prev => ({
      ...prev,
      page: newPage
    }));
  };

  // Calculate total pages for pagination
  const totalPages = useMemo(() => {
    return Math.ceil(state.totalCount / state.limit);
  }, [state.totalCount, state.limit]);

  return {
    ...state,
    handleSort,
    handlePageChange,
    totalPages,
    setSearchTerm: (term: string) => setState(prev => ({ ...prev, searchTerm: term, page: 1 })),
    setStatusFilter: (status: string) => setState(prev => ({ ...prev, statusFilter: status, page: 1 })),
    setDateFilter: (date: Date | undefined) => setState(prev => ({ ...prev, dateFilter: date, page: 1 }))
  };
};
