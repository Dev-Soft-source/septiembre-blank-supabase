
import React from "react";

export const CodeStatsLoadingState: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-10 h-10 border-4 border-fuchsia-500/30 border-t-fuchsia-500 rounded-full animate-spin"></div>
      <p className="ml-4 text-foreground/70">Calculating code statistics...</p>
    </div>
  );
};
