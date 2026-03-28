
import React, { useState } from "react";
import { Section } from "@/components/join-us/Section";
import { HelpCircle } from "lucide-react";
import { JoinUsFaqSection } from "./JoinUsFaqSection";
import { joinUsFaqData } from "./joinUsFaqData";

export function JoinUsFaq() {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <Section 
      icon={HelpCircle} 
      title="FREQUENTLY ASKED QUESTIONS" 
      className="mt-12"
      defaultOpen={false}
    >
      <div className="space-y-4">
        {joinUsFaqData.map((section) => (
          <JoinUsFaqSection 
            key={section.id}
            section={section}
            isExpanded={expandedSections.includes(section.id)}
            toggleSection={() => toggleSection(section.id)}
          />
        ))}
      </div>
    </Section>
  );
}
