import React from 'react';
import { cn } from "@/lib/utils";
interface StatCardProps {
  title: string;
  value: string;
  change?: string;
}
export const StatCard = ({
  title,
  value,
  change
}: StatCardProps) => {
  const isPositive = change?.startsWith('+');
  return <div className="glass-card rounded-lg p-4 bg-[#bd48ef]">
      <p className="text-xs sm:text-sm text-foreground/70 mb-1">{title}</p>
      <div className="flex items-baseline justify-between">
        <p className="text-lg sm:text-2xl font-bold">{value}</p>
        {change && <span className={cn("text-xs px-1.5 py-0.5 rounded", isPositive ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300")}>
            {change}
          </span>}
      </div>
    </div>;
};
export default StatCard;