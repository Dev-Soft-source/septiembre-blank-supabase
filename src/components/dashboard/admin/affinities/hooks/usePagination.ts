
import { useState } from "react";
import { PaginationState } from "../types";

export function usePagination() {
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    pageSize: 10,
    totalCount: 0
  });

  const handlePageChange = (page: number) => {
    setPagination(prev => ({...prev, currentPage: page}));
  };

  const updateTotalCount = (count: number) => {
    setPagination(prev => ({...prev, totalCount: count}));
  };

  return {
    pagination,
    setPagination,
    handlePageChange,
    updateTotalCount
  };
}
