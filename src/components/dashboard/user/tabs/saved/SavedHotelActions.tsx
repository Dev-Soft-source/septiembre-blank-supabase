
import React from "react";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface SavedHotelActionsProps {
  hotelId: string;
  favoriteId: string;
  onRemove: (id: string) => Promise<void>;
}

export default function SavedHotelActions({ 
  hotelId, 
  favoriteId, 
  onRemove 
}: SavedHotelActionsProps) {
  return (
    <div className="p-4 pt-0 flex justify-end gap-2">
      <button 
        onClick={() => onRemove(favoriteId)}
        className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-200 text-sm rounded"
      >
        Remove
      </button>
      
      <Link 
        to={`/hotel/${hotelId}`} 
        className="px-3 py-1 bg-fuchsia-500/20 hover:bg-fuchsia-500/30 text-fuchsia-200 text-sm rounded flex items-center"
      >
        View <ExternalLink className="w-3 h-3 ml-1" />
      </Link>
    </div>
  );
}
