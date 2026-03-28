
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

interface PaymentsPaginationProps {
  page: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}

export const PaymentsPagination: React.FC<PaymentsPaginationProps> = ({
  page,
  totalPages,
  handlePageChange
}) => {
  // If there are no pages or only one page, don't show pagination
  if (totalPages <= 1) {
    return null;
  }
  
  // Generate array of pages to show
  const getPageNumbers = () => {
    // Always show current page
    let pages: number[] = [page];
    
    // Add up to 2 pages before current page
    for (let i = page - 1; i >= Math.max(1, page - 2); i--) {
      pages.unshift(i);
    }
    
    // Add up to 2 pages after current page
    for (let i = page + 1; i <= Math.min(totalPages, page + 2); i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => page > 1 && handlePageChange(page - 1)}
            className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
        
        {getPageNumbers().map(pageNumber => (
          <PaginationItem key={pageNumber}>
            <PaginationLink 
              isActive={pageNumber === page}
              onClick={() => handlePageChange(pageNumber)}
              className="cursor-pointer"
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}
        
        <PaginationItem>
          <PaginationNext 
            onClick={() => page < totalPages && handlePageChange(page + 1)}
            className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
