
import React from "react";

interface TeamLevelTabProps {
  id: string;
  tier: string;
  shortName: string;
  color: string;
  isActive: boolean;
  onClick: () => void;
}

export function TeamLevelTab({ 
  id, 
  tier, 
  shortName, 
  color, 
  isActive, 
  onClick 
}: TeamLevelTabProps) {
  return (
    <div 
      onClick={onClick}
      className={`flex-1 relative cursor-pointer flex flex-col items-center group transition-all duration-300 ${
        isActive ? "transform scale-105" : "opacity-80 hover:opacity-100"
      }`}
    >
      {/* Hexagon Shape with gradient background */}
      <div 
        className={`w-20 h-20 flex items-center justify-center relative`} 
        style={{ filter: isActive ? 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' : '' }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon 
            points="50 0, 93.3 25, 93.3 75, 50 100, 6.7 75, 6.7 25" 
            className={`transition-all duration-300`}
            fill={isActive ? color : `${color}80`}
            stroke={isActive ? "#FFFFFF" : "#FFFFFF50"}
            strokeWidth="2"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
          {tier}
        </div>
      </div>
      
      {/* Label */}
      <div className="mt-2 text-center">
        <p className={`text-sm font-bold transition-colors duration-300 ${
          isActive ? "text-[#FFF9B0]" : "text-white group-hover:text-[#FFF9B0]"
        }`}>
          {shortName}
        </p>
      </div>
      
      {/* Active indicator arrow */}
      {isActive && (
        <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#FFF9B0] mt-1"></div>
      )}
    </div>
  );
}
