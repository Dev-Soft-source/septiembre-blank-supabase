
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCog, Search, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserRole {
  id: string;
  first_name?: string;
  last_name?: string;
  role: string;
  is_hotel_owner: boolean;
  is_active: boolean;
  created_at: string;
}

export default function PruebaRoles() {
  const [users, setUsers] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role, is_hotel_owner, is_active, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast({
        description: `User role updated to ${newRole} successfully`
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive"
      });
    }
  };

  const toggleHotelOwnerStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_hotel_owner: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, is_hotel_owner: !currentStatus } : user
      ));

      toast({
        description: `Hotel owner status ${!currentStatus ? 'granted' : 'removed'} successfully`
      });
    } catch (error) {
      console.error('Error updating hotel owner status:', error);
      toast({
        title: "Error",
        description: "Failed to update hotel owner status",
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || 
           user.role.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getRoleBadge = (role: string) => {
    const roleColors = {
      admin: "bg-red-500",
      moderator: "bg-blue-500",
      guest: "bg-gray-500",
      hotel_owner: "bg-green-500"
    };
    return roleColors[role as keyof typeof roleColors] || "bg-gray-500";
  };

  const getRoleStats = () => {
    const stats = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(stats).map(([role, count]) => ({
      role: role.charAt(0).toUpperCase() + role.slice(1),
      count
    }));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="bg-[#7a0486] border-purple-600">
          <CardContent className="p-6">
            <div className="text-center text-white">Loading roles...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Role Management</h2>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Assign Role
        </Button>
      </div>

      {/* Role Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {getRoleStats().map((stat) => (
          <Card key={stat.role} className="bg-[#7a0486] border-purple-600">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">{stat.count}</div>
                <div className="text-white/80 text-sm">{stat.role}s</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card className="bg-[#7a0486] border-purple-600">
        <CardContent className="p-4">
          <Input
            placeholder="Search by name or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-purple-800/50 border-purple-600 text-white placeholder:text-white/60"
          />
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-[#7a0486] border-purple-600">
        <CardHeader>
          <CardTitle className="text-white">User Roles ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-600">
                  <th className="text-left p-3 text-white">Name</th>
                  <th className="text-left p-3 text-white">Current Role</th>
                  <th className="text-left p-3 text-white">Hotel Owner</th>
                  <th className="text-left p-3 text-white">Status</th>
                  <th className="text-left p-3 text-white">Joined</th>
                  <th className="text-left p-3 text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-purple-600/30 hover:bg-purple-800/20">
                    <td className="p-3 text-white font-medium">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="p-3">
                      <Badge className={`${getRoleBadge(user.role)} text-white`}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={user.is_hotel_owner ? "bg-green-500" : "bg-gray-500"}>
                        {user.is_hotel_owner ? "Yes" : "No"}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={user.is_active ? "bg-green-500" : "bg-red-500"}>
                        {user.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="p-3 text-white/80">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Select onValueChange={(value) => updateUserRole(user.id, value)}>
                          <SelectTrigger className="h-8 w-24 bg-purple-800/50 border-purple-600 text-white text-xs">
                            <SelectValue placeholder="Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="guest">Guest</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          size="sm" 
                          className={`h-8 px-3 text-xs ${user.is_hotel_owner ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                          onClick={() => toggleHotelOwnerStatus(user.id, user.is_hotel_owner)}
                        >
                          {user.is_hotel_owner ? 'Remove Owner' : 'Make Owner'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
