
import React from "react";

interface BenefitsListProps {
  items: string[];
}

export const BenefitsList: React.FC<BenefitsListProps> = ({ items }) => {
  return (
    <div className="bg-[#8a1a96]/30 p-4 rounded-lg">
      <h4 className="font-medium mb-2">Benefits:</h4>
      <ul className="list-disc list-inside space-y-1">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};
