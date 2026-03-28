
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HotelPaginationProps {
  page: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}

export const HotelPagination: React.FC<HotelPaginationProps> = ({
  page,
  totalPages,
  handlePageChange
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className="text-white border-white/20 hover:bg-purple-700"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      
      <span className="text-white text-sm">
        Page {page} of {totalPages}
      </span>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
        className="text-white border-white/20 hover:bg-purple-700"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};
