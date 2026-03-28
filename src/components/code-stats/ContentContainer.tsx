
import React from "react";
import { TotalLinesCard } from "./TotalLinesCard";
import { StatsSummaryCards } from "./StatsSummaryCards";
import { FileBreakdownTable } from "./FileBreakdownTable";
import { FooterNote } from "./FooterNote";

type FileStats = {
  path: string;
  lineCount: number;
  sizeInBytes: number;
};

interface ContentContainerProps {
  totalLines: number;
  totalSizeInBytes: number;
  fileStats: FileStats[];
}

export const ContentContainer: React.FC<ContentContainerProps> = ({ 
  totalLines, 
  totalSizeInBytes,
  fileStats 
}) => {
  return (
    <div>
      <TotalLinesCard 
        totalLines={totalLines} 
        totalSizeInBytes={totalSizeInBytes} 
      />
      
      <StatsSummaryCards 
        fileCount={fileStats.length} 
        averageLinesPerFile={totalLines / fileStats.length}
        averageSizePerFile={totalSizeInBytes / fileStats.length}
      />
      
      <FileBreakdownTable fileStats={fileStats} />
      
      <FooterNote />
    </div>
  );
};
