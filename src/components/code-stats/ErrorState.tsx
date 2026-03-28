
import React from "react";

interface ErrorStateProps {
  error: string;
}

export const CodeStatsErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="bg-red-100 text-red-700 p-4 rounded-md">
      {error}
    </div>
  );
};
