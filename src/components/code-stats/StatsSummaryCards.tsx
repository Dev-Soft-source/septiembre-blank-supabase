
import React from "react";

interface StatsSummaryCardsProps {
  fileCount: number;
  averageLinesPerFile: number;
  averageSizePerFile: number;
}

export const StatsSummaryCards: React.FC<StatsSummaryCardsProps> = ({ 
  fileCount, 
  averageLinesPerFile,
  averageSizePerFile
}) => {
  // Convert bytes to KB with 2 decimal places
  const avgSizeInKB = (averageSizePerFile / 1024).toFixed(2);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-fuchsia-100/5 p-4 rounded-xl border border-fuchsia-500/10">
        <p className="text-xl font-bold text-fuchsia-300 mb-1">
          {fileCount.toLocaleString()}
        </p>
        <p className="text-foreground/70 text-sm">Total files</p>
      </div>
      
      <div className="bg-fuchsia-100/5 p-4 rounded-xl border border-fuchsia-500/10">
        <p className="text-xl font-bold text-fuchsia-300 mb-1">
          {Math.round(averageLinesPerFile).toLocaleString()}
        </p>
        <p className="text-foreground/70 text-sm">Average lines per file</p>
      </div>
      
      <div className="bg-fuchsia-100/5 p-4 rounded-xl border border-fuchsia-500/10">
        <p className="text-xl font-bold text-fuchsia-300 mb-1">
          {avgSizeInKB} KB
        </p>
        <p className="text-foreground/70 text-sm">Average size per file</p>
      </div>
    </div>
  );
};
