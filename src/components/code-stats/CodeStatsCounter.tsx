
import React from "react";
import { useCodeStats } from "./useCodeStats";
import { CodeStatsHeader } from "./CodeStatsHeader";
import { CodeStatsLoadingState } from "./LoadingState";
import { CodeStatsErrorState } from "./ErrorState";
import { ContentContainer } from "./ContentContainer";

export function CodeStatsCounter() {
  const { totalLines, totalSizeInBytes, isLoading, error, fileStats } = useCodeStats();
  
  return (
    <div className="glass-card rounded-2xl p-6 my-8 max-w-4xl mx-auto">
      <CodeStatsHeader />
      
      {isLoading ? (
        <CodeStatsLoadingState />
      ) : error ? (
        <CodeStatsErrorState error={error} />
      ) : (
        <ContentContainer 
          totalLines={totalLines} 
          totalSizeInBytes={totalSizeInBytes} 
          fileStats={fileStats} 
        />
      )}
    </div>
  );
}
