
import React from "react";

interface StepsListProps {
  items: string[];
}

export const StepsList: React.FC<StepsListProps> = ({ items }) => {
  return (
    <div className="bg-[#8a1a96]/30 p-4 rounded-lg">
      <h4 className="font-medium mb-2">How it works:</h4>
      <ol className="list-decimal list-inside space-y-2">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ol>
    </div>
  );
};
