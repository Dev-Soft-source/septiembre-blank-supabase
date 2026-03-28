
import React from "react";

interface RatesCalculatorCardProps {
  children: React.ReactNode;
  className?: string;
}

export const RatesCalculatorCard: React.FC<RatesCalculatorCardProps> = ({
  children,
  className = ""
}) => {
  const baseClasses = "glass-card rounded-lg p-8 border-fuchsia-500/20 bg-[#860793]";
  const combinedClasses = `${baseClasses} ${className}`.trim();

  return (
    <div className={combinedClasses}>
      {children}
    </div>
  );
};
