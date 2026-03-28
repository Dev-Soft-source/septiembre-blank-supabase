
// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility

import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface StatusSelectorProps {
  hotelId: string;
  currentStatus: string;
  onSuccess?: () => Promise<void>;
}

export function StatusSelector({ hotelId, currentStatus, onSuccess }: StatusSelectorProps) {
  const [status, setStatus] = useState<string>(currentStatus);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const updateStatus = async () => {
    if (status === currentStatus) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('hotels')
        .update({ status })
        .eq('id', hotelId);
        
      if (error) throw error;
      
      toast.success("Hotel status has been updated to " + status);
      
      if (onSuccess) await onSuccess();
    } catch (error: any) {
      console.error("Error updating hotel status:", error);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>
      
      <Button 
        onClick={updateStatus}
        disabled={isLoading || status === currentStatus}
      >
        {isLoading ? "Saving..." : "Update"}
      </Button>
    </div>
  );
}
