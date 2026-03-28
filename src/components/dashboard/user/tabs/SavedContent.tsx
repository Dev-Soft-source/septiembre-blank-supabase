
import React from "react";
import { useSavedHotels } from "@/components/dashboard/hooks/useSavedHotels";
import SavedHotelsGrid from "./saved/SavedHotelsGrid";
import SavedContentLoading from "./saved/SavedContentLoading";

export default function SavedContent() {
  const { savedHotels, isLoading, removeSavedHotel } = useSavedHotels();
  
  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-6">Saved Hotels</h2>
      
      {isLoading ? (
        <SavedContentLoading />
      ) : (
        <SavedHotelsGrid hotels={savedHotels} onRemove={removeSavedHotel} />
      )}
    </div>
  );
}
