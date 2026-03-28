
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserDetailHeaderProps {
  editing?: boolean;
  handleSaveUserDetails?: () => void;
  setEditing?: (editing: boolean) => void;
}

export const UserDetailHeader = ({ editing, handleSaveUserDetails, setEditing }: UserDetailHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center">
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Users
      </Button>
    </div>
  );
};
