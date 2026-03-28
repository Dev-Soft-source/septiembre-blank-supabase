
import { Button } from "@/components/ui/button";
import { Plus, ExternalLink } from "lucide-react";
// JotForm utilities removed
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface PropertyListHeaderProps {
  onAddProperty: () => void;
}

export const PropertyListHeader = ({ onAddProperty }: PropertyListHeaderProps) => {
  const { toast } = useToast();
  // JotForm functionality removed

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">My Properties</h1>
      <Button onClick={onAddProperty} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Add Property
      </Button>
    </div>
  );
};
