
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  first_name?: string;
  last_name?: string;
  is_hotel_owner?: boolean;
  is_active?: boolean;
  created_at: string;
  hotels?: any;
  email?: string;
  role?: string;
}

interface UserTableProps {
  users: User[];
}

export function UserTable({ users }: UserTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>First Name</TableHead>
          <TableHead>Last Name</TableHead>
          <TableHead>Hotel Owner?</TableHead>
          <TableHead>Active?</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map(user => (
          <TableRow key={user.id}>
            <TableCell>{user.first_name || "-"}</TableCell>
            <TableCell>{user.last_name || "-"}</TableCell>
            <TableCell>{user.is_hotel_owner ? "Yes" : "No"}</TableCell>
            <TableCell>{user.is_active ? "Yes" : "No"}</TableCell>
            <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
            <TableCell>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => window.location.href = `/admin/users/${user.id}`}
              >
                View Details
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {users.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4">No users found</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
