
import React from "react";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface DeleteConfirmDialogProps {
  handleDelete: () => void;
  closeDialog: () => void;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  handleDelete,
  closeDialog
}) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this item? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="pt-4">
        <Button variant="outline" onClick={closeDialog}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
