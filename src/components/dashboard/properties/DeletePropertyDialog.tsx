
// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility

import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface DeletePropertyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  hotelName: string;
  refetch: () => void;
}

export const DeletePropertyDialog: React.FC<DeletePropertyDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  hotelName,
  refetch
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Get the hotel ID from the hotel name - we need to find it first
      const { data: hotels, error: fetchError } = await supabase
        .from("hotels")
        .select("id")
        .eq("name", hotelName)
        .limit(1);

      if (fetchError) {
        throw fetchError;
      }

      if (!hotels || hotels.length === 0) {
        throw new Error("Hotel not found");
      }

      const hotelId = hotels[0].id;

      // Delete related data first
      await supabase.from("hotel_images").delete().eq("hotel_id", hotelId);
      await supabase.from("hotel_themes").delete().eq("hotel_id", hotelId);
      await supabase.from("hotel_activities").delete().eq("hotel_id", hotelId);
      await supabase.from("hotel_availability").delete().eq("hotel_id", hotelId);
      await supabase.from("bookings").delete().eq("hotel_id", hotelId);
      await supabase.from("favorites").delete().eq("hotel_id", hotelId);
      await supabase.from("reviews").delete().eq("hotel_id", hotelId);

      // Finally delete the hotel
      const { error: deleteError } = await supabase
        .from("hotels")
        .delete()
        .eq("id", hotelId);

      if (deleteError) {
        throw deleteError;
      }

      toast({
        title: "Property deleted",
        description: `${hotelName} has been permanently deleted.`,
      });

      await refetch();
      onConfirm();
      onClose();
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({
        title: "Error",
        description: "Failed to delete property. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-purple-900 border-purple-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            Delete Property
          </AlertDialogTitle>
          <AlertDialogDescription className="text-white/70">
            Are you sure you want to delete "{hotelName}"? This action cannot be undone and will permanently remove all associated data including bookings, reviews, and images.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={onClose}
            disabled={isDeleting}
            className="bg-gray-600 text-white hover:bg-gray-700"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
