
import React from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const FavoriteButton = ({ 
  isFavorite, 
  onClick, 
  className,
  size = "md" 
}: FavoriteButtonProps) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-10 h-10"
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        sizeClasses[size],
        "rounded-full bg-white/80 hover:bg-white/90 backdrop-blur-sm transition-all duration-200",
        className
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    >
      <Heart 
        size={iconSizes[size]}
        className={cn(
          "transition-colors duration-200",
          isFavorite 
            ? "fill-red-500 text-red-500" 
            : "text-gray-600 hover:text-red-500"
        )} 
      />
    </Button>
  );
};
