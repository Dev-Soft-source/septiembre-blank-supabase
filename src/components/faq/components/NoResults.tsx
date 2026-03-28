
import React from "react";

interface NoResultsProps {
  searchQuery: string;
}

export function NoResults({ searchQuery }: NoResultsProps) {
  return (
    <div className="text-center py-10 glass-card rounded-xl mb-8">
      <p className="text-[#e3d6e9] text-xl">No FAQs found matching "{searchQuery}"</p>
      <p className="text-[#e3d6e9] text-base mt-2">Try different keywords or clear your search</p>
    </div>
  );
}
