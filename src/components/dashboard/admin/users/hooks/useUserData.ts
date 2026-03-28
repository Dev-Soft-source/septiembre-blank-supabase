
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { queryUsersWithBackendAdapter } from "@/adapters/user-adapter";

export interface User {
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

export function useUserData(page: number, limit: number) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Use backend adapter for safe queries
        const { data, totalCount: count, error } = await queryUsersWithBackendAdapter(page, limit);
        
        if (error) {
          throw error;
        }

        setUsers(data);
        setTotalCount(count);
        
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch users",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, limit, toast]);

  return { users, loading, totalCount };
}
