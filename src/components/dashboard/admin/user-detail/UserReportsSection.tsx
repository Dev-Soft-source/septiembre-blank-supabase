
import React from "react";
import { UserReport } from "./hooks/user-data/useUserReports";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/components/dashboard/utils/dateUtils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface UserReportsSectionProps {
  reports: UserReport[];
  loading?: boolean;
}

export const UserReportsSection: React.FC<UserReportsSectionProps> = ({ reports, loading }) => {
  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading reports...</div>;
  }

  if (!reports || reports.length === 0) {
    return <div className="text-sm text-muted-foreground">No reports found for this user.</div>;
  }

  // Function to determine status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return 'outline';
      case 'investigating':
        return 'secondary';
      case 'pending':
      default:
        return 'destructive';
    }
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Hotel</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell>{report.hotel?.name || "Unknown hotel"}</TableCell>
              <TableCell className="max-w-md">{report.reason}</TableCell>
              <TableCell>{formatDate(report.created_at)}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(report.status)}>
                  {report.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
