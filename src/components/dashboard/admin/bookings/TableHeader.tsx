
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TableHeaderProps {
  sortField: string;
  sortDirection: "asc" | "desc";
  handleSort: (field: string) => void;
}

export const BookingsTableHeader: React.FC<TableHeaderProps> = ({
  sortField,
  sortDirection,
  handleSort
}) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="cursor-pointer" onClick={() => handleSort('hotel.name')}>
          Hotel {sortField === 'hotel.name' && (sortDirection === 'asc' ? '↑' : '↓')}
        </TableHead>
        <TableHead>Guest</TableHead>
        <TableHead className="cursor-pointer" onClick={() => handleSort('check_in')}>
          Check-In {sortField === 'check_in' && (sortDirection === 'asc' ? '↑' : '↓')}
        </TableHead>
        <TableHead className="cursor-pointer" onClick={() => handleSort('check_out')}>
          Check-Out {sortField === 'check_out' && (sortDirection === 'asc' ? '↑' : '↓')}
        </TableHead>
        <TableHead className="cursor-pointer" onClick={() => handleSort('total_price')}>
          Total {sortField === 'total_price' && (sortDirection === 'asc' ? '↑' : '↓')}
        </TableHead>
        <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
          Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
        </TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
