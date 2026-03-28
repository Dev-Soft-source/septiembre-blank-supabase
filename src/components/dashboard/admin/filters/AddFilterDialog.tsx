
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface AddFilterDialogProps {
  newItemValue: string;
  activeTab: string;
  setNewItemValue: (value: string) => void;
  handleAddNew: () => void;
  closeDialog: () => void;
}

export const AddFilterDialog: React.FC<AddFilterDialogProps> = ({
  newItemValue,
  activeTab,
  setNewItemValue,
  handleAddNew,
  closeDialog
}) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}</DialogTitle>
      </DialogHeader>
      <div className="py-4">
        <Input
          value={newItemValue}
          onChange={(e) => setNewItemValue(e.target.value)}
          placeholder={`Enter new ${activeTab.slice(0, -1)}...`}
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={closeDialog}>
          Cancel
        </Button>
        <Button onClick={handleAddNew}>
          Add
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
