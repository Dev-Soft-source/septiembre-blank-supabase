
import React from "react";
import { Section } from "@/components/join-us/Section";
import { LucideIcon, Briefcase } from "lucide-react";

interface SectionItem {
  title: string;
  items: string[];
}

interface FoundersSectionProps {
  title: string;
  sections: SectionItem[];
  extraItems: string[];
  icon?: LucideIcon;
}

export function FoundersSection({ title, sections, extraItems, icon: Icon = Briefcase }: FoundersSectionProps) {
  return (
    <Section icon={Icon} title={title}>
      {sections.map((section, index) => (
        <div key={index} className={index > 0 ? "mt-6" : ""}>
          <h3 className="text-xl font-semibold text-[#FFF9B0] mb-3">{section.title}</h3>
          <ul className="text-white leading-relaxed list-disc pl-6 space-y-2 mb-4">
            {section.items.map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
      
      <div className="mt-4">
        {extraItems.map((item, index) => (
          <p key={index} className="text-white leading-relaxed mb-2">{item}</p>
        ))}
      </div>
    </Section>
  );
}
