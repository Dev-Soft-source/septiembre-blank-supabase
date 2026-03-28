
import React from "react";
import { TeamLevelTab } from "./TeamLevelTab";
import { TeamLevel } from "./types";

interface TeamLevelTabsProps {
  teamLevels: TeamLevel[];
  activeLevel: string;
  onSelectLevel: (levelId: string) => void;
}

export function TeamLevelTabs({ teamLevels, activeLevel, onSelectLevel }: TeamLevelTabsProps) {
  return (
    <div className="flex flex-col lg:flex-row mb-8 space-y-4 lg:space-y-0 lg:space-x-3 justify-center">
      {/* Mobile: 2x2 grid, Desktop: horizontal row */}
      <div className="grid grid-cols-2 gap-4 lg:hidden w-full max-w-md mx-auto">
        {/* Reverse the levels so Tier 4 appears first (top-left) */}
        {[...teamLevels].reverse().map((level) => (
          <TeamLevelTab
            key={level.id}
            id={level.id}
            tier={level.tier}
            shortName={level.shortName}
            color={level.color}
            isActive={activeLevel === level.id}
            onClick={() => onSelectLevel(level.id)}
          />
        ))}
      </div>
      
      {/* Desktop: horizontal layout */}
      <div className="hidden lg:flex lg:space-x-3">
        {/* Reverse the levels so Tier 4 appears first (left) */}
        {[...teamLevels].reverse().map((level) => (
          <TeamLevelTab
            key={level.id}
            id={level.id}
            tier={level.tier}
            shortName={level.shortName}
            color={level.color}
            isActive={activeLevel === level.id}
            onClick={() => onSelectLevel(level.id)}
          />
        ))}
      </div>
    </div>
  );
}
