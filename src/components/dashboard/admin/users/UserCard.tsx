
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { User } from "./hooks/useUserData";

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-1">
            <div className="text-muted-foreground">Name:</div>
            <div className="font-medium">
              {user.first_name || "-"} {user.last_name || "-"}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-1">
            <div className="text-muted-foreground">Email:</div>
            <div className="font-medium">{user.email || "-"}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-1">
            <div className="text-muted-foreground">User Type:</div>
            <div className="font-medium">{user.is_hotel_owner ? "Hotel Owner" : "Regular User"}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-1">
            <div className="text-muted-foreground">Status:</div>
            <div className="font-medium">{user.is_active ? "Active" : "Inactive"}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-1">
            <div className="text-muted-foreground">Joined:</div>
            <div className="font-medium">{new Date(user.created_at).toLocaleDateString()}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="destructive" 
          size="sm" 
          className="w-full"
          onClick={() => window.location.href = `/admin/users/${user.id}`}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
