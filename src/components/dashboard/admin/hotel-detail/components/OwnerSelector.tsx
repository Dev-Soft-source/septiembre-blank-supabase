
// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility

import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { HotelOwner } from "../hooks/useHotelOwners";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface OwnerSelectorProps {
  hotelId: string;
  currentOwnerId: string | null;
  hotelOwners: HotelOwner[];
  onSuccess?: () => Promise<void>;
}

export function OwnerSelector({ hotelId, currentOwnerId, hotelOwners, onSuccess }: OwnerSelectorProps) {
  const [selectedOwnerId, setSelectedOwnerId] = useState<string | null>(currentOwnerId);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const updateOwner = async () => {
    if (selectedOwnerId === currentOwnerId) return;
    
    setIsLoading(true);
    try {
      const ownerIdToUpdate = selectedOwnerId === "unassigned" ? null : selectedOwnerId;
      
      const { error } = await supabase
        .from('hotels')
        .update({ owner_id: ownerIdToUpdate })
        .eq('id', hotelId);
        
      if (error) throw error;
      
      toast({
        title: "Owner updated",
        description: "Hotel owner has been updated successfully"
      });
      
      if (onSuccess) await onSuccess();
    } catch (error: any) {
      console.error("Error updating hotel owner:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update hotel owner",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getOwnerName = (ownerId: string | null) => {
    if (!ownerId) return "Not assigned";
    const owner = hotelOwners.find(o => o.id === ownerId);
    if (owner) {
      return `${owner.first_name || ''} ${owner.last_name || ''}`.trim() || owner.id;
    }
    return "Unknown owner";
  };

  return (
    <div className="flex items-center gap-2">
      <Select 
        value={selectedOwnerId || "unassigned"} 
        onValueChange={val => setSelectedOwnerId(val === "unassigned" ? null : val)}
      >
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Select owner" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="unassigned">Not assigned</SelectItem>
          {hotelOwners.map(owner => (
            <SelectItem key={owner.id} value={owner.id}>
              {`${owner.first_name || ''} ${owner.last_name || ''}`.trim() || owner.id}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button 
        onClick={updateOwner}
        disabled={isLoading || selectedOwnerId === currentOwnerId}
      >
        {isLoading ? "Saving..." : "Update"}
      </Button>
    </div>
  );
}
