
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { NewTheme } from "./types";

interface AddThemeDialogProps {
  newTheme: NewTheme;
  setNewTheme: React.Dispatch<React.SetStateAction<NewTheme>>;
  handleAddNewTheme: () => void;
  closeDialog: () => void;
}

export const AddThemeDialog: React.FC<AddThemeDialogProps> = ({
  newTheme,
  setNewTheme,
  handleAddNewTheme,
  closeDialog
}) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Affinity</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
          <Input
            id="name"
            value={newTheme.name}
            onChange={(e) => setNewTheme({...newTheme, name: e.target.value})}
            placeholder="Enter affinity name"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
          <Input
            id="category"
            value={newTheme.category || ""}
            onChange={(e) => setNewTheme({...newTheme, category: e.target.value})}
            placeholder="Enter category (optional)"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            id="description"
            value={newTheme.description}
            onChange={(e) => setNewTheme({...newTheme, description: e.target.value})}
            placeholder="Enter affinity description"
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={closeDialog}>
          Cancel
        </Button>
        <Button onClick={handleAddNewTheme} disabled={!newTheme.name.trim()}>
          Add
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
