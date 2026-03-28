
import React, { ReactNode } from "react";

interface DetailCardProps {
  title: string;
  children: ReactNode;
}

export const DetailCard = ({ title, children }: DetailCardProps) => (
  <div className="glass-card rounded-xl p-6 bg-white/5 backdrop-blur-sm">
    <h3 className="text-xl font-semibold mb-4 border-b pb-2">{title}</h3>
    {children}
  </div>
);
