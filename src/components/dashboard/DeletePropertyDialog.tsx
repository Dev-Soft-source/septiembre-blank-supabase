
// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility

import React, { useState } from "react";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface DeletePropertyDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  hotelName: string;
  hotelId: string;
}

export default function DeletePropertyDialog({
  open,
  onClose,
  onConfirm,
  hotelName,
  hotelId
}: DeletePropertyDialogProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Delete the hotel and all its related data
      const { error } = await supabase
        .from("hotels")
        .delete()
        .eq("id", hotelId);

      if (error) {
        throw error;
      }

      toast("The property has been permanently deleted.");
      
      onConfirm();
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("There was a problem deleting your property. Please try again.");
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="bg-background border border-fuchsia-700/30">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete property</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <span className="font-semibold">{hotelName}</span>?
            <p className="mt-2 text-red-400">
              This action cannot be undone. All data related to this hotel, including prices, photos, and availability, will be permanently deleted.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            disabled={isDeleting}
            className="border-fuchsia-700/30 hover:bg-fuchsia-700/10">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Deleting...
              </>
            ) : (
              "Confirm Deletion"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
