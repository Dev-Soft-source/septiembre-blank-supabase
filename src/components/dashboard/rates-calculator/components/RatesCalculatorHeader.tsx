
import React from "react";

interface RatesCalculatorHeaderProps {
  title: string;
  description: string;
}

export const RatesCalculatorHeader: React.FC<RatesCalculatorHeaderProps> = ({
  title,
  description
}) => {
  return (
    <div className="text-center text-white/80">
      <h3 className="text-lg font-medium mb-2 text-white">{title}</h3>
      <p>{description}</p>
    </div>
  );
};
