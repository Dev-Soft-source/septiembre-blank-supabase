
import React from "react";
import { HotelReferral } from "./hooks/user-data/useUserReferrals";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface UserReferralsSectionProps {
  referrals: HotelReferral[];
}

export const UserReferralsSection: React.FC<UserReferralsSectionProps> = ({ referrals }) => {
  if (referrals.length === 0) {
    return <p className="text-center py-4 text-gray-500">No hotel referrals found for this user.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Hotel Name</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Referred On</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {referrals.map((referral) => (
          <TableRow key={referral.id}>
            <TableCell>{referral.hotel_name}</TableCell>
            <TableCell>
              {referral.contact_name} ({referral.contact_email})
            </TableCell>
            <TableCell>{referral.formattedDate}</TableCell>
            <TableCell>
              <ReferralStatusBadge status={referral.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

// Helper component to display the status with appropriate styling
const ReferralStatusBadge = ({ status }: { status?: string }) => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return <Badge variant="success">{status}</Badge>;
    case 'pending':
      return <Badge variant="warning">{status}</Badge>;
    case 'rejected':
      return <Badge variant="destructive">{status}</Badge>;
    default:
      return <Badge variant="outline">{status || 'Pending'}</Badge>;
  }
};
