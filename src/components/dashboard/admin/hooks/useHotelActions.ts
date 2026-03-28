
// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useHotelActions = (
  onSuccess: () => Promise<void>
) => {
  const { toast } = useToast();

  const handleApprove = async (hotelId: string) => {
    const { data, error, count } = await supabase
      .from('hotels')
      .update({ status: 'approved' })
      .eq('id', hotelId)
      .select();

    if (error) {
      console.error("Hotel approval error:", error);
      toast.error("Failed to approve hotel: " + error.message);
      return;
    }

    // Check if any rows were actually updated
    if (!data || data.length === 0) {
      console.error("No rows updated during hotel approval - possible RLS policy issue");
      toast.error("Failed to approve hotel: Permission denied or hotel not found");
      return;
    }

    toast.success("Hotel has been approved");
    await onSuccess();
  };

  const handleReject = async (hotelId: string, reason: string) => {
    const { data, error } = await supabase
      .from('hotels')
      .update({ 
        status: 'rejected',
        rejection_reason: reason 
      })
      .eq('id', hotelId)
      .select();

    if (error) {
      console.error("Hotel rejection error:", error);
      toast.error("Failed to reject hotel: " + error.message);
      return;
    }

    // Check if any rows were actually updated
    if (!data || data.length === 0) {
      console.error("No rows updated during hotel rejection - possible RLS policy issue");
      toast.error("Failed to reject hotel: Permission denied or hotel not found");
      return;
    }

    toast.success("Hotel has been rejected");
    await onSuccess();
  };

  const handleDelete = async (hotelId: string) => {
    const { data, error } = await supabase
      .from('hotels')
      .delete()
      .eq('id', hotelId)
      .select();

    if (error) {
      console.error("Hotel deletion error:", error);
      toast.error("Failed to delete hotel: " + error.message);
      return;
    }

    // Check if any rows were actually deleted
    if (!data || data.length === 0) {
      console.error("No rows deleted - possible RLS policy issue");
      toast.error("Failed to delete hotel: Permission denied or hotel not found");
      return;
    }

    toast.success("Hotel has been deleted");
    await onSuccess();
  };

  return {
    handleApprove,
    handleReject,
    handleDelete
  };
};
