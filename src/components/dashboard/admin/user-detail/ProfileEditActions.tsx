
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Save, X } from "lucide-react";

interface ProfileEditActionsProps {
  editing: boolean;
  setEditing: (editing: boolean) => void;
  handleSave: () => Promise<void>;
  handleCancelEdit: () => void;
}

export const ProfileEditActions: React.FC<ProfileEditActionsProps> = ({
  editing,
  setEditing,
  handleSave,
  handleCancelEdit
}) => {
  return (
    <>
      {editing ? (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleCancelEdit}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" /> Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Changes
          </Button>
        </div>
      ) : (
        <Button 
          variant="outline" 
          onClick={() => setEditing(true)}
          className="flex items-center gap-2"
        >
          <Edit className="w-4 h-4" /> Edit User
        </Button>
      )}
    </>
  );
};
