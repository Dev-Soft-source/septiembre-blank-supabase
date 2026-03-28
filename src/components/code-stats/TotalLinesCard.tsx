
import React from "react";

interface TotalLinesCardProps {
  totalLines: number;
  totalSizeInBytes: number;
}

export const TotalLinesCard: React.FC<TotalLinesCardProps> = ({ 
  totalLines, 
  totalSizeInBytes 
}) => {
  // Convert bytes to MB with 2 decimal places
  const sizeInMB = (totalSizeInBytes / (1024 * 1024)).toFixed(2);
  
  return (
    <div className="bg-fuchsia-100/10 p-6 rounded-xl mb-6 text-center border border-fuchsia-500/20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-4xl font-bold text-fuchsia-400 mb-2">{totalLines.toLocaleString()}</p>
          <p className="text-foreground/70">Total lines of code</p>
        </div>
        <div>
          <p className="text-4xl font-bold text-fuchsia-400 mb-2">{sizeInMB} MB</p>
          <p className="text-foreground/70">Total codebase size</p>
        </div>
      </div>
    </div>
  );
};
