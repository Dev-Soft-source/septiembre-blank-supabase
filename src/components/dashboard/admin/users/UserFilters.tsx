
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
}

export function UserFilters({ searchTerm, setSearchTerm, roleFilter, setRoleFilter }: UserFiltersProps) {
  return (
    <div className="flex gap-4 mb-4">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Search by name, email, ID, role, hotel name or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      <Select value={roleFilter} onValueChange={setRoleFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Users</SelectItem>
          <SelectItem value="owner">Hotel Owners</SelectItem>
          <SelectItem value="user">Regular Users</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
