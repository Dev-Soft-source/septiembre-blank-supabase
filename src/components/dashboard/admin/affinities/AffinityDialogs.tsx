
import React from "react";
import { Dialog } from "@/components/ui/dialog";
import { AddThemeDialog } from "./AddThemeDialog";
import { DeleteConfirmDialog } from "../filters/DeleteConfirmDialog";
import { NewTheme, ThemeToDelete } from "./types";

interface AffinityDialogsProps {
  newThemeDialogOpen: boolean;
  setNewThemeDialogOpen: (open: boolean) => void;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  newTheme: NewTheme;
  setNewTheme: React.Dispatch<React.SetStateAction<NewTheme>>;
  handleAddNewTheme: () => void;
  themeToDelete: ThemeToDelete | null;
  handleDelete: () => void;
}

export const AffinityDialogs: React.FC<AffinityDialogsProps> = ({
  newThemeDialogOpen,
  setNewThemeDialogOpen,
  deleteDialogOpen,
  setDeleteDialogOpen,
  newTheme,
  setNewTheme,
  handleAddNewTheme,
  themeToDelete,
  handleDelete
}) => {
  return (
    <>
      {/* Add New Theme Dialog */}
      <Dialog open={newThemeDialogOpen} onOpenChange={setNewThemeDialogOpen}>
        <AddThemeDialog 
          newTheme={newTheme}
          setNewTheme={setNewTheme}
          handleAddNewTheme={handleAddNewTheme}
          closeDialog={() => setNewThemeDialogOpen(false)}
        />
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DeleteConfirmDialog
          handleDelete={handleDelete}
          closeDialog={() => setDeleteDialogOpen(false)}
        />
      </Dialog>
    </>
  );
};
