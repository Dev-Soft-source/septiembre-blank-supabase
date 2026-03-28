
import React from "react";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Payment } from "./types";
import { EmptyPaymentsState } from "./EmptyPaymentsState";
import { LoadingPaymentsState } from "./LoadingPaymentsState";

interface PaymentsTableProps {
  payments: Payment[];
  loading: boolean;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  handleSort: (field: string) => void;
}

export const PaymentsTable: React.FC<PaymentsTableProps> = ({
  payments,
  loading,
  sortField,
  sortDirection,
  handleSort
}) => {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  const getSortableHeaderProps = (field: string) => ({
    onClick: () => handleSort(field),
    className: "cursor-pointer hover:bg-muted/50",
    role: "button"
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return "bg-green-100 text-green-800";
      case 'pending':
        return "bg-yellow-100 text-yellow-800";
      case 'failed':
        return "bg-red-100 text-red-800";
      case 'refunded':
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <LoadingPaymentsState />;
  }

  if (payments.length === 0) {
    return <EmptyPaymentsState />;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead {...getSortableHeaderProps("user_id")}>
              Guest {renderSortIcon("user_id")}
            </TableHead>
            <TableHead {...getSortableHeaderProps("hotel")}>
              Hotel {renderSortIcon("hotel")}
            </TableHead>
            <TableHead {...getSortableHeaderProps("amount")}>
              Amount {renderSortIcon("amount")}
            </TableHead>
            <TableHead {...getSortableHeaderProps("method")}>
              Payment Method {renderSortIcon("method")}
            </TableHead>
            <TableHead {...getSortableHeaderProps("status")}>
              Status {renderSortIcon("status")}
            </TableHead>
            <TableHead {...getSortableHeaderProps("created_at")}>
              Date {renderSortIcon("created_at")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.user_name}</TableCell>
              <TableCell>{payment.hotel?.name || "Unknown Hotel"}</TableCell>
              <TableCell>{formatAmount(payment.amount)}</TableCell>
              <TableCell className="capitalize">{payment.method}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(payment.status)}>
                  {payment.status}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(payment.created_at)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
