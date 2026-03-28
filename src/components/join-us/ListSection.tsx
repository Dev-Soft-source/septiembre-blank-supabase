
import React from "react";
import { LucideIcon } from "lucide-react";
import { Section } from "./Section";

interface ListSectionProps {
  icon: LucideIcon;
  title: string;
  intro?: string;
  items: string[];
  outro?: string;
}

export function ListSection({ icon, title, intro, items, outro }: ListSectionProps) {
  return (
    <Section icon={icon} title={title}>
      {intro && <p className="text-white leading-relaxed mb-6">{intro}</p>}
      <ul className="text-white leading-relaxed list-disc pl-6 space-y-4"> {/* Increased spacing between bullets */}
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      {outro && <p className="text-white leading-relaxed mt-6">{outro}</p>}
      {/* Add extra space at the end */}
      <div className="h-2"></div>
    </Section>
  );
}
