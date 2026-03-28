import React from "react";
import { cn } from "@/lib/utils";
interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'fuchsia' | 'cyan' | 'amber';
}
export default function DashboardCard({
  title,
  value,
  icon,
  color
}: DashboardCardProps) {
  const colorClasses = {
    fuchsia: "from-fuchsia-500/20 to-fuchsia-900/20 text-fuchsia-300",
    cyan: "from-cyan-500/20 to-cyan-900/20 text-cyan-300",
    amber: "from-amber-500/20 to-amber-900/20 text-amber-300"
  };
  return <div className="glass-card rounded-xl p-6 bg-[#5c0869]">
      <div className="flex items-center gap-4">
        <div className={cn("w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center", colorClasses[color])}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>;
}