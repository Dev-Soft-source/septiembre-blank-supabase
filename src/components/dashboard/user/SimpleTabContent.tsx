
import React, { ReactNode } from "react";
interface SimpleTabContentProps {
  title: string;
  description: string;
}
export default function SimpleTabContent({
  title,
  description
}: SimpleTabContentProps) {
  return <div className="glass-card rounded-2xl p-6 bg-[#5d0083]">
      <h2 className="text-xl font-bold mb-6">{title}</h2>
      <p className="text-foreground/80">{description}</p>
    </div>;
}
