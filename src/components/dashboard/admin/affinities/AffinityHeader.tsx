
import React from "react";
import { SearchBar } from "./SearchBar";
import { ExportThemesButton } from "./ExportThemesButton";

interface AffinityHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  openNewThemeDialog: () => void;
}

export const AffinityHeader: React.FC<AffinityHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  openNewThemeDialog
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Affinities Management</h1>
        <p className="text-white/70">Manage hotel themes and affinities</p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <ExportThemesButton />
      </div>
    </div>
  );
};
