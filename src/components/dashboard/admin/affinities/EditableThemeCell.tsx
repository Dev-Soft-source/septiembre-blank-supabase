
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, Edit } from "lucide-react";

interface EditableThemeCellProps {
  id: string;
  field: string;
  value: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (newValue: string) => void;
  isTextArea?: boolean;
}

export const EditableThemeCell: React.FC<EditableThemeCellProps> = ({
  id,
  field,
  value,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onChange,
  isTextArea = false
}) => {
  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        {isTextArea ? (
          <Textarea 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="min-w-[200px]"
          />
        ) : (
          <Input 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="min-w-[150px]"
          />
        )}
        <div className={isTextArea ? "flex flex-col gap-1" : ""}>
          <Button onClick={onSave} size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Check className="h-4 w-4" />
          </Button>
          <Button onClick={onCancel} size="sm" variant="ghost" className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {value || "-"}
      <Button 
        onClick={onEdit} 
        size="sm" 
        variant="ghost" 
        className="h-6 w-6 p-0"
      >
        <Edit className="h-3 w-3" />
      </Button>
    </div>
  );
};
