
import { useState, useMemo } from "react";
import type { User } from "./useUserData";

export function useUserFiltering(users: User[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Role filtering
      if (roleFilter !== "all") {
        if (roleFilter === "owner" && !user.is_hotel_owner) return false;
        if (roleFilter === "user" && user.is_hotel_owner) return false;
      }

      // Search filtering
      if (searchTerm.trim() === "") return true;
      
      const query = searchTerm.toLowerCase().trim();
      
      return (
        user.first_name?.toLowerCase().includes(query) ||
        user.last_name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.id?.toLowerCase().includes(query) ||
        (user.hotels && user.hotels.name?.toLowerCase().includes(query)) ||
        (user.hotels && user.hotels.city?.toLowerCase().includes(query)) ||
        (user.is_hotel_owner ? "hotel owner" : "user").includes(query)
      );
    });
  }, [users, searchTerm, roleFilter]);

  return { searchTerm, setSearchTerm, roleFilter, setRoleFilter, filteredUsers };
}
