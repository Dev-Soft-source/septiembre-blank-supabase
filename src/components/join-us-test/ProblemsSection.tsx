
import React from "react";
import { Section } from "@/components/join-us/Section";
import { LucideIcon, Flame } from "lucide-react";

interface SectionItem {
  title: string;
  items: string[];
}

interface ProblemsSectionProps {
  title: string;
  sections: SectionItem[];
  icon?: LucideIcon;
}

export function ProblemsSection({ title, sections, icon: Icon = Flame }: ProblemsSectionProps) {
  return (
    <Section icon={Icon} title={title}>
      {sections.map((section, index) => (
        <div key={index} className={index > 0 ? "mt-6" : ""}>
          <h3 className="text-xl font-semibold text-[#FFF9B0] mb-3">{section.title}</h3>
          <ul className="text-white leading-relaxed list-disc pl-6 space-y-2">
            {section.items.map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </Section>
  );
}
